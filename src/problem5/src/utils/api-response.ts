import { HttpStatus } from '../constants/http-status';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  timestamp: string;
  errors?: ValidationErrorItem[];
}

interface ValidationErrorItem {
  field: string;
  message: string;
}

export class ApiResponse {
  static success<T>(data: T, message = 'Success'): SuccessResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ErrorResponse {
    return {
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  static validationError(errors: ValidationErrorItem[]): ErrorResponse {
    return {
      success: false,
      message: 'Validation failed',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      timestamp: new Date().toISOString(),
      errors,
    };
  }
}
