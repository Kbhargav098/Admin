import { Global, Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Global()
@Module({
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
