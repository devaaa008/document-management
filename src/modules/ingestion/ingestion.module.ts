import { Module } from '@nestjs/common';
import { IngestionController } from './api/ingestion.controller';
import { IngestionService } from './services/ingestion.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { DocumentService } from '../document/services/document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionJobEntity } from './model/entities/ingestion.job.entity';
import { Document } from '../document/model/entities/document.entity';
import { RequestData } from '../../lib/requestContext/request.data';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../auth/services/token.blacklist.service';
import { BlackListedToken } from '../auth/model/entities/black.listed.token.entity';
import { S3Service } from '../../lib/s3/s3.service';

@Module({
  controllers: [IngestionController],
  providers: [
    { provide: IngestionService.name, useClass: IngestionService },
    { provide: DocumentService.name, useClass: DocumentService },
    RequestData,
    JwtService,
    TokenBlacklistService,
    S3Service,
  ],
  imports: [
    TypeOrmModule.forFeature([IngestionJobEntity, Document, BlackListedToken]),
    HttpModule,
  ],
})
export class IngestionModule {}
