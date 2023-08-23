import { Module } from '@nestjs/common';
import { BkashService } from './bkash.service';
import { BkashController } from './bkash.controller';
import { DepositrequestModule } from 'src/depositrequest/depositrequest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bankdeposit } from 'src/depositrequest/entities/bankdeposit.entity';
import { HttpModule } from '@nestjs/axios';
import { Agent } from 'src/agent/entities/agent.entity';
import { AgentModule } from 'src/agent/agent.module';
import { GeneralLedger } from 'src/general-ledger/entities/general-ledger.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Bankdeposit, Agent, GeneralLedger]),
  AgentModule,
  HttpModule,
  DepositrequestModule],
  controllers: [BkashController],
  providers: [BkashService]
})
export class BkashModule {}
