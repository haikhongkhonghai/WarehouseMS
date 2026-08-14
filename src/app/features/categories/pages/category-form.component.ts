import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { Category } from '../models/category.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  template: `
    <app-page-header
      [title]="isEditMode() ? 'Sửa danh mục' : 'Thêm danh mục'"
      [subtitle]="isEditMode() ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục mới'"
    >
      <a routerLink="/categories" class="btn btn--secondary">← Quay lại</a>
    </app-page-header>

    <div class="card">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <div class="form-group">
          <label class="form-label" for="maDanhMuc"
            >Mã danh mục <span class="required">*</span></label
          >
          <input
            id="maDanhMuc"
            class="form-control"
            formControlName="maDanhMuc"
            placeholder="VD: DM-001"
            [class.form-control--error]="isFieldInvalid('maDanhMuc')"
          />
          @if (isFieldInvalid('maDanhMuc')) {
            <span class="error-msg">
              @if (form.get('maDanhMuc')?.errors?.['required']) {
                Mã danh mục không được để trống.
              } @else if (form.get('maDanhMuc')?.errors?.['uniqueCode']) {
                Mã danh mục đã tồn tại trong hệ thống.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="tenDanhMuc"
            >Tên danh mục <span class="required">*</span></label
          >
          <input
            id="tenDanhMuc"
            class="form-control"
            formControlName="tenDanhMuc"
            placeholder="VD: Điện thoại & Máy tính bảng"
            [class.form-control--error]="isFieldInvalid('tenDanhMuc')"
          />
          @if (isFieldInvalid('tenDanhMuc')) {
            <span class="error-msg">Tên danh mục không được để trống.</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="moTa">Mô tả</label>
          <textarea
            id="moTa"
            class="form-control form-control--textarea"
            formControlName="moTa"
            rows="4"
            placeholder="Nhập mô tả ngắn về danh mục này..."
          ></textarea>
        </div>

        <div class="form-actions">
          <a routerLink="/categories" class="btn btn--secondary">Hủy</a>
          <button type="submit" class="btn btn--primary" [disabled]="form.invalid">
            {{ isEditMode() ? 'Cập nhật' : 'Lưu danh mục' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        padding: 28px;
        max-width: 600px;
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .form-label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      }
      .required {
        color: #ef4444;
      }
      .form-control {
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 10px 14px;
        font-size: 14px;
        color: #1e293b;
        outline: none;
        transition: border-color 0.15s;
      }
      .form-control:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
      }
      .form-control--error {
        border-color: #ef4444 !important;
      }
      .form-control--textarea {
        resize: vertical;
        font-family: inherit;
      }
      .error-msg {
        font-size: 12px;
        color: #ef4444;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 12px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }
      .btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: none;
        transition: all 0.15s;
      }
      .btn--primary {
        background: #6366f1;
        color: white;
      }
      .btn--primary:hover:not(:disabled) {
        background: #4f46e5;
      }
      .btn--primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn--secondary {
        background: #f1f5f9;
        color: #475569;
      }
      .btn--secondary:hover {
        background: #e2e8f0;
      }
    `,
  ],
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditMode = signal(false);
  protected form!: FormGroup;
  private editingCategory: Category | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editingCategory = this.categoryService.getById(Number(id));
    }

    this.initForm();
  }

  private initForm(): void {
    const existingCodes = this.categoryService.getAllCodes();
    const currentCode = this.editingCategory?.maDanhMuc;

    this.form = this.fb.group({
      maDanhMuc: [
        this.editingCategory?.maDanhMuc ?? '',
        [Validators.required, CustomValidators.uniqueCode(existingCodes, currentCode)],
      ],
      tenDanhMuc: [this.editingCategory?.tenDanhMuc ?? '', [Validators.required]],
      moTa: [this.editingCategory?.moTa ?? ''],
    });
  }

  protected isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    try {
      const formValue = this.form.getRawValue();
      if (this.isEditMode() && this.editingCategory) {
        const updated: Category = { ...formValue, id: this.editingCategory.id };
        this.categoryService.update(updated);
        this.notificationService.success('Cập nhật danh mục thành công!');
      } else {
        this.categoryService.create(formValue);
        this.notificationService.success('Thêm danh mục thành công!');
      }
      this.router.navigate(['/categories']);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    }
  }
}
