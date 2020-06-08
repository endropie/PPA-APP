<template>
  <q-page padding class="column justify-start items-center" >
    <page-print v-if="VIEW.show">
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
        <span v-if="!rsView.deleted_at && Number(rsView.total_unit_delivery) > 0 && ['OPEN','CLOSED'].some(x => x === rsView.status)">
            <q-chip square outline icon="local_shipping"
              label="DELIVERED"
              color="orange-10"
              v-if="Math.round(rsView.total_unit_amount) === Math.round(rsView.total_unit_delivery)" >
            </q-chip>
            <q-chip square outline icon="local_shipping"
              label="SEMI-DELIVERY"
              color="orange"
              v-else>
              <q-tooltip>
                TOTAL:{{Math.round(rsView.total_unit_amount) }}
                DELIVERED:{{ Math.round(rsView.total_unit_delivery)}}
              </q-tooltip>
            </q-chip>
        </span>
      </div>
      <div class="row justify-around q-col-gutter-y-sm" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6 q-px-xs">SALES ORDER</div>
              <q-markup-table class="super-dense no-shadow" separator="none" :dark="LAYOUT.isDark">
                <tbody>
                  <tr>
                    <td class="text-uppercase">{{$tc('general.customer')}}</td>
                    <td>{{ rsView.customer.name }}</td>
                  </tr>
                  <tr>
                    <td class="text-uppercase">{{$tc('label.transaction')}}</td>
                    <td class="text-weight-bold">{{ rsView.transaction || '-'}}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <div class="column items-start q-gutter-sm">
              <q-markup-table dense square bordered class="super-dense no-shadow " separator="cell" :dark="LAYOUT.isDark">
                <tbody>
                  <tr><td>{{$tc('label.number')}}</td><td>{{rsView.fullnumber || rsView.number}}</td></tr>
                  <tr><td>{{$tc('label.date')}}</td><td>{{ $app.date_format(rsView.date) }}</td></tr>
                  <tr><td>{{$tc('label.no', 1, {v:'PO'})}}</td><td>{{rsView.reference_number}}</td></tr>
                </tbody>
              </q-markup-table>
              <q-checkbox  dense left-label v-model="show_summary" label="SUMMARY ACCUMULATE" class="print-hide" v-if="rsView.order_mode == 'ACCUMULATE'" />
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-markup-table dense bordered square separator="cell" class="table-print no-shadow no-highlight"  :dark="LAYOUT.isDark">
            <thead>
            <q-tr style="line-height:25px">
              <q-th width="30%">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th width="30%">{{ $tc('label.number', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th width="10%">{{ $tc('label.unit') }}</q-th>
              <q-th width="10%">{{ $tc('label.quantity') }}</q-th>
              <q-th width="10%">{{ $tc('label.send') }}</q-th>
              <q-th width="10%">{{ $tc('label.balance') }}</q-th>
            </q-tr>
            </thead>
            <tbody>
              <template v-if="IS_ITEM_SUMMARY">
                <q-tr v-for="(row, index) in SUM_ITEMS" :key="index">
                  <q-td>{{row.item.part_name}}</q-td>
                  <q-td>{{row.item.part_number}}</q-td>
                  <q-td class="text-center">{{row.item.unit.code}}</q-td>
                  <q-td class="text-right">{{$app.number_format(row.unit_amount,0)}}</q-td>
                  <q-td class="text-right">{{$app.number_format(row.amount_delivery,0)}}</q-td>
                  <q-td class="text-right">
                    <div v-if="Math.round(row.unit_amount - row.amount_delivery) > 0">
                      {{$app.number_format((row.unit_amount - row.amount_delivery),0)}}
                    </div>
                    <div v-else class="text-center">
                      -
                    </div>
                  </q-td>
                </q-tr>
              </template>
              <template v-else>
                <q-tr v-for="(row, index) in rsView.request_order_items" :key="index" :request-order-item-id="row.id">
                  <q-td>{{row.item.part_name}}</q-td>
                  <q-td>{{row.item.part_number}}</q-td>
                  <q-td class="text-center">{{row.unit.code}}</q-td>
                  <q-td class="text-right">{{$app.number_format(row.quantity,0)}}</q-td>
                  <q-td class="text-right">{{$app.number_format(row.amount_delivery/(row.unit_rate||1),0)}}</q-td>
                  <q-td class="text-right">
                    <div v-if="Math.round(row.quantity - row.amount_delivery/(row.unit_rate||1)) > 0">
                      {{$app.number_format((row.quantity - row.amount_delivery/(row.unit_rate||1)),0)}}
                    </div>
                    <div v-else class="text-center">
                      -
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12 text-weight-light text-italic" v-if="rsView.begin_date || rsView.until_date">
            From date {{ rsView.begin_date ? $app.moment(rsView.begin_date).format('DD/MM/YYYY') : '' }}
            until then {{ rsView.until_date ? $app.moment(rsView.until_date).format('DD/MM/YYYY') : '' }}
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12">
          <q-btn dense flat color="secondary" class="print-hide float-right"
            :label="$tc('form.show',1, {v:$tc('general.sj_delivery')})"
            v-show="!show_delivery" @click="show_delivery = true"/>
          <q-list v-show="show_delivery" bordered :dark="LAYOUT.isDark" class="main-box">
            <q-item>
              <q-item-section>{{$tc('general.sj_delivery', 2)}} ({{rsView.delivery_orders.length}})</q-item-section>
              <q-item-section side>
                <q-btn flat dense icon="clear" @click="show_delivery = !show_delivery"/>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-ripple @click="showDO(link.id)" :dark="LAYOUT.isDark"
              v-for="(link, index) in rsView.delivery_orders" :key="index">
              <q-item-section>
                {{link.fullnumber || link.number}}
              </q-item-section>
              <q-item-section side>
                <ux-chip-status dense square :row="link" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div class="row q-gutter-xs print-hide " style="padding-top:50px">
        <q-btn :label="$tc('form.back')" icon="cancel" color="dark" :class="{'full-width': $q.screen.lt.sm}" :to="`${VIEW.resource.uri}?return`" />
        <q-btn :label="$tc('form.edit')" icon="edit" color="positive" :class="{'full-width': $q.screen.lt.sm}" v-if="IS_EDITABLE" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"  />
        <q-btn :label="$tc('form.print')" icon="print" color="grey" :class="{'full-width': $q.screen.lt.sm}" @click.native="print()" />
        <q-space />
        <ux-btn-dropdown  color="blue-grey" :class="{'full-width': $q.screen.lt.sm}"
          :options="[
           { label: $tc('form.add_new'), color:'green', icon: 'add',
              hidden: !$app.can('request-orders-create'),
              detail: $tc('messages.process_create'),
              actions: () => {
                $router.push(`${VIEW.resource.uri}/create`)
              }
            },
            { label: 'CLOSED', color:'red-10', icon: 'lock',
              hidden: !IS_CLOSE || !$app.can('request-orders-close'),
              detail: $tc('messages.process_close'),
              actions: () => {
                setClose()
              }
            },
            { label: 'DELETE', color:'red', icon: 'delete',
              hidden: !IS_EDITABLE,
              detail: $tc('messages.process_delete'),
              actions: () => {
                VIEW.delete()
              }
            },
            { label: 'VOID', color:'red', icon: 'block', hidden: !IS_VOID,
              detail: $tc('messages.process_void'),
              actions: () => {
                VIEW.void(()=> init() )
              }
            },
            { label: 'RE-CALCULATE', color:'warning', icon: 'refresh',
              hidden: !$app.can('request-orders-create'),
              // detail: $tc('messages.process_void'),
              actions: () => {
                setRecalculate()
              }
            }
          ]">
        </ux-btn-dropdown>

        <q-btn-dropdown v-show="false" dense round color="blue-grey" :class="{'full-width': $q.screen.lt.sm}"
          :label="`DELIVERY (${rsView.delivery_orders.length})`"
          menu-anchor="bottom left" menu-self="top left" v-if="rsView.delivery_orders.length">
          <q-list :dark="LAYOUT.isDark" class="main-box">
            <q-item clickable v-ripple @click="showDO(link.id)" :dark="LAYOUT.isDark"
              v-for="(link, index) in rsView.delivery_orders" :key="index">
              <q-item-section>
                {{link.fullnumber || link.number}}
              </q-item-section>
              <q-item-section side>
                <ux-badge-status :row="link" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </page-print>
    <q-inner-loading :showing="VIEW.loading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
    <ux-modal-view ref="modal" fit icon="local_shipping" :title="$tc('general.sj_delivery')" :dark="LAYOUT.isDark" />
  </q-page>
</template>

<script>

import MixView from '@/mixins/mix-view.vue'
import PagePrint from '@/components/page-print'
import PagePrintBreak from '@/components/page-print-break'

export default {
  mixins: [MixView],
  components: { PagePrint, PagePrintBreak },
  data () {
    return {
      VIEW: {
        data: {},
        resource:{
          api: '/api/v1/incomes/request-orders',
          uri: '/admin/incomes/request-orders',
        }
      },
      rsView: {},
      show_delivery: false,
      show_summary: true
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
      // if (this.rsView.order_mode !== 'PO') return false
      // if (Object.keys(this.rsView.has_relationship || {}).length > 0) {
      //   if (!Boolean(this.rsView.is_estimate)) return false
      // }

      return true
    },
    IS_ITEM_SUMMARY() {
      if (this.rsView.order_mode !== 'ACCUMULATE') return false
      return this.show_summary
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
          .finally(()=>{
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
