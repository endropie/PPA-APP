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
      <q-field borderless dense hide-bottom-space
        :label="$tc('label.mode', 0, 1 , { v: $tc('label.transaction') })" stack-label
        :error="errors.has('transaction')"
        :error-message="errors.first('transaction')"
      >
        <q-option-group slot="control" type="radio" inline class="q-mt-sm"
          name="transaction"
          v-model="rsForm.transaction"
          :options="CONFIG.options.transaction_mode"
          :dark="LAYOUT.isDark"
          v-validate="'required'"
          :disable="Boolean(rsForm.customer_id)"
        />
      </q-field>
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-md-6">
          <ux-select
            :label="$tc('general.customer')"  stack-label
            v-model="rsForm.customer"
            filter clearable
            source="api/v1/incomes/customers?mode=all&--with=customer_trips"
            :option-label="(item) => `[${item.code}] ${item.name}`"
            :disable="Boolean(!rsForm.transaction || rsForm.delivery_load_items.find(i => i.item_id))"
            v-validate="'required'"
            name="customer_id" :data-vv-as="$tc('general.customer')"
            :error="errors.has('customer_id')"
            :error-message="errors.first('customer_id')"
            @input="(v) => {
              rsForm.customer_id = v ? v.id : null
              rsForm.customer_name = v ? v.name : null
              rsForm.customer_phone = v ? v.phone : null
              rsForm.customer_address = v ? v.address : null
              rsForm.order_mode = v ? v.order_mode : null
            }"
          />
          <div class="row q-col-gutter-x-sm">
            <ux-date type="date" no-error-icon
              class="col-12 col-sm-6"
              :label="$tc('label.date')" stack-label
              v-model="rsForm.date"
              :disable="Boolean(!rsForm.transaction || rsForm.delivery_load_items.find(i => i.item_id))"
              v-validate="'required'"
              name="date"
              :error="errors.has('date')"
              :error-message="errors.first('date')"
            />
            <q-input type="time" no-error-icon
              class="col-12 col-sm-6"
              :label="$tc('label.time')" stack-label
              :disable="Boolean(!rsForm.customer_id)"
              v-model="rsForm.trip_time"
              v-validate="'required'"
              name="trip_time" :data-vv-as="$tc('label.time')"
              :error="errors.has('trip_time')"
              :error-message="errors.first('trip_time')"
            >
              <q-btn slot="after" icon="list" :disable="!rsForm.customer" dense outline class="no-padding">
                <q-menu persistent auto-close>
                  <q-list bordered v-if="rsForm.customer">
                    <q-item clickable v-for="(ct, indexCT) in rsForm.customer.customer_trips || []" :key="indexCT"
                      @click="rsForm.trip_time = ct.time"
                    >
                      <q-item-section avatar>
                        <q-icon color="primary" name="timer" />
                      </q-item-section>
                      <q-item-section>{{String(ct.time).substring(0,5)}}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-input>
          </div>
          <div class="row q-col-gutter-x-sm">
            <ux-select class="col-12 col-sm-6"
              name="vehicle_id"
              :label="$tc('general.vehicle')"
              v-model="rsForm.vehicle"
              source="api/v1/references/vehicles?mode=all&type=DELIVERY"
              :option-label="(item) => `${item.number}`"
              option-value="id"
              filter clearable
              :error="errors.has('vehicle_id')"
              :error-message="errors.first('vehicle_id')"
              @input="(v) => {
                rsForm.vehicle = v ? v : null
                rsForm.vehicle_id = v ? v.id : null
              }"
            />
            <q-input type="text" class="col-12 col-sm-6"
              :label="$tc('label.delivery_note')"
              v-model="rsForm.customer_note"
              hint=" "
              :error="errors.has('delivery_note')"
              :error-message="errors.first('delivery_note')"
            />
            <!-- <q-select dense outlined
              style="min-width: 80px"
              name="rit"
              v-model="rsForm.rit"
              :options="[1,2,3,4,5,6,7,8,9,10]"
              prefix="RIT"
              v-validate="'required'"
              :error="errors.has('rit')"
              :error-message="errors.first('rit')"
            /> -->
          </div>
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
          <q-input type="textarea" autogrow
            input-style="min-height: 87px"
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
    <q-card-section :class="$app.classDimmed(!Boolean(rsForm.customer_id && rsForm.date))" >
      <!-- COLUMN:: Part items lists -->
      <q-markup-table bordered class="main-box no-shadow no-highlight q-mb-sm"
        dense separator="horizontal">
        <thead>
          <q-tr class="text-uppercase" style="line-height:30px">
            <q-th key="prefix" width="50px"></q-th>
            <q-th key="part" width="40%">{{$tc('items.part_name')}}</q-th>
            <q-th key="quantity" width="15%">{{$tc('label.quantity')}}</q-th>
            <q-th key="unit" width="15%">{{$tc('label.unit')}}</q-th>
            <q-th key="note" width="25%">{{$tc('label.encasement')}}</q-th>
          </q-tr>
        </thead>
        <tbody>
          <q-tr v-for="(row, rowIndex) in rsForm.delivery_load_items" :key="rowIndex">
            <q-td name="prefix">
              <q-btn dense flat outline tabindex="1000" color="negative" icon="clear" @click="removeDetail(rowIndex)" />
            </q-td>
            <q-td name="part">
              <ux-select dense outlined hide-bottom-space
                v-model="row.item"
                filter clearable
                :source="`/api/v1/common/items?mode=all&--limit=50&delivery_date=${rsForm.date}&customer_id=${rsForm.customer_id}`"
                :source-key="['part_name', 'part_number', 'code']"
                option-label="part_name"
                :option-sublabel="(opt) => `[${opt.customer_code}] ${opt.part_number}`"
                v-validate="'required'"
                :name="`delivery_load_items.${rowIndex}.item_id`"
                :error-message="errors.first(`delivery_load_items.${rowIndex}.item_id`)"
                :autofocus="row.hasOwnProperty('_autofocus')"
                @focus="delete row._autofocus"
                @input="(v) => {
                  row.item_id = v ? v.id : null
                  row.unit_id = v ? v.unit_id : null
                  row.unit_rate = v ? 1 : null
                  row.unit = v ? { value: v.unit.id, label: v.unit.code, rate:1 } : null
                }"
              />
            </q-td>
            <q-td name="quantity">
              <q-input type="number" dense outlined hide-bottom-space no-error-icon
                v-model="row.quantity"
                v-validate="`required|gt_value:0|max_value:${UnitMax[rowIndex]}`"
                :name="`delivery_load_items.${rowIndex}.quantity`"
                :data-vv-as="$tc('label.quantity')"
                :error="errors.has(`delivery_load_items.${rowIndex}.quantity`)"
                :error-message="errors.first(`delivery_load_items.${rowIndex}.quantity`)"
              >
                <span slot="append" class="text-subtitle2" >
                  <span v-if="UnitMax[rowIndex] > 0">/ {{$app.number_format(UnitMax[rowIndex])}}</span>
                  <span v-else>[~]</span>
                </span>
              </q-input>
            </q-td>
            <q-td name="satuan">
              <q-select type="text" dense outlined hide-bottom-space no-error-icon
                v-model="row.unit"
                :options="ItemUnitOptions[rowIndex]"
                :option-label="opt => opt.code || opt.label"
                v-validate="'required'"
                :name="`delivery_load_items.${rowIndex}.unit_id`"
                :error="errors.has(`delivery_load_items.${rowIndex}.unit_id`)"
                @input="(v) => {
                  row.unit_id = v.value
                  row.unit_rate = v.rate
                }"
              />
            </q-td>
            <q-td name="encasement">
              <q-input type="text" dense outlined hide-bottom-space
                v-model="row.encasement"
                :name="`delivery_load_items.${rowIndex}.encasement`"
                :error="errors.has(`delivery_load_items.${rowIndex}.encasement`)"
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

      <q-input type="textarea" autogrow
        filled class="q-mb-sm" input-style="min-height:45px"
        v-model="rsForm.description"
        :label="$tc('label.description')" stack-label
      />
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
        units: { data: [], api: '/api/v1/references/units?mode=all' }
      },
      FORM: {
        resource: {
          api: '/api/v1/incomes/delivery-loads',
          uri: '/admin/deliveries/delivery-loads'
        }
      },
      rsForm: null,
      setDefault: () => {
        return {
          number: null,
          transaction: null,
          order_mode: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          trip_time: null,
          customer: null,
          customer_id: null,
          customer_name: null,
          customer_phone: null,
          customer_address: null,
          vehicle: null,
          vehicle_id: null,
          customer_note: null,
          delivery_load_items:
          [{
            name: null,
            quantity: null,
            unit: null,
            notes: null
          }],
          description: null
        }
      }
    }
  },
  created () {
    // Component Page Created!
    this.init()
  },
  computed: {
    UnitMax () {
      let maximum = Object.assign({
        total: {},
        add: function (id, v) {
          if (!maximum.total[id]) maximum.total[id] = 0
          maximum.total[id] += v
        }
      })
      return this.rsForm.delivery_load_items.map((detail, i) => {
        if (!detail.item) return 0
        const amount = detail.item.amount_delivery
        let available = (amount['VERIFY'] - amount['LOAD.REG'] + amount['LOAD.RET'])
        if (!maximum.total[detail.item.id]) maximum.total[detail.item.id] = 0
        const result = available - maximum.total[detail.item.id]
        maximum.add(detail.item.id, detail.quantity * detail.unit_rate)
        return result / (detail.unit_rate || 1)
      })
    },
    UnitOptions () {
      return (this.SHEET.units.data.map(item => ({ label: item.code, value: item.id })) || [])
    },
    ItemUnitOptions () {
      // return varItemUnits
      return this.rsForm.delivery_load_items.map((rsItem, key) => {
        return this.UnitOptions
          .filter((unit) => {
            if (!rsItem.item) return
            if (rsItem.item.unit_id === unit.value) return true

            const find = rsItem.item.item_units.find((fill) => fill.unit_id === unit.value)
            if (rsItem.item.item_units && find) return true
          })
          .map(unit => {
            if (rsItem.item.unit_id === unit.value) return { ...unit, rate: 1 }
            const find = rsItem.item.item_units.find((fill) => fill.unit_id === unit.value)
            if (rsItem.item.item_units && find) {
              return { ...unit, rate: find.rate }
            }
          })
      })
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
      const newitem = Object.assign(this.setDefault().delivery_load_items[0], { _autofocus: true })
      this.rsForm.delivery_load_items.push(newitem)
    },
    removeDetail (index) {
      this.rsForm.delivery_load_items.splice(index, 1)
      if (!this.rsForm.delivery_load_items.length) this.addNewDetail()
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
