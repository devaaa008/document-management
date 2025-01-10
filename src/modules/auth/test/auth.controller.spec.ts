import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../api/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../services/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { User } from '../../user/model/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { PasswordHashService } from '../services/password.hash.service';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from '../services/token.blacklist.service';
import { BlackListedToken } from '../model/entities/black.listed.token.entity';
import { UnauthorizedException } from '@nestjs/common';

/**
 * Automation tests for Auth Controller
 * Tests functionalities of user login,logout
 */
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'sample-key',
        }),
      ],
      controllers: [AuthController],
      providers: [
        { provide: AuthService.name, useClass: AuthService },
        LocalStrategy,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlackListedToken),
          useClass: Repository,
        },
        { provide: UserService.name, useClass: UserService },
        PasswordHashService,
        ConfigService,
        TokenBlacklistService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });
  describe('Login', () => {
    it('should login successfully', async () => {
      const mockUser = { username: 'testuser', password: 'password' };
      jest
        .spyOn(AuthService.prototype, 'login')
        .mockResolvedValue({ access_token: 'some_token' });
      const req = { user: mockUser };
      expect(await controller.login(req)).toEqual({
        access_token: 'some_token',
      });
    });
    it('should throw Unauthorized error if the user is invalid', async () => {
      const mockUser = { username: 'invalidUser', password: 'password' };
      jest
        .spyOn(AuthService.prototype, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());
      const req = { user: mockUser };
      await expect(controller.login(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const req = { headers: { authorization: 'Bearer some_token' } };
      jest.spyOn(AuthService.prototype, 'logout').mockResolvedValue(undefined);
      expect(await controller.logout(req)).toBe('User Logged Out');
    });
  });
});
