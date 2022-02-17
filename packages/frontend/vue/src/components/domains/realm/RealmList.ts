/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { CreateElement, PropType, VNode } from 'vue';
import { Realm } from '@typescript-auth/domains';
import { BuildInput } from '@trapi/query';
import { BvMsgBoxData } from 'bootstrap-vue';
import { SingleResourceResponse } from '@typescript-auth/domains/dist/entities/type';
import { mergeDeep } from '../../../utils';
import { Pagination } from '../../core/Pagination';
import {
    ComponentListData,
    ComponentListProperties, buildListHeader, buildListItems,
    buildListNoMore,
    buildListPagination,
    buildListSearch,
} from '../../helpers';
import { PaginationMeta } from '../../type';

export const RealmList = Vue.extend<
ComponentListData<Realm>,
any,
any,
ComponentListProperties<Realm>
>({
    name: 'RealmList',
    components: { Pagination },
    props: {
        query: {
            type: Object as PropType<BuildInput<Realm>>,
            default() {
                return {};
            },
        },
        withHeader: {
            type: Boolean,
            default: true,
        },
        withSearch: {
            type: Boolean,
            default: true,
        },
        loadOnInit: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            busy: false,
            items: [],
            q: '',
            meta: {
                limit: 10,
                offset: 0,
                total: 0,
            },
            itemBusy: false,
        };
    },
    watch: {
        q(val, oldVal) {
            if (val === oldVal) return;

            if (val.length === 1 && val.length > oldVal.length) {
                return;
            }

            this.meta.offset = 0;

            Promise.resolve()
                .then(this.load);
        },
    },
    created() {
        if (this.loadOnInit) {
            Promise.resolve()
                .then(this.load);
        }
    },
    methods: {
        async load() {
            if (this.busy) return;

            this.busy = true;

            try {
                const response = await this.$authApi.realm.getMany(mergeDeep({
                    page: {
                        limit: this.meta.limit,
                        offset: this.meta.offset,
                    },
                    filter: {
                        name: this.q.length > 0 ? `~${this.q}` : this.q,
                    },
                }, this.query));

                this.items = response.data;
                const { total } = response.meta;

                this.meta.total = total;
            } catch (e) {
                // ...
            }

            this.busy = false;
        },
        async drop(item: Realm) {
            if (this.itemBusy) return;

            this.itemBusy = true;

            const l = this.$createElement;

            await this.$bvModal.msgBoxConfirm([l('div', { class: 'alert alert-dark m-b-0' }, [
                l('p', null, [
                    'Are you sure that you want to delete the realm  ',
                    l('b', null, [item.name]),
                    '?',
                ]),
            ])], {
                size: 'md',
                buttonSize: 'xs',
            })
                .then((value: BvMsgBoxData) => {
                    if (value) {
                        return this.$authApi.realm.delete(item.id)
                            .then(() => {
                                this.dropArrayItem(item);
                                return value;
                            }).then((value: SingleResourceResponse<Realm>) => {
                                this.itemBusy = false;
                                return value;
                            });
                    }

                    this.itemBusy = false;

                    return value;
                }).catch(() => {
                    // ...
                });
        },
        goTo(options: PaginationMeta, resolve: () => void, reject: (err?: Error) => void) {
            if (options.offset === this.meta.offset) return;

            this.meta.offset = options.offset;

            this.load()
                .then(resolve)
                .catch(reject);
        },

        handleCreated(item: Realm) {
            const index = this.items.findIndex((el: Realm) => el.id === item.id);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        },
        handleUpdated(item: Realm) {
            const index = this.items.findIndex((el: Realm) => el.id === item.id);
            if (index !== -1) {
                const keys : (keyof Realm)[] = Object.keys(item) as (keyof Realm)[];
                for (let i = 0; i < keys.length; i++) {
                    Vue.set(this.items[index], keys[i], item[keys[i]]);
                }
            }
        },
        handleDeleted(item: Realm) {
            const index = this.items.findIndex((el: Realm) => el.id === item.id);
            if (index !== -1) {
                this.items.splice(index, 1);
                this.meta.total--;
            }
        },
    },
    render(createElement: CreateElement): VNode {
        const header = buildListHeader(this, createElement, { title: 'Realms', iconClass: 'fa fa-city' });
        const search = buildListSearch(this, createElement);
        const items = buildListItems(this, createElement, { itemIconClass: 'fa fa-city' });
        const noMore = buildListNoMore(this, createElement);
        const pagination = buildListPagination(this, createElement);

        return createElement(
            'div',
            { staticClass: 'list' },
            [
                header,
                search,
                items,
                noMore,
                pagination,
            ],
        );
    },
});
