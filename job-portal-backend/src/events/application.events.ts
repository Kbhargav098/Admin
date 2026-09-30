export class ApplicationStatusChangedEvent {
  constructor(
    public readonly applicationId: string,
    public readonly organizationId: string,
    public readonly fromStatus: string,
    public readonly toStatus: string,
  ) {}
}
