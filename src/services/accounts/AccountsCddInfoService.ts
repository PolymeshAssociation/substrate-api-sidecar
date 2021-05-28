import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { IAccountCddInfo } from 'src/types/responses';

import { AbstractService } from '../AbstractService';

export class AccountsCddInfoService extends AbstractService {
	private polymeshSdk: Polymesh | undefined;
	/**
	 * Fetch CDD status for an account at a given block.
	 *
	 * @param historicApi API linked to queried block.
	 * @param address Address to check for CDD status.
	 */
	async fetchAccountCddInfo(address: string): Promise<IAccountCddInfo> {
		console.log('GETTING CDD');
		if (this.polymeshSdk === undefined) {
			this.polymeshSdk = await Polymesh.connect({ nodeUrl: process.env.SAS_SUBSTRATE_URL! });
		}

		const account = await this.polymeshSdk.accountManagement.getAccount({ address: address });
		if (!(await account.exists())) {
			return {
				did: '',
				hasCddClaim: false,
			};
		}
		const identity = await account.getIdentity();
		if (identity === null) {
			return {
				did: '',
				hasCddClaim: false,
			};
		}
		const validCdd = await identity.hasValidCdd();

		return {
			did: identity.did,
			hasCddClaim: validCdd,
		};
	}
}
