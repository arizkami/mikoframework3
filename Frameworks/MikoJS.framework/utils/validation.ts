// Validation utilities
export type ValidationRule<T = any> = (value: T) => string | null;

export class Validator<T = any> {
  private rules: ValidationRule<T>[] = [];

  rule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): string[] {
    const errors: string[] = [];
    
    for (const rule of this.rules) {
      const error = rule(value);
      if (error) {
        errors.push(error);
      }
    }
    
    return errors;
  }

  isValid(value: T): boolean {
    return this.validate(value).length === 0;
  }
}

// Common validation rules
export const Rules = {
  required: (message = 'This field is required'): ValidationRule<any> => 
    (value) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return null;
    },

  minLength: (min: number, message?: string): ValidationRule<string> =>
    (value) => {
      if (typeof value === 'string' && value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return null;
    },

  maxLength: (max: number, message?: string): ValidationRule<string> =>
    (value) => {
      if (typeof value === 'string' && value.length > max) {
        return message || `Must be no more than ${max} characters`;
      }
      return null;
    },

  email: (message = 'Must be a valid email address'): ValidationRule<string> =>
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) {
        return message;
      }
      return null;
    },

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> =>
    (value) => {
      if (typeof value === 'string' && !regex.test(value)) {
        return message;
      }
      return null;
    },

  min: (min: number, message?: string): ValidationRule<number> =>
    (value) => {
      if (typeof value === 'number' && value < min) {
        return message || `Must be at least ${min}`;
      }
      return null;
    },

  max: (max: number, message?: string): ValidationRule<number> =>
    (value) => {
      if (typeof value === 'number' && value > max) {
        return message || `Must be no more than ${max}`;
      }
      return null;
    },

  custom: <T>(fn: (value: T) => boolean, message: string): ValidationRule<T> =>
    (value) => fn(value) ? null : message
};

// Form validation
export interface FormField {
  name: string;
  value: any;
  validator: Validator;
}

export class FormValidator {
  private fields = new Map<string, FormField>();

  field(name: string, validator: Validator): this {
    this.fields.set(name, {
      name,
      value: null,
      validator
    });
    return this;
  }

  setValue(name: string, value: any): this {
    const field = this.fields.get(name);
    if (field) {
      field.value = value;
    }
    return this;
  }

  validateField(name: string): string[] {
    const field = this.fields.get(name);
    return field ? field.validator.validate(field.value) : [];
  }

  validateAll(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    for (const [name, field] of this.fields) {
      const fieldErrors = field.validator.validate(field.value);
      if (fieldErrors.length > 0) {
        errors[name] = fieldErrors;
      }
    }
    
    return errors;
  }

  isValid(): boolean {
    return Object.keys(this.validateAll()).length === 0;
  }
}