<template>
  <q-page padding class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print v-if="VIEW.show" class="q-ma-md shadow-2" style="max-width:210mm;">
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="font-size:16px">Planing & Production Control Division</span>

      <div class="row q-col-gutter-xs" >
        <div class="col-12">
          <div class="row justify-between q-col-gutter-sm" >
            <div class="col-auto self-end">
              <span class="text-h6 text-center q-pt-lg q-pl-sm">WORK ORDER</span>

              <q-markup-table class="no-shadow transparent"
                :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.line')}}</th><td>{{ rsView.line ? rsView.line.name : '-' }}</td>
                </tr>
                <tr>
                  <th class="text-left">Material of</th><td>{{ getStockistFrom(rsView.stockist_from) }}</td>
                </tr>
              </q-markup-table>
            </div>
            <div class="col-auto">
              <q-markup-table dense class="bordered no-shadow transparent" separator="cell" :dark="LAYOUT.isDark">
                <tr>
                  <th>{{$tc('label.number')}}</th>
                  <td>
                    {{rsView.number}}
                    <span v-text="'REV.'+rsView.revise_number" v-if="Boolean(rsView.revise_number)"/>
                  </td>
                </tr>
                <tr>
                  <th>{{$tc('label.date')}}</th>
                  <td>{{$app.date_format(rsView.date)}}</td>
                </tr>
                <tr>
                  <th>{{$tc('label.shift')}}</th>
                  <td>{{rsView.shift ? rsView.shift.name : '-'}}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
        </div>
        <div class="col-12">
          <q-markup-table dense class="bordered no-shadow" separator="cell" >
            <thead>
              <tr>
                <th>{{this.$tc('general.cust')}}</th>
                <th class="text-left">{{this.$tc('label.no', 1, {v:this.$tc('label.part')})}}</th>
                <th class="text-left">{{this.$tc('label.name', 1, {v:this.$tc('label.part')})}}</th>
                <th class="text-right">{{$tc('label.quantity')}}</th>
                <th>{{$tc('label.unit')}}</th>
                <th>%NG</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody v-for="(row, index) in rsView.work_order_items" :key="index">
              <q-tr>
                <q-td key="code">
                  {{row.item.customer_code}}
                </q-td>
                <q-td key="part_name" width="30%">
                  {{row.item.part_name}}
                </q-td>
                <q-td key="part_number" width="30%">
                  {{row.item.part_number}}
                </q-td>
                <q-td key="target" class="text-right">
                  {{row.target}}
                </q-td>
                <q-td key="unit_id" class="text-left">
                  {{row.unit.code}}
                </q-td>
                <q-td key="ngratio" class="text-right">
                  {{row.ngratio}}
                </q-td>
                <q-td key="quantity" class="text-right">
                  {{row.quantity}}
                </q-td>
              </q-tr>
              <q-tr v-if="show_preline">
                <q-td colspan="100%" style="padding:2px">
                  <div class="row q-col-gutter-sm">
                    <div class="col"  v-for="(itemLine, index) in row.work_order_item_lines" :key="index">
                      <q-expansion-item dense expand-separator :dark="LAYOUT.isDark"
                        :label="'Line: '+itemLine.line_id"
                        class="bordered" :header-class="LAYOUT.isDark ? `bg-blue-grey-10` : `bg-blue-grey-1`">
                        <div slot="header" class="q-item__section column q-item__section--main justify-center">
                          <span v-if="MAPINGKEY['lines']" >
                            {{MAPINGKEY['lines'][itemLine.line_id].name}}
                            <q-badge v-if="itemLine.work_production_items"
                              :label="`${totalLine(itemLine, row)} / ${totalAmount(row)}`"
                              :color="rsView.has_producted ? 'red-10' : 'primary'"/>
                          </span>
                          <span v-else>
                            {{itemLine.line_id}}
                          </span>
                        </div>
                        <q-list dense separator v-if="itemLine.work_production_items">
                          <q-item v-for="(itemProduction, key) in itemLine.work_production_items" :key="key">
                            <q-item-section>
                              <span v-if="itemProduction.work_production">
                                {{itemProduction.work_production.number}}
                                <!-- <q-badge color="blue-grey" :label="`#${itemProduction.id}`" /> -->
                              </span>
                            </q-item-section>
                            <q-item-section side>
                              <span v-if="MAPINGKEY['units'][itemProduction.unit_id]" >
                                {{$app.number_format(itemProduction.quantity)}}
                                {{MAPINGKEY['units'][itemProduction.unit_id].code}}
                              </span>
                            </q-item-section>
                          </q-item>
                          <q-item-label header v-if="!Boolean(itemLine.work_production_items.length)" class="q-pa-sm text-italic text-center">No data</q-item-label>
                        </q-list>
                      </q-expansion-item>
                    </div>
                    <div class="col" v-if="Boolean(row.item_id)">
                      <q-expansion-item dense expand-separator :dark="LAYOUT.isDark"
                        :label="$tc('general.packing')"
                        class="bordered" :header-class="LAYOUT.isDark ? `bg-blue-grey-10` : `bg-blue-grey-1`">
                        <div slot="header" class="q-item__section column q-item__section--main justify-center">
                          <span>
                            {{$tc('general.packing')}}
                            <q-badge :label="`${totalPacking(row)} / ${totalProduction(row)}`"
                              :color="rsView.has_packed ? 'red-10' : 'primary'"/>
                          </span>
                        </div>
                        <q-list dense separator>
                          <q-item v-for="(itemPacking, index) in row.packing_items" :key="index">
                            <q-item-section>
                              <span v-if="itemPacking.packing">
                                {{itemPacking.packing.number}}
                              </span>
                            </q-item-section>
                            <q-item-section  side>
                              <span v-if="MAPINGKEY['units'][itemPacking.unit_id]" >
                                {{$app.number_format(itemPacking.unit_total / (itemPacking.unit_rate || 1))}}
                                {{MAPINGKEY['units'][itemPacking.unit_id].code}}
                              </span>
                            </q-item-section>
                          </q-item>
                          <q-item-label header v-if="!Boolean(row.packing_items.length)" class="q-pa-sm text-italic text-center">No data</q-item-label>
                        </q-list>
                      </q-expansion-item>
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </tbody>
          </q-markup-table>
           <q-toggle class="print-hide" v-model="show_preline" :label="$tc('form.show',1,{v:$tc('items.preline')})"/>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
      </div>
      <div class="row q-col-gutter-xs" >
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" icon="cancel" color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn :label="$tc('form.edit')" icon="edit" color="green" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`" v-if="IS_EDITABLE"></q-btn>
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="$router.push(`${VIEW.resource.uri}/${ROUTE.params.id}/prelines`)" ></q-btn>
          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              {
                label: String($tc('form.add_new')).toUpperCase(), color:'primary', icon: 'add',
                detail: $tc('messages.process_create'),
                hidden: !$app.can('work-orders-create'),
                actions: () => $router.push(`${VIEW.resource.uri}/create`)
              },
              {
                label: 'RE-OPEN', color:'green', icon: 'refresh',
                detail: $tc('messages.process_revise'),
                hidden: !IS_REOPEN || !$app.can('work-orders-revision'),
                actions: () => setReopen()
              },
              {
                label: 'PRODUCTED', color:'green', icon: 'done_all',
                detail: $tc('messages.process_producted'),
                hidden: !IS_PRODUCTED || !$app.can('work-orders-close'),
                actions: () => setProducted()
              },
              {
                label: 'PACKED', color:'green', icon: 'done_all',
                detail: $tc('messages.process_packed'),
                hidden: !IS_PACKED || !$app.can('work-orders-close'),
                actions: () => setPacked()
              },
              {
                label: 'CLOSE', color:'green', icon: 'done_all',
                detail: $tc('messages.process_close'),
                hidden: !IS_CLOSE || !$app.can('work-orders-close'),
                actions: () => setClosing()
              },
              {
                label: String($tc('form.revision')).toUpperCase(), color:'red-8', icon: 'cached',
                detail: $tc('messages.process_revise'),
                hidden: !IS_REVISE || !$app.can('work-orders-revision'),
                actions: () => setRevision()
              },
              {
                label: 'DELETE', color:'red-10', icon: 'delete',
                detail: $tc('messages.process_delete'),
                hidden: !IS_EDITABLE || !$app.can('work-orders-delete'),
                actions: () => VIEW.delete()
              },
              {
                label: 'VOID', color:'negative', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('work-orders-void'),
                actions: () => VIEW.void(()=> init())
              },
            ]">
          </ux-btn-dropdown>
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
      show_preline: false,
      SHEET: {
        lines: {api:'/api/v1/references/lines?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
      },
      VIEW: {
        resource:{
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-orders',
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
    IS_REOPEN() {
      if (this.rsView.deleted_at) return false
      if (!['PRODUCTED', 'PACKED'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_PRODUCTED() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status != 'OPEN') return false
      return true
    },
    IS_PACKED() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status != 'PRODUCTED') return false
      return true
    },
    IS_CLOSE() {
      if (this.rsView.deleted_at) return false
      if (['CLOSED'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_REVISE() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID','REVISED'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      return true
    },

    MAPINGKEY() {
      let variables = {
        'lines': {},
        'units': {},
      }

      this.SHEET['lines'].data.map(value => { variables['lines'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })

      return variables;
    }
  },
  methods: {
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    getStockistFrom(val) {
      const stockist = [
        {value: 'FM', label: 'FRESH MATERIAL'},
        {value: 'NG', label: 'NOT GOOD',  color: 'warning' },
        {value: 'RET', label: 'REPAIR',  color: 'orange-8' },
      ]
      const v = stockist.find(x => x.value === val)
      return v ? v.label : 'N/A'

    },
    setValidation() {
      this.$router.push(`/admin/factories/work-process/${this.ROUTE.params.id}/edit`)
    },
    setRevision () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/revision`)
    },
    setView(data) {
      this.rsView =  data
    },

    totalLine (itemLine, detail) {
      const total = itemLine.work_production_items.reduce((total, item) => total += item.unit_amount, 0)
      return this.$app.number_abbreviate(Math.round(total))
    },
    totalProduction(detail) {
      return Math.round(detail.amount_process)
    },
    totalPacking (detail) {
      const total = detail.packing_items.reduce((total, item) => total += item.unit_total, 0)
      return this.$app.number_abbreviate(Math.round(total))
    },
    totalAmount (detail) {
      return Math.round(detail.unit_amount)
    },



    setReopen () {
      const submit = () => {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=reopen&nodata=true`
        this.$axios.put(url)
          .then((response) => {
            const data = response.data
            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response, 'FORM REOPEN')
          })
          .finally(()=>{
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })
      }

      this.$q.dialog({
          title: this.$tc('form.confirm', 1, {v:'RE-OPEN'}),
          message: this.$tc('messages.to_sure', 1, {v: this.$tc('messages.process_reopen')}),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
    },

    setProducted () {
      const submit = () => {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=producted&nodata=true`
        this.$axios.put(url)
          .then((response) => {
            const data = response.data
            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response, 'FORM PRODUCTED')
          })
          .finally(()=>{
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })
      }

      this.$q.dialog({
          title: this.$tc('form.confirm', 1, {v:'PRODUCTED'}),
          message: this.$tc('messages.to_sure', 1, {v: this.$tc('messages.process_producted')}),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
    },

    setPacked () {
      const submit = () => {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=packed&nodata=true`
        this.$axios.put(url)
          .then((response) => {
            const data = response.data
            this.init()
          })
          .catch(error => {
            this.$app.response.error(error.response, 'FORM PACKED')
          })
          .finally(()=>{
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })
      }

      this.$q.dialog({
          title: this.$tc('form.confirm', 1, {v:'PACKED'}),
          message: this.$tc('messages.to_sure', 1, {v: this.$tc('messages.process_packed')}),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
    },

    setClosing () {
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
