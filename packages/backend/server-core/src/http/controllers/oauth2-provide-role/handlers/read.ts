/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    applyFilters, applyPagination, applySort,
} from 'typeorm-extension';
import { NotFoundError } from '@typescript-error/http';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { OAuth2ProviderRoleEntity } from '../../../../domains';
import { useDataSource } from '../../../../database';

export async function getManyOauth2ProviderRoleRouteHandler(req: ExpressRequest, res: ExpressResponse) : Promise<any> {
    const { page, filter, sort } = req.query;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(OAuth2ProviderRoleEntity);

    const query = repository.createQueryBuilder('providerRole');

    applyFilters(query, filter, {
        defaultAlias: 'providerRole',
        allowed: ['role_id', 'provider_id'],
    });

    applySort(query, sort, {
        defaultAlias: 'providerRole',
        allowed: ['id', 'created_at', 'updated_at'],
    });

    const pagination = applyPagination(query, page, { maxLimit: 50 });

    const [entities, total] = await query.getManyAndCount();

    return res.respond({
        data: {
            data: entities,
            meta: {
                total,
                ...pagination,
            },
        },
    });
}

// ---------------------------------------------------------------------------------

export async function getOneOauth2ProviderRoleRouteHandler(req: ExpressRequest, res: ExpressResponse) : Promise<any> {
    const { id } = req.params;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(OAuth2ProviderRoleEntity);

    const query = repository.createQueryBuilder('providerRole')
        .where('providerRole.id = :id', { id });

    const result = await query.getOne();

    if (!result) {
        throw new NotFoundError();
    }

    return res.respond({
        data: result,
    });
}
