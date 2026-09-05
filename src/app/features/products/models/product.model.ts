export enum TrangThaiSanPham {
    DANG_KINH_DOANH = 'Đang kinh doanh',
    NGUNG_KINH_DOANH = 'Ngừng kinh doanh',
}

export interface Product {
    id: number;
    maSanPham: string;
    tenSanPham: string;
    idDanhMuc: number;
    donViTinh: string;
    giaNhap: number;
    giaBan: number;
    soLuongTon: number;
    trangThai: TrangThaiSanPham;
}
