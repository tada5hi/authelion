/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export interface Permission {
    id: string;

    target: string | null;

    created_at: Date;

    updated_at: Date;
}
