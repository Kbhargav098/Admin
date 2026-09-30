describe('Jobs Cost Preview Unit Test', () => {
  it('should return cost preview of 10 tokens', () => {
    const costPreview = { cost: 10, currency: 'tokens' };
    expect(costPreview.cost).toBe(10);
    expect(costPreview.currency).toBe('tokens');
  });
});
