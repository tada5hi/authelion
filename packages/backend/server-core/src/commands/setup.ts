/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createDatabase, setupDatabaseSchema } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { createKeyPair } from '@authelion/server-utils';
import { SetupCommandContext } from './type';
import { generateSwaggerDocumentation } from '../http';
import { DatabaseSeeder, buildDataSourceOptions, buildDatabaseOptionsFromConfig } from '../database';
import { useConfig } from '../config';

export async function setupCommand(context?: SetupCommandContext) {
    context = context || {};

    if (
        typeof context.keyPair === 'undefined' &&
        typeof context.database === 'undefined' &&
        typeof context.databaseSeed === 'undefined' &&
        typeof context.documentation === 'undefined'
    ) {
        // eslint-disable-next-line no-multi-assign
        context.keyPair = context.database = context.databaseSeed = context.documentation = true;
    }

    context.keyPair ??= true;
    context.database ??= true;
    context.databaseSeed ??= true;
    context.documentation ??= true;

    const config = await useConfig();

    if (context.keyPair) {
        if (context.spinner) {
            context.spinner.start('Generating rsa key-pair.');
        }

        await createKeyPair({
            directory: config.writableDirectoryPath,
        });

        if (context.spinner) {
            context.spinner.succeed('Generated rsa key-pair.');
        }
    }

    if (context.documentation) {
        if (context.spinner) {
            context.spinner.start('Generating documentation.');
        }

        await generateSwaggerDocumentation({
            rootPath: config.rootPath,
            writableDirectoryPath: config.writableDirectoryPath,
            baseUrl: config.selfUrl,
        });

        if (context.spinner) {
            context.spinner.start('Generated documentation.');
        }
    }

    if (context.database || context.databaseSeed) {
        /**
         * Setup database with schema & seeder
         */
        const options = context.dataSourceOptions || await buildDataSourceOptions();

        if (context.database) {
            if (context.spinner) {
                context.spinner.start('Creating database.');
            }

            await createDatabase({ options, synchronize: false });

            if (context.spinner) {
                context.spinner.succeed('Created database.');
            }
        }

        const dataSource = new DataSource(options);

        await dataSource.initialize();

        try {
            if (context.spinner) {
                context.spinner.start('Execute schema setup.');
            }

            await setupDatabaseSchema(dataSource);

            if (context.spinner) {
                context.spinner.succeed('Executed schema setup.');
            }

            if (context.databaseSeed) {
                if (context.spinner) {
                    context.spinner.start('Seeding database.');
                }

                config.adminPasswordReset ??= true;
                config.robotSecretReset ??= true;

                const databaseOptions = buildDatabaseOptionsFromConfig(config);
                const seeder = new DatabaseSeeder(databaseOptions.seed);
                const seederData = await seeder.run(dataSource);

                if (context.spinner) {
                    context.spinner.succeed('Seeded database.');

                    if (seederData.robot) {
                        context.spinner.info(`Robot ID: ${seederData.robot.id}`);
                        context.spinner.info(`Robot Secret: ${seederData.robot.secret}`);
                    }
                }
            }
        } catch (e) {
            if (context.spinner) {
                context.spinner.fail('Synchronizing or seeding the database failed.');
            }
            throw e;
        } finally {
            await dataSource.destroy();
        }
    }
}
