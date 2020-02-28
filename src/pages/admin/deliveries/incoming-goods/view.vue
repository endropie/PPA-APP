<template>
  <q-page padding class="column justify-start items-center" :dark="LAYOUT.isDark">
    <page-print v-if="VIEW.show">
      <span slot="header-title">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle">Warehouses - Incoming Good</span>
      <div slot="header-tags" class="print-hide">
        <q-chip class="shadow-1" square outline
          color="blue-grey" text-color="white"
          label="NCR" v-if="rsView.transaction === 'RETURN'" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <div class="row q-col-gutter-md" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6">
                INCOMING GOOD
              </div>
              <q-markup-table class="super-dense no-shadow" :dark="LAYOUT.isDark">
                <tr>
                  <th class="text-left">{{$tc('general.customer')}}</th>
                  <td>{{ rsView.customer.name }}</td>
                </tr>
                <tr>
                  <th class="text-left">{{$tc('warehouses.reference_number')}}</th>
                  <td>{{ rsView.reference_number || '-'}}</td>
                </tr>
              </q-markup-table>
            </div>
            <div class="row items-start q-gutter-x-sm">
              <q-markup-table class="super-dense no-shadow no-highlight"
                dense square bordered separator="cell" :dark="LAYOUT.isDark">
                <tbody>
                  <tr>
                    <td>{{$tc('warehouses.registration')}}</td>
                    <td>{{rsView.registration}}</td>
                  </tr>
                  <tr>
                    <td>{{'No. Indexed'}}</td>
                    <td>{{rsView.indexed_number}}</td>
                  </tr>
                  <tr v-if="rsView.request_order">
                    <td>{{$tc('general.request_order')}}</td>
                    <td>
                      <span v-if="!$app.can('request-orders-read')">{{rsView.request_order.number}}</span>
                      <q-btn v-else dense flat
                        :label="rsView.request_order.number"
                        class="q-py-none" style="line-height:normal"
                        :to="`/admin/incomes/request-orders/${rsView.request_order.id}`"/>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-markup-table class="super-dense no-shadow no-highlight"
                dense square bordered separator="cell" :dark="LAYOUT.isDark">
                <tbody>
                  <tr>
                    <td>{{$tc('label.number')}}</td>
                    <td>{{rsView.fullnumber || rsView.number}}</td>
                  </tr>
                  <tr>
                    <td>{{$tc('label.date')}}</td>
                    <td>{{ $app.date_format(rsView.date) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-table ref="table" bordered class="no-highlight no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.incoming_good_items"
            no-data-label = "No Detail"
            :rows-per-page-options ="[0]"
            :pagination="{page: null, rowsPerPage: 0 }"
            :columns="[
              { name: 'part_name', label: $tc('items.part_name'), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: $tc('items.part_number'), align: 'left', field: (v)=> v.item.part_number},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center', field: (v)=> v.unit.code},
              { name: 'quantity', label: $tc('label.quantity'), align: 'right',
                field: (v)=> v.quantity, format: (v) => $app.number_format(v)},
              { name: 'note', label: $tc('label.note'), align: 'left', field: 'note', style: `min-width:25%;`},
            ]"
          >
          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
      </div>
      <div class="row q-gutter-xs print-hide" style="padding-top:50px">
        <q-btn :label="$tc('form.back')" color="dark" icon="cancel" :to="`${VIEW.resource.uri}?return`" />
        <q-btn :label="$tc('form.print')" color="grey" icon="print" @click.native="print()" />
        <q-btn :label="$tc('form.edit')" color="green" icon="edit" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"
          v-if="IS_EDITABLE && isCanUpdate" />
        <q-space />
        <ux-btn-dropdown color="blue-grey"
          :options="[
            { label: $tc('form.add_new'), color:'green', icon: 'add',
              hidden: !isCanCreate,
              detail: $tc('messages.process_create'),
              actions: () => {
                $router.push(`${VIEW.resource.uri}/create`)
              }
            },
            { label: String('Delete').toUpperCase(), color:'red', icon: 'delete',
              hidden: !IS_EDITABLE || !isCanDelete,
              detail: $tc('messages.process_delete'),
              actions: () => {
                VIEW.delete()
              }
            },
            { label: $tc('form.validation').toUpperCase(), color:'teal', icon: 'check',
              hidden: !IS_EDITABLE || !this.$app.can('incoming-goods-validation'),
              detail:$tc('messages.process_validation'),
              actions: () => {
                setValidation()
              }
            },
            { label: (`${$tc('form.revision')}`).toUpperCase(), color:'orange', icon: 'edit',
              hidden: !IS_REVISE || rsView.status !== 'VALIDATED' || !this.$app.can('incoming-goods-revision'),
              detail:$tc('messages.process_revise'),
              actions: () => {
                setRevision()
              }
            },
            { label: (`${$tc('form.revision')} [${rsView.status}]`).toUpperCase(), color:'teal', icon: 'check',
              hidden: !IS_REVISE || rsView.status !== 'REJECTED' || !this.$app.can('incoming-goods-create'),
              // detail:$tc('messages.process_revision'),
              actions: () => {
                setRestoration()
              }
            },
            { label: 'VOID', color:'red', icon: 'block',
              hidden: !IS_VOID,
              detail: $tc('messages.process_void'),
              actions: () => {
                VIEW.void(()=> init() )
              }
            },
            { label: 'PDO', color:'blue-10', icon: 'assignment',
              hidden: !this.$app.can('pre-deliveries-create'),
              detail: $tc('form.add_new',1, {v:'PDO'}),
              actions: () => {
                $router.push(`/admin/deliveries/pre-deliveries/create?incoming_good_id=${ROUTE.params.id}`)
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
          api: '/api/v1/warehouses/incoming-goods',
          uri: '/admin/deliveries/incoming-goods',
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
    isCanCreate() {
      return this.$app.can('incoming-goods-create')
    },
    isCanUpdate() {
      return this.$app.can('incoming-goods-update')
    },
    isCanDelete() {
      return this.$app.can('incoming-goods-delete')
    },
    IS_REVISE() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID','OPEN'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (!this.$app.can('incoming-goods-void')) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at || this.rsView.status !== 'OPEN') return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      return true
    },
  },
  methods: {
    setRestoration () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/restoration`)
    },
    setRevision () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/revision`)
    },
    setValidation () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/validation`)
    },
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    btnIcon (str) {
      return !this.$q.screen.lt.sm ? str : undefined
    },
    print() {
      window.print()
    },
    setView(data) {
      this.rsView =  JSON.parse(JSON.stringify(data))
    },
  }
}
</script>
