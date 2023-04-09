import { PUBLIC_METAMASK_ADDRESS } from '$env/static/public';

const transactionParameters = {
	nonce: '0x00', // ignored by MetaMask
	gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
	gas: '0x2710', // customizable by user during MetaMask confirmation.
	to: PUBLIC_METAMASK_ADDRESS, // Required except during contract publications.
	from: '', // must match user's active address.
	value: Number(182000000000000000).toString(16), // Only required to send ether to the recipient from the initiating external account.
	//data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
	chainId: '0x3' // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
};

export { transactionParameters };
