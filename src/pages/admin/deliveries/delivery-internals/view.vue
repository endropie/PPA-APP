<template>
  <q-page padding class="column justify-start items-center"  v-if="VIEW.show">

    <page-print v-if="rsView">
      <div slot="header-tags" class="column no-wrap items-end">
        <div class="print-hide no-padding">
          <ux-chip-status :row="rsView" tag outline dense square icon='bookmark' class="no-margin" />
          <!-- <q-chip tag outline small square color="orange-10" class="text-uppercase" :label="$tc('form.temporary')" v-if="rsView.is_internal" /> -->
        </div>
        <div class="text-subtitle2 text-weight-bold text-uppercase text-center on-right">
          {{$tc('general.sj_internal',2)}}
        </div>
      </div>
      <div class="column" style="min-height:11cm;height:auto">
        <div class="row q-gutter-x-sm q-pb-sm" :class="{'no-wrap': $q.screen.gt.xs}">
          <div class="" style="max-width:50%">
            <div class="text-weight-medium uppercase">To: {{rsView.customer_name}}</div>
            <address class="text-normal">{{rsView.customer_address}}</address>
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
                      {{ rsView.fullnumber || rsView.number }}
                      </td>
                  </tr>
                  <tr>
                    <td>{{$tc('label.date')}}</td>
                    <td>{{$app.date_format(rsView.date)}}</td>
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
              <q-th auto-width>No.</q-th>
              <q-th width="40%">{{$tc('label.part')}}</q-th>
              <q-th width="20%">{{$tc('label.quantity')}}</q-th>
              <q-th width="15%">{{$tc('label.unit')}}</q-th>
              <q-th width="30%">{{$tc('label.note')}}</q-th>
            </q-tr>
            </thead>
            <tbody v-for="(row, index) in rsView.option.delivery_internal_items" :key="index">
              <q-tr>
                <q-td>{{index+1}}</q-td>
                <q-td>{{row.name}}</q-td>
                <q-td align="right">{{row.quantity}}</q-td>
                <q-td align="center">{{row.unit}}</q-td>
                <q-td>{{row.note}}</q-td>
              </q-tr>
            </tbody>
          </q-markup-table>
        </div>
        <div v-show="Boolean(rsView.option.description)">
            <div class="q-my-xs">{{$tc('label.description')}}:</div>
            <div class="q-my-xs" style="min-height:30px">{{ rsView.option.description }}</div>
        </div>
        <q-space />
        <div class="page-break-inside">
          <q-markup-table dense :dark="LAYOUT.isDark" class="no-shadow text-weight-light" style="">
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

      <div class="row q-gutter-xs print-hide" style="padding-top:50px">
        <q-btn :label="$tc('form.back')" color="dark" icon="cancel" :to="`${VIEW.resource.uri}?return`" />
        <q-btn :label="$tc('form.print')" color="grey" icon="print" @click.native="print()" />
        <q-btn :label="$tc('form.edit')" color="green" icon="edit" :to="`${VIEW.resource.uri}/${ROUTE.params.id}/edit`"
          v-if="IS_EDITABLE && $app.can('sj-delivery-orders-update')" />
        <q-space />
        <ux-btn-dropdown color="blue-grey"
          :options="[
            { label: $tc('form.add_new'), color:'green', icon: 'add',
              hidden: !$app.can('sj-delivery-orders-create'),
              detail: $tc('messages.process_create'),
              actions: () => {
                $router.push(`${VIEW.resource.uri}/create`)
              }
            },
            { label: 'DELETE', color:'red', icon: 'delete',
              hidden: !IS_EDITABLE || !$app.can('sj-delivery-orders-delete'),
              detail: $tc('messages.process_delete'),
              actions: () => {
                VIEW.delete()
              }
            },
            // { label: $tc('form.validation').toUpperCase(), color:'teal', icon: 'check',
            //  hidden: !IS_EDITABLE || !this.$app.can('pre-delivery-order-validation'),
            //  detail:$tc('messages.process_validation'),
            //  actions: () => {
            //    setValidation()
            //  }
            // },
            { label: 'VOID', color:'red', icon: 'block',
              hidden: !IS_VOID || !$app.can('sj-delivery-orders-delete'),
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
        resource: {
          api: '/api/v1/incomes/delivery-internals',
          uri: '/admin/deliveries/delivery-internals',
          params: '?mode=view'
        }
      },
      rsView: null,
      remain_only: true,
      isDoubleUnit: false
    }
  },
  created () {
    this.init()
  },
  computed: {
    IS_VOID () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status === 'OPEN') return false
      return true
    },
    IS_EDITABLE () {
      if (this.rsView.deleted_at) return false
      if (this.rsView.status !== 'OPEN') return false
      // if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
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
    setView (data) {
      this.rsView = data
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
            this.$app.response.error(error.response, 'FORM REVISION')
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
