import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../user/model/entities/role.enum';
import { DocumentInDto } from '../model/dtos/document.in.dto.';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IDocumentService } from '../services/interfaces/document.service.interface';

/**
 * Controller for managing documents within the application.
 *
 * This controller provides API endpoints for creating, retrieving, updating, and deleting documents.
 * Access to these endpoints is restricted based on user roles using JWT authentication and authorization checks.
 */
@Controller('document')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(
    @Inject(DocumentService.name)
    private readonly documentService: IDocumentService,
  ) {}

  /**
   * Creates a new document and uploads an associated file.
   *
   * This endpoint expects a multipart form data request containing a document object in the body (`DocumentInDto`) and a file named "file".
   * It requires ADMIN or EDITOR roles and performs authorization checks using JwtAuthGuard and RolesGuard.
   * The FileInterceptor is used to handle file uploads.
   * The document service is used to create the document record and upload the associated file.
   *
   * @param file - The uploaded file (`Express.Multer.File`) associated with the document.
   * @param createDocumentDto - The document data (`DocumentInDto`) to be stored.
   * @returns A promise resolving to the created document object.
   * @throws An error if document creation or file upload fails.
   */
  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: DocumentInDto,
  ) {
    return this.documentService.createAndUpload(createDocumentDto, file);
  }

  /**
   * Retrieves all documents from the system.
   *
   * This endpoint retrieves all documents and requires ADMIN, EDITOR, or VIEWER roles.
   * Authorization checks are performed using JwtAuthGuard and RolesGuard.
   * The document service is used to fetch all documents.
   *
   * @returns A promise resolving to an array of document objects.
   * @throws An error if document retrieval fails.
   */
  @Get('documents')
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async getDocuments() {
    return this.documentService.getAllDocuments();
  }

  /**
   * Updates an existing document.
   *
   * This endpoint expects a document object (`DocumentInDto`) in the request body and a document ID in the query parameter (`id`).
   * It requires ADMIN or EDITOR roles and performs authorization checks using JwtAuthGuard and RolesGuard.
   * The document service is used to update the document with the provided data.
   *
   * @param id - The ID of the document to be updated.
   * @param updateDocumentDto - The document data (`DocumentInDto`) containing the updates.
   * @returns A promise resolving to the updated document object.
   * @throws An error if document update fails.
   */
  @Put()
  @Roles(Role.ADMIN, Role.EDITOR)
  async updateDocument(
    @Query('id') id: number,
    @Body() updateDocumentDto: DocumentInDto,
  ) {
    return this.documentService.updateDocument(
      id,
      updateDocumentDto as Partial<Document>,
    );
  }

  /**
   * Deletes a document by its ID.
   *
   * This endpoint requires ADMIN or EDITOR roles and performs authorization checks using JwtAuthGuard and RolesGuard.
   *
   */
  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  async deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
