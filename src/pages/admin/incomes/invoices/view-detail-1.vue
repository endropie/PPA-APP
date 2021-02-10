<template>
<div>
  <q-markup-table dense bordered square separator="cell" class="table-print no-shadow no-highlight">
    <thead class="text-uppercase text-center font-weight-medium">
      <q-tr style="line-height:25px" class="text-uppercase">
        <q-td width="10%">{{ $tc('label.date') }}</q-td>
        <q-td width="10%">{{ $tc('label.number') }}</q-td>
        <q-td width="30%">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-td>
        <q-td width="10%">{{ $tc('label.unit') }}</q-td>
        <q-td width="10%">{{ $tc('label.quantity') }}</q-td>
        <q-td width="30%">{{ $tc('label.encasement') }}</q-td>
      </q-tr>
    </thead>
    <tbody>
      <q-tr v-for="(row, index) in  rsView.acc_invoice_items" :key="index" :delivery-order-item-id="row.id">
        <q-td>{{row.delivery_order ? $app.moment(row.delivery_order.date).format('L') : '-'}}</q-td>
        <q-td>
          <div v-if="row.delivery_order">
            {{row.delivery_order.fullnumber}}
            <div class="text-small text-grey-7" style="line-height:normal;margin-top: -4px">{{row.delivery_order.indexed_number}}</div>
          </div>
        </q-td>
        <q-td>
          {{row.item.part_name}}
          <div class="text-small text-grey-7" style="line-height:normal;margin-top: -4px">{{row.item.part_subname}}</div>
        </q-td>
        <!-- <q-td>{{row.item.part_subname}}</q-td> -->
        <q-td class="text-center">{{row.unit.code}}</q-td>
        <q-td class="text-right">{{$app.number_format(row.quantity,0)}}</q-td>
        <q-td class="text-right">{{row.encasement}}</q-td>
      </q-tr>
    </tbody>
  </q-markup-table>
  <code>
    <!-- {{rsView.acc_invoice_items}} -->
  </code>
</div>
</template>

<script>
export default {
  name: 'ViewDetail1',
  props: {
    rsView: Object
  },
  data () {
    return {
      // data
    }
  }
}
</script>
