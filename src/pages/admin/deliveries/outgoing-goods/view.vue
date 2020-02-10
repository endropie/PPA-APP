<template>
  <q-page padding class="column justify-start items-center q-gutter-sm" >
    <page-print v-if="VIEW.show" class="" >
      <div slot="header-title">
        OUTGOING GOOD
      </div>

      <div class="row q-col-gutter-sm" >
        <div class="col-12">
          <div class="row justify-between ">
            <div class="col profile">
              <div class="text-weight-medium uppercase">To: {{rsView.customer_name}}</div>
              <address class="text-weight-light">{{rsView.customer_address}}</address>
              <div class="text-weight-light ">Phone: {{rsView.customer_phone}}</div>
              <div class="text-weight-light" v-if="rsView.customer_note">{{$tc('label.no',1, {v:'DN'})}}: {{rsView.customer_note}}</div>
            </div>
            <div class="col-auto info">
              <q-markup-table dense bordered separator="cell"
                :dark="LAYOUT.isDark" class="bg-transparent no-shadow no-highlight"
              >
                <tbody>
                  <tr>
                    <td class="text-weight-light">No</td>
                    <td>
                      {{ rsView.fullnumber || rsView.number }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-weight-light">{{$tc('label.date')}}</td>
                    <td>{{$app.date_format(rsView.date)}}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12" >
          <q-markup-table dense bordered separator="cell"
            :dark="LAYOUT.isDark" class="bg-transparent no-shadow"
          >
            <thead>
            <q-tr  class="text-uppercase" style="line-height:30px">
              <q-th width="20%">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <!-- <q-th width="20%">{{ $tc('label.number', 1, {v: $tc('label.part')}) }}</q-th> -->
              <q-th width="20%" class="text-right">{{ $tc('label.quantity') }}</q-th>
              <q-th width="15%">{{ $tc('label.unit') }}</q-th>
              <q-th width="30%">{{ $tc('label.encasement') }}</q-th>
            </q-tr>
            </thead>
            <tbody>
            <q-tr v-for="(row, index) in rsView.outgoing_good_items" :key="index">
              <q-td>
                <div style="line-height:normal">
                  <span>{{row.item.part_name}}</span><br/>
                  <small>No. {{row.item.part_number}}</small>
                </div>
              </q-td>
              <!-- <q-td>{{row.item.part_number}}</q-td> -->
              <q-td class="text-right">{{$app.number_format(row.quantity)}}</q-td>
              <q-td>{{row.unit.name}}</q-td>
              <q-td>{{row.encasement}}</q-td>
            </q-tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12 text-weight-light text-italic" v-if="rsView.plan_begin_date || rsView.plan_until_date">
            Delivery plan from {{ rsView.plan_begin_date ? $app.moment(rsView.plan_begin_date).format('DD/MM/YYYY') : '' }}
            until then {{ rsView.plan_until_date ? $app.moment(rsView.plan_until_date).format('DD/MM/YYYY') : '' }}
        </div>
        <div class="col-12">
          <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
          <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.cancel')" :icon="btnIcon('cancel')"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.print')" :icon="btnIcon('print')" color="grey" @click.native="print()" />

          <ux-btn-dropdown color="blue-grey" class="float-right"
            :options="[
              { label: $tc('form.add_new'), color:'green', icon: 'add',
                hidden: !$app.can('outgoing-goods-create'),
                detail: $tc('messages.process_create'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/create`)
                }
              },
              // NO DELETE BUTTON //
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('outgoing-goods-void'),
                actions: () => {
                  VIEW.void(()=> init() )
                }
              },
            ]"/>
        </div>
      </div>
    </page-print>
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
          api: '/api/v1/warehouses/outgoing-goods',
          uri: '/admin/deliveries/outgoing-goods',
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
      if (this.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.revise_id) return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
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
    getBaseUnit(detail) {
      if(detail.unit_rate == 1) return ''
      return `(${detail.unit_amount} ${detail.item.unit.code})`
    },
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
