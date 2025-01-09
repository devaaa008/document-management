import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from '../api/document.controller';
import { DocumentService } from '../services/document.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { DocumentInDto } from '../model/dtos/document.in.dto.';
import { InternalServerErrorException } from '@nestjs/common';

describe('DocumentController', () => {
  let controller: DocumentController;

  const mockDocumentService = {
    createAndUpload: jest.fn(),
    getAllDocuments: jest.fn(),
    deleteDocument: jest.fn(),
    updateDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDocument', () => {
    it('should create a document', async () => {
      const createDocumentDto: DocumentInDto = {
        title: 'sample',
        description: 'sample description',
      };
      const file: Express.Multer.File = {} as Express.Multer.File;
      const expectedResponse = {
        id: 1,
        title: 'sample',
        description: 'sample description',
        s3Location: 's3://location',
        createdOn: '2025-01-09T07:15:08.576Z',
      };

      mockDocumentService.createAndUpload.mockResolvedValue(expectedResponse);

      const result = await controller.createDocument(createDocumentDto, file);

      expect(result).toEqual(expectedResponse);
      expect(mockDocumentService.createAndUpload).toHaveBeenCalledWith(
        createDocumentDto,
        file,
      );
    });

    it('should throw error internal server for create a document', async () => {
      const createDocumentDto: DocumentInDto = {
        title: 'sample',
        description: 'sample description',
      };
      const file: Express.Multer.File = {} as Express.Multer.File;

      mockDocumentService.createAndUpload.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(
        controller.createDocument(createDocumentDto, file),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getDocuments', () => {
    it('should return all documents', async () => {
      const expectedDocuments = [
        {
          id: 1,
          title: 'sample',
          description: 'sample description',
          s3Location: 's3://location',
          createdOn: '2025-01-09T07:15:08.576Z',
        },
      ];

      mockDocumentService.getAllDocuments.mockResolvedValue(expectedDocuments);

      const result = await controller.getDocuments();

      expect(result).toEqual(expectedDocuments);
      expect(mockDocumentService.getAllDocuments).toHaveBeenCalled();
    });
    it('should throw error for get all documents', async () => {
      mockDocumentService.getAllDocuments.mockRejectedValueOnce(
        new InternalServerErrorException(),
      );

      await expect(controller.getDocuments()).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      const id = 1;
      const updateDocumentDto: DocumentInDto = {
        title: 'sample',
      };
      const expectedResult = {
        id: 1,
        title: 'sample',
        description: 'sample description',
        s3Location: 's3://location',
        createdOn: '2025-01-09T07:15:08.576Z',
      };

      mockDocumentService.updateDocument.mockResolvedValue(expectedResult);

      const result = await controller.updateDocument(id, updateDocumentDto);

      expect(result).toEqual(expectedResult);
      expect(mockDocumentService.updateDocument).toHaveBeenCalledWith(
        id,
        updateDocumentDto,
      );
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const id = 1;
      const expectedResult = {
        raw: [],
        affected: 1,
      };

      mockDocumentService.deleteDocument.mockResolvedValue(expectedResult);

      const result = await controller.deleteDocument(id);

      expect(result).toEqual(expectedResult);
      expect(mockDocumentService.deleteDocument).toHaveBeenCalledWith(id);
    });
  });
});
