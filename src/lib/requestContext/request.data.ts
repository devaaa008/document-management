import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestData {
  constructor(private readonly cls: ClsService) {}

  setUserId(userId: number) {
    this.cls.set<number>('user_id', userId);
  }

  getUserId(): number {
    return this.cls.get('user_id');
  }

  setToken(token: string) {
    this.cls.set<string>('token', token);
  }

  getToken(): number {
    return this.cls.get<number>('token');
  }
}
