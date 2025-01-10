import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentInDto } from '../model/dtos/document.in.dto.';
import { Document } from '../model/entities/document.entity';
import { RequestData } from '../../../lib/requestContext/request.data';
import { S3Service } from '../../../lib/s3/s3.service';

/**
 * Service responsible for managing documents within the application.
 *
 * This service provides functionalities for creating, retrieving, updating, and deleting documents.
 * It interacts with the document repository and S3 service for storage.
 */
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private requestData: RequestData,
    private s3Service: S3Service,
  ) {}

  /**
   * Creates a new document and uploads an associated file to S3.
   *
   * This method creates a new `Document` entity from the provided `DocumentInDto` and uploads the associated file using the S3 service.
   * It retrieves the uploaded file location from S3 and populates the `s3Location` property of the document.
   * The document creation date, createdBy (user ID from RequestData), and ingested flag are also set.
   * Finally, the document is saved to the database repository.
   *
   * @param documentDto - The document data (`DocumentInDto`) to be stored.
   * @param file - The uploaded file (`Express.Multer.File`) associated with the document.
   * @returns A promise resolving to the created document object.
   * @throws An `InternalServerErrorException` if document creation or file upload fails.
   */
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

  /**
   * Retrieves all documents from the database repository.
   *
   * This method uses the document repository to find all documents in the database.
   *
   * @returns A promise resolving to an array of document objects.
   */
  async getAllDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  /**
   * Retrieves a document by its ID from the database repository.
   *
   * This method uses the document repository to find a document with the matching ID.
   *
   * @param id - The ID of the document to be retrieved.
   * @returns A promise resolving to the document object if found, otherwise null.
   */
  async getDocumentById(id: number): Promise<Document> {
    return this.documentRepository.findOneBy({ id });
  }

  /**
   * Updates an existing document in the database repository.
   *
   * This method first retrieves the document by ID and then merges the provided update data with the existing document properties.
   * Finally, the updated document is saved to the database repository.
   *
   * @param id - The ID of the document to be updated.
   * @param documentToUpdate - A partial document object containing the update data.
   * @returns A promise resolving to the updated document object.
   */
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

  /**
   * Deletes a document by its ID from the database repository.
   *
   * This method uses the document repository to delete the document with the matching ID.
   *
   * @param id - The ID of the document to be deleted.
   * @returns A promise that resolves when the document is deleted.
   */
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
