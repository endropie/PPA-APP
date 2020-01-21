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
        <template v-slot:top>
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
              }
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

        <template slot="body" slot-scope="rs">
          <tr rs="rs">
            <!-- slot name syntax: body-cell-<column_name> -->
            <q-td slot="body-cell-prefix"  style="width:35px">
              <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
            </q-td>
            <q-td>
              <!-- <q-btn flat dense icon="keyboard_arrow_down" color="primary" @click="rs.expand = !rs.expand" /> -->
              <q-btn-dropdown flat dense round color="primary"
                menu-anchor="bottom left" menu-self="top left">
                <div class="row q-pa-md">
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
              {{ rs.row.number }}
              <!-- <q-checkbox color="primary" v-model="rs.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" /> -->
              <ux-badge-status :row="rs.row" class=" on-right shadow-0" />
            </q-td>
            <q-td>
              <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
              <span v-else>- undifined -</span>
            </q-td>
            <q-td>
              <span v-if="rs.row.operator"> {{ rs.row.operator.name }}</span>
              <span v-else>- undifined -</span>
            </q-td>
            <q-td>
              {{ rs.row.date }}
            </q-td>
            <q-td>
              {{ rs.row.due_date }}
            </q-td>
          </tr>

          <q-tr v-show="rs.expand" :rs="rs">
            <q-td>&nbsp;</q-td>
            <q-td colspan="100%" class="group">
              <template v-for="(link, index) in rs.row.delivery_orders">
                <q-btn dense color="secondary" icon="open_in_new" :to="TABLE.resource.delivery_orders +'/'+link.id" :key="index">
                  {{link.number}} {{ link.revise_number ? ' - REV.' + link.revise_number : '' }}
                </q-btn>
              </template>


            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-pull-to-refresh>

    <ux-modal-view ref="modal" />
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

          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: this.$tc('general.customer'), field: 'customer_id', align: 'left', sortable: true },
          // { name: 'vehicle_id', label: 'Vehicle', field: 'vehicle_id', align: 'left', sortable: true },
          { name: 'operator_id', label: 'Operator', field: 'operator_id', align: 'left', sortable: true },
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'left', sortable: true},
          { name: 'due_date', label: this.$tc('label.due_date'), field: 'due_date', align: 'left', sortable: true},

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
