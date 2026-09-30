import { InsufficientTokensException } from '../../src/common/errors/custom.error';

describe('Tokens Logic Unit Test', () => {
  it('should format InsufficientTokensException correctly', () => {
    const error = new InsufficientTokensException('Low balance');
    expect(error.getStatus()).toBe(402);
    expect(error.getResponse()).toEqual({
      success: false,
      error: {
        code: 'INSUFFICIENT_TOKENS',
        message: 'Low balance',
      },
    });
  });
});
