import { IStorageAdapter } from './storage.interface.js';
import { LocalStorageAdapter } from './local-storage.adapter.js';
import { S3StorageAdapter } from './s3-storage.adapter.js';

let instance: IStorageAdapter | null = null;

export function getStorageAdapter(): IStorageAdapter {
  if (instance) return instance;

  const driver = process.env.STORAGE_DRIVER?.toLowerCase();
  const hasS3Config = Boolean(process.env.S3_BUCKET_NAME);

  if (driver === 's3' || hasS3Config) {
    instance = new S3StorageAdapter();
  } else {
    instance = new LocalStorageAdapter();
  }

  return instance;
}

export function setStorageAdapter(adapter: IStorageAdapter): void {
  instance = adapter;
}
