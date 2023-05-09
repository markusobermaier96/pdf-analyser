import { transactionParameters } from '@lib/config/metamask';
import { ethers, toBigInt, type BrowserProvider, type JsonRpcSigner } from 'ethers';

export enum Item {
	Provider,
	Signer,
	Account
}

export enum Currency {
	USD,
	WEI,
	ETHER
}

let provider: BrowserProvider;
let signer: JsonRpcSigner;
let account: string;

async function initialize() {
	if (!window.ethereum) {
		throw Error('window.ethereum not found');
	}
	let ethereum = window.ethereum;
	provider = new ethers.BrowserProvider(ethereum, 'any');
	account = await provider.send('eth_requestAccounts', []).then((res) => {
		return res[0];
	});
	
	signer = await provider.getSigner();

	let account_balance_wei = await provider.getBalance('ethers.eth');
	let account_balance_eth = ethers.formatEther(account_balance_wei).slice(0, 5);

	return { provider, signer, account, account_balance_eth };
}

export async function get(item: Item) {
	if (!(provider && signer && account)) {
		await initialize();
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

export function sendTransaction(currency: Currency, amount: string, signer: JsonRpcSigner) {
	if (!window.ethereum) {
		throw Error('window.ethereum not found');
	}
	transactionParameters.from = window.ethereum!.selectedAddress!;
	switch (currency) {
		case Currency.USD:
			const usdToWei = ethers.parseEther("0.00054")
			let costInWei = ethers.formatUnits(ethers.parseUnits(amount, 4) * usdToWei , 4)
			transactionParameters.value = ethers.parseUnits(costInWei, 0)
			break;
		case Currency.WEI:
			transactionParameters.value = toBigInt(amount);
			break;
		case Currency.ETHER:
			transactionParameters.value = ethers.parseEther(amount)
			break;
		default:
			throw new Error(`Invalid currency ${currency}`);
	}
	console.log("amount ", transactionParameters.value);
	return signer.sendTransaction(transactionParameters);
}
