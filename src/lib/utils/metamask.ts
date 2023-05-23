import { transactionParameters } from "@lib/config/metamask";
import {
  ethers,
  toBigInt,
  type BrowserProvider,
  type JsonRpcSigner,
} from "ethers";

export enum Item {
  Provider,
  Signer,
  Account,
}

export enum Currency {
  USD,
  WEI,
  ETHER,
}

const USD_TO_WEI = ethers.parseEther("0.00054");

let provider: BrowserProvider;
let signer: JsonRpcSigner;
let account: string;

async function initialize() {
  if (!window.ethereum) {
    throw Error("window.ethereum not found");
  }
  const ethereum = window.ethereum;
  provider = new ethers.BrowserProvider(ethereum, "any");
  account = await provider.send("eth_requestAccounts", []).then((res) => {
    return res[0];
  });

  signer = await provider.getSigner();

  return { provider, signer, account };
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

export function sendTransaction(
  currency: Currency,
  amount: string,
  signer: JsonRpcSigner
) {
  if (!window.ethereum) {
    throw Error("window.ethereum not found");
  }
  transactionParameters.from = window.ethereum.selectedAddress;
  switch (currency) {
    case Currency.USD:
      const costInWei = ethers.formatUnits(
        ethers.parseUnits(amount, 4) * USD_TO_WEI,
        4
      );
      transactionParameters.value = ethers.parseUnits(costInWei, 0);
      break;
    case Currency.WEI:
      transactionParameters.value = toBigInt(amount);
      break;
    case Currency.ETHER:
      transactionParameters.value = ethers.parseEther(amount);
      break;
    default:
      throw new Error(`Invalid currency ${currency}`);
  }
  console.log("amount ", transactionParameters.value);
  return signer.sendTransaction(transactionParameters);
}
