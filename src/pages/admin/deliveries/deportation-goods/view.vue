<template>
  <q-page padding class="column justify-start items-center" :dark="LAYOUT.isDark">
    <page-print v-if="VIEW.show">
      <div slot="header-tags" class="print-hide">
        <q-chip square outline icon='bookmark'
          color="blue-grey" text-color="white"
          label="NCR" v-if="rsView.transaction === 'RETURN'" />
        <q-chip square outline icon='bookmark'
          color="blue-grey" text-color="white"
          label="SAMPLE" v-if="rsView.transaction === 'SAMPLE'" />
        <ux-chip-status :row="rsView" tag outline small square icon='bookmark' />
      </div>
      <div class="row q-col-gutter-md" >
        <div class="col-12">
          <div class="row justify-between q-gutter-sm" >
            <div class="items-end q-pt-lg">
              <div class="text-h6">
                DEPORTATION GOOD
              </div>
              <div v-if="rsView.customer">
                 {{ rsView.customer.name }}
              </div>
            </div>
            <div class="row items-start q-gutter-x-sm">
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
          <q-markup-table dense bordered square separator="cell" class="table-print no-shadow no-highlight"  :dark="LAYOUT.isDark">
            <thead>
            <q-tr class="text-uppercase" style="line-height:25px">
              <q-th width="35%" v-if="!isHideColumn('part_name')">{{ $tc('label.name', 1, {v: $tc('label.part')}) }}</q-th>
              <q-th width="30%" v-if="!isHideColumn('part_subname')">{{ $app.setting('item.subname_label') }}</q-th>
              <q-th width="15%" v-if="!isHideColumn('unit')">{{ $tc('label.unit') }}</q-th>
              <q-th width="20%" v-if="!isHideColumn('quantity')">{{ $tc('label.quantity') }}</q-th>
            </q-tr>
            </thead>
            <tbody>
              <q-tr v-for="(row, index) in rsView.deportation_good_items" :key="index" :request-order-item-id="row.id">
                <q-td v-if="!isHideColumn('part_name')">{{row.item.part_name}}</q-td>
                <q-td v-if="!isHideColumn('part_subname')">{{row.item.part_subname}}</q-td>
                <q-td v-if="!isHideColumn('unit')" class="text-center">{{row.unit.code}}</q-td>
                <q-td v-if="!isHideColumn('quantity')" class="text-right">{{$app.number_format(row.quantity, row.unit.decimal_in)}}</q-td>
              </q-tr>
            </tbody>
          </q-markup-table>
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
              hidden: !IS_EDITABLE || !this.$app.can('deportation-goods-validation'),
              detail:$tc('messages.process_validation'),
              actions: () => {
                setValidation()
              }
            },
            /* {
              label: (`${$tc('form.revision')}`).toUpperCase(), color:'orange', icon: 'edit',
              hidden: !IS_REVISE || rsView.status !== 'VALIDATED' || !this.$app.can('deportation-goods-revision'),
              detail:$tc('messages.process_revise'),
              actions: () => {
                setRevision()
              }
            }, */
            { label: 'VOID', color:'red', icon: 'block',
              hidden: !IS_VOID,
              detail: $tc('messages.process_void'),
              actions: () => {
                VIEW.void(()=> init() )
              }
            }
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

export default {
  mixins: [MixView],
  components: { PagePrint },
  data () {
    return {
      VIEW: {
        resource:{
          api: '/api/v1/warehouses/deportation-goods',
          uri: '/admin/deliveries/deportation-goods',
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
      return this.$app.can('deportation-goods-create')
    },
    isCanUpdate() {
      return this.$app.can('deportation-goods-update')
    },
    isCanDelete() {
      return this.$app.can('deportation-goods-delete')
    },
    IS_LOTS() {
      if (this.rsView.transaction !== 'REGULER') return false
      if (this.rsView.order_mode !== 'NONE') return false
      if (!this.rsView.customer) return false
      return this.rsView.customer.order_lots
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
      if (!this.$app.can('deportation-goods-void')) return false
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
    isHideColumn(val) {
      const setting = this.$store.state.admin.SETTING.deportation_good
        ? this.$store.state.admin.SETTING.deportation_good['hide_view_columns'] || []
        : []

      if (setting.some(v => val === v)) return true

      const hidden = this.$store.state.admin.CONFIG.deportation_good
        ? this.$store.state.admin.CONFIG.deportation_good['hide_view_columns']
        : []
      return Boolean( hidden.some(v => val === v) )
    },
    setRevision () {
      this.$router.push(`${this.VIEW.resource.uri}/${this.ROUTE.params.id}/revision`)
    },
    setValidation () {
      const submit = () => {

        this.$q.loading.show()
        const apiUrl = `${this.VIEW.resource.api}/${this.rsView.id}?mode=validation&nodata`
        this.$axios.set('PUT', apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.$app.notify.success('VALIDATION SUCCESS', message)
          this.init()
        })
        .catch((error) => {
          let message = error.response
            ? (error.response.data.message || undefined) : undefined
          this.$app.notify.error('VALIDATION FAILED', message)
        })
        .finally(()=>{
          this.$q.loading.hide()
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
