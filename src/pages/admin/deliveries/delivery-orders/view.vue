<template>
  <q-page padding class="column content-center q-gutter-sm"  v-if="VIEW.show">
    <q-card  v-if="VIEW.show" class="print-hide modal-hide" style="max-width:210mm">
      <q-card-actions class="q-px-lg q-gutter-xs" >
          <q-btn :label="$tc('form.list')" icon="list"  color="dark" :to="`${VIEW.resource.uri}?return`"></q-btn>
          <q-btn :label="$tc('form.print')" icon="print" color="grey" @click.native="print()" ></q-btn>
          <q-space />
          <ux-btn-dropdown :label="$tc('label.others')" color="blue-grey" no-caps class="float-right"
            :options="[
              { label: 'Delete', color:'red', icon: 'delete',
                detail: $tc('messages.process_delete'),
                hidden: !IS_EDITABLE || !$app.can('sj-delivery-orders-delete'),
                actions: () => {
                  VIEW.delete()
                }
              },
              { label: $tc('form.confirm').toUpperCase(), color:'green', icon: 'block',
                detail: $tc('messages.process_confirm'),
                hidden: !IS_VOID || !$app.can('sj-delivery-orders-confirm'),
                actions: () => {
                  setConfirmation()
                }
              },
              { label: $tc('form.revision').toUpperCase(), color:'red', icon: 'block',
                detail: $tc('messages.process_revise'),
                hidden: !IS_VOID || !$app.can('sj-delivery-orders-revision'),
                actions: () => {
                  setRevision()
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
    <page-print class="shadow-2 scroll" style="max-width:210mm"
      v-for="(mode, pi) in getArrayPage(rsView.customer)" :key="pi">
      <div slot="header-tags" class="print-hide">
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <div class="row justify-between q-gutter-y-md" >
        <div class="profile" style="max-width:50%">
          <div class="text-weight-regular uppercase">To: {{rsView.customer_name}}</div>
          <address class="text-weight-light">{{rsView.customer_address}}</address>
          <div class="text-weight-light ">Phone: {{rsView.customer_phone}}</div>
        </div>
        <div class="info" style="max-width:50%">
          <q-markup-table bordered separator="cell" :dark="LAYOUT.isDark"
            class="super-dense no-shadow no-margin th-uppercase th-text-left">
            <tr>
              <th>No. SJ-OUT</th>
              <td>
                {{ rsView.number }}
                <span v-text="'REV.'+rsView.revise_number" v-if="Boolean(rsView.revise_number)"/>
              </td>
            </tr>
            <tr>
              <th>{{$tc('label.date')}}</th>
              <td>{{$app.date_format(rsView.date)}}</td>
            </tr>
            <tr>
              <th>No. SO</th><td>{{ rsView.request_order ? rsView.request_order.number : '-' }}</td>
            </tr>
          </q-markup-table>
        </div>
        <div class="col-12">
          <q-markup-table dense bordered class="no-shadow no-highlight th-uppercase" separator="cell">
            <thead>
            <q-tr vfor="(line, i) in [1,2,3,4,5,6]" key="i">
              <q-th>{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $tc('label.number', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th>{{ $tc('label.unit') }}</q-th>
              <q-th>{{ $tc('label.quantity') }}</q-th>
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
            </q-tr>
            </tbody>
          </q-markup-table>
          <q-chip dense square class="float-right print-hide">
            <small class="text-weight-light">{{`MODE: ${rsView.customer.delivery_mode}`}}</small>
          </q-chip>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
        <div class="col-12">
          <q-markup-table class="no-shadow text-weight-light">
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
import PagePrintBreak from '@/components/page-print-break'

export default {
  mixins: [MixView],
  components: { PagePrint, PagePrintBreak },
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
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.deleted_at) return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      if (this.rsView.hasOwnProperty('revise_id') && !this.rsView.revise_id) return false
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
.sign-tag
  margin-top 40px
  vertical-align bottom
</style>
