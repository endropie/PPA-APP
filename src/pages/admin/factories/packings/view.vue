<template>
  <q-page padding class="column content-center justify-start" :dark="LAYOUT.isDark" >
    <page-print v-if="VIEW.show" style="min-width:75%">
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark'/>
      </div>
      <span slot="header-subtitle">Planing & Production Control Division</span>

      <div class="column" >
        <div class="row justify-between q-col-gutter-sm" >
          <div class="col-stretch self-end text-no-wrap text-truncate">
            <span class="text-h6 text-uppercase">{{$tc('general.packing', 2)}}</span>
          </div>
          <div class="col-auto">
            <q-markup-table bordered dense square class="no-shadow no-highlight transparent" separator="cell" :dark="LAYOUT.isDark">
              <tbody>
                <tr>
                  <td>{{$tc('label.number')}}</td>
                  <td>{{rsView.number}}</td>
                </tr>
                <tr>
                  <td>{{$tc('label.date')}}</td>
                  <td>{{$app.date_format(rsView.date)}}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-stretch ">
            <q-markup-table dense separator="none"
              class="no-shadow no-highlight transparent"
              :dark="LAYOUT.isDark">
              <tbody>
                <tr>
                  <td class="no-padding text-weight-light">{{$tc('general.customer')}}</td>
                  <td width="35%">{{ rsView.customer.name }}</td>
                </tr>
                <tr>
                  <td class="no-padding text-weight-light">Operator</td>
                  <td width="35%">{{ rsView.operator ? rsView.operator.name : '-'}}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-auto ">
            <q-markup-table dense separator="none"
              class="no-shadow no-highlight transparent"
              :dark="LAYOUT.isDark">
              <tbody>
                <tr>
                  <td class="no-padding text-weight-light">{{$tc('label.shift')}}</td>
                  <td width="35%">{{ rsView.shift.name }}</td>
                </tr>
                <tr>
                  <td class="no-padding text-weight-light">Worktime</td>
                  <td width="35%">{{ getWorktime(rsView.worktime) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div>
          <q-markup-table bordered dense square class="no-shadow no-highlight transparent" separator="cell" :dark="LAYOUT.isDark" >
            <thead>
              <tr style="line-height:30px">
                <th class="text-left">{{this.$tc('label.name', 1, {v:this.$tc('label.part')})}}</th>
                <th>{{$tc('label.unit')}}</th>
                <th class="text-right">QTY</th>
                <th class="text-right">FAULT</th>
                <th class="text-right">{{$tc('label.summary')}}</th>
              </tr>
            </thead>
            <tbody >
              <q-tr v-if="rsView.packing_items">
                <q-td key="part" width="30%">
                  <div>{{rsView.packing_items.item.part_name}}</div>
                  <small>{{rsView.packing_items.item.part_number}}</small>
                </q-td>
                <q-td key="unit_id" class="text-left">
                  {{rsView.packing_items.unit.code}}
                </q-td>
                <q-td key="quantity" class="text-right">
                  {{rsView.packing_items.quantity}}
                </q-td>
                <q-td key="faulty" class="text-right">
                  {{FAULT_TOTALS}}
                </q-td>
                <q-td key="total" class="text-right">
                  {{rsView.packing_items.quantity+FAULT_TOTALS}}
                </q-td>
              </q-tr>
              <tr v-if="FAULT_TOTALS">
                <q-td colspan="100%">
                  <div class="q-pb-sm text-caption text-weight-light">
                    {{('FAULTY: ').toUpperCase()}}
                    <template v-for="(item_fault, index) in rsView.packing_items.packing_item_faults">
                      <q-chip :key="index" class="bg-white bordered" square dense>
                        <q-avatar color="faded" text-color="white">{{item_fault.quantity}}</q-avatar>
                        {{item_fault.fault.name}}
                      </q-chip>
                    </template>
                  </div>
                </q-td>
              </tr>
              <tr v-if="PACKING_ITEM_ORDERS.length">
                <td colspan="100%">
                  <q-list dense>
                    <q-item v-for="(order, orderIndex) in PACKING_ITEM_ORDERS" :key="orderIndex"
                      class="no-padding q-my-xs">
                      <q-item-section>
                        <q-item-label>{{order.number}}</q-item-label>
                        <q-item-label caption>
                          {{$app.moment(order.date).format('D MMMM YYYY')}}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side top class="text-caption text-weight-medium">
                        <q-item-label>{{$app.number_format(order.amount_finish / order.unit_rate)}} (FG)</q-item-label>
                        <q-item-label>{{$app.number_format(order.amount_faulty / order.unit_rate)}} (NC)</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div>
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="row q-gutter-sm print-hide">
          <q-btn :label="$tc('form.edit')" icon="edit" color="green" outline :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`" v-if="IS_EDITABLE" />
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="print()" />
          <q-space />
          <q-btn :label="$tc('form.list')" icon-right="list" color="dark" :to="`${VIEW.resource.uri}?return`"/>
          <!-- <q-btn :label="$tc('form.delete')" :icon="btnIcon('delete')" color="negative" outline @click="VIEW.delete" v-if="IS_EDITABLE"></q-btn> -->
          <ux-btn-dropdown split color="blue-grey"
            @click="IS_EDITABLE ? $router.push(`${VIEW.resource.uri}/create`) : false"
            :options="[
              { label: $tc('form.add_new'), color:'green', icon: 'add',
                detail: $tc('messages.process_create'),
                hidden: !IS_EDITABLE || !$app.can('packings-create'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/create`)
                }
              },
              { label: 'DELETE', color:'red', icon: 'delete',
                detail: $tc('messages.process_delete'),
                hidden: !IS_EDITABLE || !$app.can('packings-delete'),
                actions: () => {
                  VIEW.delete()
                }
              },
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('packings-create'),
                actions: () => {
                  VIEW.void(()=> init() )
                }
              },
          ]"/>
        </div>
      </div>
    </page-print>

    <q-inner-loading :showing="VIEW.loading">
        <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
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
        resource:{
          api: '/api/v1/factories/packings',
          uri: '/admin/factories/packings',
          params: '?mode=view'
        }
      },
      rsView: {},
      count: 0,
    }
  },
  created() {
    this.init()
  },
  computed: {
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (!this.$app.can('packings-void')) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at || this.rsView.status !== 'OPEN') return false
      if (this.rsView.hasOwnProperty('has_relationship') && Object.keys(this.rsView.has_relationship).length > 0) return false

      return true
    },
    FAULT_TOTALS() {
      if(!this.rsView.packing_items) return 0
      if(this.rsView.packing_items.packing_item_faults.length === 0) return 0
      return this.rsView.packing_items.packing_item_faults.reduce((total,item) => {
        // console.log(total)
        return total + Number(item.quantity)
      },0)
    },
    PACKING_ITEM_ORDERS() {
      if (!this.rsView.packing_items) return []
      return this.rsView.packing_items.packing_item_orders.map(x => {
        const number = x.work_order_item.work_order.number
        const date = x.work_order_item.work_order.date
        const unit_rate = this.rsView.packing_items.unit_rate
        return ({
          ...x, unit_rate, number, date
        })
      })
    }
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
    getWorktime(val) {
      const worktimes = this.CONFIG.options['worktime']
      const v = worktimes.find(x => x.value === val)
      return v ? v.label : 'N/A'

    },
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
