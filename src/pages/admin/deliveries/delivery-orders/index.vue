<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        subtitle="cskc"
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
              <ux-select-filter class="col-12 col-sm-6"
                v-model="FILTERABLE.fill.customer_id.value" clearable
                :label="$tc('general.customer')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                :options="CustomerOptions"
                @input="FILTERABLE.submit" />

              <q-select class="col-4 col-sm-2 "
                v-model="FILTERABLE.fill.status.value" clearable
                :options="['OPEN', 'CONFIRMED']"
                :label=" $tc('label.state')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit" />

              <ux-date class="col-8 col-sm-4"
                stack-label :label="$tc('label.date')"
                v-model="FILTERABLE.fill.date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

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

        <template slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
        </template>

        <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs">
          <span v-if="rs.row.number" class="text-weight-medium" :class="{'text-strike text-faded': rs.row.revise_id}">
            {{ rs.row.number }} {{ rs.row.revise_number ? ' - REV.' + rs.row.revise_number : '' }}</span>
          <span v-else>- undifined -</span>
        </q-td>

        <q-td slot="body-cell-status" slot-scope="rs" :props="rs" class="no-padding">
          <ux-badge-status :row="rs.row" class="shadow-1"/>
        </q-td>

        <q-td slot="body-cell-operator_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.operator"> {{ rs.row.operator.name }}</span>
          <span v-else>- undifined -</span>
        </q-td>
      </q-table>
    </q-pull-to-refresh>


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
          status: {
            value: 'OPEN',
            transform: (value) => { return null }
          }
        }
      },
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/deliveries/delivery-orders',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},

          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'customer_id', label: this.$tc('general.customer'), field: 'customer_id', align: 'left', sortable: true },
          { name: 'status', label: '', field: 'status', align: 'left', sortable: true },
          { name: 'operator_id', label: 'Operator', field: 'operator_id', align: 'left', sortable: true },
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'left', sortable: true},
          { name: 'due_date', label: this.$tc('label.due_date'), field: 'due_date', align: 'left', sortable: true},

        ],
        rowData:[],
        resData:[],
        pagination : {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10 // specifying this determines pagination is server-side,
        },
        filter: '',
        selected: [
          // initial selection => { id: 5 }
        ],
        loading: false,
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
    isEditable(row) {
      if(row.status !== 'OPEN') return false
      if(row.is_relationship) return false
      return true
    }
  },
}
</script>
