import { User } from '../../model/entities/user.entity';
import { UpdateUserDto } from '../../model/dtos/update.user.dto';

export interface IUserService {
  findOne(username: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
  findAll(): Promise<Partial<User>[]>;
  updateRole(updateUsers: UpdateUserDto[]): Promise<User[]>;
}
