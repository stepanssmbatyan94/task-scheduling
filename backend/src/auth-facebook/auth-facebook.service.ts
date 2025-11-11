import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { FacebookInterface } from './interfaces/facebook.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class AuthFacebookService {
  private readonly baseUrl = 'https://graph.facebook.com';
  private readonly apiVersion = 'v23.0';
  private static readonly PROFILE_TIMEOUT_MS = 10_000;
  private static readonly TOKEN_VALIDATION_TIMEOUT_MS = 5_000;

  constructor(private configService: ConfigService<AllConfigType>) {}

  /**
   * Retrieves a Facebook user profile using the provided access token.
   * First validates the token, then fetches the user's profile fields.
   * @param loginDto DTO containing the short-lived Facebook access token.
   * @returns Normalized user profile in internal SocialInterface format.
   */
  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    try {
      await this.verifyAccessToken(loginDto.accessToken);

      const profileUrl = new URL(`${this.baseUrl}/${this.apiVersion}/me`);
      profileUrl.searchParams.set('fields', 'id,last_name,email,first_name');
      profileUrl.searchParams.set('access_token', loginDto.accessToken);

      const response = await fetch(profileUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(AuthFacebookService.PROFILE_TIMEOUT_MS),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpException(
          errorData.error?.message || 'Facebook API error',
          response.status,
        );
      }

      const data: FacebookInterface = await response.json();

      if (!data.id) {
        throw new HttpException(
          'Invalid Facebook profile data',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        id: data.id,
        email: data.email ?? undefined,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.name === 'TimeoutError') {
        throw new HttpException(
          'Facebook API request timeout',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      throw new HttpException(
        'Failed to get Facebook profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates the Facebook access token by calling the /debug_token endpoint.
   * Also ensures the token belongs to our application.
   * @param accessToken The user's short-lived access token to be verified.
   */
  private async verifyAccessToken(accessToken: string): Promise<void> {
    try {
      const appId = this.configService.get('facebook.appId', { infer: true });
      const appSecret = this.configService.get('facebook.appSecret', {
        infer: true,
      });

      if (!appId || !appSecret) {
        throw new HttpException(
          'Facebook app credentials not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const debugUrl = new URL(`${this.baseUrl}/debug_token`);
      const appAccessToken = `${appId}|${appSecret}`;

      debugUrl.searchParams.set('input_token', accessToken);
      debugUrl.searchParams.set('access_token', appAccessToken);

      const response = await fetch(debugUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(
          AuthFacebookService.TOKEN_VALIDATION_TIMEOUT_MS,
        ),
      });

      if (!response.ok) {
        throw new HttpException(
          'Token verification failed',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await response.json();
      const tokenData = result.data;

      if (!tokenData.is_valid) {
        throw new HttpException(
          'Invalid Facebook access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (tokenData.app_id !== appId) {
        throw new HttpException(
          'Access token does not belong to this app',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Token verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Exchanges a short-lived Facebook access token for a long-lived one.
   * Useful for persisting user sessions longer than the default 1–2 hours.
   * @param shortLivedToken Facebook's default short-lived token.
   * @returns A long-lived access token from Facebook.
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
    try {
      const appId = this.configService.get('facebook.appId', { infer: true });
      const appSecret = this.configService.get('facebook.appSecret', {
        infer: true,
      });

      if (!appId || !appSecret) {
        throw new HttpException(
          'Facebook app credentials not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const tokenUrl = new URL(`${this.baseUrl}/oauth/access_token`);
      tokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
      tokenUrl.searchParams.set('client_id', appId);
      tokenUrl.searchParams.set('client_secret', appSecret);
      tokenUrl.searchParams.set('fb_exchange_token', shortLivedToken);

      const response = await fetch(tokenUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to exchange token',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Facebook token exchange failed:', error);
      throw new HttpException(
        'Failed to exchange token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
