import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';

/**
 * This service responsible for managing request-scoped data.
 */
@Injectable()
export class RequestData {
  constructor(private readonly cls: ClsService) {}

  /**
   * Sets the user ID in the request context.
   *
   * @param userId - The user ID to be stored.
   */
  setUserId(userId: number) {
    this.cls.set<number>('user_id', userId);
  }

  /**
   * Retrieves the user ID from the request context.
   *
   * @returns The user ID stored in the context.
   */
  getUserId(): number {
    return this.cls.get('user_id');
  }
}
