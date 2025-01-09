import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: this.configService.get('aws.region'),
    });
  }

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
