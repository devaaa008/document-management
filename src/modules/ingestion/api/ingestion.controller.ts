import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from '../services/ingestion.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../user/model/entities/role.enum';
import { IIngestionService } from '../services/interfaces/infestion.service.interface';

/**
 * Controller for managing document ingestion processes.
 *
 * This controller provides endpoints for triggering document ingestion and checking ingestion job status.
 * Access to these endpoints is restricted to ADMIN and EDITOR roles using JWT authentication and authorization checks.
 */
@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(
    @Inject(IngestionService.name)
    private readonly ingestionService: IIngestionService,
  ) {}

  /**
   * Triggers the ingestion process for a specific document.
   *
   * This endpoint expects a document ID in the URL parameter (`documentId`).
   * It requires ADMIN or EDITOR roles and performs authorization checks using JwtAuthGuard and RolesGuard.
   * The ingestion service is used to initiate the ingestion process for the provided document ID.
   *
   * @param documentId - The ID of the document to be ingested.
   * @returns A promise resolving to the ingestion job ID or an error message if ingestion fails.
   * @throws An error if document ingestion fails.
   */
  @Post('trigger/:documentId')
  @Roles(Role.ADMIN, Role.EDITOR)
  async ingestDocument(@Param('documentId') documentId: number) {
    return this.ingestionService.ingestDocument(documentId);
  }

  /**
   * Retrieves the status of a document ingestion job.
   *
   * This endpoint expects an ingestion job ID in the query parameter (`jobId`).
   * It requires ADMIN or EDITOR roles and performs authorization checks using JwtAuthGuard and RolesGuard.
   * The ingestion service is used to retrieve the status of the ingestion job with the provided ID.
   *
   * @param jobId - The ID of the ingestion job to check the status for.
   * @returns A promise resolving to the ingestion job status information.
   * @throws An error if job status retrieval fails.
   */
  @Get('status')
  @Roles(Role.ADMIN, Role.EDITOR)
  async getIngestionStatus(@Query('jobId') jobId: string) {
    return this.ingestionService.ingestionJobStatus(jobId);
  }
}
