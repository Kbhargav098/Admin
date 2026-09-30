import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { seedPermissions } from './seed-permissions';
import { seedRoles } from './seed-roles';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Database Seed...');

  await seedPermissions();

  const demoPassword = await bcrypt.hash('Demo@1234', 10);

  // 1. Token Plans
  const plans = [
    { id: 'plan_basic', name: 'Basic', tokens: 100, priceCents: 4900, description: '100 hiring tokens for small teams' },
    { id: 'plan_pro', name: 'Pro', tokens: 500, priceCents: 19900, description: '500 hiring tokens for fast-growing startups' },
    { id: 'plan_enterprise', name: 'Enterprise', tokens: 2000, priceCents: 69900, description: '2000 hiring tokens for scale-ups and enterprises' },
  ];
  for (const plan of plans) {
    await prisma.tokenPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  // 2. Organization 1: Acme Technologies
  const acmeOrg = await prisma.organization.upsert({
    where: { slug: 'acme-technologies' },
    update: {},
    create: {
      id: 'org_acme_1001',
      name: 'Acme Technologies',
      slug: 'acme-technologies',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      description: 'Leading global cloud computing & software innovations.',
      website: 'https://acme-tech.demo',
      industry: 'Software & Cloud Infrastructure',
      size: '500-1000 employees',
      location: 'San Francisco, CA',
      isVerified: true,
    },
  });
  await seedRoles(acmeOrg.id);

  // 3. Organization 2: Globex Corp (for tenant isolation test)
  const globexOrg = await prisma.organization.upsert({
    where: { slug: 'globex-corp' },
    update: {},
    create: {
      id: 'org_globex_2002',
      name: 'Globex Corp',
      slug: 'globex-corp',
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
      description: 'Pioneering global robotics and autonomous hardware systems.',
      website: 'https://globex.demo',
      industry: 'Robotics & Hardware',
      size: '1000+ employees',
      location: 'New York, NY',
      isVerified: true,
    },
  });
  await seedRoles(globexOrg.id);

  // 4. Acme Users & Members
  const acmeSuperAdmin = await prisma.user.upsert({
    where: { email: 'orgsuperadmin@demo.com' },
    update: { organizationId: acmeOrg.id },
    create: {
      id: 'user_acme_superadmin',
      email: 'orgsuperadmin@demo.com',
      passwordHash: demoPassword,
      firstName: 'Sarah',
      lastName: 'Connor',
      role: 'ORG_SUPER_ADMIN',
      organizationId: acmeOrg.id,
      emailVerified: true,
    },
  });

  const acmeAdmin = await prisma.user.upsert({
    where: { email: 'orgadmin@demo.com' },
    update: { organizationId: acmeOrg.id },
    create: {
      id: 'user_acme_admin',
      email: 'orgadmin@demo.com',
      passwordHash: demoPassword,
      firstName: 'Alex',
      lastName: 'Mercer',
      role: 'ORG_ADMIN',
      organizationId: acmeOrg.id,
      emailVerified: true,
    },
  });

  const acmeRecruiter1 = await prisma.user.upsert({
    where: { email: 'recruiter@demo.com' },
    update: { organizationId: acmeOrg.id },
    create: {
      id: 'user_acme_recruiter1',
      email: 'recruiter@demo.com',
      passwordHash: demoPassword,
      firstName: 'David',
      lastName: 'Miller',
      role: 'RECRUITER',
      organizationId: acmeOrg.id,
      emailVerified: true,
    },
  });

  const acmeRecruiter2 = await prisma.user.upsert({
    where: { email: 'hiringmanager@demo.com' },
    update: { organizationId: acmeOrg.id },
    create: {
      id: 'user_acme_hiringmanager',
      email: 'hiringmanager@demo.com',
      passwordHash: demoPassword,
      firstName: 'Elena',
      lastName: 'Rostova',
      role: 'RECRUITER',
      organizationId: acmeOrg.id,
      emailVerified: true,
    },
  });

  const acmeRecruiter3 = await prisma.user.upsert({
    where: { email: 'techrecruiter@demo.com' },
    update: { organizationId: acmeOrg.id },
    create: {
      id: 'user_acme_techrecruiter',
      email: 'techrecruiter@demo.com',
      passwordHash: demoPassword,
      firstName: 'Marcus',
      lastName: 'Vance',
      role: 'RECRUITER',
      organizationId: acmeOrg.id,
      emailVerified: true,
    },
  });

  // Create Acme Memberships
  const acmeUsers = [
    { user: acmeSuperAdmin, rType: null },
    { user: acmeAdmin, rType: null },
    { user: acmeRecruiter1, rType: 'HR_RECRUITER' },
    { user: acmeRecruiter2, rType: 'HIRING_MANAGER' },
    { user: acmeRecruiter3, rType: 'TECH_RECRUITER' },
  ];

  for (const { user, rType } of acmeUsers) {
    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: acmeOrg.id, userId: user.id } },
      update: { recruiterType: rType },
      create: {
        organizationId: acmeOrg.id,
        userId: user.id,
        recruiterType: rType,
        status: 'ACTIVE',
      },
    });
  }

  // Globex Users
  const globexAdmin = await prisma.user.upsert({
    where: { email: 'globexadmin@demo.com' },
    update: { organizationId: globexOrg.id },
    create: {
      id: 'user_globex_admin',
      email: 'globexadmin@demo.com',
      passwordHash: demoPassword,
      firstName: 'Hank',
      lastName: 'Scorpio',
      role: 'ORG_SUPER_ADMIN',
      organizationId: globexOrg.id,
      emailVerified: true,
    },
  });

  const globexRecruiter = await prisma.user.upsert({
    where: { email: 'globexrecruiter@demo.com' },
    update: { organizationId: globexOrg.id },
    create: {
      id: 'user_globex_recruiter',
      email: 'globexrecruiter@demo.com',
      passwordHash: demoPassword,
      firstName: 'Homer',
      lastName: 'Simpson',
      role: 'RECRUITER',
      organizationId: globexOrg.id,
      emailVerified: true,
    },
  });

  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: globexOrg.id, userId: globexAdmin.id } },
    update: {},
    create: { organizationId: globexOrg.id, userId: globexAdmin.id, status: 'ACTIVE' },
  });
  await prisma.organizationMember.upsert({
    where: { organizationId_userId: { organizationId: globexOrg.id, userId: globexRecruiter.id } },
    update: {},
    create: { organizationId: globexOrg.id, userId: globexRecruiter.id, recruiterType: 'HR_RECRUITER', status: 'ACTIVE' },
  });

  // 5. Token Wallets & Allocations
  await prisma.tokenWallet.upsert({
    where: { organizationId: acmeOrg.id },
    update: { balance: 450 },
    create: { organizationId: acmeOrg.id, balance: 450 },
  });

  await prisma.tokenWallet.upsert({
    where: { organizationId: globexOrg.id },
    update: { balance: 200 },
    create: { organizationId: globexOrg.id, balance: 200 },
  });

  await prisma.tokenAllocation.upsert({
    where: { organizationId_userId: { organizationId: acmeOrg.id, userId: acmeRecruiter1.id } },
    update: { allocated: 100, used: 24 },
    create: { organizationId: acmeOrg.id, userId: acmeRecruiter1.id, allocated: 100, used: 24 },
  });

  await prisma.tokenTransaction.createMany({
    data: [
      { organizationId: acmeOrg.id, userId: acmeSuperAdmin.id, type: 'CREDIT', amount: 500, reason: 'Initial signup token package', balanceAfter: 500 },
      { organizationId: acmeOrg.id, userId: acmeAdmin.id, type: 'ALLOCATE', amount: 100, reason: 'Allocated tokens to Recruiter David Miller', balanceAfter: 400 },
      { organizationId: acmeOrg.id, userId: acmeSuperAdmin.id, type: 'CREDIT', amount: 100, reason: 'Purchased Basic Token Plan', balanceAfter: 500 },
      { organizationId: acmeOrg.id, userId: acmeRecruiter1.id, type: 'DEBIT', amount: 10, reason: 'Job posting: Senior Full Stack Engineer', balanceAfter: 490 },
      { organizationId: acmeOrg.id, userId: acmeRecruiter1.id, type: 'DEBIT', amount: 2, reason: 'View candidate resume detail: John Doe', balanceAfter: 488 },
    ],
  });

  await prisma.payment.create({
    data: {
      organizationId: acmeOrg.id,
      provider: 'MOCK',
      transactionId: 'tx_seed_acme_pro_01',
      planName: 'Pro',
      amountCents: 19900,
      tokensPurchased: 500,
      status: 'COMPLETED',
    },
  });

  // 6. Seed 20+ Jobs
  const jobTitles = [
    { title: 'Senior Full Stack Engineer', dept: 'Engineering', loc: 'San Francisco, CA (Remote)', type: 'FULL_TIME', minSal: 140000, maxSal: 180000 },
    { title: 'Backend Tech Lead (Node.js/NestJS)', dept: 'Engineering', loc: 'San Francisco, CA', type: 'FULL_TIME', minSal: 160000, maxSal: 200000 },
    { title: 'Frontend Specialist (React / TypeScript)', dept: 'Engineering', loc: 'Remote', type: 'FULL_TIME', minSal: 120000, maxSal: 160000 },
    { title: 'DevOps & Platform Security Architect', dept: 'Infrastructure', loc: 'San Francisco, CA', type: 'FULL_TIME', minSal: 150000, maxSal: 190000 },
    { title: 'Senior Product Designer (UI/UX)', dept: 'Design', loc: 'Remote', type: 'FULL_TIME', minSal: 110000, maxSal: 150000 },
    { title: 'Principal Data Engineer (Spark/Kafka)', dept: 'Data Science', loc: 'San Francisco, CA', type: 'FULL_TIME', minSal: 170000, maxSal: 220000 },
    { title: 'Engineering Manager - Cloud Infrastructure', dept: 'Engineering', loc: 'San Francisco, CA', type: 'FULL_TIME', minSal: 180000, maxSal: 230000 },
    { title: 'Technical Product Manager', dept: 'Product', loc: 'New York, NY', type: 'FULL_TIME', minSal: 130000, maxSal: 170000 },
    { title: 'QA Automation Lead (Cypress/Playwright)', dept: 'Quality Assurance', loc: 'Remote', type: 'FULL_TIME', minSal: 100000, maxSal: 140000 },
    { title: 'Site Reliability Engineer (SRE)', dept: 'Infrastructure', loc: 'Remote', type: 'FULL_TIME', minSal: 135000, maxSal: 175000 },
    { title: 'Machine Learning Research Engineer', dept: 'AI Labs', loc: 'San Francisco, CA', type: 'FULL_TIME', minSal: 180000, maxSal: 240000 },
    { title: 'Enterprise Account Executive', dept: 'Sales', loc: 'Chicago, IL', type: 'FULL_TIME', minSal: 90000, maxSal: 150000 },
    { title: 'Customer Success Operations Manager', dept: 'Customer Support', loc: 'Remote', type: 'FULL_TIME', minSal: 80000, maxSal: 110000 },
    { title: 'HR People Partner', dept: 'Human Resources', loc: 'San Francisco, CA', type: 'FULL_TIME', minSal: 95000, maxSal: 130000 },
    { title: 'Security Compliance Manager', dept: 'Security', loc: 'Remote', type: 'FULL_TIME', minSal: 130000, maxSal: 170000 },
    { title: 'Mobile Developer (React Native)', dept: 'Engineering', loc: 'Remote', type: 'CONTRACT', minSal: 100000, maxSal: 140000 },
    { title: 'Cloud Solutions Architect', dept: 'Sales Engineering', loc: 'Seattle, WA', type: 'FULL_TIME', minSal: 150000, maxSal: 190000 },
    { title: 'Content Marketing Strategist', dept: 'Marketing', loc: 'Remote', type: 'FULL_TIME', minSal: 75000, maxSal: 105000 },
  ];

  const createdJobs: any[] = [];
  for (let i = 0; i < jobTitles.length; i++) {
    const jt = jobTitles[i];
    const job = await prisma.job.create({
      data: {
        organizationId: acmeOrg.id,
        createdById: acmeRecruiter1.id,
        title: jt.title,
        description: `Join Acme Technologies as a ${jt.title}. Work with cutting-edge tech stacks, scalable cloud systems, and elite engineering teams.`,
        department: jt.dept,
        location: jt.loc,
        employmentType: jt.type,
        salaryMin: jt.minSal,
        salaryMax: jt.maxSal,
        status: i === 15 ? 'CLOSED' : 'OPEN',
        tokenCost: 10,
        skills: {
          create: [{ name: 'TypeScript' }, { name: 'React' }, { name: 'Node.js' }],
        },
      },
    });
    createdJobs.push(job);
  }

  // Create 3 Globex Jobs for tenant isolation tests
  const globexJob = await prisma.job.create({
    data: {
      organizationId: globexOrg.id,
      createdById: globexRecruiter.id,
      title: 'Robotics Control Systems Engineer',
      description: 'Build autonomous navigation software for industrial robotics.',
      department: 'Robotics',
      location: 'New York, NY',
      employmentType: 'FULL_TIME',
      salaryMin: 150000,
      salaryMax: 200000,
      status: 'OPEN',
    },
  });

  // 7. Seed 40+ Candidates & Applications
  console.log('🌱 Seeding 40+ Candidates & Applications...');

  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Michael', 'Abigail', 'Daniel', 'Emily', 'Jacob', 'Elizabeth', 'Logan', 'Mila', 'Jackson', 'Ella', 'Sebastian', 'Avery', 'Jack', 'Sofia', 'Owen', 'Camila', 'Theodore', 'Aria', 'Aiden', 'Scarlett'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];

  const statuses = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'];

  for (let i = 0; i < 40; i++) {
    const fn = firstNames[i];
    const ln = lastNames[i];
    const email = `candidate.${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`;

    const candUser = await prisma.user.create({
      data: {
        email,
        passwordHash: demoPassword,
        firstName: fn,
        lastName: ln,
        role: 'CANDIDATE',
        emailVerified: true,
      },
    });

    const candidate = await prisma.candidate.create({
      data: {
        userId: candUser.id,
        headline: `Experienced ${i % 2 === 0 ? 'Full Stack Engineer' : 'Product Lead'} (${3 + (i % 8)} yrs xp)`,
        summary: `Passionate professional with expertise in scalable systems, UI design, and cloud deployments.`,
        phone: `+1-555-01${10 + i}`,
        location: i % 3 === 0 ? 'San Francisco, CA' : 'Remote',
        skills: 'TypeScript, React, Node.js, PostgreSQL, Docker, AWS',
        experienceYrs: 3 + (i % 8),
        profiles: {
          create: {
            title: `${fn}'s Portfolio`,
            bio: 'Building modern web apps.',
            githubUrl: `https://github.com/${fn.toLowerCase()}${ln.toLowerCase()}`,
            linkedinUrl: `https://linkedin.com/in/${fn.toLowerCase()}${ln.toLowerCase()}`,
          },
        },
        resumes: {
          create: {
            fileName: `${fn}_${ln}_Resume.pdf`,
            fileUrl: `https://acme-storage.demo/resumes/${fn}_${ln}_Resume.pdf`,
            fileSize: 102400,
            parsedText: `${fn} ${ln} Resume. Skills: React, Node.js, TypeScript, PostgreSQL.`,
          },
        },
      },
    });

    // Assign application to Acme job
    const assignedJob = createdJobs[i % createdJobs.length];
    const status = statuses[i % statuses.length];

    const app = await prisma.application.create({
      data: {
        organizationId: acmeOrg.id,
        jobId: assignedJob.id,
        candidateId: candidate.id,
        status,
        notes: `Strong technical profile with excellent interview performance.`,
        history: {
          create: {
            fromStatus: 'Applied',
            toStatus: status,
            changedById: acmeRecruiter1.id,
            reason: `Moved application to ${status} stage during review.`,
          },
        },
      },
    });

    if (status === 'Interview') {
      await prisma.interview.create({
        data: {
          applicationId: app.id,
          title: `Technical Deep-Dive Interview`,
          scheduledAt: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          durationMins: 60,
          locationUrl: 'https://meet.google.com/demo-room',
          interviewer: 'David Miller (Recruiter)',
          status: 'SCHEDULED',
        },
      });
    }

    if (status === 'Offer') {
      await prisma.offer.create({
        data: {
          applicationId: app.id,
          jobTitle: assignedJob.title,
          salary: assignedJob.salaryMax || 150000,
          currency: 'USD',
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          terms: 'Standard full-time employment contract with 401(k) matching and equity options.',
          status: 'PENDING',
        },
      });
    }
  }

  // Add 1 application for Globex Corp
  const globexCandidateUser = await prisma.user.create({
    data: {
      email: 'globex.candidate@example.com',
      passwordHash: demoPassword,
      firstName: 'Bruce',
      lastName: 'Wayne',
      role: 'CANDIDATE',
      emailVerified: true,
    },
  });

  const globexCandidate = await prisma.candidate.create({
    data: {
      userId: globexCandidateUser.id,
      headline: 'Robotics Systems Specialist',
      summary: 'Building hardware and automated robotics control units.',
      phone: '+1-555-9999',
      location: 'Gotham City',
      skills: 'Robotics, C++, ROS, Python',
      experienceYrs: 10,
    },
  });

  await prisma.application.create({
    data: {
      organizationId: globexOrg.id,
      jobId: globexJob.id,
      candidateId: globexCandidate.id,
      status: 'Shortlisted',
      notes: 'Top tier candidate for Globex Robotics.',
    },
  });

  console.log('✅ SEEDING COMPLETE SUCCESS!');
  console.log('--------------------------------------------------');
  console.log('Acme Technologies Org ID:', acmeOrg.id);
  console.log('Globex Corp Org ID:', globexOrg.id);
  console.log('Demo Password for all users: Demo@1234');
  console.log('Acme Super Admin: orgsuperadmin@demo.com');
  console.log('Acme Admin:       orgadmin@demo.com');
  console.log('Acme Recruiter:   recruiter@demo.com');
  console.log('Globex Admin:     globexadmin@demo.com');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
