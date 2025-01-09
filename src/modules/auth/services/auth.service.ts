import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { PasswordHashService } from './password.hash.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/model/entities/user.entity';
import { TokenBlacklistService } from './token.blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly passwordHashService: PasswordHashService,
    private readonly configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (
      user &&
      (await this.passwordHashService.comparePasswords(pass, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwtSecret'),
      }),
    };
  }

  async logout(token: string) {
    return this.tokenBlacklistService.addToBlacklist(token);
  }
}
