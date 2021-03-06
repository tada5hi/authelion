/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseError, ErrorOptions, mergeErrorOptions } from '@typescript-error/core';
import { ErrorCode } from '../constants';

export class AbilityError extends BaseError {
    constructor(options?: ErrorOptions) {
        super(mergeErrorOptions({
            code: ErrorCode.ABILITY_INVALID,
        }, (options || {})));
    }

    static buildMeta() {
        return new AbilityError({
            message: 'The ability meta could not be built.',
        });
    }
}
