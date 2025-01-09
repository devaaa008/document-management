import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentInDto } from '../model/dtos/document.in.dto.';
import { Document } from '../model/entities/document.entity';
import { RequestData } from '../../../lib/requestContext/request.data';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private requestData: RequestData,
  ) {}

  async create(documentDto: DocumentInDto) {
    const document = this.getDocumentData(documentDto);
    return this.documentRepository.save(document);
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

  private getDocumentData(documentDto: DocumentInDto): Document {
    const document = new Document();
    document.title = documentDto.title;
    document.description = documentDto.description;
    document.s3Location = 'temp_location';
    document.createdBy = this.requestData.getUserId();
    document.createdOn = new Date();
    document.ingested = false;
    return document;
  }
}
