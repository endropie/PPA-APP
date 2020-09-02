<template>
  <q-page padding class="column justify-start items-center" >
    <page-print v-if="VIEW.show">
      <div slot="header-tags" class="print-hide">
        <!-- header-tags -->
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' :color-options="{INVOICED:'green'}" />
      </div>
      <div class="row justify-around q-col-gutter-y-sm" >
        <div class="col-12">
          <div class="row justify justify-between q-gutter-sm" >
            <div class="sel q-pt-lg q-px-xs">
              <div class="text-h6 ">REKAP INVOICE #{{rsView.fullnumber || rsView.number}}</div>
              <div class="text-uppercase row full-width">
                <span v-if="rsView.customer">[{{rsView.customer.code}}] {{rsView.customer.name}}</span>
              </div>
            </div>
            <div class="content-end self-end q-pt-lg">
              <div class="text-uppercase">
                <span v-if="rsView.invoiced_number">No. Invoice {{rsView.invoiced_number}}</span>
              </div>
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
          <q-markup-table dense bordered square separator="cell" class="table-print no-shadow no-highlight"  :dark="LAYOUT.isDark">
            <thead>
            <q-tr style="line-height:25px" class="text-uppercase">
              <q-th width="30%">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th width="30%">{{ $app.setting('item.subname_label') }}</q-th>
              <q-th width="10%">{{ $tc('label.unit') }}</q-th>
              <q-th width="10%">{{ $tc('label.quantity') }}</q-th>
              <q-th width="30%">{{ $tc('label.encasement') }}</q-th>
            </q-tr>
            </thead>
            <tbody :key="deliveryIndex" v-for="(delivery, deliveryIndex) in rsView.deliveries">
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
        <q-space />
        <q-btn :label="$tc('form.confirm')" icon="done_all" color="positive" :class="{'full-width': $q.screen.lt.sm}" @click="setConfirmed()" v-if="rsView.status == 'OPEN'" />
        <q-btn :label="$tc('form.delete')" icon="delete" color="negative" :class="{'full-width': $q.screen.lt.sm}" @click="VIEW.delete" />
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
        resource: {
          api: '/api/v1/incomes/invoices',
          uri: '/admin/incomes/invoices'
        }
      },
      rsView: {},
      show_delivery: false
    }
  },
  created () {
    this.init()
  },
  watch: {
    '$route': 'init'
  },
  computed: {
    IS_CLOSE () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      return true
    },
    IS_VOID () {
      if (this.IS_EDITABLE) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false

      return true
    },
    SUM_ITEMS () {
      let data = []
      this.rsView.request_order_items.map((detail) => {
        const index = data.findIndex(x => {
          return x.item_id === detail.item_id
        })
        if (index > -1) {
          data[index].unit_amount += detail.unit_amount
          data[index].amount_delivery += detail.amount_delivery
          data[index].quantity += detail.quantity
        } else {
          data.push(JSON.parse(JSON.stringify(detail)))
        }
      })
      return data
    }
  },
  methods: {
    init () {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    showDO (id) {
      let params = {
        path: '/admin/deliveries/delivery-orders/view',
        params: { id: id },
        meta: { mode: 'view' },
        actions: {
          // actions
        }
      }

      this.$refs.modal.show(params)
    },
    setView (data) {
      this.rsView = data
    },
    setConfirmed () {
      const submit = () => {
        this.$q.loading.show()
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}/confirmed`

        this.$axios.post(url)
          .then((response) => {
            console.warn('OK', response)
            let msg = response.data.message[0] || ''
            if (response.data.success) this.$app.notify.success('[ACCURATE]', msg)
            else this.$app.notify.warning('[ACCURATE]', msg)

            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response || error)
          })
          .finally(() => {
            this.$q.loading.hide()
          })
      }

      submit()
    }
  }
}
</script>
