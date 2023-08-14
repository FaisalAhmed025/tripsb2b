import { Module } from '@nestjs/common';
import { NagadController } from './nagad.controller';
import { NagadGatservice } from './nagad.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { NagadGateway } from 'nagad-payment-gateway';

@Module({
  imports: [ConfigModule.forRoot(),HttpModule,
  ],
  controllers: [NagadController],
  providers: [NagadGatservice, NagadGateway],
})
export class NagadModule {}
