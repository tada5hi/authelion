/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    applyFields, applyFilters, applyPagination, applyRelations, applySort,
} from 'typeorm-extension';
import { NotFoundError } from '@typescript-error/http';
import { PermissionID } from '@authelion/common';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { OAuth2ClientEntity } from '../../../../domains';
import { useDataSource } from '../../../../database';

export async function getManyOauth2ClientRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    const {
        page, filter, fields, include, sort,
    } = req.query;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(OAuth2ClientEntity);

    const query = repository.createQueryBuilder('client');

    const relations = applyRelations(query, include, {
        defaultAlias: 'client',
        allowed: ['realm'],
    });

    applyFilters(query, filter, {
        relations,
        defaultAlias: 'client',
        allowed: ['realm_id', 'realm.name'],
    });

    applySort(query, sort, {
        allowed: ['id', 'created_at', 'updated_at'],
        defaultAlias: 'client',
    });

    if (
        req.ability &&
        req.ability.has(PermissionID.CLIENT_EDIT)
    ) {
        applyFields(
            query,
            fields,
            {
                defaultAlias: 'client',
                allowed: ['client_secret'],
            },
        );
    }

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

export async function getOneOauth2ClientRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    const { fields, include } = req.query;
    const { id } = req.params;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(OAuth2ClientEntity);

    const query = repository.createQueryBuilder('client')
        .where('client.id = :id', { id });

    applyRelations(query, include, {
        defaultAlias: 'client',
        allowed: ['realm'],
    });

    if (
        req.ability &&
        req.ability.has(PermissionID.CLIENT_EDIT)
    ) {
        applyFields(
            query,
            fields,
            {
                defaultAlias: 'client',
                allowed: ['secret'],
            },
        );
    }

    const result = await query.getOne();

    if (!result) {
        throw new NotFoundError();
    }

    return res.respond({
        data: result,
    });
}
