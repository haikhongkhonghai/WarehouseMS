import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { TransactionWithSummary, LoaiPhieu } from '../../models/transaction.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe, PageHeaderComponent, EmptyStateComponent],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly transactionService = inject(TransactionService);

  protected readonly type = signal<LoaiPhieu>(LoaiPhieu.NHAP);

  protected readonly transactions = signal<TransactionWithSummary[]>([]);
  protected readonly searchKeyword = signal('');
  protected readonly dateFrom = signal('');
  protected readonly dateTo = signal('');

  protected readonly filteredTransactions = computed(() => {
    let result = this.transactions();
    result = this.transactionService.searchByMaPhieu(this.searchKeyword(), result);
    result = this.transactionService.filterByDate(
      this.dateFrom() || null,
      this.dateTo() || null,
      result,
    );
    return result;
  });

  protected isImport(): boolean {
    return this.type() === LoaiPhieu.NHAP;
  }

  ngOnInit(): void {
    this.type.set(this.route.snapshot.data['loaiPhieu']);
    this.transactions.set(this.transactionService.getByTypeWithSummary(this.type()));
  }
}
