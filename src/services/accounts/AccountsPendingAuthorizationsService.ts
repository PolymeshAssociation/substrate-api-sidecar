import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { AuthorizationRequest, AuthorizationType } from '@polymeshassociation/polymesh-sdk/types';
import { IAccountPendingAuthorizations } from 'src/types/responses';

import { AbstractService } from '../AbstractService';

export class AccountsPendingAuthorizationsService extends AbstractService {
	private polymeshSdk: Polymesh | undefined;
	/**
	 * Fetch pending authorizations for an account.
	 *
	 * @param address Address to check for pending authorizations.
	 */
	async fetchAccountPendingAuthorizations(address: string): Promise<IAccountPendingAuthorizations> {
		if (this.polymeshSdk === undefined) {
			this.polymeshSdk = await Polymesh.connect({ nodeUrl: process.env.SAS_SUBSTRATE_URL! });
		}

		const account = await this.polymeshSdk.accountManagement.getAccount({ address: address });

		const auths = await account.authorizations.getReceived({
			type: AuthorizationType.JoinIdentity,
			includeExpired: false,
		});

		const ids = auths.map((req: AuthorizationRequest) => req.authId.toNumber());

		return {
			auths: ids,
		};
	}
}
