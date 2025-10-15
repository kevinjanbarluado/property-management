import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'email' | 'phone' | 'uuid';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean | string;
}

export class ValidationMiddleware {
  static validate(validationRules: ValidationRule[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const errors: string[] = [];
      const body = req.body;

      for (const rule of validationRules) {
        const value = body[rule.field];

        // Check if required field is present
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push(`${rule.field} is required`);
          continue;
        }

        // Skip validation if field is not present and not required
        if (!rule.required && (value === undefined || value === null || value === '')) {
          continue;
        }

        // Type validation
        if (rule.type === 'string' && typeof value !== 'string') {
          errors.push(`${rule.field} must be a string`);
          continue;
        }

        // Email validation
        if (rule.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${rule.field} must be a valid email address`);
            continue;
          }
        }

        // Phone validation
        if (rule.type === 'phone') {
          const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
          if (!phoneRegex.test(value)) {
            errors.push(`${rule.field} must be a valid phone number`);
            continue;
          }
        }

        // UUID validation
        if (rule.type === 'uuid') {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(value)) {
            errors.push(`${rule.field} must be a valid UUID`);
            continue;
          }
        }

        // Length validation
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters long`);
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be no more than ${rule.maxLength} characters long`);
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${rule.field} format is invalid`);
        }

        // Custom validation
        if (rule.customValidator) {
          const customResult = rule.customValidator(value);
          if (customResult !== true) {
            errors.push(typeof customResult === 'string' ? customResult : `${rule.field} is invalid`);
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Please check your input data',
          details: errors
        });
      }

      next();
    };
  }

  static sanitizeInput(req: Request, res: Response, next: NextFunction) {
    // Sanitize string inputs
    const sanitizeString = (str: string): string => {
      return str.trim().replace(/[<>]/g, '');
    };

    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      }
      if (typeof obj === 'object' && obj !== null) {
        const sanitized: any = {};
        for (const key in obj) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };

    req.body = sanitizeObject(req.body);
    next();
  }
}

// Predefined validation rules for Property Agent
export const PropertyAgentValidationRules = {
  create: [
    { field: 'firstName', required: true, type: 'string' as const, minLength: 1, maxLength: 50 },
    { field: 'lastName', required: true, type: 'string' as const, minLength: 1, maxLength: 50 },
    { field: 'email', required: true, type: 'email' as const, maxLength: 100 },
    { field: 'mobileNumber', required: true, type: 'phone' as const, maxLength: 20 }
  ] as ValidationRule[],
  
  update: [
    { field: 'firstName', type: 'string' as const, minLength: 1, maxLength: 50 },
    { field: 'lastName', type: 'string' as const, minLength: 1, maxLength: 50 },
    { field: 'email', type: 'email' as const, maxLength: 100 },
    { field: 'mobileNumber', type: 'phone' as const, maxLength: 20 }
  ] as ValidationRule[],
  
  id: [
    { field: 'id', required: true, type: 'uuid' as const }
  ] as ValidationRule[]
};

