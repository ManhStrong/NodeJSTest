export enum ErrorCode {
  // No required parameter
  REQUIRED_PARAM = 'M001',

  // Invalid parameter value The type, definition range, character type, string pattern, or number of characters does not conform to the WebAPI specification.
  INVALID_PARAM = 'M002',

  // The specified ID is not found
  NOT_FOUND = 'M004',

  // Unauthorized
  UNAUTHORIZED = 'M007',

  // Unexpected Error Unexpected error such as programming error or DB operation.
  UNEXPECTED = 'M008',

  // Token Expired
  TOKEN_EXCEPTION = 'TokenExpiredError',
}
