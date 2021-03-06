import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import Onboard from "bnc-onboard";
import { timeStamp } from 'console';

const Web3 = require('web3');
declare let require: any;
declare let window: any;
const tokenAbis = require('../contract/abis.json');
const ethers = require('ethers')
@Injectable({
  providedIn: 'root',
})
export class ConnectService {
  public account: any = null;
  private readonly web3: any;
  private enable: any;
  private contract: any;
  private contract1: any;

  private wallets;
  private walletProvider;
  private onboard;
  public chainId;

  constructor() {
    // if (window.ethereum === undefined) {
    //   alert('Non-Ethereum browser detected. Install MetaMask');
    // } else {
    //   console.log(window.web3);
    //   if (typeof window.web3 !== 'undefined') {
    //   this.web3 =  new Web3(window['ethereum'] || window.web3.currentProvider); // window.web3.currentProvider;
    //   } else {
    //   this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
    //   }

    //   console.log('transfer.service :: constructor :: window.ethereum');
    //   window.web3 = new Web3(window.ethereum);
    //   console.log('transfer.service :: constructor :: this.web3');
    //   console.log(this.web3);
    //   this.enable = this.enableMetaMaskAccount();
    //   console.log(this.enable);
    // }
    // if (typeof window.web3 !== 'undefined') {
    //   window.ethereum.on('accountsChanged', function (accounts) {
    //     window.location.reload();
    //   });
    //   window.ethereum.on('chainChanged', function (networkId) {
    //     window.location.reload();
    //   });
    // }

    console.log("web3", window.web3)

    this.chainId = 0x4;

    this.wallets = [
      { walletName: "metamask", preferred: true }
    ];

    this.walletProvider = null;

    this.onboard = Onboard({

      networkId: this.chainId,     // dappId: "877e8915-22d9-450e-a9b8-799bfd51798e", // [String] The API key created by step one above// [Integer] The Ethereum network ID your Dapp uses.
      hideBranding: true,
      walletSelect: {
          wallets: this.wallets
      },
      subscriptions: {
          wallet: (wallet) => {
              this.walletProvider = wallet.provider;
               console.log(`${wallet.name} is now connected`);
          }
      }
    });
  }

  public connectWallet =  async () => {
    
    const currentState = this.onboard.getState();
    if(currentState["address"] != null) {
        return {
            address: currentState["address"],
            status: "???????? Mint your GG Now.",
        }
    }
    const walletSelected = await this.onboard.walletSelect('MetaMask');
    if (walletSelected !== false) {
        const walletCheck = await this.onboard.walletCheck();
        if (walletCheck === true) {
            const currentState = this.onboard.getState();
            this.account = currentState["address"];
            return {
                address: currentState["address"],
                status: "???????? Mint your GG Now.",
            }
        } else {
            return {
                address: "",
                status: "???? Connect your wallet account to the site.",
            }
        }
    }
  }

  public disConnectWallet = () => {
    this.onboard.walletReset()
    return {
        address: "",
        status: "???? Connect your wallet account to the site.",
    }
  }

  public getCurrentWalletConnected = async () => {
    const currentState = this.onboard.getState();
  
    if(currentState["address"] != null) {
        return {
            address: currentState["address"],
            status: "???????? Mint your GG Now.",
        }
    } else {
        return {
            address: "",
            status: "",
        }
    }
  }

  public getWalletProvider = () => {
    return this.walletProvider;
  }

  public isConnected = async () => {
    if( parseInt(this.walletProvider.chainId) === parseInt(this.chainId) &&
    ((await this.getCurrentWalletConnected()).address !== "")) {
      return true;
    } else {
      return false;
    }
  }

  public getContract = (contractAddress, abi) => {
  
    let contract
  
    try {
          // const provider = new ethers.providers.Web3Provider(window.ethereum);
          const provider = new ethers.providers.Web3Provider(this.walletProvider);
          const signer = provider.getSigner();
          contract = new ethers.Contract(contractAddress, abi, signer)
    } catch (error) {
      console.log(error);
        contract = null
    }
    return contract
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise(async (resolve, reject) => {
      if (window.ethereum) {
        enable =  await window.ethereum.request({ method: 'eth_requestAccounts',}); //await window.ethereum.send('eth_requestAccounts'); //.enable();

        if (enable) {
          this.getUserBalance();
          // this.connectContract();
        }
      }
    });
    return Promise.resolve(enable);
  }

  

  public async convertJSONtoHEX(value) {
    return window.web3.utils.toHex(value);
  }

  public async buyToken(amount, currentOwnerWalletAddress, platformFee) {
    // var contract = await this.connectContract();
    // this.contract = await new window.web3.eth.Contract(
    //   tokenAbis,
    //   environment.CONTRACT_ADDRESS
    // );
    // if(!this.getWalletProvider) {
    //   finalData['transactionDetail'] = receipt
    //   return null;
    // }

    this.contract = this.getContract(environment.CONTRACT_ADDRESS, tokenAbis);
    console.log("contract", this.contract);
    let tokenId = await this.contract.nextTokenId();
    // console.log('tokenId', tokenId);

    // let tokenId = await this.contract.methods.nextTokenId().call();
    // console.log('tokenId', tokenId);

    let ownerFee: any = (amount * platformFee) / 100;
    let sellerFee: any = amount - ownerFee;
    // console.log("sellerfee", sellerFee, amount, platformFee, ownerFee);
    let finalData = {
      ownerFee: ownerFee,
      sellerFee: sellerFee,
      total: amount,
      tokenId: tokenId.toString(),
      currentOwnerWalletAddress: this.account,
    };
    // ownerFee = ownerFee.toFixed(5) * 10 ** 18;
    const oFee = ethers.utils.parseUnits(ownerFee.toString(), 18);
    // sellerFee = sellerFee.toFixed(5) * 10 ** 18;
    const sFee = ethers.utils.parseUnits(sellerFee.toString(), 18);
    const aFee = ethers.utils.parseUnits((ownerFee+sellerFee).toString(), 18);
    // console.log(parseInt(aFee), parseInt(sFee), parseInt(oFee));
    // var receipt = await this.contract.methods
    //   .mint(
    //     environment.OWNER_ADDRESS,
    //     currentOwnerWalletAddress,
    //     ownerFee.toString(),
    //     sellerFee.toString()
    //   )
    //   .send({ from: this.account, value: sellerFee + ownerFee })
    //   .once('receipt', (receipt) => {
    //     console.log('receipt==========', receipt);
    //   })
    //   .catch((error) => {
    //     console.log('error==========', error);
    //   });

    // try {
    //   var receipt = await this.contract.mint(
    //     environment.OWNER_ADDRESS,
    //     currentOwnerWalletAddress,
    //     oFee,
    //     sFee,
    //     {value: aFee}
    //   );
    // } catch (error) {
    //   console.log("errror", error)
    // }
      var receipt = await this.contract.mint(
        environment.OWNER_ADDRESS,
        currentOwnerWalletAddress,
        oFee.toString(),
        sFee.toString(),
        {value: aFee.toString()}
      )
      .once('receipt', (receipt) => {
        console.log('receipt==========', receipt);
      })
      .catch((error) => {
        console.log('error==========', error);
      });

    finalData['transactionDetail'] = receipt;
    return finalData;
  }

  public async getTokenDetails(id) {
    // var uri = await this.contract.methods.tokenURI(id).call();
    var uri = await this.contract.tokenURI(id);
    return uri;
  }

  private async getAccount(): Promise<any> {
    // console.log('transfer.service :: getAccount :: start');
    // if (this.account == null) {
    //   this.account = (await new Promise((resolve, reject) => {
    //     console.log('transfer.service :: getAccount :: eth');
    //     // console.log(window.web3.eth);

    //     window.web3.eth.getAccounts((err, retAccount) => {
    //       console.log('transfer.service :: getAccount: retAccount');
    //       console.log(retAccount);
    //       console.log(err);
    //       if (retAccount.length > 0) {
    //         this.account = retAccount[0];
    //         localStorage.setItem('walletAddress', this.account);
    //         resolve(this.account);
    //       } else {
    //         alert('No accounts found.');
    //         reject('No accounts found.');
    //       }
    //       if (err != null) {
    //         alert('Not able to retrieve account');
    //         reject('Error retrieving account');
    //       }
    //     });
    //   })) as Promise<any>;
    // }
    // return Promise.resolve(this.account);

    const currentState = this.onboard.getState();

    if(currentState["address"] != null) {

      this.account = currentState["address"];
      localStorage.setItem('walletAddress', currentState["address"]);
        return this.account;
    } else {
        return "'No accounts found.'";
    }
  }

  public async getUserBalance(): Promise<any> {
    // const account = await this.getAccount();
    // console.log('transfer.service :: getUserBalance :: account');
    // console.log(account);
    // return new Promise((resolve, reject) => {
    //   window.web3.eth.getBalance(account, function (err, balance) {
    //     console.log('transfer.service :: getUserBalance :: getBalance');
    //     console.log(balance);
    //     if (!err) {
    //       const retVal = {
    //         account: account,
    //         balance: balance,
    //       };
    //       console.log(
    //         'transfer.service :: getUserBalance :: getBalance :: retVal'
    //       );
    //       console.log(retVal);
    //       resolve(retVal);
    //     } else {
    //       reject({ account: 'error', balance: 0 });
    //     }
    //   });
    // }) as Promise<any>;
    const provider = new ethers.providers.Web3Provider(this.getWalletProvider());

    const balance = await provider.getBalance(
        (
            await this.getCurrentWalletConnected()
        ).address
    );
    
    const account = await this.getAccount();

    const retval = {
      account: account,
      balance: balance,
    }

    return retval;
  }

  async getAddress() {
    // if (typeof window.web3 !== 'undefined') {
    //   let enable = await window.ethereum.request({ method: 'eth_requestAccounts',}); //await window.ethereum.enable();
    //   console.log('enable', enable);

    //   if (enable && enable.length > 0) {
    //     this.account = enable[0];
    //     localStorage.setItem('walletAddress', this.account);
    //     // await this.getUserBalance();
    //     return this.account;
    //   } else {
    //     return '';
    //   }
    // } else {
    //   return '';
    // }
    return "";
  }
}
