export class JobCreatedEvent {
  constructor(public readonly jobId: string, public readonly organizationId: string, public readonly title: string) {}
}

export class JobClosedEvent {
  constructor(public readonly jobId: string, public readonly organizationId: string) {}
}
