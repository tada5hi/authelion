/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { OAuth2AccessToken } from '../oauth2-access-token';
import { OAuth2Client } from '../oauth2-client';
import { OAuth2TokenKind } from '../oauth2';
import { JWTPayload } from '../json-web-token';
import { Realm } from '../realm';
import { User } from '../user';
import { Robot } from '../robot';

export interface OAuth2RefreshToken {
    id: string;

    expires: Date | string;

    scope: string | null;

    // ------------------------------------------------------------------

    client_id: OAuth2Client['id'] | null;

    client: OAuth2Client | null;

    user_id: User['id'] | null,

    user: User | null,

    robot_id: Robot['id'] | null,

    robot: Robot | null,

    access_token_id: OAuth2AccessToken['id'] | null;

    access_token: OAuth2AccessToken | null;

    realm_id: Realm['id'];

    realm: Realm;
}

export type OAuth2RefreshTokenPayload = JWTPayload & {
    kind: `${OAuth2TokenKind.REFRESH}`,

    access_token_id: OAuth2AccessToken['id'],

    refresh_token_id: OAuth2AccessToken['id'],
};

export type OAuth2RefreshTokenVerification = {
    kind: `${OAuth2TokenKind.REFRESH}`,
    entity: OAuth2RefreshToken
};
