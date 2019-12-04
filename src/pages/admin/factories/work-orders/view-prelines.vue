<template>
  <q-page class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <div style="max-width:210mm;">
      <div class="print-hide q-my-md full-width">
        <!-- {{printer}} -->
        <q-select class="fit"
          :hint="`${$tc('general.line')}`"
          v-model="printer"
          dense outlined multiple use-chips
          :options="rsView.MAPLINES.map(x => ({label: x.name, value:x.id}))"
          map-options emit-value
          :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
          v-if="rsView.MAPLINES">
          <q-btn slot="after" icon="print" color="grey" @click.native="print()" />
        </q-select>
      </div>
      <template v-for="(group , index) in rsView.MAPLINES">
      <page-print class=" shadow-2 q-mb-md" :key="index" v-show="printer.indexOf(group.id) > -1">
        <div slot="header-tags" class="print-hide">
          <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
        </div>
        <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
        <span slot="header-subtitle" style="font-size:16px">Planing & Production Control Division</span>
        <div slot="footer" class="text-center fixed-bottom print-only">== PPA ==</div>

        <div class="row q-col-gutter-xs" >
          <div class="col-12">
            <div class="row justify-between q-col-gutter-sm" >
              <div class="col-auto self-end">
                <span class="text-h6 text-center q-pt-lg q-pl-sm">WORK ORDER</span>

                <q-markup-table dense class="no-shadow transparent" :dark="LAYOUT.isDark">
                  <tr>
                    <th class="text-left">{{$tc('general.line')}}</th><td>{{ group.name }}</td>
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
                    <td>{{rsView.shift.name}}</td>
                  </tr>
                </q-markup-table>
              </div>
            </div>
          </div>
          <div class="col-12">
            <q-table class="bordered no-highlight no-shadow transparent"
              color="secondary"
              separator="vertical"
              hide-bottom :dark="LAYOUT.isDark"
              :data="group.work_order_items"
              :rows-per-page-options ="[0]"
              :pagination="{ rowsPerPage: 0}"
              no-data-label = "No Production"
              :columns="[
                { name: 'cust', label: $tc('general.cust'), align: 'left', field: (v, i)=> v.item.customer_code},
                { name: 'part_name', label: $tc('label.name', 1, {v: $tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
                { name: 'part_number', label: $tc('label.no', 1, {v: $tc('label.part')}), align: 'left', field: (v)=> v.item.part_number},
                { name: 'target', label: $tc('label.quantity'), align: 'right', field: (v)=> v.target},
                { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
                { name: 'ngratio', label: 'NG Ratio', align: 'right', format:(v)=> v ? `${Number(v)}%` : '-', field: (v)=> v.ngratio},
                { name: 'total', label: 'Total', align: 'right', format:(v)=> `${Math.round(v)}`, field: (v)=> Number(v.quantity)},
              ]"
            />
          </div>
          <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
          </div>
        </div>
      </page-print>
      </template>

    </div>
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
          api: '/api/v1/factories/work-orders',
          uri: '/admin/factories/work-orders',
          params: '?mode=prelines'
        }
      },
      rsView: {},
      printer: [],
    }
  },
  created() {
    this.init()
  },
  computed: {
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      if (this.rsView.hasOwnProperty('has_relationship') && this.rsView.has_relationship.length > 0) return false

      return true
    },
  },
  methods: {
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    print() {
      window.print()
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
    setView(data) {

      const setDetail = (id) => {
      return data.work_order_items.find((x) => x.id === id) || {}
      }
      let GROUP = Object.assign({})
      data.work_order_item_lines.map((rs) => {
        if(!GROUP[rs.line_id]) GROUP[rs.line_id] = {...rs.line, work_order_items:[] }

        GROUP[rs.line_id].work_order_items.push(setDetail(rs.work_order_item_id))
        // for (let z = 0; z < 40; z++) {
        //   GROUP[rs.line_id].work_order_items.push({...setDetail(rs.work_order_item_id), id:String(rs.work_order_item_id).concat(z)})
        // }
      })
      this.rsView =  {...data, MAPLINES: Object.values(GROUP)}
      this.printer = [...Object.values(GROUP)].map(x => x.id)
    }
  }
}
</script>
