/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type MiddlewareSwaggerOptions = {
    enabled?: boolean,
    directory?: string
};

export type MiddlewareOptions = {
    bodyParser?: boolean,
    cookieParser?: boolean,
    response?: boolean,
    swagger?: MiddlewareSwaggerOptions
};
