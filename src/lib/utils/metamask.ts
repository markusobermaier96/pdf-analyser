import { transactionParameters } from '@lib/config/metamask';
import { BrowserProvider, ethers, JsonRpcSigner } from 'ethers';

export enum Item {
	Provider,
	Signer,
	Account
}

let provider: BrowserProvider;
let signer: JsonRpcSigner;
let account: string;

async function initialize() {
	if (!window.ethereum) {
		throw Error('window.ethereum not found');
	}
	let ethereum = window.ethereum
	provider = new ethers.BrowserProvider(ethereum, 'any');
	account = await provider.send('eth_requestAccounts', []).then(res => {return res[0]});
	//account = accounts[0];

	// listen to changes
	/* provider.on('accountsChanged', function (accounts: any[]) {
		account = accounts[0];
	}); */
	provider.on('network', (newNetwork, oldNetwork) => {
		if (oldNetwork) {
			console.log('changed');
			window.location.reload();
		}
	});

	signer = await provider.getSigner();

	let account_balance_wei = await provider.getBalance('ethers.eth');
	let account_balance_eth = ethers.formatEther(account_balance_wei).slice(0, 5);

	return { provider, signer, account, account_balance_eth };
}

export async function get(item: Item) {
	if (!(provider && signer && account)) {
		await initialize()
	}
	switch (item) {
		case Item.Provider:
			return provider;
		case Item.Signer:
			return signer;
		case Item.Account:
			return account;
		default:
			throw new Error(`Invalid item ${item}`);
	}
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
