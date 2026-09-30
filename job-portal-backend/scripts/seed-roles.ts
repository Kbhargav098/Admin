import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles(orgId?: string) {
  console.log('🌱 Seeding roles...');
  if (!orgId) return;

  const roles = [
    { name: 'ORG_SUPER_ADMIN', description: 'Organization Super Admin', isSystem: true },
    { name: 'ORG_ADMIN', description: 'Organization Admin', isSystem: true },
    { name: 'RECRUITER', description: 'Recruiter', isSystem: true },
  ];

  for (const role of roles) {
    const existing = await prisma.organizationRole.findFirst({
      where: { organizationId: orgId, name: role.name },
    });
    if (!existing) {
      await prisma.organizationRole.create({
        data: {
          organizationId: orgId,
          name: role.name,
          description: role.description,
          isSystem: role.isSystem,
        },
      });
    }
  }
  console.log('✅ Roles seeded.');
}

if (require.main === module) {
  seedRoles().then(() => prisma.$disconnect());
}
