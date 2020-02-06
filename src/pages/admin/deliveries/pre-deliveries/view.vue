<template>
  <q-page padding class="column justify-start">
    <page-print v-if="VIEW.show">
      <div slot="header-title">PPA - Pre Delivery </div>
      <template slot="header-tags hide-print">
        <q-chip square outline color="blue-grey" text-color="white"
          label="RETURN" v-if="rsView.transaction === 'RETURN'" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </template>

      <div class="row justify-between q-col-gutter-y-sm" >
        <div class="profile self-bottom">
          <q-markup-table dense class="super-dense no-shadow text-weight-medium">
            <tr>
              <td>{{$tc('general.customer')}}</td>
              <td>
                <span v-if="rsView.customer"> {{rsView.customer.name}} </span>
                <span v-else v-text="`-`" />
              </td>
            </tr>
            <tr>
              <td>{{$tc('label.transaction')}}</td>
              <td>{{ rsView.transaction }}</td>
            </tr>
          </q-markup-table>
        </div>
        <div class="info">
          <q-markup-table dense bordered class="super-dense no-shadow " separator="cell">
            <tbody>
              <tr>
                <td class="text-weight-medium">{{$tc('label.number')}}</td>
                <td>{{ rsView.full_number || rsView.number }}</td>
              </tr>
              <tr>
                <td class="text-weight-medium">{{$tc('label.date')}}</td>
                <td>{{$app.date_format(rsView.date)}}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-markup-table dense bordered class="no-shadow th-uppercase" separator="cell">
            <thead>
            <q-tr>
              <q-th>{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $tc('label.number', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $tc('label.unit') }}</q-th>
              <q-th>{{ $tc('label.quantity') }}</q-th>
              <q-th>Verify</q-th>
              <q-th>{{ $tc('label.encasement') }}</q-th>
            </q-tr>
            </thead>
            <tbody>
            <q-tr v-for="(row, index) in rsView.pre_delivery_items" :key="index">
              <q-td>{{row.item.part_name}}</q-td>
              <q-td>{{row.item.part_number}}</q-td>
              <q-td>{{row.unit.name}}</q-td>
              <q-td>{{$app.number_format(row.quantity)}}</q-td>
              <q-td>{{$app.number_format(row.amount_verification)}}</q-td>
              <q-td>{{row.encasement || '-'}}</q-td>
            </q-tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12 print-hide">
          <!-- =>{{rsView.schedules}} -->
          <div class="row q-gutter-sm items-center ">
            <span class="on-left">SCHEDULE</span>
            <q-badge dense outline color="faded" v-cloak v-for="(schedule, i) in rsView.schedules" :key="i">
              <div class="text-large">{{schedule.number}}<br>
                <span class="text-small">{{$app.moment(schedule.date+' '+schedule.time).format('lll')}}</span>
              </div>

            </q-badge>
          </div>
        </div>
        <div class="col-12">
            <div class="q-mb-sm text-italic">{{$tc('label.description')}}:</div>
            <div class="q-mb-md text-weight-light" style="">{{ rsView.description }}</div>
        </div>
        <div class="col-12 row q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" icon="cancel"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.edit')" icon="edit" color="positive" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"  v-if="IS_EDITABLE && $app.can('pre-deliveries-update')" />
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="VIEW.print()" />
          <q-space />
          <ux-btn-dropdown color="blue-grey"
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
              { label: $tc('form.revision').toUpperCase(), color:'orange', icon: 'edit',
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
