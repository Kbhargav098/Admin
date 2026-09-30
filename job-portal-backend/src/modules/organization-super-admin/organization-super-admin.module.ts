import { Module } from '@nestjs/common';
import { OrganizationSuperAdminController } from './organization-super-admin.controller';
import { OrganizationSuperAdminService } from './organization-super-admin.service';

@Module({
  controllers: [OrganizationSuperAdminController],
  providers: [OrganizationSuperAdminService],
  exports: [OrganizationSuperAdminService],
})
export class OrganizationSuperAdminModule {}
