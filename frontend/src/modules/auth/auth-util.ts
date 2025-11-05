import { Authentication } from './auth-constants';

export function getBearerToken(): string {
  const accessToken = getAccessToken();
  return accessToken ? `Bearer ${accessToken}` : '';
}

export function getAccessToken(): string | null {
  return localStorage.getItem(Authentication.AccessToken);
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem(Authentication.AccessToken, accessToken);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(Authentication.RefreshToken);
}

export function setRefreshToken(refreshToken: string): void {
  localStorage.setItem(Authentication.RefreshToken, refreshToken);
}

export function getExpiryIn(): string | null {
  return localStorage.getItem(Authentication.ExpiryIn);
}

export function setExpiryIn(expiryIn: string): void {
  localStorage.setItem(Authentication.ExpiryIn, expiryIn);
}

export function saveToken(
  accessToken: string,
  refreshToken: string,
  expiryIn: string
): void {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  setExpiryIn(expiryIn);
}

export function destroySensitiveInfo(): void {
  localStorage.removeItem(Authentication.AccessToken);
  localStorage.removeItem(Authentication.RefreshToken);
  localStorage.removeItem(Authentication.ExpiryIn);
}
