import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DocumentService } from '../../document/services/document.service';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { IngestionJobEntity } from '../model/entities/ingestion.job.entity';
import { Repository } from 'typeorm';
import { IngestionPayload } from '../model/ingestion.payload';
import { IngestionStatus } from '../model/ingestion.status';

@Injectable()
export class IngestionService {
  constructor(
    private readonly httpService: HttpService,
    private documentService: DocumentService,
    @InjectRepository(IngestionJobEntity)
    private ingestionJobRepository: Repository<IngestionJobEntity>,
  ) {}

  async ingestDocument(documentId: number) {
    const document = await this.documentService.getDocumentById(documentId);
    const requestId = uuid();
    const ingestionPayoad: IngestionPayload = {
      requestId: requestId,
      documentId: documentId,
      s3_path: document.s3Location,
    };
    // const response = await this.httpService.post('', ingestionPayoad);
    const ingestionJob = new IngestionJobEntity();
    ingestionJob.requestId = requestId;
    ingestionJob.payload = ingestionPayoad;
    ingestionJob.status = IngestionStatus.INPROGRESS;
    await this.ingestionJobRepository.save(ingestionJob);
    return { requestId };
  }

  async ingestionJobStatus(
    ingestionRequestId: string,
  ): Promise<Partial<IngestionJobEntity>> {
    const { requestId, status } = await this.ingestionJobRepository.findOneBy({
      requestId: ingestionRequestId,
    });
    return { requestId, status };
  }
}
