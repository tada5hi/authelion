/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    OAuth2Provider,
    OAuth2ProviderAccount,
    Oauth2TokenResponse, User, createNanoID, hasOwnProperty, isValidUserName,
} from '@typescript-auth/domains';
import { getCustomRepository, getRepository } from 'typeorm';
import { KeycloakJWTPayload } from '@typescript-auth/domains/src/entities/third-party';
import { string } from 'yargs';
import { UserEntity, UserRepository } from '../user';
import { OAuth2ProviderAccountEntity } from './entity';
import { OAuth2ProviderRoleEntity } from '../oauth2-provider-role';

export async function createOauth2ProviderAccountWithToken(
    provider: OAuth2Provider,
    tokenResponse: Oauth2TokenResponse,
) : Promise<OAuth2ProviderAccount> {
    const accountRepository = getRepository(OAuth2ProviderAccountEntity);
    let account = await accountRepository.findOne({
        provider_user_id: tokenResponse.access_token_payload.sub,
        provider_id: provider.id,
    }, { relations: ['user'] });

    const accessTokenPayload : KeycloakJWTPayload = tokenResponse.access_token_payload;

    const expiresIn : number = (accessTokenPayload.exp - accessTokenPayload.iat);
    const expireDate: Date = new Date((accessTokenPayload.iat * 1000) + (expiresIn * 1000));

    if (typeof account !== 'undefined') {
        account = accountRepository.merge(account, {
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            expires_at: expireDate,
            expires_in: expiresIn,
        });
    } else {
        const names : string[] = [
            accessTokenPayload.preferred_username,
            accessTokenPayload.nickname,
            accessTokenPayload.sub,
        ].filter((n) => n);

        const user = await createUser({
            realm_id: provider.realm_id,
        }, [...names]);

        account = accountRepository.create({
            provider_id: provider.id,
            provider_user_id: accessTokenPayload.sub,
            provider_user_name: names.shift(),
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            expires_at: expireDate,
            expires_in: expiresIn,
            user_id: user.id,
            user,
        });
    }

    await accountRepository.save(account);

    const roles : string[] = [];

    if (
        accessTokenPayload.roles &&
        Array.isArray(accessTokenPayload.roles)
    ) {
        accessTokenPayload.roles = accessTokenPayload.roles
            .filter((n) => typeof n === 'string');

        if (
            accessTokenPayload.roles &&
            accessTokenPayload.roles.length > 0
        ) {
            roles.push(...accessTokenPayload.roles);
        }
    }

    if (
        accessTokenPayload.realm_access?.roles &&
        Array.isArray(accessTokenPayload.realm_access?.roles)
    ) {
        accessTokenPayload.realm_access.roles = accessTokenPayload.realm_access?.roles
            .filter((n) => typeof n === 'string');

        if (
            accessTokenPayload.realm_access.roles &&
            accessTokenPayload.realm_access.roles.length > 0
        ) {
            roles.push(...accessTokenPayload.realm_access.roles);
        }
    }

    if (
        roles &&
        roles.length > 0
    ) {
        const providerRoleRepository = getRepository(OAuth2ProviderRoleEntity);

        const providerRoles = await providerRoleRepository
            .createQueryBuilder('providerRole')
            .leftJoinAndSelect('providerRole.provider', 'provider')
            .where('providerRole.external_id in (:...id)', { id: roles })
            .andWhere('provider.realm_id = :realmId', { realmId: provider.realm_id })
            .getMany();

        if (
            providerRoles.length > 0
        ) {
            const userRepository = getCustomRepository(UserRepository);
            await userRepository.syncRoles(
                account.user.id,
                providerRoles.map((providerRole) => providerRole.role_id),
            );
        }
    }

    return account;
}

async function createUser(data: Partial<User>, names: string[]) : Promise<UserEntity> {
    let name : string | undefined = names.shift();
    let nameLocked = true;

    if (!name) {
        name = createNanoID('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_', 30);
        nameLocked = false;
    }

    if (!isValidUserName(name)) {
        return createUser(data, names);
    }

    try {
        const userRepository = getCustomRepository(UserRepository);
        const user = userRepository.create({
            name,
            name_locked: nameLocked,
            display_name: name,
            realm_id: data.realm_id,
        });

        await userRepository.insert(user);

        return user;
    } catch (e) {
        if (
            hasOwnProperty(e, 'code') &&
            e.code === 'ER_DUP_ENTRY'
        ) {
            return createUser(data, names);
        }

        throw e;
    }
}
