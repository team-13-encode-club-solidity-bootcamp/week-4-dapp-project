import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenContractJSON from './assets/Team13Token.json';
import * as ballotContractJSON from './assets/Ballot.json';

const TOKEN_CONTRACT_ADDRESS = '0x56da1240DB296aAf28848A510F29482801615B0D';
const BALLOT_CONTRACT_ADDRESS = '0xbE12cE790C46f88Ed31eBF79cA02E6D917Fa61d9';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
    this.tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      tokenContractJSON.abi,
      this.provider,
    );
    this.ballotContract = new ethers.Contract(
      BALLOT_CONTRACT_ADDRESS,
      ballotContractJSON.abi,
      this.provider,
    );
  }

  getTokenContractAddress(): string {
    return this.tokenContract.address;
  }

  getBallotContractAddress(): string {
    return this.ballotContract.address;
  }

  async getTotalSupply(): Promise<number> {
    const totalSupplyBN = await this.tokenContract.totalSupply();
    const totalSupplyString = ethers.utils.formatEther(totalSupplyBN);
    const totalSupplyNumber = parseFloat(totalSupplyString);

    return totalSupplyNumber;
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

  async getVotingResult(ballotContractAddress: string): Promise<object> {
    // check if parameters are valid addresses
    if (!ethers.utils.isAddress(ballotContractAddress))
      throw new NotAcceptableException(
        `Parameter Error: The ballot contract address ${ballotContractAddress} is not a valid address`,
      );

    // connecting to Ballot contract
    const ballotContract = new ethers.Contract(
      ballotContractAddress,
      ballotContractJSON.abi,
      this.provider,
    );

    const winnerProposal = await ballotContract.winningProposal();
    const nameWinnerProposalBytes = await ballotContract.winnerName();
    const nameWinnerProposal = ethers.utils.parseBytes32String(
      nameWinnerProposalBytes,
    );
    console.log(
      `The winner proposal is ${winnerProposal} and the name is: ${nameWinnerProposal}`,
    );

    return { nameWinnerProposal };
  }
}
