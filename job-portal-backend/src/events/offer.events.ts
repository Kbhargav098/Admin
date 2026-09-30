export class OfferSentEvent {
  constructor(
    public readonly offerId: string,
    public readonly applicationId: string,
    public readonly salary: number,
  ) {}
}
