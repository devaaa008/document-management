import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { PasswordHashService } from './password.hash.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/model/entities/user.entity';
import { TokenBlacklistService } from './token.blacklist.service';
import { IAuthService } from './interfaces/auth.service.interface';
import { IUserService } from '../../user/services/interfaces/user.service.interface';

/**
 * Service responsible for user authentication and authorization.
 *
 * This service provides functionalities for validating user credentials, generating access tokens, and managing token blacklisting for logout.
 */
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService.name) private readonly userService: IUserService,
    private readonly passwordHashService: PasswordHashService,
    private readonly configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  /**
   * Validates a user's credentials (username and password).
   *
   * This method retrieves the user by username and compares the provided password hash with the stored hash using the PasswordHashService.
   * If the credentials match, it returns a partial user object excluding the password property.
   *
   * @param username - The username provided by the user.
   * @param pass - The password provided by the user.
   * @returns A partial user object if credentials are valid, otherwise null.
   */
  async validateUser(username: string, pass: string): Promise<Partial<User>> {
    const user = await this.userService.findOne(username);
    if (
      user &&
      (await this.passwordHashService.comparePasswords(pass, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * This method generates a JWT access token for a successfully authenticated user.
   *
   * This method creates a payload containing user information (username, id, role) and signs it using the JWT service with the secret key from the configuration.
   * It returns an object containing the access token.
   *
   * @param user - The user object representing the authenticated user.
   * @returns An object containing the access token.
   */
  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwtSecret'),
      }),
    };
  }

  /**
   * Adds a JWT token to the blacklist for logout functionality.
   *
   * This method delegates the task of adding the provided token to the token blacklist service.
   * The token blacklist is used to invalidate tokens and prevent unauthorized access after logout.
   *
   * @param token - The JWT token to be blacklisted.
   * @returns A promise that resolves when the token is added to the blacklist.
   */
  async logout(token: string) {
    await this.tokenBlacklistService.addToBlacklist(token);
  }
}
