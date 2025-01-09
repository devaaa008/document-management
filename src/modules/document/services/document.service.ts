import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentInDto } from '../model/dtos/document.in.dto.';
import { Document } from '../model/entities/document.entity';
import { RequestData } from '../../../lib/requestContext/request.data';
import { IngestionJobEntity } from '../../ingestion/model/entities/ingestion.job.entity';
import { S3Service } from '../../../lib/s3/s3.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private requestData: RequestData,
    private s3Service: S3Service,
  ) {}

  async createAndUpload(
    documentDto: DocumentInDto,
    file: Express.Multer.File,
  ): Promise<Document> {
    try {
      const s3Location = await this.s3Service.uploadFile(file);
      const document = this.getDocumentData(documentDto, s3Location);
      return this.documentRepository.save(document);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  async getDocumentById(id: number): Promise<Document> {
    return this.documentRepository.findOneBy({ id });
  }

  async updateDocument(
    id: number,
    documentToUpdate: Partial<Document>,
  ): Promise<Document> {
    const document = await this.getDocumentById(id);
    Object.assign(document, {
      ...document,
      ...documentToUpdate,
    });
    return this.documentRepository.save(document);
  }

  async deleteDocument(id: number) {
    return this.documentRepository.delete(id);
  }

  private getDocumentData(
    documentDto: DocumentInDto,
    s3Location: string,
  ): Document {
    const document = new Document();
    document.title = documentDto.title;
    document.description = documentDto.description;
    document.s3Location = s3Location;
    document.createdBy = this.requestData.getUserId();
    document.createdOn = new Date();
    document.ingested = false;
    return document;
  }
}
