// Augment Express Request to carry typed user data after auth middleware
import 'express';

declare module 'express' {
  interface Request {
    /** Authenticated user attached by auth middleware */
    user?: {
      id: string;
      email: string;
      role: string;
    };
    /** Parsed pagination params (attached by pagination middleware if used) */
    pagination?: {
      page: number;
      limit: number;
    };
  }
}
