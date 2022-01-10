/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Config } from '../config';

export type ServerStartContext = {
    config: Config
};

export type ServerSetupContext = {
    config: Config,
    keyPair: boolean,
    database: boolean,
    databaseSeeder: boolean,
    documentation: boolean
};