import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

/**
 * This Service is responsible for interacting with Amazon S3.
 */
@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  /**
   * Constructs an instance of the S3Service.
   *
   * @param configService - The configuration service used to access application settings.
   */
  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: this.configService.get('aws.region'),
    });
  }

  /**
   * Uploads a file to the specified Amazon S3 bucket.
   *
   * @param file - The file object to be uploaded.
   * @returns A promise that resolves to the URL of the uploaded file.
   * @throws An error if the file upload fails.
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.configService.get('aws.s3.bucket'),
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}
