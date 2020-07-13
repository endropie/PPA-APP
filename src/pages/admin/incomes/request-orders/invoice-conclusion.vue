<template>
  <q-page padding class="column justify-start items-center" >
    <page-print v-if="VIEW.show">
      <div slot="header-tags" class="print-hide">
        <!-- header-tags -->
      </div>
      <div class="row justify-around q-col-gutter-y-sm" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6 q-px-xs">REKAP INVOICE #{{rsView.fullnumber || rsView.number}}</div>
              <q-markup-table class="super-dense no-shadow" separator="none" :dark="LAYOUT.isDark">
                <tbody v-if="rsView.request_order">
                  <tr>
                    <td class="text-uppercase">{{$tc('general.customer')}}</td>
                    <td v-if="rsView.request_order">{{ rsView.request_order.customer.name }}</td>
                  </tr>
                  <tr>
                    <td class="text-uppercase">{{$tc('label.transaction')}}</td>
                    <td class="text-weight-bold">{{ rsView.request_order.transaction || '-'}}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <div class="column items-start q-gutter-sm">
              <q-markup-table dense square bordered class="super-dense no-shadow " separator="cell" :dark="LAYOUT.isDark">
                <tbody v-if="rsView.request_order">
                  <tr><td>{{$tc('label.no', 1, {v:'SO'})}}</td><td>{{rsView.request_order.fullnumber || rsView.request_order.number}}</td></tr>
                  <tr><td>{{$tc('label.date')}}</td><td>{{ $app.date_format(rsView.request_order.date) }}</td></tr>
                  <tr><td>{{$tc('label.no', 1, {v:'PO'})}}</td><td>{{rsView.request_order.reference_number}}</td></tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <code>
            <!-- {{rsView.delivery_orders}} -->
          </code>
          <q-markup-table dense bordered square separator="cell" class="table-print no-shadow no-highlight"  :dark="LAYOUT.isDark">
            <thead>
            <q-tr style="line-height:25px">
              <q-th width="30%">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th width="30%">{{ $app.setting('item.subname_label') }}</q-th>
              <q-th width="10%">{{ $tc('label.unit') }}</q-th>
              <q-th width="10%">{{ $tc('label.quantity') }}</q-th>
              <q-th width="30%">{{ $tc('label.encasement') }}</q-th>
            </q-tr>
            </thead>
            <tbody :key="deliveryIndex" v-for="(delivery, deliveryIndex) in rsView.delivery_orders">
              <tr>
                <td colspan="100%">
                  <span class="text-weight-medium">
                    #SJDO {{delivery.fullnumber || delivery.number}}
                  </span>
                </td>
              </tr>
              <q-tr v-for="(row, index) in delivery.delivery_order_items" :key="index" :request-order-item-id="row.id">
                <q-td>{{row.item.part_name}}</q-td>
                <q-td>{{row.item.part_subname}}</q-td>
                <q-td class="text-center">{{row.unit.code}}</q-td>
                <q-td class="text-right">{{$app.number_format(row.quantity,0)}}</q-td>
                <q-td class="text-right">{{row.encasement}}</q-td>
              </q-tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
      <div class="row q-gutter-xs print-hide " style="padding-top:50px">
        <q-btn :label="$tc('form.back')" icon="cancel" color="dark" :class="{'full-width': $q.screen.lt.sm}" v-go-back.single />
        <q-btn :label="$tc('form.print')" icon="print" color="grey" :class="{'full-width': $q.screen.lt.sm}" @click.native="print()" />

      </div>
    </page-print>
    <q-inner-loading :showing="VIEW.loading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>

import MixView from '@/mixins/mix-view.vue'
import PagePrint from '@/components/page-print'
export default {
  mixins: [MixView],
  components: { PagePrint },
  data () {
    return {
      bottomTab: null,
      VIEW: {
        data: {},
        resource:{
          api: '/api/v1/incomes/request-orders/invoice',
          uri: '/admin/incomes/request-orders/invoice',
        }
      },
      rsView: {},
      show_delivery: false
    }
  },
  created() {
    this.init()
  },
  watch:{
      '$route' : 'init',
  },
  computed: {
    IS_CLOSE() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      return true
    },
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false

      return true
    },
    SUM_ITEMS() {
      let data = []
      this.rsView.request_order_items.map((detail) => {
        const index = data.findIndex(x => {
          return x.item_id == detail.item_id
        })
        if (index > -1) {
          data[index].unit_amount += detail.unit_amount
          data[index].amount_delivery += detail.amount_delivery
          data[index].quantity += detail.quantity
        }
        else {
          data.push(JSON.parse(JSON.stringify(detail)))
        }
      })
      return data
    }
  },
  methods: {
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    showDO(id) {
      let params = {
        path: '/admin/deliveries/delivery-orders/view',
        params: { id: id },
        meta: { mode: 'view'},
        actions: {
          // actions
        }
      }

      this.$refs.modal.show(params);
    },
    setView(data) {
      this.rsView =  data
    },
    push (row) {
      this.$q.loading.show()
      let url = `/api/v1/incomes/request-orders/invoice/${row.id}/accurate/push`
      this.$axios.post(url)
        .then((response) => {
          console.warn('OK', response)
          let msg = response.data.d[0] || ''
          return (response.data.s)
            ? this.$app.notify.success('[ACCURATE]', msg)
            : this.$app.notify.warning('[ACCURATE]', msg)
          this.init();
        })
        .catch(error => {
          this.$app.response.error(error.response || error)
        })
        .finally(()=>{
          this.$q.loading.hide()
        })
    },
    forget (row) {
      const submit = (row) => {
        this.$q.loading.show()
        let url = `/api/v1/incomes/request-orders/invoice/${row.id}/accurate/forget`
        this.$axios.post(url)
          .then((response) => {
            let msg = response.data.d[0] || ''
            if (response.data.s)  {
              this.$app.notify.success('[ACCURATE]', msg)
            }
            else this.$app.notify.warning('[ACCURATE]', msg)
            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response || error)
          })
          .finally(()=>{
            this.$q.loading.hide()
          })
      }

      this.$q.dialog({title:'DELETE CONFIRM', message: 'Are you sure to delete?', cancel: true})
      .onOk(() => {
        submit(row)
      })

    },
    setClose() {
      const submit = () => {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=close&nodata=true`
        this.$axios.put(url)
          .then((response) => {
            const data = response.data
            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response, 'FORM CLOSED')
          })
          .finally(()=>{
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })
      }

      this.$q.dialog({
        title: this.$tc('form.confirm', 1, {v:'CLOSE'}),
        message: this.$tc('messages.to_sure', 1, {v: this.$tc('messages.process_close')}),
        cancel: true,
        persistent: true
      }).onOk(() => {
        submit()
      })
    },
    setRecalculate() {
      const submit = () => {
        // this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=calculate&nodata=true`
        this.$axios.put(url)
          .then((response) => {
            const data = response.data
            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response, 'FORM CLOSED')
          })
          .finally(() => {
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })

      }

      submit()
    }
  }
}
</script>
