<template>
  <q-page padding class="page-index">
    <q-pull-to-refresh @refresh="TABLE.refresh">
      <q-table ref="table"
        class="table-index table-striped table-sticky-column th-uppercase"
        :dense="$q.screen.lt.md"
        :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        :visible-columns="COLUMNS"
        :filter="TABLE.filter"
        selection="none"
        :selected.sync="TABLE.selected"
        row-key="code"
        :rows-per-page-options="[10,25,50,100,200,500,0]"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading">

        <template v-slot:top>
          <table-header
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :menus="[
              { shortcut: true,
                label: $tc('form.add'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                hidden: !$app.can('items-create'),
                to: `${TABLE.resource.uri}/create`
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

              <q-select class="col-12 col-sm-6"
                dense use-chips hide-dropdown-icon
                placeholder="Stock"
                :options="['FM','WO','WIP','FG','NC','NCR']"
                v-model="FILTERABLE.fill.has_stocks.value" multiple
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit">
                <span slot="prepend" class="text-caption" v-text="'STOCK'" />
                <q-btn slot="append"
                  dense rounded color="light" size="sm"
                  label="ALL"
                  v-if="!FILTERABLE.fill.has_stocks.value || FILTERABLE.fill.has_stocks.value.length < 6 "
                  @click="[FILTERABLE.fill.has_stocks.value = ['FM','WO','WIP','FG','NC','NCR'], FILTERABLE.submit()]" >
                  <q-tooltip>{{$tc('label.all')}}</q-tooltip>
                </q-btn>
              </q-select>

              <q-select class="col-12" autocomplete="off"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit" >

                <template slot="append">
                  <q-btn flat dense icon="search" dark-percentage color="fadded" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>

          </table-header>
        </template>

        <q-td slot="body-cell" slot-scope="rs" :props="rs">
          <div v-if="rs.col.name === 'prefix'">
            <q-btn v-if="isCanUpdate" dense flat color="grey" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`"/>
            <q-btn v-if="isCanDelete" dense flat color="grey" icon="delete" @click.native="TABLE.delete(rs.row)" />
          </div>

          <div v-else-if="rs.col.name === 'customer'">
            <span v-if="rs.row.customer" v-text="rs.row.customer.code"/>
            <span v-else v-text="'-'" />
          </div>

          <div v-else-if="rs.col.name === 'brand'">
            <span v-if="rs.row.brand" v-text="rs.row.brand.name"/>
            <span v-else v-text="'-'" />
          </div>

          <div v-else-if="rs.col.name === 'specification'">
            <span v-if="rs.row.specification" v-text="rs.row.specification.name"/>
            <span v-else v-text="'-'" />
          </div>

          <div v-else-if="rs.col.name === 'enable'">
            <q-avatar size="24px" class="shadow-1"
            :color="rs.row.enable ? 'green' : 'red'" text-color="white"
            :icon="rs.row.enable ? 'mdi-check-outline' : 'block'" />
          </div>

          <div v-else>{{rs.value}}</div>

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
      stockAll: false,
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
          has_stocks: {
            value: null,
            type: 'array',
            transform: (value) => { return String(value).split(',') }
          },
        }
      },
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/common/items',
          uri: '/admin/common/items',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left', required: true,},

          { name: 'customer', label: this.$tc('general.cust')+'.', field: 'customer_id', align: 'left', sortable: true},
          { name: 'part_number', label: this.$tc('label.part')+' #', field: 'part_number', align: 'left', sortable: true },
          { name: 'part_name', label: this.$tc('items.part_name'), field: 'part_name', align: 'left', sortable: true },
          // { name: 'enable', label:this.$tc('label.active'), field: 'enable', align: 'center', sortable: true },

          // Item stocks
          { name: 'ALL', label: 'ALL', sortable: true, field: (item)=> Number(item.totals['*']), format:(v) => Boolean(v) ? this.$app.number_format(v) : '-', style:'text-weight-medium'},
          { name: 'FM', label: 'FM', sortable: true, field: (item)=> item.totals['FM'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-' },
          { name: 'WO', label: 'WO', sortable: true, field: (item)=> item.totals['WO'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'WIP', label: 'WIP', sortable: true, field: (item)=> item.totals['WIP'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'FG', label: 'FG', sortable: true, field: (item)=> item.totals['FG'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'NC', label: 'NC', sortable: true, field: (item)=> item.totals['NC'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'NCR', label: 'NCR', sortable: true, field: (item)=> item.totals['NCR'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'NG', label: 'NG', sortable: true, field: (item)=> item.totals['NG'], format:(v) => Boolean(v) ? this.$app.number_format(v) : '-'},

          { name: 'PDOREG', label: 'PDO [REG]', sortable: true, align: 'center', clases:'bg-faded', hidden:  (!process.env.DEV && !this.$route.query.DEV),
            field: (item) => item.totals['PDO.REG'], format: (v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'PDORET', label: 'PDO [RET]', sortable: true, align: 'center', clases:'bg-faded', hidden:  (!process.env.DEV && !this.$route.query.DEV),
            field: (item) => item.totals['PDO.RET'], format: (v) => Boolean(v) ? this.$app.number_format(v) : '-'},
          { name: 'VDO', label: 'VDO', sortable: true, hidden:  (!process.env.DEV && !this.$route.query.DEV),
            field: (item)=> item.totals['VDO'], format: (v) => Boolean(v) ? this.$app.number_format(v) : '-'},

          { name: 'price', label: 'Price', field: 'price', sortable: true, hidden: !this.$app.can('items.price') },
          { name: 'price_dm', label: 'Price in DM', field: 'price', sortable: true, hidden: !this.$app.can('items.price') },
          { name: 'price_brl', label: 'Price in BRL', field: 'price', sortable: true, hidden: !this.$app.can('items.price') },
          // { name: 'brand', label: this.$tc('general.brand'), field: 'bran_id', align: 'left', sortable: true},
          // { name: 'specification', label: 'Specification', field: 'specification_id', align: 'left', sortable: true},
          // { name: 'part_alias', label: 'Part alias', field: 'part_alias', sortable: true },
          { name: 'code', field: 'code', label: 'Intern code', align: 'left', sortable: true, required: true, },

        ],
        hideColumns: ['code']
      }
    }
  },
  created () {
    if (!this.$app.can('items-price')) {
      this.TABLE.visibleColumns = this.TABLE.columns.filter(x => {
        return ['price', 'price_dm', 'price_brl'].indexOf(x.name) < 0
      }).map(x=>{
        return x.name
      })
    }

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
      return (this.SHEET.customers.data.map(item => ({label: `${item.code} - ${item.name}`, value: item.id, rowdata:item})) || [])
    },
    MAPINGKEY() {
      let variables = {
        'itemstocks': {},
      }
      // this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value.totals })

      return variables;
    }
  },
  methods: {
    totalStock(id, label) {
      if(!this.MAPINGKEY['itemstocks'][id]) return 0
      return Number(this.MAPINGKEY['itemstocks'][id][label])
    }
  },
}
</script>
