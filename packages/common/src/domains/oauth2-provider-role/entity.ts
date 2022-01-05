/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { OAuth2Provider } from '../oauth2-provider';
import { Role } from '../role';

@Entity({ name: 'oauth2_provider_roles' })
@Index(['provider_id', 'role_id'], { unique: true })
@Index(['provider_id', 'external_id'], { unique: true })
export class Oauth2ProviderRole {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column({ type: 'varchar', length: 36 })
        external_id: string;

    @CreateDateColumn()
        created_at: Date;

    @UpdateDateColumn()
        updated_at: Date;

    // -----------------------------------------------

    @Column({ type: 'int', unsigned: true })
        role_id: number;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
        role: Role;

    @Column({ type: 'uuid' })
        provider_id: string;

    @ManyToOne(() => OAuth2Provider, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'provider_id' })
        provider: OAuth2Provider;
}