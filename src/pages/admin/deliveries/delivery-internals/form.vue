<template>
<q-page padding class="form-page justify-center">
  <q-card inline class="main-box" v-if="FORM.show">
    <q-card-section class="q-py-xs">
      <form-header :title="FORM.title()" :subtitle="`# ` + (rsForm.fullnumber || rsForm.number || FORM.subtitle())" hide-menu>
        <template  slot="menu-append">
          <ux-chip-status square outline :row="rsForm" v-if="rsForm.status" />
        </template>
      </form-header>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-md-6">
          <ux-select
            name="customer_id"
            :label="$tc('general.customer')"  stack-label
            v-model="rsForm.customer"
            filter clearable
            source="api/v1/incomes/customers?mode=all"
            :option-label="(item) => `[${item.code}] ${item.name}`"
            option-value="id"
            v-validate="'required'"
            :error="errors.has('customer_id')"
            :error-message="errors.first('customer_id')"
            @input="(v) => {
              rsForm.customer = v ? v : null
              rsForm.customer_id = v ? v.id : null
              rsForm.customer_name = v ? v.name : null
              rsForm.customer_phone = v ? v.phone : null
              rsForm.customer_address = v ? v.address : null
            }"
          />
          <ux-date dense
            name="date" type="date"
            v-model="rsForm.date"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('date')"
            :error-message="errors.first('date')"
          />
        </div>
        <div class="col-12 col-md-6" >
          <div class="row q-col-gutter-x-sm">
            <q-input class="col" name="customer_name"
              :label="$tc('label.name')"  stack-label
              v-model="rsForm.customer_name"
              :dark="LAYOUT.isDark"
              v-validate="'required'"
              :error="errors.has('customer_name')" />

            <q-input class="col-12 col-sm-auto" name="customer_phone"
              :label="$tc('label.phone')"  stack-label
              v-model="rsForm.customer_phone"
              :dark="LAYOUT.isDark"
              v-validate="''"
              :error="errors.has('customer_phone')"/>
          </div>
          <q-input type="textarea" autogrow rows="3"
            name="customer_address"
            :label="$tc('label.address')"  stack-label
            :dark="LAYOUT.isDark"
            v-model="rsForm.customer_address"
          />
        </div>
      </div>
    </q-card-section>
    <q-separator inset />
    <!-- SINGLE-REVISION -->
    <q-card-section>
      <!-- COLUMN:: Part items lists -->
      <q-markup-table bordered class="main-box no-shadow no-highlight q-mb-sm"
        dense separator="horizontal"
        :dark="LAYOUT.isDark">
        <thead>
          <q-tr class="text-uppercase" style="line-height:30px">
            <q-th key="prefix" width="50px"></q-th>
            <q-th key="part" width="40%">{{$tc('items.part_name')}}</q-th>
            <q-th key="quantity" width="15%">{{$tc('label.quantity')}}</q-th>
            <q-th key="unit" width="15%">{{$tc('label.unit')}}</q-th>
            <q-th key="note" width="25%">{{$tc('label.note')}}</q-th>
          </q-tr>
        </thead>
        <tbody>
          <q-tr v-for="(row, rowIndex) in rsForm.option.delivery_internal_items" :key="rowIndex">
            <q-td name="prefix">
              <q-btn dense flat outline tabindex="1000" color="negative" icon="clear" @click="removeDetail(rowIndex)" />
            </q-td>
            <q-td name="part">
              <q-input type="text" dense outlined hide-bottom-space
                v-model="row.name"
                v-validate="'required'"
                :name="`option.delivery_internal_items.${rowIndex}.name`"
                :error="errors.has(`option.delivery_internal_items.${rowIndex}.name`)"
                :autofocus="row.hasOwnProperty('_autofocus')"
                @focus="delete row._autofocus"
                />
            </q-td>
            <q-td name="quantity">
              <q-input type="number" dense outlined hide-bottom-space
                v-model="row.quantity"
                v-validate="'required'"
                :name="`option.delivery_internal_items.${rowIndex}.quantity`"
                :error="errors.has(`option.delivery_internal_items.${rowIndex}.quantity`)"
              />
            </q-td>
            <q-td name="satuan">
              <q-input type="text" dense outlined hide-bottom-space
                v-model="row.unit"
                :name="`option.delivery_internal_items.${rowIndex}.unit`"
                :error="errors.has(`option.delivery_internal_items.${rowIndex}.unit`)"
              />
            </q-td>
            <q-td name="note">
              <q-input type="text" dense outlined hide-bottom-space
                v-model="row.note"
                :name="`option.delivery_internal_items.${rowIndex}.note`"
                :error="errors.has(`option.delivery_internal_items.${rowIndex}.note`)"
              />
            </q-td>
          </q-tr>
          <q-tr>
            <q-td>
              <q-btn dense color="positive" icon="add" @click="addNewDetail" />
            </q-td>
            <q-td rowspan="100%"></q-td>
          </q-tr>
        </tbody>
      </q-markup-table>
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input type="textarea" autogrow
            filled class="q-mb-sm self-start" input-style="min-height:95px"
            v-model="rsForm.option.description"
            :label="$tc('label.description')" stack-label
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select type="text" autogrow
            filled class="q-mb-sm"
            emit-value map-options
            v-model="rsForm.reason_id"
            :options="ReasonOptions"
            :label="$tc('label.reason')"
          />
          <q-input type="text" autogrow
            name="reason_description"
            filled class="q-mb-sm"
            v-model="rsForm.reason_description"
            :label="$tc('label.note') + ' Internal'"
            v-validate="Boolean(rsForm.reason_id) ? '' : 'required'"
            :error="errors.has('reason_description')"
          />
        </div>
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()"></q-btn>
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark">
    <q-spinner-dots size="70px" color="primary" />
  </q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {
    return {
      SHEET: {
        reasons: { api: '/api/v1/references/reasons?mode=all&type=DELIVERY_INTERNAL' }
      },
      FORM: {
        resource: {
          api: '/api/v1/incomes/delivery-internals',
          uri: '/admin/deliveries/delivery-internals'
        }
      },
      rsForm: null,
      setDefault: () => {
        return {
          number: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          customer: null,
          customer_id: null,
          reason_id: null,
          reason_description: null,
          option: {
            delivery_internal_items: [
              {
                name: null,
                quantity: null,
                unit: null,
                notes: null
              }
            ],
            description: null
          }
        }
      }
    }
  },
  created () {
    // Component Page Created!
    this.init()
  },
  computed: {
    ReasonOptions () {
      return (this.SHEET.reasons.data
        .filter(item => item.enable)
        .map(item => ({ label: item.name, value: item.id })) || [])
        .concat([{ label: this.$tc('label.others'), value: null }])
    }
  },
  watch: {
    '$route': 'init'
  },
  methods: {
    init () {
      this.FORM.load((data) => {
        this.setForm(data || this.setDefault())
      })
    },
    setForm (data) {
      this.rsForm = Object.assign({}, this.setDefault(), data)
    },

    addNewDetail () {
      const newitem = Object.assign(this.setDefault().option.delivery_internal_items[0], { _autofocus: true })
      this.rsForm.option.delivery_internal_items.push(newitem)
    },
    removeDetail (index) {
      this.rsForm.option.delivery_internal_items.splice(index, 1)
      if (!this.rsForm.option.delivery_internal_items.length) this.addNewDetail()
    },
    onSave () {
      const submit = () => {
        this.FORM.loading = true
        const { apiUrl, method } = this.FORM.meta()
        this.$axios.set(method, apiUrl, this.rsForm)
          .then((response) => {
            let message = response.data.number + ' - #' + response.data.id
            this.FORM.response.success({ message: message })
            this.FORM.toView(response.data.id)
          })
          .catch((error) => {
            this.FORM.response.fields(error.response)
            this.FORM.response.error(error.response || error, 'REVISION FAILED')
          })
          .finally(() => {
            this.FORM.loading = false
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
          message: this.$tc('messages.to_sure', 1, { v: this.$tc('form.save') }),
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
