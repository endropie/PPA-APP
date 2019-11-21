<template>
  <q-page padding class="row justify-center"  style="min-width:210mm;">
    <page-print v-if="VIEW.show" :class="{'header-minimaze':$q.screen.lt.sm}" style="max-width:210mm;">
      <div slot="header-title">PPA - Pre Delivery </div>
      <template slot="header-tags">
        <q-chip square outline color="blue-grey" text-color="white"
          label="RETURN" v-if="rsView.transaction === 'RETURN'" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </template>

      <div class="row justify-between q-col-gutter-y-sm" >
        <div class="profile">

        </div>
        <div class="info">
          <q-markup-table class="bordered super-dense th-text-left no-shadow" separator="cell" dense>
            <tr>
              <th class="text-weight-light">No</th>
              <td>
                {{ rsView.number }}
                <span v-text="'REV.'+rsView.revise_number" v-if="Boolean(rsView.revise_number)"/>
              </td>
            </tr>
            <tr>
              <th class="text-weight-light">{{$tc('label.date')}}</th>
              <td>{{$app.date_format(rsView.date)}}</td>
            </tr>
            <tr>
              <th class="text-weight-light">{{$tc('label.transaction')}}</th>
              <td class="text-weight-medium">{{ rsView.transaction }}</td>
            </tr>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-table ref="table"
            class="bordered no-shadow no-radius no-highlight"
            color="secondary"
            separator="vertical" dense hide-bottom
            :data="rsView.pre_delivery_items"
            no-data-label = "No Production"
            :columns="[
              { name: 'code', label: 'code', align: 'left', field: (v)=> v.item.customer_code, hidden: true},
              { name: 'part_name', label: this.$tc('label.name', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('label.number', 1, {v:this.$tc('label.part')}), align: 'left', field: (v)=> v.item.part_number},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right', field: (v)=> v.quantity},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'amount_verification', label: 'Verify', align: 'right',
                field: (v)=> Number(v.amount_verification),
                format: (v) => Boolean(v) ? $app.number_format(v) : '',
              }
            ]"
          >

          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12 q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" icon="cancel"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.edit')" icon="edit" color="positive" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"  v-if="IS_EDITABLE && $app.can('pre-deliveries-update')" />
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="VIEW.print()" />

          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              { label: $tc('form.add_new'), color:'green', icon: 'add',
                detail: $tc('messages.process_create'),
                hidden: !$app.can('pre-deliveries-create'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/create`)
                }
              },
              { label: 'DELETE', color:'red', icon: 'delete',
                detail: $tc('messages.process_delete'),
                hidden: !IS_EDITABLE || !$app.can('pre-deliveries-delete'),
                actions: () => {
                  VIEW.delete()
                }
              },
              { label: $tc('form.revision').toUpperCase(), color:'red', icon: 'block',
                detail: $tc('messages.process_revise'),
                hidden: !IS_VOID || !$app.can('pre-deliveries-revision'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/${ROUTE.params.id}/revision`)
                }
              },
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('pre-deliveries-void'),
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
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/deliveries/pre-deliveries',
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
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.revise_id) return false
      if (this.rsView.deleted_at) return false
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
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
