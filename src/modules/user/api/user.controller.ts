import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../model/dtos/user.dto';
import { UserControllerDtoConverter } from './user.controller.dto.converter';
import { User } from '../model/entities/user.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../model/entities/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { UpdateUserDto } from '../model/dtos/update.user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userControllerDtoConverter: UserControllerDtoConverter,
  ) {}

  @Post('/register')
  async createUser(@Body() userDto: UserDto) {
    const user = this.userControllerDtoConverter.convertCreateDto(userDto);
    await this.userService.create(user);
    return 'User Created Successfully';
  }

  @Get('/users')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(): Promise<Partial<User>[]> {
    return this.userService.findAll();
  }

  @Put('/user')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRole(@Body() userDtos: UpdateUserDto[]) {
    await this.userService.updateRole(userDtos);
    return 'User Updated Successfully';
  }
}
