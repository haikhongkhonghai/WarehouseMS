import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static notBlank(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined) {
        return { required: true };
      }
      if (typeof value === 'string' && value.trim().length === 0) {
        return { required: true };
      }
      return null;
    };
  }

  static nonNegative(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return Number(value) >= 0 ? null : { nonNegative: true };
    };
  }

  static uniqueCode(existingCodes: string[], currentCode?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) {
        return null;
      }
      if (currentCode && value === currentCode) {
        return null;
      }
      return existingCodes.includes(value) ? { uniqueCode: true } : null;
    };
  }
}
