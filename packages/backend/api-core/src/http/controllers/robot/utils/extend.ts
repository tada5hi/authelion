/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { getRepository } from 'typeorm';
import { BadRequestError } from '@typescript-error/http';
import { Robot } from '@authelion/common';
import { ExpressValidationResult, buildExpressValidationErrorMessage } from '../../../express-validation';
import { RobotEntity } from '../../../../domains';

type ExpressValidationResultExtendedWithRobot = ExpressValidationResult<{
    robot_id: Robot['id']
}, {
    robot?: RobotEntity
}>;

export async function extendExpressValidationResultWithRobot<
    T extends ExpressValidationResultExtendedWithRobot,
>(result: T) : Promise<T> {
    if (result.data.robot_id) {
        const repository = getRepository(RobotEntity);
        const entity = await repository.findOne(result.data.robot_id);
        if (typeof entity === 'undefined') {
            throw new BadRequestError(buildExpressValidationErrorMessage('robot_id'));
        }

        result.meta.robot = entity;
    }

    return result;
}