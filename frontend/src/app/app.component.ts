import { Component } from '@angular/core';
import { ethers } from 'ethers';

declare let window: any;
declare let error: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  blockNumber: number | string | undefined;
  provider: ethers.providers.BaseProvider;
  accounts: string[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.accounts = [];
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
    // console.log(this.accounts);
  }

  async connectWallet() {
    try {
      // console.log('testing');
      //Created check function to see if the MetaMask extension is installed
      //Have to check the ethereum binding on the window object to see if it's installed
      const { ethereum } = window;
      await ethereum.request({ method: 'eth_requestAccounts' });
      this.accounts = await ethereum.request({ method: 'eth_accounts' });
      // console.log(this.accounts);
    } catch (error) {
      console.error(error);
    }
  }
}
