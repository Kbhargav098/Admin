import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';

@Controller()
export class ApiController {
  @Public()
  @Get()
  getApiInfo() {
    return {
      name: 'Job Portal Organisation API',
      version: '1.0.0',
      documentation: '/api/docs',
    };
  }
}
