import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/entities/user.entity';
import { UserControllerDtoConverter } from './api/user.controller.dto.converter';
import { PasswordHashService } from '../auth/services/password.hash.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../auth/services/token.blacklist.service';
import { BlackListedToken } from '../auth/model/entities/black.listed.token.entity';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserControllerDtoConverter,
    PasswordHashService,
    JwtService,
    TokenBlacklistService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, BlackListedToken]),
    forwardRef(() => AuthModule),
  ],
})
export class UserModule {}
