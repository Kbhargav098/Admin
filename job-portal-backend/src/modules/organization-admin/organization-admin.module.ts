import { Module } from '@nestjs/common';
import { OrganizationAdminController } from './organization-admin.controller';
import { OrganizationAdminService } from './organization-admin.service';

@Module({
  controllers: [OrganizationAdminController],
  providers: [OrganizationAdminService],
  exports: [OrganizationAdminService],
})
export class OrganizationAdminModule {}
