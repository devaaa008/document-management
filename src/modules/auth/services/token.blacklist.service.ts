import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackListedToken } from '../model/entities/black.listed.token.entity';
import { Repository } from 'typeorm';

/**
 * Service responsible for managing the blacklist of tokens for logout functionality.
 *
 * This service provides methods to add tokens to the blacklist and check if a token is blacklisted.
 */
@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(BlackListedToken)
    private readonly blacklistRepository: Repository<BlackListedToken>,
  ) {}

  /**
   * Adds a token to the blacklist table.
   *
   * This method creates a new `BlackListedToken` entity with the provided token and saves it to the database using the TypeORM repository.
   * Blacklisted tokens are used to invalidate tokens and prevent unauthorized access after logout.
   *
   * @param token - The JWT token to be added to the blacklist.
   * @returns A promise that resolves when the token is saved to the blacklist table.
   */
  async addToBlacklist(token: string): Promise<void> {
    const blacListedToken = new BlackListedToken();
    blacListedToken.token = token;
    await this.blacklistRepository.save(blacListedToken);
  }

  /**
   * Checks if a token is present in the blacklist table.
   *
   * This method uses the TypeORM repository to find a `BlackListedToken` entity where the `token` property matches the provided token.
   * It returns `true` if a matching token is found, indicating that the token is blacklisted, otherwise `false`.
   *
   * @param token - The JWT token to be checked against the blacklist.
   * @returns A promise resolving to `true` if the token is blacklisted, otherwise `false`.
   */
  async isBlacklisted(token: string): Promise<boolean> {
    return !!(await this.blacklistRepository.findOneBy({ token }));
  }
}
