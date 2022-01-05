/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { check } from 'express-validator';
import { ExpressRequest } from '../../../type';

export async function runOauth2ProviderValidation(req: ExpressRequest, operation: 'create' | 'update') {
    await check('name')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 30 })
        .run(req);

    await check('open_id')
        .exists()
        .notEmpty()
        .isBoolean()
        .run(req);

    await check('token_host')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 512 })
        .run(req);

    await check('token_path')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 256 })
        .optional({ nullable: true })
        .run(req);
    await check('token_revoke_path')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 256 })
        .optional({ nullable: true })
        .run(req);

    await check('authorize_host')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 512 })
        .optional({ nullable: true })
        .run(req);

    await check('authorize_path')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 5, max: 256 })
        .optional({ nullable: true })
        .run(req);

    await check('scope')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3, max: 512 })
        .optional({ nullable: true })
        .run(req);

    await check('client_id')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3, max: 128 })
        .run(req);

    await check('client_secret')
        .exists()
        .notEmpty()
        .isString()
        .isLength({ min: 3, max: 128 })
        .optional({ nullable: true })
        .run(req);

    if (operation === 'create') {
        await check('realm_id')
            .exists()
            .notEmpty()
            .isString()
            .run(req);
    }
}
