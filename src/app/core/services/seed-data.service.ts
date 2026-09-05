import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';

@Injectable({ providedIn: 'root' })
export class SeedDataService {
  private readonly ls = inject(LocalStorageService);

  initialize(): void {
    this.seedCategories();
    this.seedProducts();
  }

  private seedCategories(): void {
    if (this.ls.hasKey(STORAGE_KEYS.CATEGORIES_DATA)) return;

    const initialCategories = [
      {
        id: 1,
        maDanhMuc: 'DM-001',
        tenDanhMuc: 'Điện thoại & Máy tính bảng',
        moTa: 'Các thiết bị di động thông minh',
      },
      {
        id: 2,
        maDanhMuc: 'DM-002',
        tenDanhMuc: 'Laptop & Linh kiện',
        moTa: 'Máy tính xách tay và thiết bị thay thế',
      },
      { id: 3, maDanhMuc: 'DM-003', tenDanhMuc: 'Thiết bị Âm thanh', moTa: 'Loa, tai nghe, micro' },
      {
        id: 4,
        maDanhMuc: 'DM-004',
        tenDanhMuc: 'Phụ kiện Công nghệ',
        moTa: 'Sạc, cáp, giá đỡ, bao da',
      },
      {
        id: 5,
        maDanhMuc: 'DM-005',
        tenDanhMuc: 'Thiết bị văn phòng',
        moTa: 'Máy in, máy scan, máy chiếu',
      },
      {
        id: 6,
        maDanhMuc: 'DM-006',
        tenDanhMuc: 'Gia dụng thông minh',
        moTa: 'Robot hút bụi, nồi chiên không dầu',
      },
      {
        id: 7,
        maDanhMuc: 'DM-007',
        tenDanhMuc: 'Thiết bị mạng',
        moTa: 'Router, Hub, Switch, WiFi',
      },
      {
        id: 8,
        maDanhMuc: 'DM-008',
        tenDanhMuc: 'Đồ chơi công nghệ',
        moTa: 'Flycam, kính VR, thiết bị AR',
      },
      {
        id: 9,
        maDanhMuc: 'DM-009',
        tenDanhMuc: 'Thiết bị lưu trữ',
        moTa: 'USB, ổ cứng di động, thẻ nhớ',
      },
      {
        id: 10,
        maDanhMuc: 'DM-010',
        tenDanhMuc: 'Camera giám sát',
        moTa: 'IP Camera, Webcam, đầu ghi',
      },
    ];

    this.ls.saveAll(STORAGE_KEYS.CATEGORIES_DATA, initialCategories);
    this.ls.setSequence(STORAGE_KEYS.CATEGORIES_SEQ, 11);
  }

  private seedProducts(): void {
    if (this.ls.hasKey(STORAGE_KEYS.PRODUCTS_DATA)) return;

    const initialProducts = [
      {
        id: 1,
        maSanPham: 'SP-001',
        tenSanPham: 'iPhone 15 Pro Max',
        idDanhMuc: 1,
        donViTinh: 'Chiếc',
        giaNhap: 28000000,
        giaBan: 32000000,
        soLuongTon: 15,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 2,
        maSanPham: 'SP-002',
        tenSanPham: 'iPad Pro M2',
        idDanhMuc: 1,
        donViTinh: 'Chiếc',
        giaNhap: 20000000,
        giaBan: 24000000,
        soLuongTon: 8,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 3,
        maSanPham: 'SP-003',
        tenSanPham: 'MacBook Pro 14 M3',
        idDanhMuc: 2,
        donViTinh: 'Chiếc',
        giaNhap: 35000000,
        giaBan: 39900000,
        soLuongTon: 10,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 4,
        maSanPham: 'SP-004',
        tenSanPham: 'RAM DDR5 Kingston 16GB',
        idDanhMuc: 2,
        donViTinh: 'Thanh',
        giaNhap: 1200000,
        giaBan: 1500000,
        soLuongTon: 50,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 5,
        maSanPham: 'SP-005',
        tenSanPham: 'Tai nghe AirPods Pro 2',
        idDanhMuc: 3,
        donViTinh: 'Hộp',
        giaNhap: 4500000,
        giaBan: 5500000,
        soLuongTon: 25,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 6,
        maSanPham: 'SP-006',
        tenSanPham: 'Cáp Sạc Nhanh Type-C 2m',
        idDanhMuc: 4,
        donViTinh: 'Sợi',
        giaNhap: 150000,
        giaBan: 250000,
        soLuongTon: 100,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 7,
        maSanPham: 'SP-007',
        tenSanPham: 'Máy In Laser Canon LBP2900',
        idDanhMuc: 5,
        donViTinh: 'Cái',
        giaNhap: 3800000,
        giaBan: 4300000,
        soLuongTon: 5,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 8,
        maSanPham: 'SP-008',
        tenSanPham: 'Robot Hút Bụi Roborock Q Revo',
        idDanhMuc: 6,
        donViTinh: 'Bộ',
        giaNhap: 14000000,
        giaBan: 16500000,
        soLuongTon: 4,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 9,
        maSanPham: 'SP-009',
        tenSanPham: 'Router ASUS ROG Rapture',
        idDanhMuc: 7,
        donViTinh: 'Cái',
        giaNhap: 7500000,
        giaBan: 8900000,
        soLuongTon: 6,
        trangThai: 'Đang kinh doanh',
      },
      {
        id: 10,
        maSanPham: 'SP-010',
        tenSanPham: 'Ổ Cứng SSD Samsung T7 1TB',
        idDanhMuc: 9,
        donViTinh: 'Cái',
        giaNhap: 1800000,
        giaBan: 2200000,
        soLuongTon: 30,
        trangThai: 'Đang kinh doanh',
      },
    ];

    this.ls.saveAll(STORAGE_KEYS.PRODUCTS_DATA, initialProducts);
    this.ls.setSequence(STORAGE_KEYS.PRODUCTS_SEQ, 11);
  }
}
