
// import { NagadController } from './nagad.controller';

import { NagadGatewayService } from './nagad.service';
import { Module } from '@nestjs/common';
import { NagadController } from './nagad.controller';

@Module({
  controllers: [NagadController],
  providers: [ NagadGatewayService],
})
export class NagadModule {}
