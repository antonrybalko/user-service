import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { LoggerInterface } from 'shared/interface/LoggerInterface';
import { Inject, Service } from 'typedi';

@Service()
export class StorageService {
  @Inject('LoggerInterface')
  private logger: LoggerInterface;

  private s3: S3Client;

  private region = process.env.AWS_REGION;

  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!this.region || !this.bucketName || !accessKeyId || !secretAccessKey) {
      this.logger.error('AWS S3 configuration is missing');
      throw new Error('AWS S3 configuration is missing');
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);

    return `https://s3.${this.region}.amazonaws.com/${this.bucketName}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await this.s3.send(command);
  }
}
