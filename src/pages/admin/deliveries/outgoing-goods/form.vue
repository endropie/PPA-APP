<template>
<q-page padding class="form-page justify-center">
  <q-card inline class="main-box q-ma-sm " v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >

      </form-header>
    </q-card-section>
    <!-- COLUMN::1st customer Identitity -->
    <q-card-section class="row q-col-gutter-x-md">
      <q-field class="col-12"
        borderless stack-label hide-bottom-space
        :label="$tc('label.mode',1, {v:$tc('label.transaction')})"
        :dark="LAYOUT.isDark"
        :disable="Boolean(rsForm.customer_id)"
        :error="errors.has('transaction')"
        :error-message="errors.first('transaction')"
        v-show="this.ROUTE.meta.mode !== 'edit'">

        <q-option-group slot="control"
          name="transaction" type="radio" inline
          v-model="rsForm.transaction"
          :options="CONFIG.options.transaction_mode"
          :dark="LAYOUT.isDark"
          :disable="Boolean(rsForm.customer_id)"
          v-validate="'required'"
        />
      </q-field>
    </q-card-section>
    <q-card-section class="row q-col-gutter-x-md" :class="{'light-dimmed': !rsForm.transaction}">
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <ux-select-filter name="customer_id" class="col-12" hide-bottom-space
            v-model="rsForm.customer_id"
            :label="$tc('general.customer')"
            :options="CustomerOptions" filter clearable
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('customer_id')"
            :error-message="errors.first('customer_id')"
            @input="setCustomerReference" />

          <ux-date name="date" type="date" class="col-12 col-sm-6" hide-bottom-space
            stack-label label="Date"
            v-model="rsForm.date"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('date')"
            :error-message="errors.first('date')"/>

          <ux-date name="due_date" type="date" class="col-12 col-sm-6" hide-bottom-space
            stack-label label="Due Date"
            v-model="rsForm.due_date"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('due_date')"
            :error-message="errors.first('due_date')"/>

          <ux-select-filter class="col-9"
            name="vehicle_id"
            :label="$tc('transports.seri')" stack-label
            v-model="rsForm.transport_number"
            hide-bottom-space autocomplete="off"
            :options="VehicleOptions"
            :dark="LAYOUT.isDark"
            :error="errors.has('vehicle_id')"
            :error-message="errors.first('vehicle_id')" />

          <q-select class="col-3"
            name="rit" label="RIT"
            v-model="rsForm.rit" clearable
            hide-bottom-space no-error-icon hide-dropdown-icon
            :options="RitOptions" options-dense
            :options-dark="LAYOUT.isDark" :dark="LAYOUT.isDark"
            v-validate="'min_value:0'"
            :error="errors.has('rit')" />

          <q-input name="customer_note" class="col-12"
            stack-label :label="$tc('label.no',1, {v:'DN'})"
            v-model="rsForm.customer_note"
            :dark="LAYOUT.isDark"
            v-validate="''" />

        </div>
      </div>
      <!-- COLUMN::2nd Transaction details -->
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">

          <q-input name="customer_name" class="col-12"
            stack-label label="Name"
            v-model="rsForm.customer_name"
            :dark="LAYOUT.isDark"
            v-validate="'required'" />

          <q-input name="customer_phone" class="col-12"
            stack-label label="phone"
            v-model="rsForm.customer_phone"
            :dark="LAYOUT.isDark" />

          <q-input name="customer_address" class="col-12"
            type="textarea" rows="4"
            stack-label label="Address"
            v-model="rsForm.customer_address"
            :dark="LAYOUT.isDark" />
        </div>
      </div>
      <!-- COLUMN::3th Part items lists -->
      <div class="col-12 q-my-md" >
        <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
          dense separator="horizontal"
          :dark="LAYOUT.isDark">
          <q-tr>
            <q-th key="prefix"></q-th>
            <q-th key="item_id" class="text-left">{{$tc('items.part_name')}}</q-th>
            <q-th key="part_number" class="text-left">{{$tc('items.part_number')}}</q-th>
            <q-th key="quantity">{{$tc('label.quantity')}}</q-th>
            <q-th key="unit_id">{{$tc('label.unit')}}</q-th>
          </q-tr>
          <q-tr v-for="(row, index) in rsForm.outgoing_good_items" :key="index">
            <q-td key="prefix" width="50px" class="q-gutter-x-xs">
              <q-btn dense round flat color="red" icon="clear" @click="exclude(index, row)"/>
            </q-td>
            <q-td key="part_name">
              <span v-if="Boolean(row.item)" class="">
                {{row.item.part_name}}
              </span>
            </q-td>
            <q-td key="part_number">
              <span v-if="Boolean(row.item)" class="">
                {{row.item.part_number}}
              </span>
            </q-td>
            <q-td key="unit_id" width="15%" >
              <q-select :name="`outgoing_good_items.${index}.unit_id`"
                style="min-width:60px"
                v-model="row.unit_id"
                outlined dense hide-bottom-space
                :dark="LAYOUT.isDark" color="blue-grey-5"
                :options="ItemUnitOptions[index]"
                map-options emit-value
                v-validate="row.item_id ? 'required' : ''"
                :error="errors.has(`outgoing_good_items.${index}.unit_id`)"
                @input="(val)=>{ setUnitReference(index, val) }"/>
            </q-td>
            <q-td key="quantity" width="25%" >
              <q-input :name="`outgoing_good_items.${index}.quantity`"
                style="min-width:120px"
                v-model="row.quantity" type="number" :min="0"
                outlined dense hide-bottom-space no-error-icon align="center"
                :dark="LAYOUT.isDark" color="blue-grey-5"
                v-validate="`required|gt_value:0|max_value: ${row.MAX / row.unit_rate}`"
                :error="errors.has(`outgoing_good_items.${index}.quantity`)">

                <span slot="append" class="text-subtitle2">
                  {{`/ ${$app.number_format(row.MAX / row.unit_rate)}`}}
                </span>

                <q-btn slot="after"
                  dense flat color="primary"
                  icon="done_all"
                  v-if="!row.quantity"
                  @click="row.quantity = row.MAX" >
                  <q-tooltip>{{$tc('label.all')}}</q-tooltip>
                </q-btn>
              </q-input>
            </q-td>
          </q-tr>
          <q-tr v-for="(exItem, index) in rsForm.exclude_items" :key="index"
            style="background-color: rgba(125, 125, 125, 0.2)">
            <q-td key="prefix" class="q-gutter-x-xs">
              <q-btn dense glossy color="green-5" icon="add" @click="include(index, exItem)"/>
            </q-td>
            <q-td key="part_name">
              <span v-if="Boolean(exItem.item)" class="text-strike">
                {{exItem.item.part_name}}
              </span>
            </q-td>
            <q-td key="part_number">
              <span v-if="Boolean(exItem.item)" class="text-strike">
                {{exItem.item.part_number}}
              </span>
            </q-td>
            <q-td key="unit_id" width="20%" >
            </q-td>
            <q-td key="quantity" width="20%" >
            </q-td>
          </q-tr>
          <q-tr v-show="rsForm.outgoing_good_items.length <= 0">
            <q-td colspan="100%">
              <q-banner  inline-actions class="main-box"
                :class="{
                  'bg-grey-2 text-faded': !LAYOUT.isDark,
                  'text-white': LAYOUT.isDark
                }">
                <template v-slot:avatar>
                  <q-icon v-show="errors.has('totals')" name="warning" color="warning" />
                </template>
                <span class="text-body2">
                  <input type="number" class="hidden"
                    name="totals" :data-vv-as="$tc('label.total', 1, {v:$tc('label.quantity')})"
                    :value="ITEMS_LENGTH"
                    v-validate="`required|gt_value:0`">
                  <span v-if="!rsForm.customer_id">{{ $tc('form.select_a',1,{v:$tc('general.customer')}) }}</span>
                  <span v-else-if="errors.has('totals')" class="text-red">{{ $tc('messages.no_details') }}</span>
                </span>
              </q-banner>
            </q-td>
          </q-tr>
        </q-markup-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12">
        <div class="row q-col-gutter-x-sm q-mb-md">
          <q-input class="col-12" rows="3"
            name="description" type="textarea"
            filled
            stack-label :label="$tc('label.description')"
            v-model="rsForm.description"
            :dark="LAYOUT.isDark" />
        </div>
      </div>

    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="group">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE" :loading="FORM.loading"/>
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
</q-page>
</template>

<script>
import Vue from 'vue'
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {
    return {
      SHEET: {
        customers: { api:'/api/v1/incomes/customers?mode=all'},
        employees: { api:'/api/v1/common/employees?mode=all'},
        vehicles: { api:'/api/v1/references/vehicles?mode=all'},
        units: { api:'/api/v1/references/units?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
      },
      FORM:{
        resource:{
          api: '/api/v1/warehouses/outgoing-goods',
          uri: '/admin/deliveries/outgoing-goods',
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),

          customer_id: null,
          customer_name: null,
          customer_phone: null,
          customer_address: null,
          customer_note: null,

          vehicle_id: null,
          rit: null,

          due_date: this.$app.moment().format('YYYY-MM-DD'),
          due_time: this.$app.moment().format('HH:mm'),

          description: null,
          revise_id: 0,
          outgoing_good_items:[],
          exclude_items: [],

        }
      }
    }
  },
  created() {
    // Component Page Created!
    this.init()
  },
  computed: {
    IS_EDITABLE() {
      if (this.rsForm.hasOwnProperty('revise_id') && this.rsForm.is_revision == true) return false
      if (this.rsForm.hasOwnProperty('has_relationship')) {
        if (Object.keys(this.rsForm.has_relationship).length > 0) return false
      }
      return true
    },
    RitOptions() {
      let rits = []
      for (let i = 0; i < 10; i++) rits.push(i+1)
      return rits
    },
    CustomerOptions() {
      // let label = [item.code, item.name].join('-')
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    VehicleOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.number, value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let Items = this.SHEET.items.data.filter((item) => item.customer_id === this.rsForm.customer_id)
      return (Items.map(item => ({label: `${item.code} - ${item.part_name}`, value: item.id, disable: !item.enable})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.outgoing_good_items) {
        if (this.rsForm.outgoing_good_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.outgoing_good_items[i]
          vars[i] = ( this.UnitOptions || [])
          vars[i] = vars[i].filter((unit)=> {
            if(!rsItem.item_id) return false
            if(rsItem.item) {
              if(rsItem.item.unit_id === unit.value) return true
              if(rsItem.item.item_units) {
                let filtered = rsItem.item.item_units.filter((fill)=> fill.unit_id == unit.value)
                if(filtered.length > 0) return true
              }
            }
            return false;
          })
        }
      }
      return vars
    },
    ITEMS_LENGTH() {
      return this.rsForm.outgoing_good_items.length || 0
    },
    MAPINGKEY(){
      let variables = {
        'customers' : {},
        // 'units': {},
        // 'items': {},
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      // this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      // this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })

      return variables;
    }
  },
  watch:{
    '$route' : 'init'
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        this.setForm(data || this.setDefault())
      })
    },
    setCustomerReference(val) {
      if(this.rsForm.customer_id) {
        this.rsForm.customer_name = this.MAPINGKEY['customers'][val].name
        this.rsForm.customer_phone = this.MAPINGKEY['customers'][val].phone
        this.rsForm.customer_address = this.MAPINGKEY['customers'][val].address_raw

        this.loadDetails(val)
      }
      else {
        this.rsForm.customer_name = null
        this.rsForm.customer_phone = null
        this.rsForm.customer_address = null
        this.rsForm.outgoing_good_items = []
      }
    },
    setUnitReference(index, val) {
      if(!val) return;
      else if (this.rsForm.outgoing_good_items[index].item.unit_id === val) {
        this.rsForm.outgoing_good_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.outgoing_good_items[index].item.item_units) {
          this.rsForm.outgoing_good_items[index].item.item_units.map((itemUnit)=> {
            if (itemUnit.unit_id == val) this.rsForm.outgoing_good_items[index].unit_rate = itemUnit.rate
          })
        }
      }
    },
    loadDetails(val) {
      const params = [
        `customer_id=${val}`,
        `has_stocks=VDO`
      ]

      const pickMax = (TransDO, VDO) => {
        if (Number(TransDO) < Number(VDO)) return TransDO

        return VDO
      }

      this.rsForm.outgoing_good_items = []
      this.rsForm.exclude_items = []
      this.SHEET.load('items', params.join('&'),
      (res) => {
        if (res.status === 200 && res.data.length > 0) {
          this.rsForm.outgoing_good_items = res.data.map(item => {

            // console.warn('ITEM->', item.totals)
            const maximum = this.rsForm.transaction === 'RETURN'
              ? pickMax(item.totals['PDO.RET'], item.totals['VDO'])
              : pickMax(item.totals['PDO.REG'], item.totals['VDO'])

            return {
              outgoing_good_id: null,
              item: item,
              item_id: item.id,
              unit_id: item.unit_id,
              unit_rate: 1,
              quantity: null,
              MAX: maximum
            }
          })
          .filter(detail => detail.MAX > 0)
        }
      })
    },
    setForm(data) {
      this.rsData =  JSON.parse(JSON.stringify(data))
      this.rsForm =  JSON.parse(JSON.stringify(data))
      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {
        this.FORM.response.relationship({
          title: 'Ship-Delivery has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }

    },
    exclude(index, row) {
      this.rsForm.exclude_items.push({...row, quantity: null})
      this.rsForm.outgoing_good_items.splice(index, 1)
    },
    include(index, row) {
      this.rsForm.outgoing_good_items.push(row)
      this.rsForm.exclude_items.splice(index, 1)
    },
    onSave() {
      this.$validator.validate().then(result => {

        if (!result) {
          this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          });

          return;
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();

        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response || error, 'Submit')
        })
        .finally(()=>{
          setTimeout(() => {
            this.FORM.loading = false
          }, 2000)
        });

      });
    },
  },
}
</script>
