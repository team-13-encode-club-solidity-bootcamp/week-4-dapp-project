import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenContractJSON from './assets/Team13Token.json';
import * as ballotContractJSON from './assets/Ballot.json';

const TOKEN_CONTRACT_ADDRESS = '0x56da1240DB296aAf28848A510F29482801615B0D';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    this.provider = new ethers.providers.AlchemyProvider(
      'goerli',
      this.configService.get('ALCHEMY_API_KEY'),
    );
    this.tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      tokenContractJSON.abi,
      this.provider,
    );
  }

  async getTokenStats(walletAddress: string): Promise<object> {
    if (!ethers.utils.isAddress(walletAddress))
      throw new NotAcceptableException(
        `Parameter Error: The wallet address ${walletAddress} is not a valid address`,
      );

    const tokenContractAddress = this.tokenContract.address;
    const tokenName = await this.tokenContract.name();
    const tokenSymbol = await this.tokenContract.symbol();
    const tokenDecimals = await this.tokenContract.decimals();

    const totalSupplyBN = await this.tokenContract.totalSupply();
    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
    const totalSupplyNumber = parseFloat(totalSupplyString);

    const tokenBalanceBN = await this.tokenContract.balanceOf(walletAddress);
    const tokenBalance = ethers.utils.formatEther(tokenBalanceBN);

    return {
      tokenContractAddress,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      totalSupplyNumber,
      tokenBalance,
    };
  }

  async getBallotStats(ballotContractAddress: string): Promise<object> {
    if (!ethers.utils.isAddress(ballotContractAddress))
      throw new NotAcceptableException(
        `Parameter Error: The ballot contract address ${ballotContractAddress} is not a valid address`,
      );

    const ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotContractJSON.abi,
      this.provider,
    );

    const targetBlockNumberBN = await ballotContract.targetBlockNumber();
    const targetBlockNumber = ethers.utils.formatUnits(targetBlockNumberBN, 0);

    const indexWinnerProposalBN = await ballotContract.winningProposal();
    const indexWinnerProposal = ethers.utils.formatUnits(
      indexWinnerProposalBN,
      0,
    );

    const nameWinnerProposalBytes = await ballotContract.winnerName();
    const nameWinnerProposal = ethers.utils.parseBytes32String(
      nameWinnerProposalBytes,
    );

    return {
      ballotContractAddress,
      targetBlockNumber,
      indexWinnerProposal,
      nameWinnerProposal,
    };
  }

  async getVotingPowers(
    ballotContractAddress: string,
    walletAddress: string,
  ): Promise<object> {
    // check if parameters are valid addresses
    if (!ethers.utils.isAddress(ballotContractAddress))
      throw new NotAcceptableException(
        `Parameter Error: The ballot contract address ${ballotContractAddress} is not a valid address`,
      );

    if (!ethers.utils.isAddress(walletAddress))
      throw new NotAcceptableException(
        `Parameter Error: The wallet address ${walletAddress} is not a valid address`,
      );

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotContractJSON.abi,
      this.provider,
    );

    const votingPowerBigNumber = await ballotContract.votingPower(
      walletAddress,
    );
    const votingPowerSpentBigNumber = await ballotContract.votingPowerSpent(
      walletAddress,
    );

    const votingPower = ethers.utils.formatEther(votingPowerBigNumber);
    const votingPowerSpent = ethers.utils.formatEther(
      votingPowerSpentBigNumber,
    );

    console.log(
      `Address: ${walletAddress} - Voting Power: ${votingPower} - Voting Power Spent: ${votingPowerSpent}`,
    );

    return {
      ballotContractAddress,
      walletAddress,
      votingPower,
      votingPowerSpent,
    };
  }
}
