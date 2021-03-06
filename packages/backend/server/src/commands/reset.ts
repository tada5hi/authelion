/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Arguments, Argv, CommandModule } from 'yargs';
import { loadConfig, resetCommand, setConfig } from '@authelion/server-core';
import * as ora from 'ora';

import { buildDataSourceOptions } from '../database/utils';

interface ResetArguments extends Arguments {
    root: string;
}

export class ResetCommand implements CommandModule {
    command = 'reset';

    describe = 'Run reset operation.';

    builder(args: Argv) {
        return args
            .option('root', {
                alias: 'r',
                default: process.cwd(),
                describe: 'Path to the project root directory.',
            });
    }

    async handler(args: ResetArguments) {
        const config = await loadConfig(args.root);
        setConfig(config);

        const dataSourceOptions = await buildDataSourceOptions();

        const spinner = ora.default({
            spinner: 'dots',
        });

        await resetCommand({
            spinner,
            dataSourceOptions,
        });

        process.exit(0);
    }
}
