<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        :filter="TABLE.filter"
        selection="none"
        :selected.sync="TABLE.selected"
        row-key="id"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading">

        <!-- Table Header -->
        <template v-slot:top="props">
          <table-header hide-search
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :menus="[
              { label: $tc('form.add'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                shortcut: true,
                hidden:!$app.can('outgoing-goods-create'),
                to: `${TABLE.resource.uri}/create`
              },
              { label: $tc('label.trash'),
                detail:  $tc('messages.show_deleted'),
                shortcut: true,
                icon: Boolean(FILTERABLE.fill.withTrashed.value)? 'mdi-cup' : 'mdi-cup-off',
                closePopup: false,
                outline: true,
                actions:() => {
                  FILTERABLE.toggleTrash()
                  FILTERABLE.submit()
                }
              },
              { label: 'Fullscreen',
                icon: props.inFullscreen ? 'fullscreen_exit' : 'fullscreen',
                shortcut: true,
                actions:props.toggleFullscreen
              },
            ]">

            <div class="row q-col-gutter-xs" >
              <ux-select-filter class="col-12 col-sm-5"
                v-model="FILTERABLE.fill.customer_id.value" clearable
                :label="$tc('general.customer')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                :options="CustomerOptions"
                @input="FILTERABLE.submit" />

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.date')"
                v-model="FILTERABLE.fill.date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <q-select class="col-6 col-sm-2 "
                v-model="FILTERABLE.fill.transaction.value" clearable
                :label=" $tc('label.transaction')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                :options="CONFIG.options['transaction_mode']"
                emit-value map-options
                @input="FILTERABLE.submit" />

              <q-select class="col-6 col-sm-2 "
                v-model="FILTERABLE.fill.status.value" clearable
                :options="['OPEN', 'CLOSED']"
                :label=" $tc('label.state')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit" />

              <q-select class="col-12" autocomplete="off"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit">

                <template slot="append">
                  <q-btn flat dense icon="search" dark-percentage color="fadded" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>
          </table-header>
        </template>

            <!-- slot name syntax: body-cell-<column_name> -->
            <q-td slot="body-cell-prefix" slot-scope="rs"  style="width:35px">
              <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
            </q-td>
            <q-td slot="body-cell-number" slot-scope="rs">
              <!-- <q-btn flat dense icon="keyboard_arrow_down" color="primary" @click="rs.expand = !rs.expand" /> -->
              <q-btn-dropdown flat dense round
                :label="`${rs.row.fullnumber || rs.row.number} (${rs.row.delivery_orders.length})`"
                :color="LAYOUT.isDark ? 'white' : 'dark'"
                menu-anchor="bottom left" menu-self="top left">
                <div class="row q-pa-md" :class="{'bg-faded text-white': LAYOUT.isDark}">
                  <div class="column">
                    <div class="text-subtitle2 q-mb-md">SJ-DELIVERY ORDER</div>
                    <template v-for="(link, index) in rs.row.delivery_orders">
                      <q-btn dense class="q-ma-xs" :key="index"
                        color="secondary" icon="open_in_new"
                        :label="`${link.number} ${link.revise_number ? ' - REV.' + link.revise_number : ''}`"
                        @click="showDO(link.id)" />
                    </template>
                  </div>

                  <q-separator vertical inset class="q-mx-lg" v-show="false" />

                  <div class="column">
                  </div>
                </div>
              </q-btn-dropdown>
              <!-- <q-checkbox color="primary" v-model="rs.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" /> -->
              <ux-chip-status dense square :row="rs.row" class=" on-right shadow-0" />
            </q-td>
            <q-td slot="body-cell-created_at" slot-scope="rs" :props="rs" class="no-padding">
              <div class="column text-body">
                <span class="text-uppercase text-grey-8">
                  {{rs.row.user_by ? rs.row.user_by.name : 'undefined'}}
                </span>
                <small v-if="rs.row.created_at" class="text-grey">
                  <q-icon name="mdi-earth"></q-icon>
                  {{ $app.moment(rs.row.created_at).fromNow() }}
                </small>
              </div>
            </q-td>
      </q-table>
    </q-pull-to-refresh>
    <ux-modal-view ref="modal"  fit icon="local_shipping" :title="$tc('general.sj_delivery')" />
  </q-page>
</template>

<script>
import MixIndex from '@/mixins/mix-index.vue'

export default {
  mixins: [MixIndex],
  data () {
    return {
      SHEET: {
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'}
      },
      FILTERABLE: {
        fill: {
          customer_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          transaction: {
            value: null,
            type: 'string',
            transform: (value) => { return null }
          },
          status: {
            value: null,
            type: 'string',
            transform: (value) => { return null }
          },
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/warehouses/outgoing-goods',
          uri: '/admin/deliveries/outgoing-goods',
          delivery_orders: '/admin/deliveries/delivery-orders',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'center', sortable: true,
            format:(v)=> v ? this.$app.moment(v).format('ll') : '-', classes: 'text-uppercase'},
          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: this.$tc('general.customer'), field: (val) => val.customer.name , align: 'left', sortable: true },
          { name: 'created_at', label: this.$tc('form.create',2), field:'created_at', align: 'center' },

        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
  },
  methods: {
    showDO(id) {
      let mode = {
        path: '/admin/deliveries/delivery-orders/view',
        params: { id: id },
        meta: { mode: 'view'},
        actions: {
          // actions
        }
      }

      this.$refs.modal.show(mode);
    }
  },
}
</script>
