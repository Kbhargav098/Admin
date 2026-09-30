import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermissions() {
  console.log('🌱 Seeding permissions...');
  const permissions = [
    { code: 'org:manage_all', module: 'organization', description: 'Full organization management' },
    { code: 'tokens:purchase', module: 'tokens', description: 'Purchase token packages' },
    { code: 'billing:manage', module: 'billing', description: 'Manage organization billing' },
    { code: 'org_admin:manage', module: 'members', description: 'Create and manage Org Admins' },
    { code: 'recruiter:manage', module: 'members', description: 'Manage recruiters' },
    { code: 'tokens:allocate', module: 'tokens', description: 'Allocate tokens to recruiters' },
    { code: 'job:manage_all', module: 'jobs', description: 'Manage all jobs in organization' },
    { code: 'member:manage', module: 'members', description: 'Manage organization members' },
    { code: 'job:create', module: 'jobs', description: 'Post new job openings' },
    { code: 'job:update', module: 'jobs', description: 'Update job details' },
    { code: 'candidate:search', module: 'candidates', description: 'Search candidate database' },
    { code: 'candidate:view', module: 'candidates', description: 'View full candidate profile' },
    { code: 'application:manage', module: 'applications', description: 'Manage ATS application stages' },
    { code: 'interview:schedule', module: 'interviews', description: 'Schedule candidate interviews' },
    { code: 'offer:send', module: 'offers', description: 'Generate and send offer letters' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: perm,
      create: perm,
    });
  }
  console.log('✅ Permissions seeded.');
}

if (require.main === module) {
  seedPermissions().then(() => prisma.$disconnect());
}
