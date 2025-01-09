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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordHashService: PasswordHashService,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(user: User): Promise<User> {
    user.password = await this.passwordHashService.hashPassword(user.password);
    const existingUser = await this.findOne(user.username);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.userRepository.save(user);
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
  }

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
