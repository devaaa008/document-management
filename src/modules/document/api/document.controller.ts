import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../user/model/entities/role.enum';
import { DocumentInDto } from '../model/dtos/document.in.dto.';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('document')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createDocument(@Body() createDocumentDto: DocumentInDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Get('documents')
  @Roles(Role.ADMIN, Role.EDITOR, Role.VIEWER)
  async getDocuments() {
    return this.documentService.getAllDocuments();
  }

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

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  async deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
