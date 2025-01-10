import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../model/dtos/user.dto';
import { UserControllerDtoConverter } from './user.controller.dto.converter';
import { User } from '../model/entities/user.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../model/entities/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { UpdateUserDto } from '../model/dtos/update.user.dto';
import { IUserService } from '../services/interfaces/user.service.interface';

/**
 * Controller for managing user accounts within the application.
 *
 * This controller provides endpoints for user registration, retrieving all users (ADMIN only), and updating user roles (ADMIN only).
 * Access control is implemented using JWT authentication and authorization checks with roles.
 */
@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService.name) private readonly userService: IUserService,
    private readonly userControllerDtoConverter: UserControllerDtoConverter,
  ) {}

  /**
   * Creates a new user account.
   *
   * This endpoint expects a `UserDto` object in the request body containing user registration details.
   * It uses the `UserControllerDtoConverter` to convert the DTO to a `User` entity before passing it to the user service for creation.
   * No role restrictions are applied for user registration.
   *
   * @param userDto - The user data (`UserDto`) for registration.
   * @returns A promise resolving to a success message upon successful user creation.
   * @throws An error if user creation fails.
   */
  @Post('/register')
  async createUser(@Body() userDto: UserDto) {
    const user = this.userControllerDtoConverter.convertCreateDto(userDto);
    await this.userService.create(user);
    return 'User Created Successfully';
  }

  /**
   * Retrieves all users from the system.
   *
   * This endpoint requires ADMIN role and performs authorization checks using JwtAuthGuard and RolesGuard.
   * It retrieves all users using the user service and returns a partial representation of user data.
   *
   * @returns A promise resolving to an array of partial user objects (`Partial<User>`) containing basic user information.
   * @throws An error if user retrieval fails.
   */
  @Get('/users')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(): Promise<Partial<User>[]> {
    return this.userService.findAll();
  }

  /**
   * Updates user roles in bulk.
   *
   * This endpoint expects an array of `UpdateUserDto` objects in the request body containing user IDs and new roles.
   * It requires ADMIN role and performs authorization checks using JwtAuthGuard and RolesGuard.
   * The user service is used to update the roles of the specified users.
   *
   * @param userDtos - An array of `UpdateUserDto` objects containing user IDs and updated roles.
   * @returns A promise resolving to a success message upon successful user role update.
   * @throws An error if user role update fails.
   */
  @Put('/user')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRole(@Body() userDtos: UpdateUserDto[]) {
    await this.userService.updateRole(userDtos);
    return 'User Updated Successfully';
  }
}
