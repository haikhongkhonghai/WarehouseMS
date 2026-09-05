import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';

import { Transaction, TransactionDetail, TransactionSummary, LoaiPhieu } from '../../models/transaction.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, PageHeaderComponent],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss'
})
export class TransactionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly transactionService = inject(TransactionService);


  protected readonly LoaiPhieu = LoaiPhieu;
  protected readonly transaction = signal<Transaction | null>(null);
  protected readonly details = signal<TransactionDetail[]>([]);

  protected readonly summary = computed<TransactionSummary>(() =>
    this.transactionService.calculateSummary(this.details())
  );

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.transaction.set(this.transactionService.getById(id));
      this.details.set(this.transactionService.getDetailsByTransactionId(id));
    }
  }



  protected getItemTotal(detail: TransactionDetail): number {
    return this.transactionService.calculateItemTotal(detail.soLuong, detail.donGia);
  }
}
