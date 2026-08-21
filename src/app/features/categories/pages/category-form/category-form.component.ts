import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Category } from '../../models/category.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
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
