/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { PropType } from 'vue';
import { RolePermission } from '@typescript-auth/domains';
import { ComponentListItemData } from '../../helpers';

export type Properties = {
    items?: RolePermission[],
    roleId?: string,
    permissionId?: string
};

export const RolePermissionListItemActions = Vue.extend<ComponentListItemData<RolePermission>, any, any, Properties>({
    props: {
        items: {
            type: Array as PropType<RolePermission[]>,
            default: () => [],
        },
        roleId: String,
        permissionId: String,
    },
    data() {
        return {
            busy: false,
            item: null,

            loaded: false,
        };
    },
    created() {
        Promise.resolve()
            .then(() => this.initFromProperties())
            .then(() => this.init())
            .then(() => {
                this.loaded = true;
            });
    },
    methods: {
        initFromProperties() {
            if (!Array.isArray(this.items)) return;

            const index = this.items.findIndex((item: RolePermission) => item.role_id === this.roleId && item.permission_id === this.permissionId);
            if (index !== -1) {
                this.item = this.items[index];
            }
        },
        async init() {
            try {
                const response = await this.$authApi.rolePermission.getMany({
                    filters: {
                        role_id: this.roleId,
                        permission_id: this.permissionId,
                    },
                    page: {
                        limit: 1,
                    },
                });

                if (response.meta.total === 1) {
                    const { 0: item } = response.data;

                    this.item = item;
                }
            } catch (e) {
                // ...
            }
        },
        async add() {
            if (this.busy || this.item) return;

            this.busy = true;

            try {
                const item = await this.$authApi.rolePermission.create({
                    role_id: this.roleId,
                    permission_id: this.permissionId,
                });

                this.$bvToast.toast('The role-permission relation was successfully created.', {
                    variant: 'success',
                    toaster: 'b-toaster-top-center',
                });

                this.item = item;

                this.$emit('created', item);
            } catch (e) {
                if (e instanceof Error) {
                    this.$bvToast.toast(e.message, {
                        variant: 'warning',
                        toaster: 'b-toaster-top-center',
                    });

                    this.$emit('failed', e);
                }
            }

            this.busy = false;
        },
        async drop() {
            if (this.busy || !this.item) return;

            this.busy = true;

            try {
                const item = await this.$authApi.rolePermission.delete(this.item.id);

                this.$bvToast.toast('The role-permission relation was successfully deleted.', {
                    variant: 'success',
                    toaster: 'b-toaster-top-center',
                });

                this.item = null;

                this.$emit('deleted', item);
            } catch (e) {
                if (e instanceof Error) {
                    this.$bvToast.toast(e.message, {
                        variant: 'warning',
                        toaster: 'b-toaster-top-center',
                    });

                    this.$emit('failed', e);
                }
            }

            this.busy = false;
        },
    },
    template: `
        <div>
            <button
                v-if="!item && loaded"
                class="btn btn-xs btn-success"
                @click.prevent="add"
            >
                <i class="fa fa-plus" />
            </button>
            <button
                v-if="item && loaded"
                class="btn btn-xs btn-danger"
                @click.prevent="drop"
            >
                <i class="fa fa-trash" />
            </button>
        </div>
    `,
});
