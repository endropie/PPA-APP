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
            </q-chip>
        </span>
      </div>
      <div class="row justify-around q-col-gutter-y-sm" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6">REQUEST ORDER</div>
              <q-markup-table class="super-dense no-shadow" :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.customer')}}</th>
                  <td>{{ rsView.customer.name }}</td>
                </tr>
                <tr>
                  <th class="text-left">{{$tc('label.reference')}} PO/SJ</th>
                  <td>{{ rsView.reference_number || '-'}}</td>
                </tr>
              </q-markup-table>
            </div>
            <div>
              <q-markup-table dense bordered class="super-dense no-shadow" separator="cell" :dark="LAYOUT.isDark">
                <tr>
                  <th>{{$tc('label.number')}}</th>
                  <td>
                    {{rsView.number}}
                    <span v-text="'REV.'+rsView.revise_number" v-if="Boolean(rsView.revise_number)"/>
                  </td>
                </tr>
                <tr>
                  <th>{{$tc('label.date')}}</th>
                  <td>{{ $app.date_format(rsView.date) }}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-markup-table dense bordered separator="cell" class="no-shadow no-highlight"  :dark="LAYOUT.isDark">
            <thead>
            <q-tr style="line-height:30px">
              <q-th>{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $tc('label.number', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $tc('label.unit') }}</q-th>
              <q-th>{{ $tc('label.quantity') }}</q-th>
              <q-th>{{ $tc('general.delivery') }}</q-th>
            </q-tr>
            </thead>
            <tbody>
            <q-tr v-for="(row, index) in rsView.request_order_items" :key="index">
              <q-td>{{row.item.part_name}}</q-td>
              <q-td>{{row.item.part_number}}</q-td>
              <q-td class="text-center">{{row.unit.name}}</q-td>
              <q-td class="text-right">{{$app.number_format(row.quantity)}}</q-td>
              <q-td class="text-right">{{$app.number_format(row.amount_delivery)}}</q-td>
            </q-tr>
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
            { label: 'CLOSED', color:'green', icon: 'done_all', hidden: !IS_CLOSE || !$app.can('request-orders-close'),
              detail: $tc('messages.process_close'),
              actions: () => {
                setClosed()
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
          <!-- <div class="row q-pa-md">
            <div class="column">
              <div class="text-subtitle2 q-mb-md">SJ-DELIVERY ORDER</div>
              <template v-for="(link, index) in rsView.delivery_orders">
                <q-btn dense class="q-ma-xs" :key="index"
                  color="secondary" icon="open_in_new"
                  :label="`${link.number} ${link.revise_number ? ' - REV.' + link.revise_number : ''}`"
                  @click="showDO(link.id)" />
              </template>
            </div>

            <q-separator vertical inset class="q-mx-lg" v-show="false" />

            <div class="column">
            </div>
          </div> -->
        </q-btn-dropdown>
      </div>
    </page-print>
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
      // if (this.rsView.order_mode === 'NONE') return false
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
      if (this.rsView.revise_id) return false
      if (this.rsView.order_mode === 'NONE') return false
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) {
        if (!Boolean(this.rsView.is_estimate)) return false
      }

      return true
    },
  },
  methods: {
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    btnIcon (str) {
      return !this.$q.screen.lt.sm ? str : ''
    },
    print() {
      window.print()
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
    setClosed() {
      const submit = () => {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=closed&nodata=true`
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
    }
  }
}
</script>
