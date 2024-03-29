import { PUBLIC_METAMASK_ADDRESS } from "$env/static/public";
import type { ethers } from "ethers";

const transactionParameters: ethers.TransactionRequest = {
  //gasPrice: '0x000010000000', // customizable by user during MetaMask confirmation.
  gasLimit: "0x2710", // customizable by user during MetaMask confirmation.
  to: PUBLIC_METAMASK_ADDRESS, // Required except during contract publications.
  from: "", // must match user's active address.
  value: undefined, // Only required to send ether to the recipient from the initiating external account.
};

export { transactionParameters };
