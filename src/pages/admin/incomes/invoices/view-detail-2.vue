<template>
<div>
    <div v-for="(cols, indexCols) in COLUMNS" :key="indexCols">
    <q-markup-table bordered dense square separator="cell" class="table-print no-shadow no-highlight">

      <!-- HEADER -->
      <thead :key="`thead-${indexCols}`">
        <q-tr class="text-uppercase" style="line-height:25px; page-break-after: always;">
          <q-th rowspan="2" width="10%">{{ $tc('label.date') }}</q-th>
          <q-th rowspan="2" width="10%">{{ $tc('label.number') }}</q-th>
          <q-th v-for="(col, indexCol) in cols" :key="indexCol" width="10%">
            {{ITEMS[col].item.part_name}}
          </q-th>
          <q-td auto-width class="no-padding" style="border-bottom:none;"></q-td>
        </q-tr>

        <q-tr style="line-height:25px" class="text-uppercase">
          <q-th v-for="(col, indexCol) in cols" :key="indexCol" width="10%">
            {{ITEMS[col].item.part_subname === ITEMS[col].item.part_name ? ITEMS[col].item.code : ITEMS[col].item.part_subname }}
          </q-th>
          <q-td auto-width class="no-padding" style="border-bottom:none; border-top:none"></q-td>
        </q-tr>
      </thead>

      <!-- LINE -->
      <q-tr>
        <q-td colspan="2" style="height:0px; padding:0;"> </q-td>
        <q-td v-for="(col, indexCol) in cols" :key="indexCol" style="height:2px; padding:0;" width="10%"></q-td>
      </q-tr>

        <!-- BODY -->
        <!-- <tbody v-for="(loop, ii) in [1,2,3,4,5,6,7,8,9,10]" :key="`tbody-${ii}-${indexCols}`"> -->
        <tbody :key="`tbody-${indexCols}`">
          <q-tr v-for="(row, index) in ROWS" :key="index" :delivery-order-item-id="row.id">
            <q-td>{{row.delivery_order ? $app.moment(row.delivery_order.date).format('L') : '-'}}</q-td>
            <q-td>
              <div v-if="row.delivery_order">
                {{row.delivery_order.fullnumber}}
                <div class="text-small text-grey-7" style="line-height:normal;margin-top: -4px">{{row.delivery_order.indexed_number}}</div>
              </div>
            </q-td>
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" class="text-center">
              <div v-if="getDataCell(row.data, col)">
                {{$app.number_format(getDataCell(row.data, col), 0)}}
              </div>
              <span v-if="Number(row.item_id) === Number(col)">{{$app.number_format(row.quantity,0)}}</span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-bottom:none; border-top:none"></q-td>
          </q-tr>
        </tbody>
        <!-- FOOTER -->
        <tbody :key="`tfoot-${indexCols}`">
          <q-tr>
            <q-td colspan="2" class="text-right"> Jumlah</q-td>
            <q-td v-for="(col, indexCol) in cols" :key="indexCol" class="text-center">
              <span class="text-medium">{{$app.number_format(ITEMS[col].data.reduce((t, rs) => { return t + rs.quantity }, 0),0)}}</span>
            </q-td>
            <q-td auto-width class="no-padding" style="border-top:none"></q-td>
          </q-tr>
        </tbody>
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
    COLUMNS () {
      // const columns = Object.keys(this.ITEMS).concat(Object.keys(this.ITEMS), Object.keys(this.ITEMS), Object.keys(this.ITEMS), Object.keys(this.ITEMS))
      const columns = Object.keys(this.ITEMS)
      if (!columns.length) return []
      const page = this.colx > 0 ? this.colx : columns.length
      return columns.reduce((vc, x, i) => {
        (vc[Math.floor((i) / page)] = vc[Math.floor((i) / page)] || []).push(x)
        return vc
      }, [])
    },
    ROWS () {
      if (!this.rsView.acc_invoice_items.length) return []
      const rows = this.rsView.acc_invoice_items
        .reduce((vr, x) => {
          vr[x['delivery_order_id']] = (vr[x['delivery_order_id']] || { id: x['delivery_order_id'], data: [], delivery_order: x['delivery_order'] })
          vr[x['delivery_order_id']].data.push(x)
          return vr
        }, {})

      return Object.values(rows).sort((a, b) => new Date(a.delivery_order.date) - new Date(b.delivery_order.date))
    },
    ITEMS () {
      if (!this.rsView.acc_invoice_items.length) return []
      return this.rsView.acc_invoice_items.reduce((rv, x) => {
        rv[x['item_id']] = (rv[x['item_id']] || { id: x['item_id'], data: [], item: x['item'] })
        rv[x['item_id']].data.push(x)
        return rv
      }, {})
    }
  },
  methods: {
    getDataCell (data, col) {
      return data.filter(x => x.item_id === Number(col)).reduce((t, rs) => { return t + rs.quantity }, 0)
    }
  }
}
</script>
