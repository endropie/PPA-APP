<template>
  <q-page padding class="contentable" :dark="LAYOUT.isDark" >
    <page-print v-if="VIEW.show" class="q-pa-md shadow-2" >
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark'/>
      </div>
      <span slot="header-title">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle">Planing & Production Control Division</span>

      <div class="row q-col-gutter-sm" >
        <div class="col-12">
          <div class="row justify-between q-col-gutter-sm" >
            <div class="col self-end">
                <span class="text-h6">PACKING GOODS</span>
            </div>
            <div class="col q-pb-md">
              <q-markup-table  class="no-shadow text-center super-dense" separator="cell" dense :dark="LAYOUT.isDark" bordered>
                <tr><th>{{$tc('label.number')}}</th><th>{{$tc('label.date')}}</th></tr>
                <tr>
                  <td>{{rsView.number}}</td>
                  <td>{{$app.date_format(rsView.date)}}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-markup-table class="super-dense no-shadow th-text-right" dense :dark="LAYOUT.isDark" bordered>
            <tr>
              <th class="text-weight-light">Worktime</th>
              <td width="35%">{{ getWorktime(rsView.worktime) }}</td>

              <th class="text-weight-light">{{$tc('general.customer')}}</th>
              <td width="35%">{{ rsView.customer.name }}</td>
            </tr>
            <tr>
              <th class="text-weight-light">Operator</th>
              <td width="35%">{{ rsView.operator ? rsView.operator.name : '-'}}</td>

              <th class="text-weight-light">{{$tc('label.shift')}}</th>
              <td width="35%">{{ rsView.shift.name }}</td>
            </tr>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-table ref="table" class="no-highlight no-shadow"
           dense hide-bottom bordered
            color="secondary" separator="vertical" :dark="LAYOUT.isDark"
            :data="[rsView.packing_items]"
            no-data-label = "No Production"
            :columns="[
              { name: 'work_order_item', label: 'Work Order', align: 'left', field: (v)=> v.work_order_item ? v.work_order_item.work_order.number : null},
              { name: 'code', label: this.$tc('label.code', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.code},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'quantity', label: 'QTY', align: 'right', field: (v)=> v.quantity},
              { name: 'faulty', label: 'FAULT', align: 'right', field: (v)=> this.FAULT_TOTALS},
              { name: 'total', label: $tc('label.total'), align: 'right', field: (v)=> (v.quantity+FAULT_TOTALS)},
            ]"
          >
          <template slot="bottom-row">
            <tr v-if="FAULT_TOTALS">
              <q-td colspan="100%" style="border-top-width: 1px">
                <div class="q-pb-sm text-caption text-weight-light">
                  {{('FAULTY').toUpperCase()}}
               </div>
                <div>
                  <template v-for="(item_fault, index) in rsView.packing_items.packing_item_faults">
                    <q-chip :key="index" class="bg-white bordered" square dense>
                      <q-avatar color="faded" text-color="white">{{item_fault.quantity}}</q-avatar>
                      {{item_fault.fault.name}}
                    </q-chip>
                  </template>
                </div>

              </q-td>
            </tr>
          </template>
          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
      </div>
      <div class="row q-gutter-sm print-hide">
        <q-btn :label="$tc('form.edit')" icon="edit" color="green" outline :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`" v-if="IS_EDITABLE" />
        <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="print()" />
        <q-space />
        <q-btn :label="$tc('form.list')" icon-right="list" color="dark" :to="`${VIEW.resource.uri}?return`"/>
        <!-- <q-btn :label="$tc('form.delete')" :icon="btnIcon('delete')" color="negative" outline @click="VIEW.delete" v-if="IS_EDITABLE"></q-btn> -->
        <ux-btn-dropdown split color="blue-grey" no-caps class="float-right"
          :label="IS_EDITABLE ?  $tc('form.add_new') : $tc('label.others')"
          @click="IS_EDITABLE ? $router.push(`${VIEW.resource.uri}/create`) : false"
          :options="[
            { label: $tc('form.add_new'), color:'green', icon: 'add',
              detail: $tc('messages.process_create'),
              hidden: !IS_EDITABLE || !$app.can('packings-create'),
              actions: () => {
                $router.push(`${VIEW.resource.uri}/create`)
              }
            },
            { label: 'Delete', color:'red', icon: 'delete',
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
