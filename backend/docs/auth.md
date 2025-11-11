# Auth

## Table of Contents <!-- omit in toc -->

- [General info](#general-info)
  - [Auth via email flow](#auth-via-email-flow)
  - [Auth via external services or social networks flow](#auth-via-external-services-or-social-networks-flow)
- [Configure Auth](#configure-auth)
- [Auth via Apple](#auth-via-apple)
- [Auth via Facebook](#auth-via-facebook)
- [Auth via Google](#auth-via-google)
- [About JWT strategy](#about-jwt-strategy)
- [Refresh token flow](#refresh-token-flow)
  - [Support login for multiple devices / Sessions](#support-login-for-multiple-devices--sessions)
- [Logout](#logout)
- [Q&A](#qa)
  - [After `POST /api/v1/auth/logout` or removing session from the database, the user can still make requests with an `access token` for some time. Why?](#after-post-apiv1authlogout-or-removing-session-from-the-database-the-user-can-still-make-requests-with-an-access-token-for-some-time-why)

---

## General info

### Auth via email flow

The API provides email/password registration and login with confirmation, password reset, and refresh tokens.

```mermaid
sequenceDiagram
    participant A as Frontend (Web, Mobile)
    participant B as Task Scheduling API

    A->>B: 1. Sign up via email + password
    A->>B: 2. Sign in via email + password
    B->>A: 3. Receive access + refresh tokens
    A->>B: 4. Call protected endpoints with access token
```

### Auth via external services or social networks flow

Optional modules integrate Apple, Facebook, and Google sign-in. They exchange provider tokens for local JWTs.

```mermaid
sequenceDiagram
    participant P as Provider (Apple/Google/Facebook)
    participant A as Frontend
    participant B as Task Scheduling API

    A->>P: 1. Authenticate user
    P->>A: 2. Return provider access token
    A->>B: 3. Exchange provider token
    B->>A: 4. Issue JWT + refresh token
```

Flow steps:
1. Authenticate with the provider.
2. Call one of the exchange endpoints:
   - `POST /api/v1/auth/facebook/login`
   - `POST /api/v1/auth/google/login`
   - `POST /api/v1/auth/apple/login`
3. Use the returned JWT for API requests.

---

## Configure Auth

1. Generate strong secrets:
   ```bash
   node -e "console.log('\nAUTH_JWT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\nAUTH_REFRESH_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\nAUTH_FORGOT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\nAUTH_CONFIRM_EMAIL_SECRET=' + require('crypto').randomBytes(256).toString('base64'))"
   ```
2. Add them to `.env` alongside lifetimes:
   ```text
   AUTH_JWT_SECRET=...
   AUTH_JWT_TOKEN_EXPIRES_IN=15m
   AUTH_REFRESH_SECRET=...
   AUTH_REFRESH_TOKEN_EXPIRES_IN=7d
   AUTH_FORGOT_SECRET=...
   AUTH_FORGOT_TOKEN_EXPIRES_IN=1h
   AUTH_CONFIRM_EMAIL_SECRET=...
   AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN=1d
   ```

---

## Auth via Apple

1. Configure an Apple Service ID and private key (see [apple-signin-auth](https://www.npmjs.com/package/apple-signin-auth)).
2. Provide the credentials through environment variables (`APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_CLIENT_ID`, `APPLE_KEY_FILE_PATH`, etc.).

## Auth via Facebook

1. Create an app at <https://developers.facebook.com/>.
2. Store `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` in `.env`.

## Auth via Google

1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Store `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.

---

## About JWT strategy

`src/auth/strategies/jwt.strategy.ts` validates the token signature and ensures the payload holds a user id. It does **not** query the database per request to keep latency low—services should load additional user data when needed.

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // ...

  public validate(payload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
```

> Fetch complete user details inside services if the controller needs more context.

---

## Refresh token flow

1. `POST /api/v1/auth/email/login` returns `{ token, tokenExpires, refreshToken }`.
2. Use `token` in the `Authorization` header for protected requests.
3. Before the access token expires, call `POST /api/v1/auth/refresh` with the refresh token to obtain a new pair.

### Support login for multiple devices / Sessions

The API creates a session record per login. During refresh the stored session hash is verified and rotated, ensuring previous refresh tokens for that session are invalidated.

---

## Logout

1. Call `POST /api/v1/auth/logout`.
2. Remove stored tokens on the client (cookies, localStorage, etc.).

---

## Q&A

### After `POST /api/v1/auth/logout` or removing session from the database, the user can still make requests with an `access token` for some time. Why?

JWTs are stateless and remain valid until `AUTH_JWT_TOKEN_EXPIRES_IN` is reached. Immediate revocation would require extra database checks on every request, which harms performance. If you absolutely need revocation, extend the JWT strategy to confirm session existence, but be aware of the trade-offs.

---

Previous: [Database](database.md)

Next: [Serialization](serialization.md)
# Auth

## Table of Contents <!-- omit in toc -->

- [General info](#general-info)
  - [Auth via email flow](#auth-via-email-flow)
  - [Auth via external services or social networks flow](#auth-via-external-services-or-social-networks-flow)
- [Configure Auth](#configure-auth)
- [Auth via Apple](#auth-via-apple)
- [Auth via Facebook](#auth-via-facebook)
- [Auth via Google](#auth-via-google)
- [About JWT strategy](#about-jwt-strategy)
- [Refresh token flow](#refresh-token-flow)
  - [Video example](#video-example)
  - [Support login for multiple devices / Sessions](#support-login-for-multiple-devices--sessions)
- [Logout](#logout)
- [Q\&A](#qa)
  - [After `POST /api/v1/auth/logout` or removing session from the database, the user can still make requests with an `access token` for some time. Why?](#after-post-apiv1authlogout-or-removing-session-from-the-database-the-user-can-still-make-requests-with-an-access-token-for-some-time-why)

---

## General info

### Auth via email flow

By default boilerplate used sign in and sign up via email and password.

```mermaid
sequenceDiagram
    participant A as Fronted App (Web, Mobile, Desktop)
    participant B as Backend App

    A->>B: 1. Sign up via email and password
    A->>B: 2. Sign in via email and password
    B->>A: 3. Get a JWT token
    A->>B: 4. Make any requests using a JWT token
```

<https://user-images.githubusercontent.com/6001723/224566194-1c1f4e98-5691-4703-b30e-92f99ec5d929.mp4>

### Auth via external services or social networks flow

Also you can sign up via another external services or social networks like Apple, Facebook and Google.

```mermaid
sequenceDiagram
    participant B as External Auth Services (Apple, Google, etc)
    participant A as Fronted App (Web, Mobile, Desktop)
    participant C as Backend App

    A->>B: 1. Sign in through an external service
    B->>A: 2. Get Access Token
    A->>C: 3. Send Access Token to auth endpoint
    C->>A: 4. Get a JWT token
    A->>C: 5. Make any requests using a JWT token
```

For auth with external services or social networks you need:

1. Sign in through an external service and get access token(s).
1. Call one of endpoints with access token received in frontend app on 1-st step and get JWT token from the backend app.

   ```text
   POST /api/v1/auth/facebook/login

   POST /api/v1/auth/google/login

   POST /api/v1/auth/apple/login
   ```

1. Make any requests using a JWT token

---

## Configure Auth

1. Generate secret keys for `access token` and `refresh token`:

   ```bash
   node -e "console.log('\nAUTH_JWT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_REFRESH_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_FORGOT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_CONFIRM_EMAIL_SECRET=' + require('crypto').randomBytes(256).toString('base64'));"
   ```

1. Go to `/.env` and replace `AUTH_JWT_SECRET` and `AUTH_REFRESH_SECRET` with output from step 1.

   ```text
   AUTH_JWT_SECRET=HERE_SECRET_KEY_FROM_STEP_1
   AUTH_REFRESH_SECRET=HERE_SECRET_KEY_FROM_STEP_1
   ```

## Auth via Apple

1. [Set up your service on Apple](https://www.npmjs.com/package/apple-signin-auth)
1. Change `APPLE_APP_AUDIENCE` in `.env`

   ```text
   APPLE_APP_AUDIENCE=["com.company", "com.company.web"]
   ```

## Auth via Facebook

1. Go to https://developers.facebook.com/apps/creation/ and create a new app
   <img alt="image" src="https://github.com/brocoders/nestjs-boilerplate/assets/6001723/05721db2-9d26-466a-ad7a-072680d0d49b">

   <img alt="image" src="https://github.com/brocoders/nestjs-boilerplate/assets/6001723/9f4aae18-61da-4abc-9304-821a0995a306">
2. Go to `Settings` -> `Basic` and get `App ID` and `App Secret` from your app
   <img alt="image" src="https://github.com/brocoders/nestjs-boilerplate/assets/6001723/b0fc7d50-4bc6-45d0-8b20-fda0b6c01ac2">
3. Change `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` in `.env`

   ```text
   FACEBOOK_APP_ID=123
   FACEBOOK_APP_SECRET=abc
   ```

## Auth via Google

1. You need a `CLIENT_ID`, `CLIENT_SECRET`. You can find these pieces of information by going to the [Developer Console](https://console.cloud.google.com/), clicking your project (if doesn't have create it here https://console.cloud.google.com/projectcreate) -> `APIs & services` -> `credentials`.
1. Change `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

   ```text
   GOOGLE_CLIENT_ID=abc
   GOOGLE_CLIENT_SECRET=abc
   ```

## About JWT strategy

In the `validate` method of the `src/auth/strategies/jwt.strategy.ts` file, you can see that we do not check if the user exists in the database because it is redundant, it may lose the benefits of the JWT approach and can affect the application performance.

To better understand how JWT works, watch the video explanation https://www.youtube.com/watch?v=Y2H3DXDeS3Q and read this article https://jwt.io/introduction/

```typescript
// src/auth/strategies/jwt.strategy.ts

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // ...

  public validate(payload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
```

> If you need to get full user information, get it in services.

## Refresh token flow

1. On sign in (`POST /api/v1/auth/email/login`) you will receive `token`, `tokenExpires` and `refreshToken` in response.
1. On each regular request you need to send `token` in `Authorization` header.
1. If `token` is expired (check with `tokenExpires` property on client app) you need to send `refreshToken` to `POST /api/v1/auth/refresh` in `Authorization` header to refresh `token`. You will receive new `token`, `tokenExpires` and `refreshToken` in response.

### Video example

https://github.com/brocoders/nestjs-boilerplate/assets/6001723/f6fdcc89-5ec6-472b-a6fc-d24178ad1bbb

### Support login for multiple devices / Sessions

Boilerplate supports login for multiple devices with a Refresh Token flow. This is possible due to `sessions`. When a user logs in, a new session is created and stored in the database. The session record contains `sessionId (id)`, `userId`, and `hash`.

On each `POST /api/v1/auth/refresh` request we check `hash` from the database with `hash` from the Refresh Token. If they are equal, we return new `token`, `tokenExpires`, and `refreshToken`. Then we update `hash` in the database to disallow the use of the previous Refresh Token.

## Logout

1. Call following endpoint:

   ```text
   POST /api/v1/auth/logout
   ```

2. Remove `access token` and `refresh token` from your client app (cookies, localStorage, etc).

## Q&A

### After `POST /api/v1/auth/logout` or removing session from the database, the user can still make requests with an `access token` for some time. Why?

It's because we use `JWT`. `JWTs` are stateless, so we can't revoke them, but don't worry, this is the correct behavior and the access token will expire after the time specified in `AUTH_JWT_TOKEN_EXPIRES_IN` (the default value is 15 minutes). If you still need to revoke `JWT` tokens immediately, you can check if a session exists in [jwt.strategy.ts](https://github.com/brocoders/nestjs-boilerplate/blob/2896589f52d2df025f12069ba82ba4fac1db8ebd/src/auth/strategies/jwt.strategy.ts#L20-L26) on each request. However, it's not recommended because it can affect the application's performance.

---

Previous: [Database](database.md)

Next: [Serialization](serialization.md)
