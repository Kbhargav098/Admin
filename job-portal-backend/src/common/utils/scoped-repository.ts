export class ScopedRepository {
  static withOrg<T extends Record<string, any>>(organizationId: string, where?: T): T {
    return {
      ...(where || {}),
      organizationId,
    } as unknown as T;
  }
}
