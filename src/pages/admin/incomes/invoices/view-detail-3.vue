<template>
<div>
  <div v-for="(cols, indexCols) in COLUMNS" :key="indexCols">
    <q-markup-table  dense bordered square separator="cell" class="table-print no-shadow no-highlight">
      <!-- <template v-for="(cols, indexCols) in COLUMNS"> -->
        <thead :key="`thead-${indexCols}`" class="text-uppercase text-center font-weight-medium">
          <q-tr class="text-uppercase" style="line-height:15px; page-break-after: always;">
            <q-td width="10%" align="center" rowspan="3" colspan="4" class="no-padding">{{$tc('label.name', 0, {v:$tc('label.part')}) }}</q-td>
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" width="10%" :delivery-order-id="DELIVERY_ORDERS[col].id" style="padding:2px 6px;">
              <span v-if="DELIVERY_ORDERS[col].delivery_order"> {{DELIVERY_ORDERS[col].delivery_order.fullnumber}} </span>
            </q-td>
            <q-td width="50%" class="no-padding" style="border-bottom:none;"></q-td>
          </q-tr>

          <q-tr class="text-uppercase" style="line-height:15px">
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" width="10%" :delivery-order-id="DELIVERY_ORDERS[col].id" class="no-padding" >
              <span v-if="DELIVERY_ORDERS[col].delivery_order"> PO: {{ DELIVERY_ORDERS[col].delivery_order.request_reference_number || -'' }} </span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-bottom:none; border-top:none"></q-td>
          </q-tr>
          <q-tr class="text-uppercase" style="line-height:15px">
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" width="10%" :delivery-order-id="DELIVERY_ORDERS[col].id">
              <span v-if="DELIVERY_ORDERS[col].delivery_order"> LPB: {{ DELIVERY_ORDERS[col].delivery_order.confirmed_number || '-' }} </span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-bottom:none; border-top:none"></q-td>
          </q-tr>
          <q-tr class="text-uppercase" style="line-height:15px">
            <q-td>CODE</q-td>
            <q-td>{{ $tc('label.part') }}</q-td>
            <q-td>{{ $tc('label.no', 1, {v:$tc('label.part')}) }}</q-td>
            <q-td>{{ $tc('label.price') }}</q-td>
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" width="10%" :delivery-order-id="DELIVERY_ORDERS[col].id">
              <span v-if="DELIVERY_ORDERS[col].delivery_order"> {{$app.moment(DELIVERY_ORDERS[col].delivery_order.date).format('L')}} </span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-bottom:none; border-top:none"></q-td>
          </q-tr>
        </thead>

        <!-- LINE -->
        <q-tr>
          <q-td colspan="2" style="height:0px; padding:0;"> </q-td>
          <q-td  style="height:2px; padding:0;" v-for="(col, indexCol) in cols" :key="indexCol" width="10%"></q-td>
        </q-tr>

        <!-- <tbody v-for="(loop, ii) in [1,2,3,4,5,6,7,8,9,10]" :key="`tbody-${ii}-${indexCols}`"> -->
        <tbody :key="`tbody-${indexCols}`">
          <q-tr v-for="(row, rowIndex) in ROWS" :key="rowIndex">
            <q-td>
              <div v-if="row.item">
                <span>{{row.item.code}}</span>
              </div>
            </q-td>
            <q-td>
              <div v-if="row.item">
                <span>{{row.item.part_name}}</span>
              </div>
            </q-td>
            <q-td>
              <div v-if="row.item">
                <span>[{{row.item.part_subname}}]</span>
              </div>
            </q-td>
            <q-td>
              <div v-if="row.item">
                <span>{{$app.number_format(row.item.price)}}</span>
              </div>
            </q-td>
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" class="text-center">
              <span v-if="getDataCell (row.data, col)">{{ $app.number_format(getDataCell (row.data, col)) }}</span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-bottom:none; border-top:none"></q-td>
          </q-tr>
        </tbody>

        <tbody v-if="false" :key="`tfoot-${indexCols}`">
          <q-tr>
            <q-td colspan="3" class="text-right"> Jumlah</q-td>
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" class="text-center">
              <span class="text-medium">{{$app.number_format(DELIVERY_ORDERS[col].data.reduce((t, rs) => { return t + rs.quantity }, 0),0)}}</span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-top:none"></q-td>
          </q-tr>
        </tbody>
        <q-tr>
          <q-td colspan="100%" style="height:0px; padding:0; border-bottom:0;"> </q-td>
        </q-tr>
      <!-- </template> -->
    </q-markup-table>
    <div class="q-mb-md" style="page-break-after: always;"></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ViewDetail2',
  props: {
    rsView: Object,
    colx: { type: Number, required: true }
  },
  data () {
    return {
      // data
    }
  },
  computed: {
    ROWS () {
      if (!this.rsView.acc_invoice_items.length) return []
      return this.rsView.acc_invoice_items.reduce((vr, x) => {
        vr[x['item_id']] = (vr[x['item_id']] || { id: x['item_id'], data: [], item: x['item'] })
        vr[x['item_id']].data.push(x)
        return vr
      }, {})
    },
    COLUMNS () {
      // const columns = Object.keys(this.DELIVERY_ORDERS).concat(Object.keys(this.DELIVERY_ORDERS), Object.keys(this.DELIVERY_ORDERS), Object.keys(this.DELIVERY_ORDERS), Object.keys(this.DELIVERY_ORDERS))
      const columns = Object.keys(this.DELIVERY_ORDERS)
      if (!columns.length) return []

      const page = this.colx > 0 ? this.colx : columns.length
      return columns.slice()
        .sort((a, b) => new Date(this.DELIVERY_ORDERS[a].delivery_order.date) - new Date(this.DELIVERY_ORDERS[b].delivery_order.date))
        .reduce((rv, x, i) => {
          (rv[Math.floor((i) / page)] = rv[Math.floor((i) / page)] || []).push(x)
          return rv
        }, [])
    },
    DELIVERY_ORDERS () {
      if (!this.rsView.acc_invoice_items.length) return []

      return this.rsView.acc_invoice_items
        .reduce((rv, x) => {
          rv[x['delivery_order_id']] = (rv[x['delivery_order_id']] || { id: x['delivery_order_id'], data: [], delivery_order: x['delivery_order'] })
          rv[x['delivery_order_id']].data.push(x)
          return rv
        }, {})
    }
  },
  methods: {
    getDataCell (data, col) {
      return data.filter(x => x.delivery_order_id === Number(col)).reduce((t, rs) => { return t + rs.quantity }, 0)
    }
  }
}
</script>
