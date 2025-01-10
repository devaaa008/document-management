import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './api/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/services/user.service';
import { PasswordHashService } from './services/password.hash.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/model/entities/user.entity';
import { LocalStrategy } from './services/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './services/token.blacklist.service';
import { BlackListedToken } from './model/entities/black.listed.token.entity';

@Module({
  providers: [
    { provide: AuthService.name, useClass: AuthService },
    PasswordHashService,
    { provide: UserService.name, useClass: UserService },
    LocalStrategy,
    ConfigService,
    TokenBlacklistService,
    JwtService,
  ],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User, BlackListedToken]),
  ],
})
export class AuthModule {}
