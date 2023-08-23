import { Module } from '@nestjs/common';
import { NagadController } from './nagad.controller';
import { NagadGatservice } from './nagad.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [ConfigModule.forRoot(),HttpModule,
  ],
  controllers: [NagadController],
  providers: [NagadGatservice],
})
export class NagadModule {}
