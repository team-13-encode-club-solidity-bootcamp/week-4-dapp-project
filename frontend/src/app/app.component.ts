import { Component } from '@angular/core';
import { ethers } from 'ethers';
import { HttpClient, HttpParams } from '@angular/common/http';

import tokenContractJSON from '../assets/Team13Token.json';
import { QuestionBase } from 'src/app/models/question-base';
import { Observable } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';

const { ethereum } = window;

const API_URL = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [QuestionService],
})
export class AppComponent {
  blockNumber: number | string | undefined;
  provider: ethers.providers.Web3Provider;
  accounts: string[];
  tokenContractAddress: string;
  tokenName: string | undefined;
  tokenSymbol: string | undefined;
  tokenDecimals: number | undefined;
  totalSupplyNumber: number | undefined;
  tokenBalance: number | undefined;
  questions$: Observable<QuestionBase<any>[]>;

  constructor(private http: HttpClient, service: QuestionService) {
    // this.provider = ethers.getDefaultProvider('goerli');
    this.provider = new ethers.providers.Web3Provider(ethereum);
    this.accounts = [];
    this.tokenContractAddress = '';
    this.questions$ = service.getQuestions();
    // console.log(this.accounts);
  }

  syncBlock() {
    this.blockNumber = 'loading...';
    this.provider.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
    });
  }

  clearBlock() {
    this.blockNumber = 0;
    this.accounts = [];
    this.tokenName = undefined;
    // console.log(this.accounts);
  }

  async connectWallet() {
    try {
      // console.log('testing');
      //Created check function to see if the MetaMask extension is installed
      //Have to check the ethereum binding on the window object to see if it's installed
      await ethereum.request({ method: 'eth_requestAccounts' });
      this.accounts = await ethereum.request({ method: 'eth_accounts' });
      // console.log(this.accounts);
    } catch (error) {
      console.error(error);
    }
  }

  async getTokenStats() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('walletAddress', this.accounts[0]);
    // console.log(queryParams);
    const request = this.http.get<any>(API_URL + '/token-stats', {
      params: queryParams,
    });
    request.subscribe((response) => {
      this.tokenContractAddress = response.tokenContractAddress;
      this.tokenName = response.tokenName;
      this.tokenSymbol = response.tokenSymbol;
      this.tokenDecimals = response.tokenDecimals;
      this.totalSupplyNumber = response.totalSupplyNumber;
      this.tokenBalance = response.tokenBalance;
    });
  }

  async delegateVotingPower() {
    try {
      const signer = this.provider.getSigner();
      // console.log(signer);
      const tokenContractFactory = new ethers.Contract(
        this.tokenContractAddress,
        tokenContractJSON.abi,
        signer
      );
      await tokenContractFactory['delegate'](this.accounts[0]).then(
        (transactionHash: string) => {
          console.log(transactionHash);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async vote() {
    try {
    } catch (error) {
      console.error(error);
    }
  }
}
