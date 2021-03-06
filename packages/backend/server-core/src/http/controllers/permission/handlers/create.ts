/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ForbiddenError } from '@typescript-error/http';
import { check, matchedData, validationResult } from 'express-validator';
import {
    Permission, PermissionID,
} from '@authelion/common';
import { ExpressValidationError } from '../../../express-validation';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { PermissionEntity } from '../../../../domains';
import { useDataSource } from '../../../../database';

export async function createOnePermissionRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    if (!req.ability.has(PermissionID.PERMISSION_ADD)) {
        throw new ForbiddenError();
    }

    await check('id')
        .exists()
        .notEmpty()
        .isLength({ min: 3, max: 30 })
        .run(req);

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        throw new ExpressValidationError(validation);
    }

    const data = matchedData(req, { includeOptionals: false });

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(PermissionEntity);
    const role = repository.create(data);

    await repository.save(role);

    return res.respondCreated({
        data: {
            id: role.id,
        },
    });
}
