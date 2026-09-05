import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { sanitizeForm } from '../../../../core/utils/form.utils';
import { Product, TrangThaiSanPham } from '../../models/product.model';
import { Category } from '../../../categories/models/category.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly productService = inject(ProductService);
    private readonly categoryService = inject(CategoryService);
    private readonly notificationService = inject(NotificationService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly TrangThai = TrangThaiSanPham;
    protected readonly isEditMode = signal(false);
    protected readonly categories = signal<Category[]>([]);
    protected form!: FormGroup;
    private editingProduct: Product | null = null;

    ngOnInit(): void {
        this.categories.set(this.categoryService.getAll());
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.editingProduct = this.productService.getById(Number(id));
        }
        this.initForm();
    }

    private initForm(): void {
        const existingCodes = this.productService.getAllCodes();
        const currentCode = this.editingProduct?.maSanPham;
        this.form = this.fb.group({
            maSanPham: [this.editingProduct?.maSanPham ?? '', [CustomValidators.notBlank(), CustomValidators.uniqueCode(existingCodes, currentCode)]],
            tenSanPham: [this.editingProduct?.tenSanPham ?? '', [CustomValidators.notBlank()]],
            idDanhMuc: [this.editingProduct?.idDanhMuc ?? null, [Validators.required]],
            donViTinh: [this.editingProduct?.donViTinh ?? '', [CustomValidators.notBlank()]],
            giaNhap: [this.editingProduct?.giaNhap ?? 0, [Validators.required, CustomValidators.nonNegative()]],
            giaBan: [this.editingProduct?.giaBan ?? 0, [Validators.required, CustomValidators.nonNegative()]],
            soLuongTon: [this.editingProduct?.soLuongTon ?? 0, [CustomValidators.nonNegative()]],
            trangThai: [this.editingProduct?.trangThai ?? TrangThaiSanPham.DANG_KINH_DOANH],
        });
    }

    protected isFieldInvalid(field: string): boolean {
        const control = this.form.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    protected onSubmit(): void {
        if (this.form.invalid) return;
        sanitizeForm(this.form, 'maSanPham', 'tenSanPham', 'donViTinh');
        try {
            const formValue = this.form.getRawValue();
            if (this.isEditMode() && this.editingProduct) {
                this.productService.update({ ...formValue, id: this.editingProduct.id });
                this.notificationService.success('Cập nhật sản phẩm thành công!');
            } else {
                this.productService.create(formValue);
                this.notificationService.success('Thêm sản phẩm thành công!');
            }
            this.router.navigate(['/products']);
        } catch (error) {
            this.notificationService.error((error as Error).message);
        }
    }
}
