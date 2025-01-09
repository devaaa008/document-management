import { Module } from '@nestjs/common';
import { DocumentController } from './api/document.controller';
import { DocumentService } from './services/document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './model/entities/document.entity';
import { RequestData } from '../../lib/requestContext/request.data';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../auth/services/token.blacklist.service';
import { BlackListedToken } from '../auth/model/entities/black.listed.token.entity';
import { S3Service } from '../../lib/s3/s3.service';

@Module({
  controllers: [DocumentController],
  providers: [
    DocumentService,
    RequestData,
    JwtService,
    TokenBlacklistService,
    S3Service,
  ],
  imports: [TypeOrmModule.forFeature([Document, BlackListedToken])],
})
export class DocumentModule {}
