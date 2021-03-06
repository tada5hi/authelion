/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { check, validationResult } from 'express-validator';
import { BadRequestError } from '@typescript-error/http';
import { isPermittedForResourceRealm } from '@authelion/common';
import { ExpressRequest } from '../../../type';
import { UserRoleValidationResult } from '../type';
import {
    ExpressValidationError,
    buildExpressValidationErrorMessage,
    matchedValidationData,
} from '../../../express-validation';
import { extendExpressValidationResultWithUser } from '../../user/utils/extend';
import { extendExpressValidationResultWithRole } from '../../role/utils/extend';
import { CRUDOperation } from '../../../constants';

export async function runUserRoleValidation(
    req: ExpressRequest,
    operation: `${CRUDOperation.CREATE}` | `${CRUDOperation.UPDATE}`,
) : Promise<UserRoleValidationResult> {
    const result : UserRoleValidationResult = {
        data: {},
        meta: {},
    };

    if (operation === CRUDOperation.CREATE) {
        await check('user_id')
            .exists()
            .isUUID()
            .run(req);

        await check('role_id')
            .exists()
            .isUUID()
            .run(req);
    }

    // ----------------------------------------------

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        throw new ExpressValidationError(validation);
    }

    result.data = matchedValidationData(req, { includeOptionals: true });

    // ----------------------------------------------

    await extendExpressValidationResultWithRole(result);
    if (
        result.meta.role &&
        result.meta.role.realm_id
    ) {
        if (
            !isPermittedForResourceRealm(req.realmId, result.meta.role.realm_id)
        ) {
            throw new BadRequestError(buildExpressValidationErrorMessage('role_id'));
        }

        result.data.role_realm_id = result.meta.role.realm_id;
    }

    await extendExpressValidationResultWithUser(result);
    if (result.meta.user) {
        if (
            !isPermittedForResourceRealm(req.realmId, result.meta.user.realm_id)
        ) {
            throw new BadRequestError(buildExpressValidationErrorMessage('user_id'));
        }

        result.data.user_realm_id = result.meta.user.realm_id;
    }

    // ----------------------------------------------

    return result;
}
