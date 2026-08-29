import { FormGroup } from '@angular/forms';

export function normalizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function sanitizeForm(form: FormGroup, ...fields: string[]): void {
  for (const field of fields) {
    const control = form.get(field);
    if (control && typeof control.value === 'string') {
      control.setValue(normalizeString(control.value));
    }
  }
}
