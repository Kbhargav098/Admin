export class OrganizationCreatedEvent {
  constructor(public readonly organizationId: string, public readonly name: string) {}
}

export class MemberInvitedEvent {
  constructor(public readonly organizationId: string, public readonly email: string) {}
}
