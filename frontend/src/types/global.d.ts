export {};

declare global {
  type SuccessResponse<T = unknown> = {
    data?: T;
    message?: string;
    success?: boolean;
  };

  type ErrorResponse = {
    errorCode: string;
    message: string;
    statusCode: number;
  };
}
