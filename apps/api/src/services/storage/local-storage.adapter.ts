import { IStorageAdapter, StoragePutOptions } from './storage.interface.js';
import fs from 'node:fs/promises';
import path from 'node:path';

export class LocalStorageAdapter implements IStorageAdapter {
  public readonly driverName = 'local' as const;
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.resolve(process.cwd(), 'vault_storage');
  }

  private resolvePath(key: string): string {
    // Strip leading slashes to prevent absolute path escapes
    const sanitized = key.replace(/^[/\\]+/, '');
    return path.join(this.baseDir, sanitized);
  }

  public async putObject(key: string, data: Buffer, _options?: StoragePutOptions): Promise<string> {
    const fullPath = this.resolvePath(key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, data);
    return fullPath;
  }

  public async getObject(key: string): Promise<Buffer> {
    const fullPath = this.resolvePath(key);
    return fs.readFile(fullPath);
  }

  public async deleteObject(key: string): Promise<boolean> {
    try {
      const fullPath = this.resolvePath(key);
      await fs.unlink(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  public async hasObject(key: string): Promise<boolean> {
    try {
      const fullPath = this.resolvePath(key);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
