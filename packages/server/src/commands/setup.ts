/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import * as ora from 'ora';
import path from 'path';
import { createDatabase } from 'typeorm-extension';
import { createConnection } from 'typeorm';
import { SetupCommandContext } from './type';
import { createSecurityKeyPair } from '../utils';
import { generateSwaggerDocumentation } from '../http/swagger';
import { DatabaseRootSeeder, buildDatabaseConnectionOptions } from '../database';
import { useConfig } from '../config';

export async function setupCommand(context: SetupCommandContext) {
    context.config ??= useConfig();

    const writableDirectoryPath = path.join(
        context.config.rootPath,
        context.config.writableDirectory,
    );

    const spinner = ora.default({
        spinner: 'dots',
    });

    if (
        !context.keyPair &&
        !context.database &&
        !context.databaseSeeder &&
        !context.documentation
    ) {
        // eslint-disable-next-line no-multi-assign
        context.keyPair = context.database = context.databaseSeeder = context.documentation = true;
    }

    if (context.keyPair) {
        spinner.start('Generating rsa key-pair.');

        await createSecurityKeyPair({
            directory: writableDirectoryPath,
        });

        spinner.succeed('Generated rsa key-pair.');
    }

    if (context.documentation) {
        spinner.start('Generating documentation.');

        await generateSwaggerDocumentation({
            rootDirectoryPath: context.config.rootPath,
            writableDirectory: context.config.writableDirectory,
            selfUrl: context.config.selfUrl,
        });

        spinner.start('Generated documentation.');
    }

    if (context.database || context.databaseSeeder) {
        /**
         * Setup database with schema & seeder
         */
        const connectionOptions = await buildDatabaseConnectionOptions(context.config, context.databaseConnectionExtend);

        if (context.database) {
            spinner.start('Creating database.');
            await createDatabase({ ifNotExist: true }, connectionOptions);
            spinner.succeed('Created database.');
        }

        const connection = await createConnection(connectionOptions);

        try {
            spinner.start('Synchronize database schema.');
            await connection.synchronize();
            spinner.succeed('Synchronized database schema.');

            if (context.databaseSeeder) {
                spinner.start('Seeding database.');

                const seeder = new DatabaseRootSeeder({
                    userName: context.config.adminUsername,
                    userPassword: context.config.adminPassword,
                    userPasswordReset: true,

                    robotSecretReset: true,

                    ...(context.databaseSeederOptions ? context.databaseSeederOptions : {}),
                });

                spinner.succeed('Seeded database.');

                const seederData = await seeder.run(connection);
                spinner.info(`Robot ID: ${seederData.robot.id}`);
                spinner.info(`Robot Secret: ${seederData.robot.secret}`);
            }
        } catch (e) {
            console.log(e);
            spinner.fail('Synchronizing or seeding the database failed.');
            throw e;
        } finally {
            await connection.close();
        }
    }
}