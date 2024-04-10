import { ErrorCode } from './error-code';
export class DetailErrorCode {
  errorCode: ErrorCode;
  message?: string;

  constructor(errorCode: ErrorCode, message?: string) {
    this.errorCode = errorCode;
    this.message = message;
  }
}
