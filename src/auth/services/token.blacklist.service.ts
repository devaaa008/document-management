import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackListedToken } from '../model/entities/black.listed.token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(BlackListedToken)
    private readonly blacklistRepository: Repository<BlackListedToken>,
  ) {}

  async addToBlacklist(token: string): Promise<void> {
    const blacListedToken = new BlackListedToken();
    blacListedToken.token = token;
    this.blacklistRepository.save(blacListedToken);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return !!(await this.blacklistRepository.findOneBy({ token }));
  }
}
