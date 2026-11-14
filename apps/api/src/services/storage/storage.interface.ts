export interface StoragePutOptions {
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface IStorageAdapter {
  readonly driverName: 'local' | 's3';
  putObject(key: string, data: Buffer, options?: StoragePutOptions): Promise<string>;
  getObject(key: string): Promise<Buffer>;
  deleteObject(key: string): Promise<boolean>;
  hasObject(key: string): Promise<boolean>;
}
