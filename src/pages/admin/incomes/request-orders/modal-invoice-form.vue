<template>
  <q-dialog ref="modal" persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white" style="min-width:200px">
      <q-header class="bg-blue-grey">
        <q-toolbar>
          <q-toolbar-title>Form Invoice</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-footer class="bg-blue-grey-2 text-blue-grey">
        <q-toolbar class="justify-end q-gutter-x-xs">
          <q-btn color="grey" label="Cancel" v-close-popup />
          <q-btn color="blue-grey" label="Create" @click="save" :disable="!Selected" />
        </q-toolbar>
      </q-footer>

      <q-page-container>
        <q-page padding>
          <q-list bordered separator>
            <q-item-label v-if="!Deliveries.length" header class="text-center">
              Delivery not result!
            </q-item-label>
            <q-item
              :active="Boolean(delivery.selected)"
              v-for="(delivery, index) in Deliveries" :key="index"
              >
              <q-item-section side>
                <q-checkbox v-model="delivery.selected" color="blue-grey" @click="push(invoice)"
                  :disable="delivery.status !== 'CONFIRMED'"
                />
              </q-item-section>
              <q-item-section>
                {{delivery.fullnumber || delivery.number}}
              </q-item-section>
              <q-item-section side>
                <ux-chip-status dense square :row="delivery" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>

export default {
  props: {
    deliveryOrders: Array,
    requestOrderId: Number,
  },
  data () {
    return {
      delivery_orders: []
    }
  },
  computed: {
    Deliveries () {
      return this.delivery_orders.filter(x=>!x.acc_invoice_id && x.status === 'CONFIRMED')
    },
    Selected () {
      return this.Deliveries.filter(x => x.selected).length > 0
    }
  },
  methods: {
    show () {
      this.$refs['modal'].show()
      this.delivery_orders = JSON.parse(JSON.stringify(this.deliveryOrders))
      this.delivery_orders = this.delivery_orders.map(item => ({...item, selected:false}))
    },
    hide () {
      this.$refs['modal'].hide()
    },
    save () {
      const submit = (data) => {
        this.$q.loading.show()
        let url = `/api/v1/incomes/request-orders/${this.requestOrderId}/invoice/create`
        this.$axios.post(url, data)
          .then((response) => {
            let msg = `${response.data.d[0]}`
            this.$app.notify.success('INVOICE', msg)
            this.$emit('done', true);
          })
          .catch(error => {
            console.warn(error);
            this.$app.response.error(error.response|| error, 'INVOICE')
          })
          .finally(()=>{
            this.$q.loading.hide()
          })

      }

      const data = {
        number: null,
        data: null,
        delivery_orders: this.delivery_orders.filter(x => x.selected).map(item => ({id: item.id}))
      }

      if (!data.delivery_orders.length) {
        return this.$q.dialog({
          html: true,
          message:'Delivery unset!. <br>Please choice some delivery, first.'
        });
      }
      submit(data)
    }
  }
}

</script>

