import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { IngestionService } from '../services/ingestion.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../user/model/entities/role.enum';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger/:documentId')
  @Roles(Role.ADMIN, Role.EDITOR)
  async ingestDocument(@Param('documentId') documentId: number) {
    return this.ingestionService.ingestDocument(documentId);
  }

  @Get('status')
  @Roles(Role.ADMIN, Role.EDITOR)
  async getIngestionStatus(@Query('requestId') requestId: string) {
    return this.ingestionService.ingestionJobStatus(requestId);
  }
}
