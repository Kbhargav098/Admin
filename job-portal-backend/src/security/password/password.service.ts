import { Injectable } from '@nestjs/common';
import { CryptoUtil } from '../../common/utils/crypto.util';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return CryptoUtil.hashPassword(password);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return CryptoUtil.comparePassword(password, hash);
  }
}
