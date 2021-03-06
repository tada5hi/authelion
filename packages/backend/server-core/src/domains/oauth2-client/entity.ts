/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { OAuth2Client, Realm, User } from '@authelion/common';
import { UserEntity } from '../user';
import { RealmEntity } from '../realm';

@Entity({ name: 'auth_clients' })
export class OAuth2ClientEntity implements OAuth2Client {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column({
        type: 'varchar',
        length: 256,
    })
        name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
        description: string | null;

    @Column({
        type: 'varchar',
        length: 256,
        select: false,
        nullable: true,
    })
        secret: string | null;

    @Column({
        type: 'varchar',
        length: 2000,
        nullable: true,
    })
        redirect_uri: string | null;

    @Column({
        type: 'varchar',
        length: 512,
        nullable: true,
    })
        grant_types: string | null;

    @Column({
        type: 'varchar',
        length: 512,
        nullable: true,
        default: null,
    })
        scope: string | null;

    @Column({
        type: 'boolean',
        default: false,
    })
        is_confidential: boolean;

    // ------------------------------------------------------------------

    @Column({ nullable: true, default: null })
        realm_id: Realm['id'];

    @ManyToOne(() => RealmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'realm_id' })
        realm: RealmEntity;

    @Column({ nullable: true, default: null })
        user_id: User['id'] | null;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'user_id' })
        user: UserEntity | null;
}
