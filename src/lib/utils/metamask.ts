import { transactionParameters } from '@lib/config/metamask';
import { ethers } from 'ethers';

export async function connect() {
	if (!window.ethereum) {
		throw Error('window.ethereum not found');
	}
	let provider = new ethers.BrowserProvider(window.ethereum, 'any');
	let accounts = await provider.send('eth_requestAccounts', []);
	let account = accounts[0];

	/* // listen to account changes
  provider.on('accountsChanged', function (accounts: any[]) {
    account = accounts[0];
    console.log(address); // Print new address
  }); */

	// listen to network changes
	provider.on('network', (newNetwork, oldNetwork) => {
		// When a Provider makes its initial connection, it emits a "network"
		// event with a null oldNetwork along with the newNetwork. So, if the
		// oldNetwork exists, it represents a changing network
		if (oldNetwork) {
			console.log('changed');
			window.location.reload();
		}
	});

	let signer = await provider.getSigner();

	let account_balance_wei = await provider.getBalance('ethers.eth');
	let account_balance_eth = ethers.formatEther(account_balance_wei).slice(0, 5);

	return { provider, signer, account, account_balance_eth };
}

export async function sendTransaction() {
	if (!window.ethereum) {
		throw Error('window.ethereum not found');
	}
	transactionParameters.from = window.ethereum!.selectedAddress!;
	return await window.ethereum.request({
		method: 'eth_sendTransaction',
		params: [transactionParameters]
	});
}
