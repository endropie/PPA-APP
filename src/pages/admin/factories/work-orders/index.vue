<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index table-striped th-uppercase" color="primary" :dark="LAYOUT.isDark"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
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
              { label: $tc('form.add_new'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                shortcut: true,
                hidden:!$app.can('work-orders-create'),
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

            <div class="column" >
              <div class="row q-col-gutter-xs q-pb-xs">
                <ux-select-filter class="col" style="min-width:150px"
                  name="line_id"
                  v-model="FILTERABLE.fill.line_id.value" clearable
                  :label="$tc('items.preline')" stack-label
                  :placeholder="$tc('form.select', 1, {v:$tc('items.preline')})"
                  dense hide-bottom-space hide-dropdown-icon
                  standout="bg-blue-grey-5 text-white"
                  :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  :options="LineOptions"
                  @input="FILTERABLE.submit" />

                <q-select class="col" style="min-width:120px"
                  label="Stockist"
                  v-model="FILTERABLE.fill.stockist_from.value" clearable
                  :options="stockist_options" map-options emit-value
                  dense hide-bottom-space hide-dropdown-icon
                  standout="bg-blue-grey-5 text-white"
                  :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                  :dark="LAYOUT.isDark"
                  @input="FILTERABLE.submit" />

                <q-select class="col" style="min-width:120px"
                  v-model="FILTERABLE.fill.status.value" clearable
                  :options="['OPEN', 'ON:PROCESS', 'HAS:PRODUCTED', 'HAS:PACKED', 'PRODUCTED', 'PACKED', 'CLOSED']"
                  :label=" $tc('label.state')"
                  dense hide-bottom-space hide-dropdown-icon
                  standout="bg-blue-grey-5 text-white"
                  :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                  :dark="LAYOUT.isDark"
                  @input="FILTERABLE.submit" />

                <ux-date class="col" style="min-width:150px"
                  stack-label :label="$tc('label.date')"
                  v-model="FILTERABLE.fill.date.value" type="date"  clearable
                  dense hide-bottom-space
                  standout="bg-blue-grey-5 text-white"
                  :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                  :dark="LAYOUT.isDark"
                  @input="FILTERABLE.submit"/>

                <q-select class="col" style="min-width:120px"
                  map-options emit-value
                  v-model="FILTERABLE.fill.shift_id.value" clearable
                  :options="ShiftOptions"
                  :label="$tc('label.shift')"
                  dense hide-bottom-space hide-dropdown-icon
                  standout="bg-blue-grey-5 text-white"
                  :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                  :dark="LAYOUT.isDark"
                  @input="FILTERABLE.submit"/>


              </div>

            <div class="row q-col-gutter-xs q-pb-xs">
              <div class="col-12 col-sm-6">
                <div class="row q-col-gutter-xs">
                  <ux-select class="col-12 col-sm-4"
                    v-model="FILTERABLE.fill.customer_id.value" clearable
                    :label="$tc('general.customer')" stack-label
                    :placeholder="$tc('form.select', 1, {v:$tc('general.customer')})"
                    dense hide-bottom-space hide-dropdown-icon
                    standout="bg-blue-grey-5 text-white"
                    :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                    :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                    :options="CustomerOptions"
                    filter emit-value map-options
                    @input="[
                      FILTERABLE.fill.item_id.value=null,
                      SHEET.load('items', `customer_id=${FILTERABLE.fill.customer_id.value}`),
                      FILTERABLE.submit()
                    ]"/>

                  <ux-select-filter class="col-12 col-sm-8"
                    v-model="FILTERABLE.fill.item_id.value" clearable
                    :label="$tc('general.item')" stack-label
                    :placeholder="$tc('form.select', 1, {v:$tc('general.item')})"
                    dense hide-bottom-space hide-dropdown-icon
                    standout="bg-blue-grey-5 text-white"
                    :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                    :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                    :options="ItemOptions"
                    @input="FILTERABLE.submit"
                    :loading="SHEET['items'].loading"/>
                </div>
              </div>
              <q-select class="col-12 col-sm-6" autocomplete="off"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit">

                <template slot="append">
                  <q-btn flat dense icon="search" color="blue-grey-10" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>

            </div>
          </table-header>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn dense flat color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn v-if="isCanUpdate(rs.row)" dense flat color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn v-if="isCanDelete(rs.row)" dense flat color="light"  icon="delete" @click.native="TABLE.delete(rs.row)" />
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs" style="width:35px">
          <div :class="{'text-strike': Boolean(rs.row.revise_id)}">
            {{ rs.row.number }}
            <span v-text="'REV.'+rs.row.revise_number" v-if="Boolean(rs.row.revise_number)"/>
          </div>
        </q-td>

        <q-td slot="body-cell-status" slot-scope="rs" :props="rs" class="no-padding">
          <div class="column inline q-pb-xs"
            v-if="['OPEN', 'PRODUCTED', 'PACKED'].find(x => x === rs.row.status) && (rs.row.total_production > 0 || rs.row.total_packing > 0)">
            <span>
              <q-chip  dense square
                class="status-chip shadow-1 text-uppercase"
                color="blue-grey" text-color="white" >
                {{$tc('factories.production')}}
                <q-badge class="status-chip-badge"
                  :color="!Boolean(rs.row.has_producted) ? 'blue-grey-10' : 'red'">
                  <span>{{$app.number_abbreviate(rs.row.total_production)}} </span>
                  <span v-if="!Boolean(rs.row.has_producted)">&nbsp;/&nbsp;{{$app.number_abbreviate(rs.row.total_amount)}}</span>
                </q-badge>
              </q-chip>
            </span>
            <span>
              <q-chip dense square
                class="status-chip shadow-1 text-uppercase no-margin"
                color="blue-grey" text-color="white">
                {{$tc('factories.packing')}}
                <q-badge class="status-chip-badge"
                  :color="!Boolean(rs.row.has_packed) !== 'PACKED' ? 'blue-grey-10' : 'red'">
                  <span>{{$app.number_abbreviate(rs.row.total_packing)}} </span>
                  <span v-if="!Boolean(rs.row.has_packed) !== 'PACKED'">&nbsp;/&nbsp;{{$app.number_abbreviate(rs.row.total_production)}}</span>
                </q-badge>
              </q-chip>

            </span>
          </div>
          <ux-badge-status v-else :row="rs.row" class="shadow-1" />
        </q-td>

        <q-td slot="body-cell-stockist" slot-scope="rs" :props="rs" style="width:35px">
          <span v-if="rs.row.stockist_from">
            {{Object.assign({}, stockist_options.find(x => x.value === rs.row.stockist_from)).label || '-'}}
          </span>
        </q-td>

        <q-td slot="body-cell-date" slot-scope="rs" :props="rs">
          <span v-if="rs.row.date"> {{ $app.moment(rs.row.date).format('DD/MM/YY') }}</span>
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
      stockist_options: [
        {value:'FM', label:'FM [FRESH]'},
        {value:'NG', label:'NG [NOTGOOD]'},
        {value:'RET', label:'RET [REPAIR]'}
      ],
      SHEET: {
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},
        shifts: {data:[], api:'/api/v1/references/shifts?mode=all'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        items: {data:[], api:'/api/v1/common/items?mode=all', autoload: false},
      },
      FILTERABLE: {
        fill: {
          line_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          status: {
            value: null,
            type: 'string',
            transform: (value) => { return null }
          },
          stockist_from: {
            value: null,
            type: 'string',
            transform: (value) => { return null }
          },
          date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          shift_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          customer_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          item_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-orders',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},

          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'status', label: 'status', align: 'center' },
          { name: 'line_id', label: 'Line', field: (rs)=> rs.line.name , align: 'left', sortable: true },
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'center', sortable: true },
          { name: 'shift_id', label: 'Shift', field: (rs)=> rs.shift.name , align: 'center', sortable: true },
          { name: 'stockist', label: 'Stockist', align: 'left'},
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(line => ({label: line.name, value: line.id})) || [])
    },
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      return (this.SHEET.items.data.map(item => ({
        // item: item,
        label: `${item.part_name} - ${item.part_number}`,
        sublabel:`[${item.customer_code}] ${item.part_number}`,
        value: item.id
      })) || [])
    },
  },
  methods: {
    isCanUpdate(row){
      if (row.status != 'OPEN') return false
      if (row.is_relationship) return false
      return this.$app.can('work-orders-update')
    },
    isCanDelete(row){
      if (row.status != 'OPEN') return false
      if (row.is_relationship) return false
      return this.$app.can('work-orders-delete')
    },
  },
}
</script>

<style lang="stylus">
.status-chip, .status-chip-badge
  height: 20px
.status-chip
  margin :2px
.status-chip-badge
  position: relative;
  right: -6px;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
</style>
