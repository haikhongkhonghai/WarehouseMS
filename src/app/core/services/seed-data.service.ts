import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import { Transaction, TransactionDetail, LoaiPhieu } from '../../features/transactions/models/transaction.model';

@Injectable({ providedIn: 'root' })
export class SeedDataService {
  private readonly ls = inject(LocalStorageService);

  initialize(): void {
    this.seedCategories();
    this.seedProducts();
    this.seedTransactions();
  }

  private seedCategories(): void {
    if (this.ls.hasKey(STORAGE_KEYS.CATEGORIES_DATA)) return;

    const categoryNames = [
        'Điện thoại thông minh', 'Máy tính bảng', 'Laptop & MacBook', 'Màn hình máy tính', 'Bàn phím cơ',
        'Chuột không dây', 'Tai nghe Gaming', 'Loa Bluetooth', 'Microphone Thu Âm', 'Webcam PC',
        'Máy in văn phòng', 'Máy chiếu', 'Máy scan', 'Ổ cứng HDD', 'Ổ cứng SSD',
        'RAM Máy tính', 'Bo mạch chủ (Mainboard)', 'Bộ vi xử lý (CPU)', 'Card đồ họa (VGA)', 'Tản nhiệt & Fan'
    ];

    const initialCategories = categoryNames.map((name, i) => ({
      id: i + 1,
      maDanhMuc: `DM-${String(i + 1).padStart(3, '0')}`,
      tenDanhMuc: name,
      moTa: `Mô tả cho ${name}`,
    }));

    this.ls.saveAll(STORAGE_KEYS.CATEGORIES_DATA, initialCategories);
    this.ls.setSequence(STORAGE_KEYS.CATEGORIES_SEQ, 21);
  }

  private seedProducts(): void {
    if (this.ls.hasKey(STORAGE_KEYS.PRODUCTS_DATA)) return;
    const prefixes = ['Pro', 'Max', 'Ultra', 'Plus', 'Gaming', 'Office', 'Lite', 'Edition'];
    
    const initialProducts = Array.from({ length: 40 }, (_, i) => {
        const id = i + 1;
        const catId = (i % 20) + 1;
        const prefix = prefixes[i % prefixes.length];
        return {
            id,
            maSanPham: `SP-${String(id).padStart(3, '0')}`,
            tenSanPham: `Sản phẩm ${id} ${prefix}`,
            idDanhMuc: catId,
            donViTinh: 'Cái',
            giaNhap: 1000000 + (id * 100000),
            giaBan: 1500000 + (id * 150000),
            soLuongTon: 50 + id,
            trangThai: 'Đang kinh doanh',
        };
    });

    this.ls.saveAll(STORAGE_KEYS.PRODUCTS_DATA, initialProducts);
    this.ls.setSequence(STORAGE_KEYS.PRODUCTS_SEQ, 41);
  }

  private seedTransactions(): void {
    if (this.ls.hasKey(STORAGE_KEYS.TRANSACTIONS_DATA)) return;

    const txData: Transaction[] = [];
    const tdData: TransactionDetail[] = [];
    let txId = 1;
    let tdId = 1;

    // 10 Import transactions
    for (let i = 1; i <= 10; i++) {
        const maPhieu = `PN-${String(i).padStart(3, '0')}`;
        txData.push({
            id: txId,
            maPhieu,
            loaiPhieu: LoaiPhieu.NHAP,
            ngayTao: '2026-09-01',
            ghiChu: `Nhập lô hàng số ${i}`
        });

        const numItems = (i % 3) + 1; 
        for (let j = 0; j < numItems; j++) {
            tdData.push({
                id: tdId++,
                idPhieu: txId,
                idSanPham: ((i + j) % 40) + 1,
                soLuong: 10 + j * 5,
                donGia: 1200000
            });
        }
        txId++;
    }

    // 10 Export transactions
    for (let i = 1; i <= 10; i++) {
        const maPhieu = `PX-${String(i).padStart(3, '0')}`;
        txData.push({
            id: txId,
            maPhieu,
            loaiPhieu: LoaiPhieu.XUAT,
            ngayTao: '2026-09-02',
            ghiChu: `Xuất lô hàng số ${i}`
        });

        const numItems = (i % 2) + 1;
        for (let j = 0; j < numItems; j++) {
            tdData.push({
                id: tdId++,
                idPhieu: txId,
                idSanPham: ((i + j + 10) % 40) + 1,
                soLuong: 2 + j,
                donGia: 1800000
            });
        }
        txId++;
    }

    this.ls.saveAll(STORAGE_KEYS.TRANSACTIONS_DATA, txData);
    this.ls.setSequence(STORAGE_KEYS.TRANSACTIONS_SEQ, txId);
    
    this.ls.saveAll(STORAGE_KEYS.TRANSACTION_DETAILS_DATA, tdData);
    this.ls.setSequence(STORAGE_KEYS.TRANSACTION_DETAILS_SEQ, tdId);
    
    this.ls.setSequence(STORAGE_KEYS.IMPORT_CODE_SEQ, 11);
    this.ls.setSequence(STORAGE_KEYS.EXPORT_CODE_SEQ, 11);
  }
}

