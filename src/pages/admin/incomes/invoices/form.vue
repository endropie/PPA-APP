<template>
  <q-page padding>
    <q-card inline class="main-box" v-if="rsForm">
      <q-card-section class="q-x-md">
        <div class="row q-col-gutter-x-sm">
        <ux-select
          class="col-12 col-sm-6"
          name="customer_id"
          :label="$tc('general.customer')" stack-label
          v-model="rsForm.customer_id"
          filter clearable
          source="/api/v1/incomes/customers?mode=all"
          option-value="id"
          :option-label="(e) => `[${e.code}] ${e.name}`"
          map-options
          v-validate="'required'"
          :error="errors.has('customer_id')"
          :error-message="errors.first('customer_id')"
          @input="setCustomer"
          :hint="rsForm.order_mode ? `[${rsForm.order_mode}]` : undefined"
        />

        <ux-date
          class="col-12 col-sm-6"
          name="date"
          :label="$tc('label.date')" stack-label
          v-model="rsForm.date"
          v-validate="'required'"
          :error="errors.has('date')"
          :error-message="errors.first('date')"
        />
        </div>
      </q-card-section>
      <q-card-section v-if="rsForm.order_mode">
        <q-table title="SJ Delivery"
          v-if="rsForm.order_mode !== 'NONE'"
          flat dense bordered separator='cell'
          style="max-height: calc( 100vh - 100px )"
          :data="deliveryTable.data"
          :columns="deliveryTable.columns"
          :pagination.sync="deliveryTable.pagination"
           @request="deliveryTable.request"
        >
          <q-td slot="body-cell-action" slot-scope="rs" :props="rs" class="q-pa-xs" auto-width>
            <q-checkbox left-label
              :disable="rs.row.status !== 'CONFIRMED'"
              :value="Boolean(rsForm.delivery_orders.find(e => e.id === rs.row.id))"
              @input="!Boolean(rsForm.delivery_orders.find(e => e.id === rs.row.id))
                ? rsForm.delivery_orders.push(rs.row)
                : rsForm.delivery_orders = rsForm.delivery_orders.filter(e => e.id !== rs.row.id)
              "
            />

            <!-- <q-btn dense outline size="sm" color="blue-grey" icon="check"
              @click="rsForm.delivery_orders.push(rs.row)"
              v-if="!rsForm.delivery_orders.find(e => e.id === rs.row.id)"
            />

            <q-btn dense outline size="sm" color="negative" icon="clear"
              @click="rsForm.delivery_orders = rsForm.delivery_orders.filter(e => e.id !== rs.row.id)"
              v-if="rsForm.delivery_orders.find(e => e.id === rs.row.id)"
            /> -->
          </q-td>
        </q-table>
        <q-table title="Sales Order"
          v-else
          flat dense bordered separator='cell'
          style="max-height: calc( 100vh - 100px )"
          :data="orderTable.data"
          :columns="orderTable.columns"
          :pagination.sync="orderTable.pagination"
           @request="orderTable.request"
        >
          <q-td slot="body-cell-action" slot-scope="rs" :props="rs" class="q-pa-xs" auto-width>
            <q-checkbox left-label
              :disable="rs.row.status !== 'CLOSED'"
              :value="Boolean(rsForm.request_orders.find(e => e.id === rs.row.id))"
              @input="!Boolean(rsForm.request_orders.find(e => e.id === rs.row.id))
                ? rsForm.request_orders.push(rs.row)
                : rsForm.request_orders = rsForm.request_orders.filter(e => e.id !== rs.row.id)
              "
            />
          </q-td>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="grey-5" :label="$tc('form.reset')" @click="init()" />
        <q-btn color="positive" :label="$tc('form.save')" @click="save()" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'
export default {
  mixins: [MixForm],
  data () {
    return {
      FORM: {
        resource: {
          api: '/api/v1/incomes/invoices',
          uri: '/admin/incomes/invoices'
        }
      },
      rsForm: null,
      setDefault: () => ({
        number: null,
        date: this.$app.moment().format('YYYY-MM-DD'),
        customer_id: null,
        order_mode: null,
        delivery_orders: [],
        request_orders: []
      }),
      deliveryTable: {
        api: '/api/v1/incomes/delivery-orders',
        data: [],
        loding: false,
        columns: [
          { name: 'number', label: 'number', field: 'number', align: 'left'},
          { name: 'indexed_number', label: 'index', field: 'indexed_number', align: 'left'},
          { name: 'status', label: '', field: 'status', align: 'center' },
          { name: 'action', label: '', align: 'center' },
        ],
        pagination: {
          // sortBy: 'desc',
          // descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0,
        },
        request: this.loadDelivery
      },
      orderTable: {
        api: '/api/v1/incomes/request-orders',
        data: [],
        loding: false,
        columns: [
          { name: 'number', label: 'number', field: 'number', align: 'left'},
          { name: 'reference_number', label: 'Reference', field: 'reference_number', align: 'left'},
          { name: 'status', label: '', field: 'status', align: 'center' },
          { name: 'action', label: '', align: 'center' },
        ],
        pagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0,
        },
        request: this.loadOrder
      }
    }
  },
  created(){
    // Component Page Created!
    this.init()
  },
  computed: {
    //
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        this.rsForm = Object.assign(this.rsForm || this.setDefault(), data)
        this.loadDelivery()
      })
    },
    setCustomer (v) {
      this.rsForm.customer_id = v ? v.id : null
      this.rsForm.order_mode = v ? v.order_mode : null
      this.deliveryTable.data = []
      this.rsForm.request_orders= []
      this.rsForm.delivery_orders = []
      if (this.rsForm.order_mode !== 'NONE') this.loadDelivery()
      if (this.rsForm.order_mode === 'NONE') this.loadOrder()
    },
    loadDelivery (request = Object.assign({})) {
      let parameter = []
      if (!this.rsForm.customer_id) return console.warn('CUSTOMER INPUT FIRST!')
      parameter.push(`customer_id=${this.rsForm.customer_id}`)
      const paginate = request.pagination || {}
      const limit = paginate.rowsPerPage || this.deliveryTable.pagination.rowsPerPage
      const page = Number(paginate.rowsPerPage) === Number(this.deliveryTable.pagination.rowsPerPage)
                 ? paginate.page : 1

      let api = `${this.deliveryTable.api}?status=CONFIRMED&invoicing=true&limit=${limit}&page=${page}&${parameter.join('&')}`
      console.warn('api', api)
      this.deliveryTable.loading = true
      this.$axios.get(api)
        .then((response) => {
          this.deliveryTable.data = []
          if (response.data.data) {
            response.data.data.map(e => this.deliveryTable.data.push(e))
          }
          this.deliveryTable.pagination.page = response.data.current_page
          this.deliveryTable.pagination.rowsPerPage = response.data.per_page
          this.deliveryTable.pagination.rowsNumber = response.data.total
        }).catch((error) => {
          console.error('NO', error)
        }).finally(() => {
          this.deliveryTable.loading = false
        })
    },
    loadOrder (request = Object.assign({})) {
      let parameter = []
      if (!this.rsForm.customer_id) return console.warn('CUSTOMER INPUT FIRST!')
      parameter.push(`customer_id=${this.rsForm.customer_id}`)
      const paginate = request.pagination || {}
      const limit = paginate.rowsPerPage || this.orderTable.pagination.rowsPerPage
      const page = Number(paginate.rowsPerPage) === Number(this.orderTable.pagination.rowsPerPage)
                 ? paginate.page : 1

      let api = `${this.orderTable.api}?invoicing=true&limit=${limit}&page=${page}&${parameter.join('&')}`
      console.warn('api', api)
      this.orderTable.loading = true
      this.$axios.get(api)
        .then((response) => {
          this.orderTable.data = []
          if (response.data.data) {
            response.data.data.map(e => this.orderTable.data.push(e))
          }
          this.orderTable.pagination.page = response.data.current_page
          this.orderTable.pagination.rowsPerPage = response.data.per_page
          this.orderTable.pagination.rowsNumber = response.data.total
        }).catch((error) => {
          console.error('NO', error)
        }).finally(() => {
          this.orderTable.loading = false
        })
    },
    save () {
      const submit = () => {
        const data = this.rsForm
        this.$q.loading.show()
        this.$axios.post(this.FORM.resource.api, data)
          .then((response) => {
            let message = `${response.data.message || response.messageText}`
            this.FORM.response.success({message:message})
            this.FORM.toView(response.data.id)
          })
          .catch(error => {
            this.FORM.response.fields(error.response)
            this.FORM.response.error(error.response || error, 'Submit')
          })
          .finally(()=> {
            this.$q.loading.hide()
          })

      }


      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          })
        }

        if (this.rsForm.order_mode === 'NONE' && !this.rsForm.request_orders.length) {
          return this.$q.dialog({
            html: true,
            message:'SO/PO not selected!. <br>Please pick some sales orders, first.'
          })
        }

        if (this.rsForm.order_mode !== 'NONE' && !this.rsForm.delivery_orders.length) {
          return this.$q.dialog({
            html: true,
            message:'SJDO not selected!. <br>Please pick some delivery, first.'
          })
        }

        submit()
      })

    }
  }
}

</script>

