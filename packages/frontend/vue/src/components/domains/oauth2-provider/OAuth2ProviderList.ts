/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { PropType } from 'vue';
import { BuildInput } from '@trapi/query';
import { OAuth2Provider } from '@typescript-auth/domains';
import {
    mergeDeep,
} from '../../../utils';
import { Pagination } from '../../core/Pagination';
import { ComponentListData, ComponentListProperties } from '../../helpers';

type Properties = ComponentListProperties<OAuth2Provider> & {
    mapItems?: () => void,
    filterItems?: () => void
};

export const OAuth2ProviderList = Vue.extend<
ComponentListData<OAuth2Provider>,
any,
any,
Properties
>({
    name: 'OAuth2ProviderList',
    components: { Pagination },
    props: {
        mapItems: Function,
        filterItems: Function,
        query: {
            type: Object as PropType<BuildInput<OAuth2Provider>>,
            default() {
                return {};
            },
        },
        withSearch: {
            type: Boolean,
            default: true,
        },
        withHeader: {
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
    computed: {
        formattedItems() {
            let { items } = this;

            if (typeof this.filterItems === 'function') {
                items = items.filter(this.filterItems);
            }

            if (typeof this.mapItems === 'function') {
                items = items.map(this.mapItems);
            }

            return items;
        },
    },
    watch: {
        q(val, oldVal) {
            if (val === oldVal) return;

            if (val.length === 1 && val.length > oldVal.length) {
                return;
            }

            this.meta.offset = 0;

            this.load();
        },
    },
    created() {
        if (this.loadOnInit) {
            this.load();
        }
    },
    methods: {
        async load() {
            if (this.busy) return;

            this.busy = true;

            try {
                const response = await this.$authApi.oauth2Provider.getMany(mergeDeep({
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
        async drop(item) {
            if (this.itemBusy) return;

            this.itemBusy = true;

            const l = this.$createElement;

            await this.$bvModal.msgBoxConfirm([l('div', { class: 'alert alert-dark m-b-0' }, [
                l('p', null, [
                    'Are you sure that you want to delete the provider  ',
                    l('b', null, [item.name]),
                    '?',
                ]),
            ])], {
                size: 'md',
                buttonSize: 'xs',
            })
                .then((value) => {
                    if (value) {
                        return this.$authApi.oauth2Provider.delete(item.id)
                            .then(() => {
                                this.dropArrayItem(item);
                                return value;
                            });
                    }

                    this.itemBusy = false;

                    return value;
                }).catch(() => {
                    // ...
                });
        },
        goTo(options, resolve, reject) {
            if (options.offset === this.meta.offset) return;

            this.meta.offset = options.offset;

            this.load()
                .then(resolve)
                .catch(reject);
        },

        dropArrayItem(item) {
            const index = this.items.findIndex((el) => el.id === item.id);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        },
        addArrayItem(item) {
            this.items.push(item);
        },
        editArrayItem(item) {
            const index = this.items.findIndex((el) => el.id === item.id);
            if (index !== -1) {
                const keys = Object.keys(item);
                for (let i = 0; i < keys.length; i++) {
                    Vue.set(this.items[index], keys[i], item[keys[i]]);
                }
            }
        },
    },
    template: `
        <div>
            <slot
                v-if="withHeader"
                name="header"
            >
                <div class="d-flex flex-row mb-2">
                    <div>
                        <slot name="header-title">
                            <h6 class="mb-0">
                                <i class="fab fa-pied-piper-alt" /> Providers
                            </h6>
                        </slot>
                    </div>
                    <div class="ml-auto">
                        <slot
                            name="header-actions"
                            :load="load"
                            :busy="busy"
                        >
                            <div class="d-flex flex-row">
                                <div>
                                    <button
                                        type="button"
                                        class="btn btn-xs btn-dark"
                                        :disabled="busy"
                                        @click.prevent="load"
                                    >
                                        <i class="fas fa-sync" /> Refresh
                                    </button>
                                </div>
                            </div>
                        </slot>
                    </div>
                </div>
            </slot>
            <div
                v-if="withSearch"
                class="form-group"
            >
                <div class="input-group">
                    <label />
                    <input
                        v-model="q"
                        type="text"
                        name="q"
                        class="form-control"
                        placeholder="..."
                    >
                    <div class="input-group-append">
                        <span class="input-group-text"><i class="fa fa-search" /></span>
                    </div>
                </div>
            </div>
            <slot
                name="items"
                :items="formattedItems"
                :item-busy="itemBusy"
                :drop="drop"
                :busy="busy"
            >
                <div class="c-list">
                    <div
                        v-for="(item,key) in formattedItems"
                        :key="key"
                        class="c-list-item mb-2"
                    >
                        <div class="c-list-content align-items-center">
                            <div class="c-list-icon">
                                <i class="fa fa-group" />
                            </div>
                            <slot name="item-name">
                                <span class="mb-0">{{ item.name }}</span>
                            </slot>

                            <div class="ml-auto">
                                <slot
                                    name="item-actions"
                                    :item="item"
                                    :item-busy="itemBusy"
                                    :drop="drop"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </slot>

            <div
                v-if="!busy && formattedItems.length === 0"
                slot="no-more"
            >
                <div class="alert alert-sm alert-info">
                    No (more) providers available.
                </div>
            </div>

            <pagination
                :total="meta.total"
                :offset="meta.offset"
                :limit="meta.limit"
                @to="goTo"
            />
        </div>
    `,
});

export default OAuth2ProviderList;
