import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-1',
    });
    this.bucket = process.env.S3_BUCKET || '';
  }

  get isEnabled(): boolean {
    return this.bucket !== '';
  }

  async uploadFile(file: Express.Multer.File): Promise<{ key: string; url: string }> {
    const ext = extname(file.originalname);
    const key = `photos/${uuidv4()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucket}.s3.${process.env.AWS_REGION || 'ap-northeast-1'}.amazonaws.com/${key}`;
    return { key, url };
  }
}
