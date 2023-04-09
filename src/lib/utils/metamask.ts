import { transactionParameters } from '@lib/config/metamask';

export async function makePayment() {
	if (!window.ethereum) {
		throw Error('window.ethereum not found');
	}
	const txHash = await window.ethereum.request({
		method: 'eth_sendTransaction',
		params: [transactionParameters]
	});
}

export function confirmPayment() {
    return new Promise<void>((resolve, reject) => {
        const confirmed = window.confirm('Are you sure you want to make the payment?');
        if (confirmed) {
          resolve();
        } else {
          reject(Error('Payment declined by user'));
        }
      });
  }