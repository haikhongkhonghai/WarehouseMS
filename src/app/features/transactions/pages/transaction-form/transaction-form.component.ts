import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { ProductService } from '../../../products/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoaiPhieu } from '../../models/transaction.model';
import { Product } from '../../../products/models/product.model';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, PageHeaderComponent],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly type = signal<LoaiPhieu>(LoaiPhieu.NHAP);

  protected readonly maPhieu = signal('');
  protected readonly products = signal<Product[]>([]);
  protected form!: FormGroup;

  protected isImport(): boolean {
    return this.type() === LoaiPhieu.NHAP;
  }

  get detailsArray(): FormArray {
    return this.form.get('details') as FormArray;
  }

  ngOnInit(): void {
    this.type.set(this.route.snapshot.data['loaiPhieu']);
    this.products.set(this.productService.getAll());
    this.maPhieu.set(this.transactionService.generateMaPhieu(this.type()));
    this.form = this.fb.group({
      ghiChu: [''],
      details: this.fb.array([this.createDetailGroup()]),
    });
  }

  private createDetailGroup(): FormGroup {
    return this.fb.group({
      idSanPham: [null, [Validators.required]],
      soLuong: [1, [Validators.required, CustomValidators.positiveNumber()]],
      donGia: [0, [Validators.required, CustomValidators.nonNegative()]],
    });
  }

  protected addDetail(): void {
    this.detailsArray.push(this.createDetailGroup());
  }

  protected removeDetail(index: number): void {
    this.detailsArray.removeAt(index);
  }

  protected onProductChange(index: number): void {
    const group = this.detailsArray.at(index) as FormGroup;
    const productId = group.get('idSanPham')?.value;
    if (productId) {
      const product = this.productService.getById(productId);
      if (product) {
        group.patchValue({ donGia: this.isImport() ? product.giaNhap : product.giaBan });
      }
    }
  }

  protected getRowTotal(index: number): number {
    const group = this.detailsArray.at(index) as FormGroup;
    const soLuong = group.get('soLuong')?.value || 0;
    const donGia = group.get('donGia')?.value || 0;
    return this.transactionService.calculateItemTotal(soLuong, donGia);
  }

  protected getGrandTotal(): number {
    const rawDetails = this.detailsArray.getRawValue();
    return this.transactionService.calculateSummary(rawDetails).tongGiaTri;
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    try {
      const { ghiChu, details } = this.form.getRawValue();
      const type = this.type();
      this.transactionService.createTransaction(type, ghiChu, details);
      const actionText = this.isImport() ? 'nhập' : 'xuất';
      this.notificationService.success(`Tạo phiếu ${actionText} thành công!`);
      this.router.navigate([this.isImport() ? '/transactions/import' : '/transactions/export']);
    } catch (error) {
      this.notificationService.error((error as Error).message);
    }
  }
}

