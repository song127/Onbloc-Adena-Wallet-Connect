// === src/types/AppError.ts ===
/**
 * 표준 에러 코드 및 에러 객체 정의
 */
export enum ErrorCode {
  ADENA_NOT_INSTALLED = "ADENA_NOT_INSTALLED",
  INVALID_ADDRESS = "INVALID_ADDRESS",
  INVALID_AMOUNT = "INVALID_AMOUNT",
  NETWORK_ERROR = "NETWORK_ERROR",
  TX_FAILED = "TX_FAILED",
  UNKNOWN = "UNKNOWN",
}

export interface AppError {
  code: ErrorCode;
  userMessage: string; // 사용자에게 보여줄 메시지
  devMessage?: string; // 개발자용 상세 메시지
  cause?: unknown; // 원본 에러
}

export function createAppError(code: ErrorCode, userMessage: string, devMessage?: string, cause?: unknown): AppError {
  return { code, userMessage, devMessage, cause };
}
