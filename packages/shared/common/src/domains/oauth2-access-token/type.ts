/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { User } from '../user';
import { OAuth2Client } from '../oauth2-client';
import { Robot } from '../robot';
import { OAuth2TokenKind } from '../oauth2';
import { JWTPayload } from '../json-web-token';
import { Realm } from '../realm';
import { OAuth2TokenGrant } from './constants';

export interface OAuth2AccessToken {
    id: string,

    content: string,

    client_id: OAuth2Client['id'] | null,

    client: OAuth2Client | null,

    user_id: User['id'] | null,

    user: User | null,

    robot_id: Robot['id'] | null,

    robot: Robot | null,

    realm_id: Realm['id'],

    realm: Realm,

    expires: Date | string,

    scope: string | null
}

export type OAuth2AccessTokenPayload = JWTPayload & {
    /**
     * Specify this token as access token.
     */
    kind: `${OAuth2TokenKind.ACCESS}`,

    access_token_id: OAuth2AccessToken['id'],
};

export type OAuth2TokenGrantType = `${OAuth2TokenGrant}`;

export type OAuth2AccessTokenVerification = {
    kind: `${OAuth2TokenKind.ACCESS}`,
    entity: OAuth2AccessToken
};
