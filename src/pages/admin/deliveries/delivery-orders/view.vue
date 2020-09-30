<template>
  <q-page padding class="column justify-start items-center"  v-if="VIEW.show">
    <div class="column q-gutter-y-sm" style="min-width:75%" v-if="VIEW.show">

      <q-card :dark="LAYOUT.isDark"
        class="no-shadow no-margin print-hide modal-hide q-pt-sm"
        style="position:sticky;top:50px">
        <q-card-actions class="q-gutter-xs no-padding" align="right">
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
              { label: $tc('form.edit').toUpperCase(), color:'orange', icon: 'save',
                detail: $tc('messages.process_update'),
                hidden: !IS_EDITABLE || !$app.can('sj-delivery-orders-update'),
                actions: () => {
                  $router.push(`${VIEW.resource.uri}/${ROUTE.params.id}/edit-sample`)
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

          <q-btn dense flat round color="blue-grey" icon="settings" @click="$refs['config'].show()" />
          <config-delivery-order ref="config" persistent />
        </q-card-actions>
      </q-card>

      <page-print :dark="LAYOUT.isDark" :class="{'multi-page':getArrayPage(rsView.customer).length > 1}"
        v-for="(mode, pi) in getArrayPage(rsView.customer)" :key="pi">
        <div slot="header-tags" class="column no-wrap items-end">
          <div class="print-hide no-padding">
            <ux-chip-status :row="rsView" tag outline dense square icon='bookmark' class="no-margin" />
            <!-- <q-chip tag outline small square color="orange-10" class="text-uppercase" :label="$tc('form.temporary')" v-if="rsView.is_internal" /> -->
          </div>
          <div class="text-subtitle2 text-weight-bold text-uppercase text-center on-right">
            <span v-if="rsView.is_internal">{{$tc('general.sj_internal',2)}}</span>
            <span v-else>{{$tc('general.sj_delivery',2)}} {{rsView.transaction}}</span>
          </div>
        </div>
        <div class="column" style="min-height:11cm;height:auto">
          <div class="row q-gutter-x-sm q-pb-sm" :class="{'no-wrap': $q.screen.gt.xs}">
            <div class="" style="max-width:50%">
              <div class="text-weight-medium uppercase">To: {{rsView.customer_name}}</div>
              <address class="text-normal" style="font-style: normal">{{rsView.customer_address}}</address>
              <div class="text-weight-medium" v-if="rsView.customer_note">{{$tc('label.no',1, {v:'DN'})}}: {{rsView.customer_note}}</div>
              <div class="text-weight-medium" v-if="rsView.vehicle">{{$tc('label.transport')}}: {{rsView.vehicle.number}}</div>
              <!-- <div class="text-weight-medium" v-if="rsView.indexed_number">{{$tc('label.no',1, {v:'Index'})}}: {{rsView.indexed_number}}</div> -->
            </div>
            <q-space/>
            <div class="on-right" style="max-width:50%">
              <div class="column items-start">
                <q-markup-table dense bordered square separator="cell" :dark="LAYOUT.isDark"
                  class="table-print super-dense no-shadow no-highlight th-uppercase"
                >
                  <tbody>
                    <tr>
                      <td>{{$tc('label.number')}}</td>
                      <td>
                        {{ rsView.fullnumber || rsView.number }}{{(String(mode).toUpperCase() === 'JASA' ? 'A' : '')}}
                        </td>
                      <td>{{$tc('label.date')}}</td>
                      <td>{{$app.date_format(rsView.date)}}</td>
                    </tr>
                    <tr v-if="!Boolean(rsView.is_internal || rsView.transaction == 'SAMPLE')">
                      <td>{{$tc('label.no',1, {v:'Index'})}}</td>
                      <td>
                        {{rsView.indexed_number}}
                      </td>
                      <td>No. SO</td>
                      <td>
                        {{ rsView.request_order ? (rsView.request_order.fullnumber || rsView.request_order.number) : '-' }}
                      </td>
                    </tr>
                    <tr v-if="rsView.reconcile_number">
                      <td>{{$tc('form.reconciliation')}}</td>
                      <td  colspan="100%">
                        {{rsView.reconcile_number}}
                      </td>
                    </tr>
                    <tr v-if="!Boolean(rsView.is_internal || rsView.transaction == 'SAMPLE')">
                      <td>PO/SJ</td>
                      <td colspan="100%">
                        <div class="ellipsis-3-lines" style="white-space:normal;">
                          {{ rsView.request_order ? rsView.request_order.reference_number : '-' }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="row">
                <q-space/>
                <div v-if="rsView.is_internal">
                  <q-checkbox left-label color="blue-grey" label="REMAINIG"
                    v-model="remain_only"
                    :true-value="true" :false-value="false"
                    class="print-hide align-end"
                  />
                  <span class="text-weight-medium print-only" v-if="remain_only">(REMAINIG)</span>
                </div>
                <div>
                  <q-checkbox left-label color="blue-grey" label="UNIT [PCS-KG]"
                    v-model="isDoubleUnit"
                    :true-value="true" :false-value="false"
                    class="print-hide align-end"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <q-markup-table dense bordered square separator="cell"
              :dark="LAYOUT.isDark"
              class="table-print no-shadow no-highlight th-uppercase">
              <thead>
              <q-tr>
                <q-th v-if="IS_LOTS">LOTS</q-th>
                <q-th v-if="!isHideColumn('part_name')" class="text-left">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
                <q-th v-if="!isHideColumn('part_subname')" class="text-left">{{ $app.setting('item.subname_label') }}</q-th>
                <q-th v-if="isDoubleUnit & !isHideColumn('quantity')" key="PCS" class="text-right" >Unit (PCS)</q-th>
                <q-th v-if="isDoubleUnit & !isHideColumn('quantity')" key="KG" class="text-right" >Unit (KG)</q-th>
                <q-th v-if="!isDoubleUnit & !isHideColumn('quantity')" class="text-right" >{{ $tc('label.quantity') }}</q-th>
                <q-th v-if="!isDoubleUnit & !isHideColumn('unit')" class="text-left" width="10%" >{{ $tc('label.unit') }}</q-th>
                <q-th v-if="rsView.is_internal && !remain_only && !isDoubleUnit" class="print-hide">Reconcile</q-th>
                <q-th v-if="!isHideColumn('encasement')">{{ $tc('label.encasement') }}</q-th>
              </q-tr>
              </thead>
              <tbody v-for="(row, index) in rsView.delivery_order_items" :key="index">
                <q-tr :delivery-order-item-id="row.id"
                  v-show="isRowMain(row)" >
                  <q-td v-if="IS_LOTS"> {{row.number_lots}} </q-td>
                  <q-td v-if="!isHideColumn('part_name')">
                    <span class="text-weight-medium" v-if="Boolean(mode)">{{mode}}:&nbsp;</span>
                    <span class="text-weight-medium" v-if="['DETAIL', 'UNIT_DETAIL'].find(x => x === rsView.customer.delivery_mode)">Material:&nbsp;</span>
                    <span v-if="row.item"> {{row.item.part_name}} </span>
                  </q-td>
                  <q-td v-if="!isHideColumn('part_subname')" key="part_subname">
                    <span v-if="row.item"> {{row.item.part_subname}} </span>
                  </q-td>
                  <q-td v-if="!isHideColumn('quantity') && isDoubleUnit" key="PCS" class="text-right">
                    {{!valPCS(row) ? '' : $app.number_format(valPCS(row), row.unit.decimal_in) + ' PCS'}}
                  </q-td>
                  <q-td v-if="!isHideColumn('quantity') && isDoubleUnit" key="KG" class="text-right">
                    {{!valKG(row) ? '' : $app.number_format(valKG(row), row.unit.decimal_in) + ' KG'}}
                  </q-td>
                  <q-td  v-if="!isHideColumn('quantity') && !isDoubleUnit" key="quantity" class="text-right">
                    <span v-if="rsView.is_internal && remain_only">
                      {{$app.number_format(Number(row.quantity) - (row.amount_reconcile / (row.unit_rate||1)), row.unit.decimal_in)}}
                    </span>
                    <span v-else>{{$app.number_format(row.quantity, row.unit.decimal_in)}}</span>
                  </q-td>
                  <q-td v-if="!isHideColumn('unit') && !isDoubleUnit" key="unit"  class="text-left">
                    {{row.unit.code}}
                  </q-td>
                  <q-td v-if="rsView.is_internal && !remain_only && !isDoubleUnit" class="print-hide text-right">
                    {{$app.number_format(row.amount_reconcile, row.unit.decimal_in)}}
                  </q-td>
                  <q-td v-if="!isHideColumn('encasement')">
                    <div class="row cursor-pointer">
                      <span>{{row.encasement}}</span>
                      <template v-if="String(mode).toUpperCase() !== 'JASA' && rsView.status === 'OPEN'">
                        <q-popup-edit v-model="row.encasement" content-class="" :cover="false" :offset="[0, 10]"
                          @save="(val,init) => setEncasement(index, val, init)"
                          >
                          <template v-slot="{ value, emitValue, set, cancel }">
                            <q-input autofocus dense :value="value" :label="$tc('label.encasement')" stack-label
                              @input="emitValue"
                            >
                              <template v-slot:after>
                                <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                <q-btn flat dense color="positive" icon="check_circle" @click.stop="set" />
                              </template>
                            </q-input>
                          </template>
                        </q-popup-edit>
                        <q-space/>
                        <q-icon name="edit" class="print-hide cursor-pointer self-end text-grey"/>
                      </template>
                    </div>
                  </q-td>
                </q-tr>
                <q-tr :delivery-order-item-id="row.id"
                  v-show="isRowMain(row)"
                  v-if="['DETAIL', 'UNIT_DETAIL'].find(x => x === rsView.customer.delivery_mode)">
                  <q-td v-if="IS_LOTS"> {{row.number_lots}} </q-td>
                  <q-td v-if="!isHideColumn('part_name')">
                    <span class="text-weight-medium">Jasa:&nbsp;</span>
                    <span v-if="row.item"> {{row.item.part_name}} </span>
                  </q-td>
                  <q-td v-if="!isHideColumn('part_subname')">
                    <span v-if="row.item"> {{row.item.part_subname}} </span>
                  </q-td>
                  <q-td  v-if="!isHideColumn('quantity') && isDoubleUnit" key="PCS" class="text-right">
                    {{!valPCS(row) ? '' : $app.number_format(valPCS(row), row.unit.decimal_in) + ' PCS'}}
                  </q-td>
                  <q-td v-if="!isHideColumn('quantity') && isDoubleUnit" key="KG" class="text-right">
                    {{!valKG(row) ? '' : $app.number_format(valKG(row), row.unit.decimal_in) + ' KG'}}
                  </q-td>
                  <q-td v-if="!isHideColumn('quantity') && !isDoubleUnit" class="text-right">
                    {{$app.number_format(row.quantity, row.unit.decimal_in)}}
                  </q-td>
                  <q-td v-if="!isHideColumn('unit') && !isDoubleUnit" class="text-left">{{row.unit.code}}</q-td>
                  <q-td v-if="rsView.is_internal && !remain_only && !isDoubleUnit" class="print-hide text-right"></q-td>
                  <q-td v-if="!isHideColumn('encasement')"></q-td>
                </q-tr>
              </tbody>
              <tbody >
                <tr v-if="rsView.is_internal && remain_only && !rsView.delivery_order_items.filter(x => isRowMain(x)).length">
                  <td colspan="100%" class="text-italic text-grey text-center" style="height: 42px !important">
                    <span>NO REMAIN RECORD.</span>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div v-show="Boolean(rsView.description)">
              <div class="q-my-xs">{{$tc('label.description')}}:</div>
              <div class="q-my-xs" style="min-height:30px">{{ rsView.description }}</div>
          </div>
          <q-space />
          <div class="page-break-inside">
            <q-card bordered flat class="bg-red-10 text-white print-hide"
              v-if="rsView.deleted_at">
              <q-card-section>
                <div  class="text-subtitle2">
                  {{rsView.status }}
                  <span v-if="rsView.reason" v-html="rsView.reason.name" />
                </div>
                <div class="text-caption">
                  Desription <br>
                  {{rsView.reason_description || '-'}}
                </div>
              </q-card-section>
            </q-card>
            <q-markup-table v-else dense :dark="LAYOUT.isDark" class="no-shadow text-weight-light" style="">
              <tr class="text-center">
                <td width="21%">
                  <div class="sign-name">Diterima Oleh</div>
                  <div class="sign-tag row no-wrap q-mx-lg">( <q-space/>. . . . . . . . . . . . . .<q-space/> )</div>
                </td>
                <td width="21%">
                  <div class="sign-name">Outgoing Oleh</div>
                  <div class="sign-tag row no-wrap q-mx-lg">( <q-space/>. . . . . . . . . . . . . .<q-space/> )</div>
                </td>
                <td width="21%">
                  <div class="sign-name">Security</div>
                  <div class="sign-tag row no-wrap q-mx-lg">( <q-space/>. . . . . . . . . . . . . .<q-space/> )</div>
                </td>
                <td width="21%" class="text-capitalize">
                  <div class="sign-name">Hormat Kami</div>
                  <div class="sign-tag row no-wrap q-mx-lg" v-if="rsView.created_user">(<q-space/>{{rsView.created_user.name}}<q-space/>)</div>
                  <div class="sign-tag row no-wrap q-mx-lg" v-else>( <q-space/>. . . . . . . . . . . . . .<q-space/> )</div>
                </td>
              </tr>
            </q-markup-table>
          </div>
        </div>
      </page-print>
    </div>

    <q-inner-loading :showing="VIEW.loading">
        <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import MixView from '@/mixins/mix-view.vue'
import PagePrint from '@/components/page-print'
import ConfigDeliveryOrder from './config.vue'

export default {
  mixins: [MixView],
  components: { PagePrint, ConfigDeliveryOrder },
  data () {
    return {
      VIEW: {
        resource: {
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/deliveries/delivery-orders',
          params: '?mode=view'
        }
      },
      rsView: {},
      remain_only: true,
      isDoubleUnit: false
    }
  },
  created () {
    this.init()
  },
  computed: {
    IS_LOTS () {
      return Boolean(this.rsView.customer && this.rsView.customer.order_lots)
    },
    IS_MAINROW () {
      return Boolean(!this.rsView.is_internal || !this.remain_only)
    },
    IS_CONFIRM () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      return true
    },
    IS_RECON () {
      if (this.rsView.deleted_at) return false
      if (!this.rsView.is_internal) return false
      if (this.rsView.status !== 'CONFIRMED') return false
      return true
    },
    IS_REVISE () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.transaction === 'SAMPLE') return false
      if (this.rsView.status !== 'OPEN' && this.rsView.is_internal) return false
      if (this.rsView.status !== 'OPEN' && this.rsView.reconcile_id) return false
      return true
    },
    IS_VOID () {
      if (this.rsView.deleted_at) return false
      return true
    },
    IS_EDITABLE () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      if (this.rsView.transaction !== 'SAMPLE') return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      return true
    }
  },
  methods: {
    init () {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    isHideColumn (val) {
      const setting = this.$store.state.admin.SETTING.sj_delivery
        ? this.$store.state.admin.SETTING.sj_delivery['hide_view_columns'] || []
        : []

      if (setting.some(v => val === v)) return true

      const config = this.$store.state.admin.CONFIG.sj_delivery['hide_view_columns'] || []
      return Boolean(config.some(v => val === v))
    },
    isRowMain (row) {
      return this.IS_MAINROW || Math.round(row.unit_amount) !== Math.round(row.amount_reconcile)
    },
    getOrderLot (row) {
      // return
      console.warn('LOT', row.number_lots)
    },
    valPCS (row) {
      if (row.unit_id === 1) {
        return Number(row.quantity)
      } else if (row.item.unit_id === 1) {
        return Number(row.unit_amount)
      } else if (row.item && row.item.item_units) {
        const find = row.item.item_units.find(u => u.unit_id === 1)
        if (find) {
          return (Number(row.unit_amount) / Number(find.rate || 1))
        }
      }
      return null
    },
    valKG (row) {
      if (row.unit_id === 2) {
        return Number(row.quantity)
      } else if (row.item.unit_id === 2) {
        return Number(row.unit_amount)
      } else if (row.item && row.item.item_units) {
        const find = row.item.item_units.find(u => u.unit_id === 2)
        if (find) {
          return (Number(row.unit_amount) / Number(find.rate || 1))
        }
      }
      return null
    },
    getArrayPage (c) {
      if (c.delivery_mode === 'SEPARATE') return ['Material', 'Jasa']
      else return ['']
    },
    setView (data) {
      this.rsView = data
    },
    setRevision () {
      const page = this.rsView.is_internal ? 'revision-internal' : 'revision'
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/${page}`)
    },
    setReconciliation () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/reconcile`)
    },
    setConfirmation () {
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
            this.$app.response.error(error.response, 'CONFIRMED FAILED')
          })
          .finally(() => {
            this.VIEW.show = true
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000)
          })
      }

      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color: 'negative',
            icon: 'error',
            position: 'top-right',
            timeout: 3000,
            message: this.$tc('messages.to_complete_form')
          })
        }

        this.$q.dialog({
          title: this.$tc('form.confirm'),
          message: this.$tc('messages.to_sure', 1, { v: this.$tc('form.validation') }),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
      })
    },
    setEncasement (index, val, init) {
      const save = () => this.rsView.delivery_order_items[index].encasement = val
      const cancel = () => this.rsView.delivery_order_items[index].encasement = init
      if (this.rsView.delivery_order_items[index].id) {
        const row = this.rsView.delivery_order_items[index]
        this.VIEW.loading = true
        let url = `${this.VIEW.resource.api}/${this.ROUTE.params.id}?mode=item-encasement&nodata=true`
        this.$axios.put(url, { id: row.id, encasement: val })
          .then((response) => {
            save()
            this.$app.notify.success('Data Updated!')
          })
          .catch(error => {
            cancel()
            this.$app.response.error(error.response, 'Update Encasement')
          })
          .finally(() => {
            setTimeout(() => {
              this.VIEW.loading = false
            }, 1000)
          })
      } else cancel()
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
