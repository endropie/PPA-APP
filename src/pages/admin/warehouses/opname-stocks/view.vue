<template>
  <q-page class="row justify-center" :dark="LAYOUT.isDark" style="min-width:210mm;">
    <page-print v-if="VIEW.show" class="q-ma-md q-pr-lg shadow-2" style="max-width:210mm;">
      <span slot="header-title" style="font-size:26px">Priuk Perkasa Abadi, PT</span>
      <span slot="header-subtitle" style="font-size:16px">Warehouses - Incoming Good</span>
      <div slot="header-tags" class="print-hide">
      <q-chip class="shadow-1" square outline
        color="blue-grey" text-color="white"
        label="RET" v-if="rsView.transaction === 'RETURN'" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <div class="row q-col-gutter-md" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6">
                {{$tc('general.opname_stocks')}}
              </div>
            </div>
            <div>
              <q-markup-table class="super-dense bordered no-shadow" separator="cell" :dark="LAYOUT.isDark">
                <tr>
                  <th>{{$tc('label.number')}}</th>
                  <td>
                    {{rsView.number}}
                    <span v-text="'REV.'+rsView.revise_number" v-if="Boolean(rsView.revise_number)"/>
                  </td>
                </tr>
                <tr>
                  <th>{{$tc('label.date')}}</th>
                  <td>{{ $app.date_format(rsView.date) }}</td>
                </tr>
                <tr>
                  <th>{{$tc('label.reference')}}</th>
                  <td>{{ rsView.reference || '-'}}</td>
                </tr>
              </q-markup-table>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-table ref="table" class="no-highlight bordered no-shadow" color="secondary" separator="vertical" dense hide-bottom :dark="LAYOUT.isDark"
            :data="rsView.opname_stock_items"
            no-data-label = "No Detail"
            :rows-per-page-options ="[0]"
            :pagination="{page: null, rowsPerPage: 0 }"
            :columns="[
              { name: 'code', label:  this.$tc('general.cust'), align: 'left', field: (v)=> v.item.customer_code},
              { name: 'part_name', label: this.$tc('items.part_name'), align: 'left', field: (v)=> v.item.part_name},
              { name: 'part_number', label: this.$tc('items.part_number'), align: 'left', field: (v)=> v.item.part_number},
              { name: 'quantity', label: $tc('label.quantity'), align: 'center'},
              { name: 'init_amount', label: $tc('items.stock_init'), align: 'right',
                field: (v)=> v.init_amount, format: (v) => $app.number_format(v)},
              { name: 'final_amount', label: $tc('items.stock_final'), align: 'right',
                field: (v)=> v.final_amount, format: (v) => $app.number_format(v)}
            ]"
          >
          <template v-slot:body-cell-quantity="rsItem">
            <q-td class="text-right">
              <q-badge class="float-left"
                :color="rsItem.row.quantity > 0 ? 'positive' : 'negative'">
                <q-icon  name="mdi-chevron-double-up" v-if="rsItem.row.quantity > 0" />
                <q-icon  name="mdi-chevron-double-down" v-if="rsItem.row.quantity < 0" />
              </q-badge>
              <span v-if="rsItem.row.quantity" v-html="$app.number_format(Math.abs(rsItem.row.quantity))"/>
              <span class="q-pl-xs" v-if="rsItem.row.unit" v-html="rsItem.row.unit.code" />
            </q-td>
          </template>
          </q-table>
        </div>
        <div class="col-12">
            <div class="q-my-xs text-italic">{{$tc('label.description')}}:</div>
            <div class="q-my-xs text-weight-light" style="min-height:30px">{{ rsView.description }}</div>
        </div>
      </div>
      <div class="q-gutter-xs print-hide" style="padding-top:50px">
        <q-btn :label="$tc('form.list')" icon="list" color="dark" :to="`${VIEW.resource.uri}?return`" />
        <q-btn :label="$tc('form.print')" color="grey" icon="print" @click.native="print()" />
        <q-btn :label="$tc('form.edit')" color="green" icon="edit" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"
          v-if="IS_EDITABLE && isCanUpdate" />

        <ux-btn-dropdown color="blue-grey" no-caps class="float-right"
          :label="$tc('label.others')"
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
              hidden: !IS_EDITABLE || !this.$app.can('opname-stocks-validation'),
              detail:$tc('messages.process_validation'),
              actions: () => {
                setValidation()
              }
            },
            { label: (`${$tc('form.revision')}`).toUpperCase(), color:'teal', icon: 'check',
              hidden: !IS_REVISE || rsView.status !== 'VALIDATED' || !this.$app.can('opname-stocks-revision'),
              // detail:$tc('messages.process_revision'),
              actions: () => {
                setRevision()
              }
            },
            { label: 'VOID', color:'red', icon: 'block',
              hidden: !IS_VOID,
              detail: $tc('messages.process_void'),
              actions: () => {
                VIEW.void(()=> init() )
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
          api: '/api/v1/warehouses/opname-stocks',
          uri: '/admin/warehouses/opname-stocks',
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
      return this.$app.can('opname-stocks-create')
    },
    isCanUpdate() {
      return this.$app.can('opname-stocks-update')
    },
    isCanDelete() {
      return this.$app.can('opname-stocks-delete')
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
      if (!this.$app.can('opname-stocks-void')) return false
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
    setRevision () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/revision`)
    },
    setValidation () {
      const submit = () => {

        this.VIEW.loading = true
        let apiUrl = this.VIEW.resource.api + '/' + this.ROUTE.params.id
        apiUrl += '?mode=validation&nodata=true'
        this.$axios.put(apiUrl, {})
        .then((response) => {
          this.$app.notify.success({
            message: this.$tc('messages.success_validated').toUpperCase(),
            detail: this.$tc('messages.form_has_validated',1, {v:response.data.number})
          })
          this.init()
        })
        .catch((error) => {
          this.$app.response.error(error.response || error, 'UPDATE FAILED');
        })
        .finally(()=>{
          setTimeout(() => {
            this.VIEW.loading = false
          }, 1000)

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
    },
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    setView(data) {
      this.rsView =  JSON.parse(JSON.stringify(data))
    },
  }
}
</script>
