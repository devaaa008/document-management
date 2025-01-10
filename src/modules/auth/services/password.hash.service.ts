import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for hashing and comparing passwords using bcrypt.
 */
@Injectable()
export class PasswordHashService {
  private saltRounds: number;
  constructor() {
    this.saltRounds = 10;
  }

  /**
   * Hashes a plain text password using bcrypt.
   *
   * This method generates a random salt using the configured number of rounds and then uses bcrypt to hash the provided password with the generated salt.
   * The hashed password is returned for secure storage.
   *
   * @param password - The plain text password to be hashed.
   * @returns A promise resolving to the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password with a hashed password using bcrypt.
   *
   * This method uses bcrypt to compare the provided plain text password with the stored hashed password.
   * It returns `true` if the passwords match, otherwise `false`.
   *
   * @param password - The plain text password to be compared.
   * @param hashedPassword - The hashed password stored for the user.
   * @returns A promise resolving to `true` if passwords match, otherwise `false`.
   */
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
