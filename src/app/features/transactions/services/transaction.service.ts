import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import {
    Transaction,
    TransactionDetail,
    TransactionSummary,
    TransactionWithSummary,
    LoaiPhieu
} from '../models/transaction.model';
import { ProductService } from '../../products/services/product.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constant';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private readonly ls = inject(LocalStorageService);
    private readonly productService = inject(ProductService);

    private readonly TX_DATA_KEY = STORAGE_KEYS.TRANSACTIONS_DATA;
    private readonly TX_SEQ_KEY = STORAGE_KEYS.TRANSACTIONS_SEQ;
    private readonly TD_DATA_KEY = STORAGE_KEYS.TRANSACTION_DETAILS_DATA;
    private readonly TD_SEQ_KEY = STORAGE_KEYS.TRANSACTION_DETAILS_SEQ;

    getAll(): Transaction[] {
        return this.ls.getAll<Transaction>(this.TX_DATA_KEY);
    }

    getById(id: number): Transaction | null {
        return this.ls.getById<Transaction>(this.TX_DATA_KEY, id);
    }

    getByType(type: LoaiPhieu): Transaction[] {
        return this.getAll().filter(t => t.loaiPhieu === type);
    }

    getDetailsByTransactionId(transactionId: number): TransactionDetail[] {
        return this.ls.getAll<TransactionDetail>(this.TD_DATA_KEY)
            .filter(d => d.idPhieu === transactionId);
    }


    calculateItemTotal(soLuong: number, donGia: number): number {
        return (soLuong || 0) * (donGia || 0);
    }

    calculateSummary(details: Pick<TransactionDetail, 'soLuong' | 'donGia'>[]): TransactionSummary {
        return {
            soSanPham: details.length,
            tongSoLuong: details.reduce((sum, d) => sum + (d.soLuong || 0), 0),
            tongGiaTri: details.reduce((sum, d) => sum + this.calculateItemTotal(d.soLuong, d.donGia), 0),
        };
    }

    getTransactionSummary(transactionId: number): TransactionSummary {
        const details = this.getDetailsByTransactionId(transactionId);
        return this.calculateSummary(details);
    }

    getByTypeWithSummary(type: LoaiPhieu): TransactionWithSummary[] {
        const transactions = this.getByType(type);
        const allDetails = this.ls.getAll<TransactionDetail>(this.TD_DATA_KEY);

        const detailsMap = new Map<number, TransactionDetail[]>();
        for (const detail of allDetails) {
            const list = detailsMap.get(detail.idPhieu);
            if (list) {
                list.push(detail);
            } else {
                detailsMap.set(detail.idPhieu, [detail]);
            }
        }

        return transactions.map(t => {
            const details = detailsMap.get(t.id) || [];
            const summary = this.calculateSummary(details);
            return {
                ...t,
                ...summary,
            };
        });
    }

    generateMaPhieu(type: LoaiPhieu, isPreview: boolean = false): string {
        const isImport = type === LoaiPhieu.NHAP;
        const prefix = isImport ? APP_CONSTANTS.IMPORT_PREFIX : APP_CONSTANTS.EXPORT_PREFIX;
        const seqKey = isImport ? STORAGE_KEYS.IMPORT_CODE_SEQ : STORAGE_KEYS.EXPORT_CODE_SEQ;
        const nextNumber = isPreview ? this.ls.getSequence(seqKey) : this.ls.generateNextId(seqKey);
        return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
    }

    createTransaction(
        type: LoaiPhieu,
        ghiChu: string,
        details: Omit<TransactionDetail, 'id' | 'idPhieu'>[]
    ): Transaction {
        const isImport = type === LoaiPhieu.NHAP;
        const typeLabel = isImport ? 'Phiếu nhập' : 'Phiếu xuất';

        if (details.length === 0) {
            throw new Error(`${typeLabel} phải có ít nhất một sản phẩm.`);
        }

        for (const detail of details) {
            const product = this.productService.getById(detail.idSanPham);
            if (!product) {
                throw new Error(`Sản phẩm với ID ${detail.idSanPham} không tồn tại.`);
            }
            if (!isImport && product.soLuongTon < detail.soLuong) {
                throw new Error(
                    `Sản phẩm "${product.tenSanPham}" chỉ còn ${product.soLuongTon} ${product.donViTinh}, không đủ xuất ${detail.soLuong}.`
                );
            }
        }

        const maPhieu = this.generateMaPhieu(type);
        const transaction = this.ls.insert<Transaction>(this.TX_DATA_KEY, this.TX_SEQ_KEY, {
            maPhieu,
            loaiPhieu: type,
            ngayTao: new Date().toISOString().split('T')[0],
            ghiChu,
        });

        for (const detail of details) {
            const product = this.productService.getById(detail.idSanPham)!;
            
            this.ls.insert<TransactionDetail>(this.TD_DATA_KEY, this.TD_SEQ_KEY, {
                idPhieu: transaction.id,
                idSanPham: detail.idSanPham,
                soLuong: detail.soLuong,
                donGia: detail.donGia,
                maSanPham: product.maSanPham,
                tenSanPham: product.tenSanPham,
                donViTinh: product.donViTinh
            });

            const stockDelta = isImport ? detail.soLuong : -detail.soLuong;
            this.productService.updateStock(product.id, product.soLuongTon + stockDelta);
        }

        return transaction;
    }

    createImport(ghiChu: string, details: Omit<TransactionDetail, 'id' | 'idPhieu'>[]): Transaction {
        return this.createTransaction(LoaiPhieu.NHAP, ghiChu, details);
    }

    createExport(ghiChu: string, details: Omit<TransactionDetail, 'id' | 'idPhieu'>[]): Transaction {
        return this.createTransaction(LoaiPhieu.XUAT, ghiChu, details);
    }

    searchByMaPhieu<T extends Transaction>(keyword: string, transactions: T[]): T[] {
        if (!keyword.trim()) {
            return transactions;
        }
        const lower = keyword.toLowerCase().trim();
        return transactions.filter(t => t.maPhieu.toLowerCase().includes(lower));
    }

    filterByDate<T extends Transaction>(from: string | null, to: string | null, transactions: T[]): T[] {
        let result = transactions;
        if (from) {
            result = result.filter(t => t.ngayTao >= from);
        }
        if (to) {
            result = result.filter(t => t.ngayTao <= to);
        }
        return result;
    }
}

