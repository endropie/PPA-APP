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
            title="DELIVERY OUTSTANDING"
            :TABLE.sync="TABLE"
          >

            <div class="row q-col-gutter-xs">
              <ux-date
                v-model="FILTERABLE.fill.delivery_outstanding.value"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                @input="FILTERABLE.submit"
              />
              <ux-select
                filter map-options emit-value
                class="col-12 col-sm-3"
                v-model="FILTERABLE.fill.customer_id.value" clearable
                :label="$tc('general.customer')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :options="CustomerOptions"
                @input="FILTERABLE.submit"
              />

              <q-select class="col" autocomplete="off"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
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
            <!-- <q-btn dense flat color="grey" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`"/> -->
            <!-- <q-btn v-if="isCanUpdate" dense flat color="grey" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`"/>
            <q-btn v-if="isCanDelete" dense flat color="grey" icon="delete" @click.native="TABLE.delete(rs.row)" />
            <q-btn v-if="isCanPush" dense flat color="light" icon="mdi-database-export" title="upload"
              @click.native="push(rs.row)"
            /> -->
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

          <div v-else-if="rs.col.name === 'WO'">
            <span v-if="Boolean(rs.value !== 0)">
              {{rs.value}}
              <q-tooltip>
                FM({{$app.number_format(rs.row.totals['WOFM'])}})
                NC({{$app.number_format(rs.row.totals['WONC'])}})
                NCR({{$app.number_format(rs.row.totals['WONCR'])}})
              </q-tooltip>
            </span>
            <span v-else v-text="'-'" />
          </div>

          <div v-else-if="rs.col.name === 'PDO'">
            <span v-if="Boolean(rs.value !== 0)">
              {{rs.value}}
              <q-tooltip>
                REGULER({{$app.number_format(rs.row.totals['PDO.REG'])}})
                RETURN({{$app.number_format(rs.row.totals['PDO.RET'])}})
              </q-tooltip>
            </span>
            <span v-else v-text="'-'" />
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
      SHEET: {
        customers: { data: [], api: '/api/v1/incomes/customers?mode=all' }
      },
      FILTERABLE: {
        fill: {
          // date: {
          //   value: this.$app.moment().format('YYY-MM-DD'),
          //   type: 'string',
          //   transform: (value) => { return '' }
          // },
          enable: {
            value: '',
            type: 'string',
            transform: (value) => { return '' }
          },
          customer_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          delivery_outstanding: {
            value: this.$app.moment().format('YYYY-MM-DD'),
            type: 'string',
            transform: (value) => { return '' }
          }
        }
      },
      TABLE: {
        mode: 'index',
        resource: {
          api: '/api/v1/common/items',
          uri: '/admin/deliveries/delivery-outstanding'
        },
        columns: [
          { name: 'prefix', label: '', align: 'left', required: true },

          { name: 'customer', label: this.$tc('general.cust') + '.', field: 'customer_id', align: 'left', sortable: true },
          { name: 'part_name', label: this.$tc('items.part_name'), field: 'part_name', align: 'left', sortable: true },
          { name: 'part_subname', label: this.$app.setting('item.subname_label'), field: 'part_subname', align: 'left', sortable: true },
          { name: 'amount_delivery_task_reguler', label: `${this.$tc('general.delivery_task', 2)}(REG)`, field: 'amount_delivery_task_reguler' },
          { name: 'amount_delivery_task_return', label: `${this.$tc('general.delivery_task', 2)}(RET)`, field: 'amount_delivery_task_return' },
          { name: 'amount_delivery_verify', label: this.$tc('general.delivery_verify', 2), field: 'amount_delivery_verify' },
          { name: 'amount_delivery_load_reguler', label: `${this.$tc('general.delivery_load', 2)}(REG)`, field: 'amount_delivery_load_reguler' },
          { name: 'amount_delivery_load_return', label: `${this.$tc('general.delivery_load', 2)}(RET)`, field: 'amount_delivery_load_return' }
        ],
        hideColumns: ['code']
      }
    }
  },
  created () {
    if (!this.$app.can('items-price')) {
      this.TABLE.visibleColumns = this.TABLE.columns.filter(x => {
        return ['price', 'price_dm', 'price_brl'].indexOf(x.name) < 0
      }).map(x => {
        return x.name
      })
    }

    this.INDEX.load()
  },
  computed: {
    isCanPush () {
      return this.$app.can('items-push')
    },
    isCanUpdate () {
      return this.$app.can('items-update')
    },
    isCanDelete () {
      return this.$app.can('items-delete')
    },
    CustomerOptions () {
      return (this.SHEET.customers.data.map(item => ({ label: `${item.code} - ${item.name}`, value: item.id, rowdata: item })) || [])
    },
    MAPINGKEY () {
      let variables = {
        'itemstocks': {}
      }
      // this.SHEET['itemstocks'].data.map(value => { variables['itemstocks'][value.id] = value.totals })

      return variables
    }
  },
  methods: {
    totalStock (id, label) {
      if (!this.MAPINGKEY['itemstocks'][id]) return 0
      return Number(this.MAPINGKEY['itemstocks'][id][label])
    },
    push (row) {
      let url = `${this.TABLE.resource.api}/${row.id}/accurate/push`
      console.warn('pusher', url)
      this.$q.loading.show()
      this.$axios.post(url)
        .then((response) => {
          let msg = response.data.d[0] || ''
          return (response.data.s)
            ? this.$app.notify.success('ACCURATE PUSH', msg)
            : this.$app.notify.warning('ACCURATE PUSH', msg)
        }).catch((error) => {
          this.$app.response.error(error.response || error)
        }).finally(() => {
          this.$q.loading.hide()
        })
    },
    pushAll () {
      let url = `${this.TABLE.resource.api}/all/accurate/push`
      this.$q.loading.show()
      this.$axios.post(url)
        .then((response) => {
          console.warn('OK', response.data.filter(x => x.s === true).length)
          let arrMsg = []
          if (response.data.filter(x => x.s === true).length) {
            arrMsg.push(response.data.filter(x => x.s === true).length + ' success')
          }
          if (response.data.filter(x => x.s === false).length) {
            arrMsg.push(response.data.filter(x => x.s === false).length + ' failed')
          }
          this.$app.notify.info('ACCURATE SYNC', String(arrMsg.join(',') + ' to customer sync.'))
        }).catch((error) => {
          this.$app.response.error(error.response || error)
        }).finally(() => {
          this.$q.loading.hide()
        })
    }
  }
}
</script>
