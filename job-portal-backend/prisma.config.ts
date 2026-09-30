// Configuration helper for Prisma ORM
export const prismaConfig = {
  logQueries: process.env.NODE_ENV === 'development',
};
