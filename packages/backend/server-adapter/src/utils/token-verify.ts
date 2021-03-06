/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Cache } from 'redis-extension';
import {
    OAuth2API,
    OAuth2TokenVerification, TokenError, hasOwnProperty,
} from '@authelion/common';
import { isClientError } from '@trapi/client';
import { Logger } from '../socket';

export type TokenVerifyContext = {
    token: string,
    tokenAPIClient: OAuth2API,
    tokenCache?: Cache<string>,
    logger?: Logger
};

export async function verifyToken(context: TokenVerifyContext) : Promise<OAuth2TokenVerification> {
    let data : OAuth2TokenVerification | undefined;

    if (context.tokenCache) {
        data = await context.tokenCache.get(context.token);

        if (context.logger) {
            context.logger.info(`The token ${context.token} could be verified from cache.`);
        }
    }

    if (!data) {
        let payload : OAuth2TokenVerification;

        try {
            payload = await context.tokenAPIClient.verifyToken(context.token);
            if (context.logger) {
                context.logger.info(`The token ${context.token} could be verified.`);
            }
        } catch (e) {
            if (
                isClientError(e) &&
                e.response &&
                e.response.data &&
                hasOwnProperty(e.response.data, 'code') &&
                hasOwnProperty(e.response.data, 'message')
            ) {
                if (context.logger) {
                    context.logger.debug(e.response.data.message as string, {
                        error: e,
                    });
                }

                throw new TokenError({
                    statusCode: e.response.status,
                    code: e.response.data.code as string | number,
                    message: e.response.data.message as string,
                });
            } else {
                if (context.logger) {
                    context.logger.debug(`The token ${context.token} could not be verified.`, {
                        error: e,
                    });
                }

                throw new TokenError({
                    previous: e,
                });
            }
        }

        let expires : number;
        if (typeof payload.entity.expires === 'string') {
            expires = Date.parse(payload.entity.expires);
        } else {
            expires = payload.entity.expires.getTime();
        }

        let secondsDiff : number = expires - Date.now();
        secondsDiff = parseInt(secondsDiff.toString(), 10);

        if (secondsDiff <= 0) {
            throw TokenError.expired();
        }

        if (context.tokenCache) {
            await context.tokenCache.set(context.token, payload, { seconds: secondsDiff });
        }

        data = payload;
    }

    return data;
}
