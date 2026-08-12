import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getAll<T>(dataKey: string): T[] {
    if (!this.isBrowser) {
      return [];
    }
    try {
      const raw = localStorage.getItem(dataKey);
      return raw ? JSON.parse(raw) as T[] : [];
    } catch (error) {
      console.error(`Lỗi đọc key ${dataKey} từ localStorage:`, error);
      return [];
    }
  }

  getById<T extends {id: number}>(dataKey: string, id: number): T | null {
    const items = this.getAll<T>(dataKey);
    return items.find((item) => item.id === id) ?? null;
  }

  saveAll<T>(dataKey: string, data: T[]): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(dataKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Lỗi lưu key ${dataKey} vào localStorage:`, error);
      throw new Error(`Không thể lưu dữ liệu vào ${dataKey}`);
    }
  }

  getSequence(seqKey: string): number {
    if (!this.isBrowser) {
      return 1;
    }
    try {
      const raw = localStorage.getItem(seqKey);
      return raw ? parseInt(raw, 10) : 1;
    } catch (error) {
      console.error(`Lỗi đọc sequence ${seqKey}:`, error);
      return 1;
    }
  }

  setSequence(seqKey: string, value: number): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(seqKey, value.toString());
    } catch (error) {
      console.error(`Lỗi lưu sequence ${seqKey}:`, error);
      throw new Error(`Không thể lưu sequence ${seqKey}.`);
    }
  }

  generateNextId(seqKey: string): number {
    const nextId = this.getSequence(seqKey);
    this.setSequence(seqKey, nextId + 1);
    return nextId;
  }

  insert<T extends { id: number }>(dataKey: string, seqKey: string, record: Omit<T, 'id'>): T {
    const id = this.generateNextId(seqKey);
    const newRecord = { ...record, id } as T;
    const items = this.getAll<T>(dataKey);
    items.push(newRecord);
    this.saveAll(dataKey, items);
    return newRecord;
  }

  update<T extends { id: number }>(dataKey: string, record: T): boolean {
    const items = this.getAll<T>(dataKey);
    const index = items.findIndex((item) => item.id === record.id);
    if (index === -1) {
      return false;
    }
    items[index] = record;
    this.saveAll(dataKey, items);
    return true;
  }

  delete<T extends { id: number }>(dataKey: string, id: number): boolean {
    const items = this.getAll<T>(dataKey);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    items.splice(index, 1);
    this.saveAll(dataKey, items);
    return true;
  }

  hasKey(key: string): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }
}
