import { IngestionJobEntity } from '../../model/entities/ingestion.job.entity';

export interface IIngestionService {
  ingestDocument(documentId: number): Promise<{ jobId: string }>;
  ingestionJobStatus(
    ingestionJobId: string,
  ): Promise<Partial<IngestionJobEntity>>;
}
