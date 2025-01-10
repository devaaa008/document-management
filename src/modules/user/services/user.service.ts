import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/entities/user.entity';
import { PasswordHashService } from '../../auth/services/password.hash.service';
import { UpdateUserDto } from '../model/dtos/update.user.dto';
import { IUserService } from './interfaces/user.service.interface';

/**
 * Service responsible for managing user accounts within the application.
 *
 * This service provides functionalities to find users by username, create new users, retrieve all users (partial data), and update user roles.
 * It interacts with the user repository and password hashing service.
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordHashService: PasswordHashService,
  ) {}

  /**
   * Retrieves a user by username.
   *
   * This method searches for a user in the repository based on the provided `username`.
   * It returns the user entity if found, otherwise undefined.
   *
   * @param username - The username of the user to retrieve.
   * @returns A promise resolving to a `User` entity if found, otherwise undefined.
   */
  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * Creates a new user account.
   *
   * This method first hashes the user's password using the password hashing service.
   * It then checks for an existing user with the same username to prevent duplicates.
   * If no existing user is found, the user entity is saved to the repository and returned.
   *
   * @param user - The user data (`User`) to be created.
   * @returns A promise resolving to the created `User` entity.
   * @throws A `BadRequestException` if a user with the same username already exists.
   */
  async create(user: User): Promise<User> {
    user.password = await this.passwordHashService.hashPassword(user.password);
    const existingUser = await this.findOne(user.username);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userRepository.save(user);
  }

  /**
   * Retrieves all users from the system (partial data).
   *
   * This method retrieves all users from the repository and transforms them into a partial representation.
   * The partial representation excludes sensitive information like password.
   * It returns an array of partial user objects containing basic user information (ID, username, role).
   *
   * @returns A promise resolving to an array of partial user objects (`Partial<User>`) containing basic user information.
   */
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

  /**
   * Updates user roles in bulk.
   *
   * This method iterates over an array of `UpdateUserDto` objects and performs the following for each:
   *   - Finds the user by ID in the repository.
   *   - Throws a `NotFoundException` if the user is not found.
   *   - Updates the user's role with the value from the `UpdateUserDto`.
   *   - Saves the updated user entity to the repository.
   *
   * It returns a promise resolving to an array of updated user entities.
   *
   * @param updateUsers - An array of `UpdateUserDto` objects containing user IDs and updated roles.
   * @returns A promise resolving to an array of updated `User` entities.
   * @throws A `NotFoundException` if a user with the specified ID is not found.
   */
  async updateRole(updateUsers: UpdateUserDto[]): Promise<User[]> {
    const update = async (updateUser: UpdateUserDto) => {
      const user = await this.userRepository.findOneBy({ id: updateUser.id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      Object.assign(user, { ...user, role: updateUser.role });
      return this.userRepository.save(user);
    };
    return Promise.all(updateUsers.map(update));
  }
}
