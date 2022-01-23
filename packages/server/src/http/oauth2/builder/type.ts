/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { OAuth2AccessToken } from '@typescript-auth/domains';
import { ExpressRequest } from '../../type';
import { KeyPairOptions } from '../../../utils';

export type TokenBuilderContext = {
    maxAge?: number,
};

export type AccessTokenBuilderContext = TokenBuilderContext & {
    keyPairOptions?: Partial<KeyPairOptions>
    request: ExpressRequest,
    selfUrl: string,
};

export type RefreshTokenBuilderContext = TokenBuilderContext & {
    accessToken: OAuth2AccessToken
};
