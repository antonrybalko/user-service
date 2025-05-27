export interface CloudStorageInterface {
  uploadFile(key: string, body: Buffer, contentType: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
