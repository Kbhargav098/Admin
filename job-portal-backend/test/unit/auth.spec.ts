import { CryptoUtil } from '../../src/common/utils/crypto.util';

describe('Auth Password Hashing Unit Test', () => {
  it('should hash and verify passwords correctly', async () => {
    const raw = 'Demo@1234';
    const hashed = await CryptoUtil.hashPassword(raw);
    expect(hashed).not.toEqual(raw);
    const matches = await CryptoUtil.comparePassword(raw, hashed);
    expect(matches).toBe(true);
  });
});
