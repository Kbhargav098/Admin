import { Module } from '@nestjs/common';
import { ApiController } from './controllers/api.controller';
import { AuthModule } from '../../modules/auth/auth.module';
import { UsersModule } from '../../modules/users/users.module';
import { OrganizationsModule } from '../../modules/organizations/organizations.module';
import { OrganizationMembersModule } from '../../modules/organization-members/organization-members.module';
import { OrganizationRolesModule } from '../../modules/organization-roles/organization-roles.module';
import { OrganizationSuperAdminModule } from '../../modules/organization-super-admin/organization-super-admin.module';
import { OrganizationAdminModule } from '../../modules/organization-admin/organization-admin.module';
import { RecruitersModule } from '../../modules/recruiters/recruiters.module';
import { JobsModule } from '../../modules/jobs/jobs.module';
import { ApplicationsModule } from '../../modules/applications/applications.module';
import { AtsModule } from '../../modules/ats/ats.module';
import { InterviewsModule } from '../../modules/interviews/interviews.module';
import { OffersModule } from '../../modules/offers/offers.module';
import { CandidatesModule } from '../../modules/candidates/candidates.module';
import { SearchModule } from '../../modules/search/search.module';
import { TokensModule } from '../../modules/tokens/tokens.module';
import { BillingModule } from '../../modules/billing/billing.module';
import { PaymentsModule } from '../../modules/payments/payments.module';
import { NotificationsModule } from '../../modules/notifications/notifications.module';
import { MessagingModule } from '../../modules/messaging/messaging.module';
import { AnalyticsModule } from '../../modules/analytics/analytics.module';
import { SettingsModule } from '../../modules/settings/settings.module';

// Stub modules
import { PlatformAdminModule } from '../../modules/platform-admin/platform-admin.module';
import { PlatformSuperAdminModule } from '../../modules/platform-super-admin/platform-super-admin.module';
import { ProfilesModule } from '../../modules/profiles/profiles.module';
import { ResumesModule } from '../../modules/resumes/resumes.module';
import { SkillsModule } from '../../modules/skills/skills.module';
import { EducationModule } from '../../modules/education/education.module';
import { ExperienceModule } from '../../modules/experience/experience.module';
import { ProjectsModule } from '../../modules/projects/projects.module';
import { CertificationsModule } from '../../modules/certifications/certifications.module';
import { SavedJobsModule } from '../../modules/saved-jobs/saved-jobs.module';
import { JobAlertsModule } from '../../modules/job-alerts/job-alerts.module';
import { ReferralsModule } from '../../modules/referrals/referrals.module';
import { ModerationModule } from '../../modules/moderation/moderation.module';
import { SupportModule } from '../../modules/support/support.module';
import { AiModule as AiModuleSub } from '../../modules/ai/ai.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrganizationsModule,
    OrganizationMembersModule,
    OrganizationRolesModule,
    OrganizationSuperAdminModule,
    OrganizationAdminModule,
    RecruitersModule,
    JobsModule,
    ApplicationsModule,
    AtsModule,
    InterviewsModule,
    OffersModule,
    CandidatesModule,
    SearchModule,
    TokensModule,
    BillingModule,
    PaymentsModule,
    NotificationsModule,
    MessagingModule,
    AnalyticsModule,
    SettingsModule,
    PlatformAdminModule,
    PlatformSuperAdminModule,
    ProfilesModule,
    ResumesModule,
    SkillsModule,
    EducationModule,
    ExperienceModule,
    ProjectsModule,
    CertificationsModule,
    SavedJobsModule,
    JobAlertsModule,
    ReferralsModule,
    ModerationModule,
    SupportModule,
    AiModuleSub,
  ],
  controllers: [ApiController],
})
export class ApiV1Module {}
