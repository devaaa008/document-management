import { Injectable } from '@nestjs/common';
import { UserDto } from '../model/dtos/user.dto';
import { User } from '../model/entities/user.entity';
import { Role } from '../model/entities/role.enum';

@Injectable()
export class UserControllerDtoConverter {
  convertCreateDto(userDto: UserDto): User {
    const user = new User();
    user.username = userDto.username;
    user.password = userDto.password;
    user.role = Role.VIEWER;
    return user;
  }
}
