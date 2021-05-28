import { ApiPromise } from '@polkadot/api';
import { RequestHandler } from 'express';
import { IAddressParam } from 'src/types/requests';

import { validateAddress } from '../../middleware';
import { AccountsCddInfoService } from '../../services';
import AbstractController from '../AbstractController';

/**
 * GET CDD status for an address.
 *
 * Paths:
 * - `address`: The address to query.
 *
 * Query:
 * - (Optional)`at`: Block at which to query for CDD status
 *
 * Returns:
 * - `did`: DID associated with the account
 * - `hasCddClaim`: whether the DID has a valid CDD claim
 */
export default class AccountsCddController extends AbstractController<AccountsCddInfoService> {
	constructor(api: ApiPromise) {
		super(api, '/accounts/:address/cdd-info', new AccountsCddInfoService(api));
		this.initRoutes();
	}

	protected initRoutes(): void {
		this.router.use(this.path, validateAddress);

		this.safeMountAsyncGetHandlers([['', this.getAccountCddInfo]]);
	}

	/**
	 * Get the latest account balance summary of `address`.
	 *
	 * @param req Express Request
	 * @param res Express Response
	 */
	private getAccountCddInfo: RequestHandler<IAddressParam> = async ({ params: { address } }, res): Promise<void> => {
		AccountsCddController.sanitizedSend(res, await this.service.fetchAccountCddInfo(address));
	};
}
