import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static nonNegative(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return Number(value) >= 0 ? null : { nonNegative: true };
    };
  }

  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return Number(value) > 0 ? null : { positiveNumber: true };
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
