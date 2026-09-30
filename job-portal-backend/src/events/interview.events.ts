export class InterviewScheduledEvent {
  constructor(
    public readonly interviewId: string,
    public readonly applicationId: string,
    public readonly scheduledAt: Date,
  ) {}
}
