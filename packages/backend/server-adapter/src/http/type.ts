/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NextFunction, Request } from 'express';
import {
    AbilityDescriptor, AbilityManager, OAuth2Client, Realm, Robot, User,
} from '@authelion/common';

export interface ExpressRequest extends Request {
    user?: User,
    userId?: User['id'],

    robot?: Robot,
    robotId?: Robot['id'],

    client?: OAuth2Client,
    clientId?: OAuth2Client['id']

    realmId?: Realm['id'],

    token?: string,

    ability: AbilityManager,
    permissions: AbilityDescriptor[],
}

export interface ExpressResponse extends Response {

}

export interface ExpressNextFunction extends NextFunction {

}
