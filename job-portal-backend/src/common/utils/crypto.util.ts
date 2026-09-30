import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export class CryptoUtil {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static hashToken(token: string): string {
    if (!token) return '';
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateRandomToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
