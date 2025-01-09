import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../api/user.controller';
import { UserService } from '../services/user.service';
import { UserDto } from '../model/dtos/user.dto';
import { UserControllerDtoConverter } from '../api/user.controller.dto.converter';
import { User } from '../model/entities/user.entity';
import { Role } from '../model/entities/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { UpdateUserDto } from '../model/dtos/update.user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordHashService } from '../../auth/services/password.hash.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../../auth/services/token.blacklist.service';
import { ClsService } from 'nestjs-cls';
import { AppModule } from '../../../app.module';
import { BlackListedToken } from '../../auth/model/entities/black.listed.token.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserControllerDtoConverter,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlackListedToken),
          useClass: Repository,
        },
        RolesGuard,
        JwtAuthGuard,
        PasswordHashService,
        ConfigService,
        JwtService,
        TokenBlacklistService,
      ],
      imports: [AppModule],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  describe('create user', () => {
    it('should create a user', async () => {
      const userDto: UserDto = {
        username: 'abce',
        password: '123456',
      };
      jest.spyOn(UserService.prototype, 'create').mockResolvedValue(null);
      expect(await controller.createUser(userDto)).toBe(
        'User Created Successfully',
      );
    });

    it('should throw error for duplicate user', async () => {
      const userDto: UserDto = {
        username: 'abce',
        password: '123456',
      };
      jest
        .spyOn(UserService.prototype, 'create')
        .mockRejectedValueOnce(new BadRequestException());
      await expect(controller.createUser(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAll users', () => {
    it('should get all users', async () => {
      const mockUsers: Partial<User>[] = [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
      ];
      jest.spyOn(UserService.prototype, 'findAll').mockResolvedValue(mockUsers);
      expect(await controller.getAllUsers()).toEqual(mockUsers);
    });
  });

  describe('update user', () => {
    it('should update user roles', async () => {
      const updateDtos: UpdateUserDto[] = [
        { id: 1, role: Role.ADMIN },
        { id: 2, role: Role.EDITOR },
      ];
      jest
        .spyOn(UserService.prototype, 'updateRole')
        .mockResolvedValue(undefined);
      expect(await controller.updateRole(updateDtos)).toBe(
        'User Updated Successfully',
      );
    });

    it('should throw Notfound exception for update user roles for invalid user', async () => {
      const updateDtos: UpdateUserDto[] = [
        { id: 1, role: Role.ADMIN },
        { id: 2, role: Role.EDITOR },
      ];
      jest
        .spyOn(UserService.prototype, 'updateRole')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(controller.updateRole(updateDtos)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
