export enum LoaiPhieu {
    NHAP = 'Nhập',
    XUAT = 'Xuất',
}

export interface Transaction {
    id: number;
    maPhieu: string;
    loaiPhieu: LoaiPhieu;
    ngayTao: string;
    ghiChu: string;
}

export interface TransactionDetail {
    id: number;
    idPhieu: number;
    idSanPham: number;
    soLuong: number;
    donGia: number;
}

export interface TransactionSummary {
    soSanPham: number;
    tongSoLuong: number;
    tongGiaTri: number;
}

export interface TransactionWithSummary extends Transaction, TransactionSummary {}
