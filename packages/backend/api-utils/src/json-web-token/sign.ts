/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { sign } from 'jsonwebtoken';
import { KeyPair, useKeyPair } from '../key-pair';
import { TokenSignContext } from './type';

export async function signToken<T extends string | object | Buffer | Record<string, any>>(
    payload: T,
    context?: TokenSignContext,
): Promise<string> {
    context ??= {};
    context.options ??= {};
    context.options.expiresIn = context.options.expiresIn || 3600;

    if (context.secret) {
        context.options.algorithm = context.options.algorithm || 'HS256';
        return sign(payload, context.secret, context.options);
    }

    const keyPair: KeyPair = await useKeyPair(context.keyPair);
    context.options.algorithm = context.options.algorithm || 'RS256';

    return sign(payload, keyPair.privateKey, context.options);
}