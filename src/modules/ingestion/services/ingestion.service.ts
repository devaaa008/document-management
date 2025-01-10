import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DocumentService } from '../../document/services/document.service';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { IngestionJobEntity } from '../model/entities/ingestion.job.entity';
import { Repository } from 'typeorm';
import { IngestionPayload } from '../model/ingestion.payload';
import { IngestionStatus } from '../model/ingestion.status';
import { ConfigService } from '@nestjs/config';

/**
 * Service responsible for managing document ingestion processes.
 *
 * This service provides functionalities to trigger document ingestion, track job status, and update document ingestion status.
 * It interacts with the document service, ingestion job repository, and potentially an external ingestion API (commented out).
 */
@Injectable()
export class IngestionService implements IngestionService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(DocumentService.name)
    private documentService: DocumentService,
    @InjectRepository(IngestionJobEntity)
    private ingestionJobRepository: Repository<IngestionJobEntity>,
    private configService: ConfigService,
  ) {}

  /**
   * Triggers the ingestion process for a specific document.
   *
   * This method first retrieves the document by ID and checks if it's already ingested.
   * If not ingested, it creates a new `IngestionJobEntity` with a unique ID (`jobId`) and the document details (`IngestionPayload`).
   * The job status is set to `INPROGRESS`. The document's `ingested` flag is then updated to `true`.
   * An error is thrown if document retrieval fails or if the document is already ingested.
   *
   * (Commented out for now) It also attempts to send a POST request to an external ingestion API with the `IngestionPayload`.
   *
   * Finally, the ingestion job and updated document are saved to the database.
   *
   * @param documentId - The ID of the document to be ingested.
   * @returns A promise resolving to an object containing the generated `jobId`.
   * @throws A `BadRequestException` if the document is already ingested.
   * @throws An `InternalServerErrorException` if document retrieval, job creation, or document update fails.
   */
  async ingestDocument(documentId: number): Promise<{ jobId: string }> {
    const document = await this.documentService.getDocumentById(documentId);
    if (document.ingested)
      throw new BadRequestException('Document Already Ingested');
    try {
      const jobId = uuid();
      const ingestionPayoad: IngestionPayload = {
        documentId: documentId,
        s3_path: document.s3Location,
      };
      const response = this.httpService.post(
        this.configService.get<string>('ingestion.url'),
        ingestionPayoad,
      );
      const ingestionJob = new IngestionJobEntity();
      ingestionJob.jobId = jobId;
      ingestionJob.payload = ingestionPayoad;
      ingestionJob.status = IngestionStatus.INPROGRESS;
      await this.ingestionJobRepository.save(ingestionJob);
      await this.documentService.updateDocument(documentId, { ingested: true });
      return { jobId };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Retrieves the status of a document ingestion job.
   *
   * This method retrieves an `IngestionJobEntity` from the repository based on the provided `ingestionJobId`.
   * It returns a partial object containing only the `jobId` and `status` properties of the retrieved job entity.
   *
   * @param ingestionJobId - The ID of the ingestion job to check the status for.
   * @returns A promise resolving to a partial object containing `jobId` and `status` of the ingestion job.
   * @throws An error if the job entity is not found.
   */
  async ingestionJobStatus(
    ingestionJobId: string,
  ): Promise<Partial<IngestionJobEntity>> {
    const { jobId, status } = await this.ingestionJobRepository.findOneBy({
      jobId: ingestionJobId,
    });
    return { jobId, status };
  }
}
