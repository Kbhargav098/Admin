import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createSuperAdmin() {
  console.log('🌱 Creating Platform Super Admin...');
  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'superadmin@platform.com' },
    update: {},
    create: {
      email: 'superadmin@platform.com',
      passwordHash,
      firstName: 'Platform',
      lastName: 'SuperAdmin',
      role: 'PLATFORM_SUPER_ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Super Admin created:', user.email);
}

if (require.main === module) {
  createSuperAdmin().then(() => prisma.$disconnect());
}
