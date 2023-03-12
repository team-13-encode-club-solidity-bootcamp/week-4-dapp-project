import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/token-stats')
  getTokenStats(
    @Query('walletAddress') walletAddress: string,
  ): Promise<object> {
    return this.appService.getTokenStats(walletAddress);
  }

  @Get('/ballot-stats')
  getBallotStats(
    @Query('ballotAddress') ballotContractAddress: string,
  ): Promise<object> {
    return this.appService.getBallotStats(ballotContractAddress);
  }

  @Get('/voting-powers')
  getVotingPowers(
    @Query('ballotAddress') ballotContractAddress: string,
    @Query('walletAddress') walletAddress: string,
  ): Promise<object> {
    return this.appService.getVotingPowers(
      ballotContractAddress,
      walletAddress,
    );
  }
}
