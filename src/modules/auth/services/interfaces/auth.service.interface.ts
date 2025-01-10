import { User } from '../../../user/model/entities/user.entity';

export interface IAuthService {
  validateUser(username: string, pass: string): Promise<Partial<User>>;
  login(user: User): Promise<{ access_token: string }>;
  logout(token: string): Promise<void>;
}
