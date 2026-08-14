import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validator kiểm tra xem mã nhập vào đã tồn tại trong hệ thống chưa.
   * @param existingCodes Danh sách các mã hiện tại.
   * @param currentCode Mã hiện tại (nếu đang ở chế độ chỉnh sửa) để bỏ qua kiểm tra.
   */
  static uniqueCode(existingCodes: string[], currentCode?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toString().trim();
      if (!value) return null;

      if (currentCode && value.toLowerCase() === currentCode.toLowerCase()) {
        return null;
      }

      const isDuplicate = existingCodes.some((code) => code.toLowerCase() === value.toLowerCase());

      return isDuplicate ? { uniqueCode: true } : null;
    };
  }
}
