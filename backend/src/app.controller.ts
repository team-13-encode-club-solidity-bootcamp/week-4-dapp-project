import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/token-contract-address')
  getTokenContractAddress(): string {
    return this.appService.getTokenContractAddress();
  }

  @Get('/total-supply')
  async getTotalSupply(): Promise<number> {
    return await this.appService.getTotalSupply();
  }

  @Get('/ballot-contract-address')
  getBallotContractAddress(): string {
    return this.appService.getBallotContractAddress();
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

  @Get('/voting-result')
  getVotingResult(
    @Query('ballotAddress') ballotContractAddress: string,
  ): Promise<object> {
    return this.appService.getVotingResult(ballotContractAddress);
  }
}
