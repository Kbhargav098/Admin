export class TokensDeductedEvent {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly reason: string,
  ) {}
}
