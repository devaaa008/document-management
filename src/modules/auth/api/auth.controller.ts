import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { IAuthService } from '../services/interfaces/auth.service.interface';

/**
 * Controller for authentication API endpoints.
 *
 * This controller handles user login and logout functionalities.
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService.name) private readonly authService: IAuthService,
  ) {}

  /**
   * Login endpoint for users to authenticate with the service.
   *
   * This endpoint expects the user credentials in the request body and uses Passport.js local strategy for authentication.
   * On successful login, it calls the login logic to the AuthService and returns the appropriate response.
   *
   * @protected
   * @param req - The HTTP request object containing user credentials in the body.
   * @returns A promise resolving to the login response from the AuthService.
   * @throws An error if login fails.
   */
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Logout endpoint for users to terminate their authenticated session.
   *
   * This endpoint retrieves the authorization token from the request headers and delegates the logout logic to the AuthService.
   * On successful logout, it returns a confirmation message.
   *
   * @param req - The HTTP request object containing the authorization token.
   * @returns A promise resolving to a message indicating successful logout.
   * @throws An error if logout fails.
   */
  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logout(token);
    return 'User Logged Out';
  }
}
