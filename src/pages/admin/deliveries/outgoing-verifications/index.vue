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
                hidden:!$app.can('outgoing-verifications-create'),
                to: `${TABLE.resource.uri}/create`
              },
              { label: $tc('general.delivery',2),
                detail:  $tc('messages.show_delivered'),
                shortcut: true,
                icon: !Boolean(FILTERABLE.fill.unvalidated.value) ? 'mdi-eye' : 'mdi-eye-off',
                closePopup: false,
                outline: true,
                actions:() => {
                  toggleShow()
                  FILTERABLE.submit()
                }
              }
            ]">


            <div class="row q-col-gutter-xs" >
              <ux-select-filter class="col-12 col-sm-6 self-start"
                v-model="FILTERABLE.fill.customer_id.value" clearable
                :label="$tc('general.customer')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                :options="CustomerOptions"
                @input="FILTERABLE.submit" />
            </div>
          </table-header>
        </template>

        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn v-if="isCanUpdate && isEditRow(rs.row)" dense flat color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`"/>
          <q-btn v-if="isCanDelete && isEditRow(rs.row)" dense flat color="light" icon="delete" @click.native="TABLE.delete(rs.row)"/>
        </q-td>

        <q-td slot="body-cell-outgoing_good_id" slot-scope="rs" :props="rs" style="width:35px">
          <span v-if="rs.row.outgoing_good" v-text=" rs.row.outgoing_good.number" />
          <q-badge v-else dense
            class="q-px-sm q-py-xs"
            label="Wait"
            color="faded" text-color="white" />
        </q-td>

        <q-td slot="body-cell-quantity" slot-scope="rs" :props="rs" style="width:35px">
          <span :class="{'text-weight-light highlight-and-fade':!rs.row.outgoing_good_id}">{{ rs.row.quantity }}</span>
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
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
      },
      FILTERABLE: {
        fill: {
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
          unvalidated: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/warehouses/outgoing-good-verifications',
          uri: '/admin/deliveries/outgoing-verifications',
        },
        columns: [
          { name: 'prefix', label:''},
          { name: 'id',  label: '#', field:'id', format:(v)=> `${v}`},
          { name: 'validated_at', label: 'Outgoing', field: 'validated_at', align: 'center', sortable: true,
             format:(v)=> v ? `${v}` : '-'
          },
          { name: 'part_name', label: this.$tc('items.part_name'), field: (v)=> v.item.part_name, align: 'left', sortable: true },
          { name: 'part_number', label: this.$tc('items.part_number'), field:(v)=> v.item.part_number, align: 'left', sortable: true },
          { name: 'quantity', label: this.$tc('label.quantity'), field: 'quantity', align: 'center', sortable: true },
          { name: 'unit_id', label: this.$tc('label.unit'), field: (v) => v.unit.code, align: 'left', sortable: true},
          { name: 'encasement', label: this.$tc('label.encasement'), field: 'encasement', align: 'left', sortable: true },
          { name: 'pre_delivery_number', label: 'No. PDO', field: 'pre_delivery_number', align: 'left', sortable: true },
        ]
      },
      rsForm: {
        quantity: null,
        unit_id: null
      }
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('outgoing-verifications-update')
    },
    isCanDelete(){
      return this.$app.can('outgoing-verifications-delete')
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    ItemOptions() {
      return (this.SHEET.items.data.map(item => ({
        label: item.code,
        detail:`[${item.part_number}] ${item.part_name}`,
        value: item.id
      })) || [])
    },
  },
  methods: {
    toggleShow() {
      this.FILTERABLE.fill.unvalidated.value = this.FILTERABLE.fill.unvalidated.value ? null : 1
    },
    isEditRow(row) {
      if (row.is_relationship) return false
      return true
    },
    cancelRow(val, initial) {
      val.quantity = initial.quantity
    },
    saveRow(val, initial) {
      let valid = true
      this.$validator.validate().then(result => {
        if (!result) {
          this.cancelRow(val, initial)
          this.$app.notify.error('Form invalid!')
          return false
        }
        this.TABLE.loading = true
        let method = 'PATCH',
            mode = 'edit',
            apiUrl = this.TABLE.resource.api + '/' + val.id

        const data = {
          quantity: val.quantity,
          // unit_id: val.unit_id
        }

        this.$axios.set(method, apiUrl, data)
        .then((response) => {
          this.$app.notify.success('Update Verify #' + response.data.id + ' success!')
        })
        .catch((error) => {
          this.cancelRow(val, initial)
          console.error(error.response)
          this.$app.response.error(error.response, 'Update Verify #' + val.id || val.item.part_name+' failed!')

        })
        .finally(()=>{
          this.TABLE.loading = false
        });
      })

      if (!valid) return false

    },
  },
}
</script>
