import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../api/ingestion.controller';
import { IngestionService } from '../services/ingestion.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    ingestDocument: jest.fn(),
    ingestionJobStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ingestDocument', () => {
    it('should ingest document for valid endpoint', async () => {
      const documentId = 123;
      const expectedResult = { status: 'success', jobId: 'abc123' };
      mockIngestionService.ingestDocument.mockResolvedValue(expectedResult);

      const result = await controller.ingestDocument(documentId);

      expect(ingestionService.ingestDocument).toHaveBeenCalledWith(documentId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if ingestion fails', async () => {
      const documentId = 456;
      const errorMessage = 'Ingestion failed';
      mockIngestionService.ingestDocument.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(controller.ingestDocument(documentId)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('getIngestionStatus', () => {
    it('should call get status of Ingestion job with the correct jobId', async () => {
      const jobId = 'abc123';
      const expectedResult = { status: 'completed' };
      mockIngestionService.ingestionJobStatus.mockResolvedValue(expectedResult);

      const result = await controller.getIngestionStatus(jobId);

      expect(ingestionService.ingestionJobStatus).toHaveBeenCalledWith(jobId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if ingestionService.ingestionJobStatus fails', async () => {
      const jobId = 'def456';
      const errorMessage = 'Status check failed';
      mockIngestionService.ingestionJobStatus.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(controller.getIngestionStatus(jobId)).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
