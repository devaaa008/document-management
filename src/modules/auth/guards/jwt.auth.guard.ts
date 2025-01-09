import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from '../services/token.blacklist.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const tokenBlackListed =
      await this.tokenBlacklistService.isBlacklisted(token);

    if (!token || tokenBlackListed) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtSecret'),
      });

      request['user'] = payload;
      this.cls.set('user_id', payload.sub);
      this.cls.set('token', token);
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as any).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
