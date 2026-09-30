import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async listOffers(organizationId: string) {
    return this.prisma.offer.findMany({
      where: { application: { organizationId } },
      include: {
        application: {
          include: {
            job: true,
            candidate: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffer(data: {
    applicationId: string;
    jobTitle: string;
    salary: number;
    currency?: string;
    startDate: string | Date;
    terms?: string;
  }) {
    const offer = await this.prisma.offer.create({
      data: {
        applicationId: data.applicationId,
        jobTitle: data.jobTitle,
        salary: Number(data.salary),
        currency: data.currency || 'USD',
        startDate: new Date(data.startDate),
        terms: data.terms,
        status: 'PENDING',
      },
    });

    // Automatically transition application status to Offer
    await this.prisma.application.update({
      where: { id: data.applicationId },
      data: { status: 'Offer' },
    });

    return offer;
  }

  async withdrawOffer(id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException('Offer not found');

    return this.prisma.offer.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });
  }
}
