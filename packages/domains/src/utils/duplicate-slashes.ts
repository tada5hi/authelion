/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { URL } from 'url';

export function removeDuplicateForwardSlashesFromURL(str: string) : string {
    const url = new URL(str);

    return `${url.protocol}//${(url.host + url.pathname).replace(/([^:]\/)\/+/g, '$1')}${url.search}`;
}