import { DocumentInDto } from '../../model/dtos/document.in.dto.';
import { Document } from '../../model/entities/document.entity';

export interface IDocumentService {
  createAndUpload(
    documentDto: DocumentInDto,
    file: Express.Multer.File,
  ): Promise<Document>;
  getAllDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document>;
  updateDocument(
    id: number,
    documentToUpdate: Partial<Document>,
  ): Promise<Document>;
  deleteDocument(id: number): Promise<any>;
}
