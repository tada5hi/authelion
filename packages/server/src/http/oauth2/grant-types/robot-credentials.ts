/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    OAuth2AccessTokenSubKind,
    OAuth2ServerError,
    Oauth2TokenResponse,
} from '@typescript-auth/domains';
import { getCustomRepository } from 'typeorm';
import { AbstractGrant } from './abstract-grant';
import { OAuth2BearerTokenResponse } from '../response';
import { RobotEntity, RobotRepository } from '../../../domains';
import { Grant } from './type';

export class RobotCredentialsGrantType extends AbstractGrant implements Grant {
    async run() : Promise<Oauth2TokenResponse> {
        const entity = await this.validate();

        const accessToken = await this.issueAccessToken({
            entity: {
                type: OAuth2AccessTokenSubKind.ROBOT,
                data: entity,
            },
        });

        const refreshToken = await this.issueRefreshToken(accessToken);

        const response = new OAuth2BearerTokenResponse({
            keyPairOptions: this.context.keyPairOptions,
            accessToken,
            refreshToken,
        });

        return response.build();
    }

    async validate() : Promise<RobotEntity> {
        const { id, secret } = this.context.request.body;

        const repository = getCustomRepository<RobotRepository>(RobotRepository);
        const entity = await repository.verifyCredentials(id, secret);

        if (typeof entity === 'undefined') {
            throw OAuth2ServerError.invalidCredentials();
        }

        return entity;
    }
}