<template>
  <q-page padding class="column justify-start">
    <page-print v-if="VIEW.show">
      <div slot="header-title" class="text-uppercase">{{$tc('general.delivery_load')}}</div>
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>

      <div class="row justify-between q-col-gutter-y-sm" >
        <div class="profile self-bottom">
          <q-markup-table dense class="super-dense no-shadow no-highlight text-weight-medium">
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
          <q-markup-table dense square bordered class="super-dense no-shadow no-highlight" separator="cell">
            <tbody>
              <tr>
                <td class="text-weight-medium">{{$tc('label.number')}}</td>
                <td>{{ rsView.fullnumber || rsView.number }}</td>
              </tr>
              <tr>
                <td class="text-weight-medium">{{$tc('label.date')}}</td>
                <td>{{$app.date_format(rsView.date)}}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-markup-table dense bordered class="no-shadow no-highlight th-uppercase" separator="cell">
            <thead>
            <q-tr>
              <q-th>{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $app.setting('item.subname_label') }}</q-th>
              <q-th>{{ $tc('label.unit') }}</q-th>
              <q-th>{{ $tc('label.quantity') }}</q-th>
              <q-th>{{ $tc('label.encasement') }}</q-th>
            </q-tr>
            </thead>
            <tbody>
            <q-tr v-for="(row, index) in rsView.delivery_load_items" :key="index">
              <q-td>{{row.item.part_name}}</q-td>
              <q-td>{{row.item.part_subname}}</q-td>
              <q-td class="text-center">{{row.unit.code}}</q-td>
              <q-td class="text-right">{{$app.number_format(row.quantity, $app.get(row, 'unit.decimal_in') || 0)}}</q-td>
              <q-td>{{row.encasement || '-'}}</q-td>
            </q-tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-12">
          <div class="q-mb-sm text-italic">{{$tc('label.description')}}:</div>
          <div class="q-mb-md text-weight-light" style="">{{ rsView.description }}</div>
        </div>
        <div class="col-12 row q-gutter-xs print-hide " style="padding-top:50px">
          <q-btn :label="$tc('form.back')" icon="cancel"  color="dark" :to="`${VIEW.resource.uri}?return`" />
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="VIEW.print()" />
          <q-space />
          <q-btn-dropdown outline class="no-dropdown-icon"
            :color="'secondary'" icon="local_shipping"
            menu-anchor="bottom left" menu-self="top left">
            <span slot="label" class="on-right">
              {{`SJDO (${rsView.delivery_orders.length})`}}
            </span>
            <div class="row q-pa-md" :class="{'bg-faded text-white': LAYOUT.isDark}">
              <div class="column">
                <div class="text-subtitle2 q-mb-md">SJ-DELIVERY ORDER</div>
                <template v-for="(link, index) in rsView.delivery_orders">
                  <q-btn dense class="q-ma-xs" :key="index"
                    color="secondary" icon="open_in_new"
                    :label="`${link.fullnumber || link.number}`"
                    @click="showDO(link.id)" />
                </template>
              </div>

              <q-separator vertical inset class="q-mx-lg" v-show="false" />

              <div class="column">
              </div>
            </div>
          </q-btn-dropdown>
          <ux-btn-dropdown color="blue-grey"
            :options="[
              { label: $tc('form.add_new'), color:'green', icon: 'add',
                detail: $tc('messages.process_create'),
                hidden: !$app.can('delivery-loads-create'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/create`)
                }
              },
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('delivery-loads-void'),
                actions: () => {
                  VIEW.void(()=> init() )
                }
              },
            ]"
          />
        </div>
      </div>
    </page-print>
    <ux-modal-view ref="modal"  fit icon="local_shipping" :title="$tc('general.sj_delivery')" />
  </q-page>
</template>

<script>

import MixView from '@/mixins/mix-view.vue'
import PagePrint from '@/components/page-print'

export default {
  mixins: [MixView],
  components: { PagePrint },
  data () {
    return {
      VIEW: {
        data: {},
        resource: {
          api: '/api/v1/incomes/delivery-loads',
          uri: '/admin/deliveries/delivery-loads'
        }
      },
      rsView: {},
      count: 0
    }
  },
  created () {
    this.init()
  },
  computed: {
    IS_CLOSE () {
      if (this.rsView.deleted_at) return false
      if (['CLOSED'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_VOID () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.revise_id) return false
      if (this.rsView.status !== 'OPEN') return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      return true
    },
    IS_EDITABLE () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.revise_id) return false
      if (this.rsView.status !== 'OPEN') return false
      return true
    }
  },
  methods: {
    init () {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    setView (data) {
      this.rsView = data
    },
    showDO (id) {
      let mode = {
        path: '/admin/deliveries/delivery-orders/view',
        params: { id: id },
        meta: { mode: 'view' },
        actions: {
          // actions
        }
      }
      this.$refs.modal.show(mode)
    }
  }
}
</script>
