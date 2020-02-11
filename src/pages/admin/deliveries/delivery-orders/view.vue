<template>
  <q-page padding class="column justify-start items-center q-gutter-sm"  v-if="VIEW.show">
      <q-card :dark="LAYOUT.isDark" v-if="VIEW.show" class="no-shadow print-hide modal-hide">
        <q-card-actions class="q-px-lg q-gutter-xs" >
          <q-btn :label="$tc('form.list')" icon="list"  color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="print()" ></q-btn>
          <q-space />
          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" class="self-end"
            :options="[
              { label: $tc('form.confirm').toUpperCase(), color:'green', icon: 'done_all',
                detail: $tc('messages.process_confirm'),
                hidden: !IS_CONFIRM || !$app.can('sj-delivery-orders-confirm'),
                actions: () => {
                  setConfirmation()
                }
              },
              { label: $tc('form.revision').toUpperCase(), color:'orange', icon: 'save',
                detail: $tc('messages.process_revise'),
                hidden: !IS_REVISE || !$app.can('sj-delivery-orders-revision'),
                actions: () => {
                  setRevision()
                }
              },
              { label: $tc('form.reconciliation').toUpperCase(), color:'indigo-10', icon: 'swap_horiz',
                detail: $tc('messages.process_reconcile'),
                hidden: !IS_RECON || !$app.can('sj-delivery-orders-create'),
                actions: () => {
                  setReconciliation()
                }
              },
              { label: 'VOID', color:'red', icon: 'block',
                detail: $tc('messages.process_void'),
                hidden: !IS_VOID || !$app.can('sj-delivery-orders-void'),
                actions: () => {
                  VIEW.void(()=> init() )
                }
              }
            ]"
          />
        </q-card-actions>
      </q-card>
      <page-print :dark="LAYOUT.isDark" style="min-width:75%" :class="{'multi-page':getArrayPage(rsView.customer).length > 1}"
        v-for="(mode, pi) in getArrayPage(rsView.customer)" :key="pi">
        <div slot="header-tags" class="print-hide">
          <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
          <q-chip tag outline small square color="orange-10" class="text-uppercase" :label="$tc('form.temporary')" v-if="rsView.is_internal" />
        </div>
        <div class="column" >
          <div class="row justify-between q-col-gutter-sm q-pb-sm">
            <div class="profile col-stretch">
              <div class="text-weight-regular uppercase">To: {{rsView.customer_name}}</div>
              <address class="text-weight-light">{{rsView.customer_address}}</address>
              <div class="text-weight-light" v-if="rsView.customer_phone">Phone: {{rsView.customer_phone}}</div>
              <div class="text-weight-light" v-if="rsView.customer_note">{{$tc('label.no',1, {v:'DN'})}}: {{rsView.customer_note}}</div>
            </div>
            <div class="col-auto">
              <div class=" row no-wrap items-start">
                <q-markup-table dense bordered square separator="cell" :dark="LAYOUT.isDark"
                  class="super-dense no-highlight no-shadow th-uppercase q-mx-sm">
                  <tbody>
                    <tr>
                      <td>{{$tc('label.number')}}</td>
                      <td>{{ rsView.fullnumber || rsView.number }}</td>
                    </tr>
                    <tr>
                      <td>{{$tc('label.date')}}</td>
                      <td>{{$app.date_format(rsView.date)}}</td>
                    </tr>
                    <tr v-if="rsView.reconcile_number">
                      <td>{{$tc('form.reconciliation')}}</td>
                      <td>{{rsView.reconcile_number}}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-markup-table dense bordered square separator="cell" :dark="LAYOUT.isDark"
                  class="super-dense no-shadow no-margin no-highlight th-uppercase"
                  v-if="!rsView.is_internal">
                  <tbody>
                    <tr>
                      <td>No. SO</td>
                      <td>{{ rsView.request_order ? (rsView.request_order.fullnumber || rsView.request_order.number) : '-' }}</td>
                    </tr>
                    <tr>
                      <td>REF. PO/SJ</td>
                      <td>{{ rsView.request_order ? rsView.request_order.reference_number : '-' }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>
          </div>
          <div>
            <q-markup-table dense bordered square separator="cell"
              :dark="LAYOUT.isDark"
              class="table-print no-shadow no-highlight th-uppercase">
              <thead>
              <q-tr>
                <q-th>{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
                <q-th>{{ $tc('label.number', 1, {v: $tc('label.part')}) }}</q-th>
                <q-th>{{ $tc('label.unit') }}</q-th>
                <q-th>{{ $tc('label.quantity') }}</q-th>
                <q-th v-if="rsView.is_internal" class="print-hide">Reconcile</q-th>
                <q-th>{{ $tc('label.encasement') }}</q-th>
              </q-tr>
              </thead>
              <template v-if="['DETAIL', 'UNIT_DETAIL'].find(x => x === rsView.customer.delivery_mode)">
              <tbody v-for="(row, index) in rsView.delivery_order_items" :key="index">
                <q-tr >
                  <q-td>
                    <span class="text-weight-medium">Material:&nbsp;</span>
                    {{row.item.part_name}}
                  </q-td>
                  <q-td>{{row.item.part_number}}</q-td>
                  <q-td class="text-center">{{row.unit.name}}</q-td>
                  <q-td class="text-right">{{$app.number_format(row.quantity)}}</q-td>
                </q-tr>
                <q-tr >
                  <q-td>
                    <span class="text-weight-medium">Jasa:&nbsp;</span>
                    {{row.item.part_name}}
                  </q-td>
                  <q-td>{{row.item.part_number}}</q-td>
                  <q-td class="text-center">{{row.unit.name}}</q-td>
                  <q-td class="text-right">{{$app.number_format(row.quantity)}}</q-td>
                  <q-td>{{row.encasement}}</q-td>
                </q-tr>
              </tbody>
              </template>
              <tbody v-else>
              <q-tr v-for="(row, index) in rsView.delivery_order_items" :key="index">
                <q-td>
                  <span v-if="Boolean(mode)" class="text-weight-medium">{{mode}}:&nbsp;</span>
                  {{row.item.part_name}}
                </q-td>
                <q-td>{{row.item.part_number}}</q-td>
                <q-td class="text-center">{{row.unit.name}}</q-td>
                <q-td class="text-right">{{$app.number_format(row.quantity)}}</q-td>
                <q-td class="print-hide text-right" v-if="rsView.is_internal">{{$app.number_format(row.amount_reconcile)}}</q-td>
                <q-td>{{row.encasement}}</q-td>
              </q-tr>
              </tbody>
            </q-markup-table>
            <q-chip dense square class="float-right print-hide">
              <small class="text-weight-light">{{`MODE: ${rsView.customer.delivery_mode}`}}</small>
            </q-chip>
          </div>
          <div v-show="Boolean(rsView.description)">
              <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
              <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
          </div>
          <div class="page-break-inside">
            <q-markup-table :dark="LAYOUT.isDark" class="no-shadow text-weight-light" style="">
              <tr class="text-center">
                <td width="21%">
                  <div class="sign-name">Diterima Oleh</div>
                  <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
                </td>
                <td width="21%">
                  <div class="sign-name">Outgoing Oleh</div>
                  <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
                </td>
                <td width="21%">
                  <div class="sign-name">Security</div>
                  <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
                </td>
                <td width="35%">
                  <div class="sign-name">Hormat Kami</div>
                  <div class="sign-tag">( . . . . . . . . . . . . . . )</div>
                </td>
              </tr>
            </q-markup-table>
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

export default {
  mixins: [MixView],
  components: { PagePrint },
  data () {
    return {
      VIEW: {
        resource:{
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/deliveries/delivery-orders',
          params: '?mode=view'
        }
      },
      rsView: {},
    }
  },
  created() {
    this.init()
  },
  computed: {
    IS_CONFIRM() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      return true
    },
    IS_RECON() {
      if (this.rsView.deleted_at) return false
      if (!this.rsView.is_internal) return false
      if (this.rsView.status !== 'CONFIRMED') return false
      return true
    },
    IS_REVISE() {
      if (this.rsView.deleted_at) return false
      return true
    },
    IS_VOID() {
      if (this.rsView.deleted_at) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
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
    print() {
      window.print()
    },
    getBaseUnit(detail) {
      if(detail.unit_rate == 1) return ''
      return `(${detail.unit_amount} ${detail.item.unit.code})`
    },
    getArrayPage(c) {
      if (c.delivery_mode === 'SEPARATE') return ['Material', 'Jasa']
      else return ['']
    },
    setView(data) {
      this.rsView =  data
    },
    setRevision() {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/revision`)
    },
    setReconciliation() {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/reconcile`)
    },
    setConfirmation() {
      const submit = () => {
        this.VIEW.show = false
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=confirmation&nodata=true`
        this.$axios.put(url)
          .then((response) => {
            const data = response.data
            this.setView(data)
          })
          .catch(error => {
            this.$app.response.error(error.response, 'FORM REVISION')
          })
          .finally(()=>{
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000);
          })
      }

      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          });
        }

        this.$q.dialog({
          title: this.$tc('form.confirm'),
          message: this.$tc('messages.to_sure', 1, {v: this.$tc('form.validation')}),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
      })
    }
  }
}
</script>

<style lang="stylus">
.info, .info th
  text-transform uppercase
  font-size 11px
  font-weight 500

.table-print
  .q-table tr, .q-table td
    line-height normal
    height unset !important
  .q-table td
    padding-top 2px
    padding-bottom 2px
.sign-tag
  margin-top 40px
  vertical-align bottom
</style>
