<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
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
                hidden:!$app.can('pre-deliveries-create'),
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
              <ux-select class="col-12 col-sm-6"
                v-model="FILTERABLE.fill.customer_id.value" clearable
                :label="$tc('general.customer')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                filter emit-value map-options
                :options="CustomerOptions"
                @input="FILTERABLE.submit" />

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.begin')"
                v-model="FILTERABLE.fill.begin_date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.until')"
                v-model="FILTERABLE.fill.until_date.value" type="date"  clearable
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

                <template slot="before">
                </template>
                <template slot="append">
                  <q-btn flat dense icon="search" dark-percentage color="fadded" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>
          </table-header>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <!-- <q-btn v-if="isCanUpdate && isEditable(rs.row)" dense flat color="light" icon="edit"   :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" :class="{'hidden': rs.row.is_relationship === true}" /> -->
          <!-- <q-btn v-if="isCanDelete && isEditable(rs.row)" dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)" :class="{'hidden': rs.row.is_relationship === true}" /> -->
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs" style="width:35px">
          <div :class="{'text-strike': Boolean(rs.row.revise_id)}">
            {{ rs.row.fullnumber || rs.row.number }}
          </div>
        </q-td>

        <q-td slot="body-cell-status" slot-scope="rs" class="">
          <ux-chip-status dense square :row="rs.row" />
        </q-td>

        <q-td slot="body-cell-persentase" slot-scope="rs" class="no-padding">
          <div class="column " style="min-width:180px">
            <q-linear-progress size="22px"  color="blue-grey" :value="Boolean(rs.row.summary_items) ? (rs.row.summary_verifications/rs.row.summary_items) : 0">
              <div class="absolute-full flex flex-center">
                <q-badge :color="Boolean(rs.row.status === 'CLOSED') ? 'red' : 'blue-grey-10'" text-color="white" class="text-weight-medium q-pt-xs">
                  <span>{{$app.number_abbreviate(rs.row.summary_verifications)}} </span>
                  <span>&nbsp;/&nbsp;{{$app.number_abbreviate(rs.row.summary_items)}}</span>
                </q-badge>
              </div>
            </q-linear-progress>
          </div>
        </q-td>

        <q-td slot="body-cell-transaction" slot-scope="rs"  class="no-padding" style="width:35px">
          <q-chip dense square
            color="blue-grey" text-color="white"
            :label="rs.row.transaction"
            :outline="rs.row.transaction === 'RETURN'" />
        </q-td>

        <q-td slot="body-cell-customer_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.customer"> {{ rs.row.customer.name }}</span>
          <span v-else>- undifined -</span>
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
          begin_date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          until_date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          }
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/deliveries/pre-deliveries',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'date', label: this.$tc('label.date'), field: 'date', format:(v) => this.$app.moment(v).format('DD/MM/YYYY'), align: 'center', sortable: true},
          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'status', label: '', field: 'status', align: 'left'},
          { name: 'persentase', label: '(%)', align: 'center'},
          { name: 'customer_id', label: this.$tc('general.customer'), field: 'customer_id', align: 'left', sortable: true },
          { name: 'transaction', label: this.$tc('label.transaction'), field: 'transaction', align: 'center', sortable: true },
          { name: 'created_at', label: this.$tc('form.create',2), field: 'created_at', align: 'center', sortable: true },
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('items-update')
    },
    isCanDelete(){
      return this.$app.can('items-delete')
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
  },
  methods: {
    isEditable(row) {
      // if(row.order_mode === 'NONE') return false
      if(row.status !== 'OPEN') return false
      if(row.is_relationship) return false
      return true
    }
  },
}
</script>
