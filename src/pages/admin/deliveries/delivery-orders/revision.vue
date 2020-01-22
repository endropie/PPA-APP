<template>
<q-page padding class="form-page justify-center">
  <q-card inline class="q-ma-sm " v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
          <q-chip label="Revised" slot="menu-prepend" small color="negative" v-if="rsForm.revise_id" />
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-x-xl">
        <!-- COLUMN::Base Document -->
        <!-- <q-field class="col-12"
          :label="$tc('label.mode',1, {v:$tc('label.transaction')})" stack-label
          :data-vv-as="$tc('label.mode',1, {v:$tc('label.transaction')})"
          borderless
          :error="errors.has('transaction')"
          :error-message="errors.first('transaction')">
          <div slot="control" class="q-mt-sm">
            <q-option-group type="radio" disable
              name="transaction"
              v-model="rsForm.transaction"
              dense inline color="secondary"
              :options="CONFIG.options['transaction_mode']"
              v-validate="'required'"/>
          </div>
        </q-field> -->
        <q-input class="col-12  col-sm-6"
          name="number" disable
          stack-label label="No Transaction"
          dense hide-bottom-space
          v-model="rsForm.number"
          v-validate="ROUTE.meta.mode == 'edit' ? 'required':''"
          :error="errors.has('number')"
          :error-message="errors.first('number')">
          <template slot="append">
            <q-badge v-if="rsForm.revise_number">{{ `REV.${rsForm.revise_number}` }} </q-badge>
          </template>
        </q-input>

        <ux-select-filter class="col-12 col-sm-6"
          :name="`request_order_id`"
          :label="$tc('label.no',1,{v:$tc('general.request_order')}) + `[${rsForm.request_order_id}]`"
          v-model="rsForm.request_order_id"
          readonly hide-dropdown-icon
          v-validate="'required'"
          :options="RequestOrderOptions"
          :error="errors.has(`request_order_id`)"
          :error-message="errors.first(`request_order_id`)"
          :loading="SHEET['request_orders'].loading">
          <q-chip slot="after" square
            class="self-end items-end"
            :label="rsForm.transaction"
            text-color="white"
            :class="rsForm.transaction === 'RETURN' ? 'bg-faded' : 'bg-primary'"/>
        </ux-select-filter>

        <!-- COLUMN::1st customer Identitity -->
        <div class="col-12 col-md-6" >
          <div class="row q-col-gutter-x-sm content-between">
            <q-input  class="col-12"
              :label="$tc('general.customer')" readonly
              :value="rsForm.customer ? `${rsForm.customer.code} - ${rsForm.customer.name}` : null"/>
            <ux-date class="col-12 col-sm-6"
              name="date" type="date"
              stack-label label="Date"
              v-model="rsForm.date"
              :dark="LAYOUT.isDark"
              v-validate="'required'"
              :error="errors.has('date')"
              :error-message="errors.first('date')"/>

            <ux-date class="col-12 col-sm-6"
              name="due_date" type="date"
              stack-label label="Due Date"
              v-model="rsForm.due_date"
              :dark="LAYOUT.isDark"
              v-validate="'required'"
              :error="errors.has('due_date')"
              :error-message="errors.first('due_date')"/>

            <ux-select-filter class="col-12 self-end"
              name="operator_id"
              stack-label label="Operator"
              v-model="rsForm.operator_id"
              :options="EmployeeOptions"
              :dark="LAYOUT.isDark"
              v-validate="'required'"
              :error="errors.has(`operator_id`)"
              :error-message="errors.first(`operator_id`)"/>
          </div>
        </div>
        <!-- COLUMN::2nd Transaction details -->
        <div class="col-12 col-md-6" >
          <div class="column">
            <q-input name="customer_name"
              :label="$tc('label.name')"  stack-label
              v-model="rsForm.customer_name"
              v-validate="'required'"/>
            <q-input name="customer_phone"
              :label="$tc('label.phone')"  stack-label
              v-model="rsForm.customer_phone"
              v-validate="'required'"/>
            <q-input type="textarea" rows="3"
              name="customer_address"
              :label="$tc('label.address')"  stack-label
              v-model="rsForm.customer_address"
              autogrow />

          </div>
        </div>
        <!-- COLUMN::3th Part items lists -->
        <div class="col-12 q-my-md">
          <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
            dense separator="horizontal"
            :dark="LAYOUT.isDark">
            <q-tr>
              <q-th key="prefix"></q-th>
              <q-th key="item_id">{{$tc('items.part_name')}}</q-th>
              <q-th key="part_number">{{$tc('items.part_number')}}</q-th>
              <q-th key="quantity">{{$tc('label.quantity')}}</q-th>
              <q-th key="unit_id">{{$tc('label.unit')}}</q-th>
            </q-tr>
            <q-tr v-for="(row, index) in rsForm.delivery_order_items" :key="index">
              <q-td key="prefix" style="width:50px">
                <q-btn dense flat round icon="clear" color="red" @click="removeItem(index)"/>
              </q-td>
              <q-td key="request_order_item_id" width="30%" >
                <ux-select-filter v-if="WITH_RO" style="min-width:150px"
                  :name="`delivery_order_items.${index}.item_id`"
                  v-model="row.request_order_item_id"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  :options="RequestOrderItemOptions" clearable
                  v-validate="`required`"
                  :error="errors.has(`delivery_order_items.${index}.item_id`)"
                  @input="(val)=>{ setRequestOrderItem(index, val) }" />

                <ux-select-filter v-else style="min-width:150px"
                  :name="`delivery_order_items.${index}.item_id`"
                  v-model="row.item_id"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  :options="ItemOptions"
                  v-validate="`required`"
                  :error="errors.has(`delivery_order_items.${index}.item_id`)"
                  @input="(val)=>{ setItemReference(index, val) }"
                  :loading="SHEET['items'].loading"/>
              </q-td>
              <q-td key="item_id" width="30%" >

                <q-input readonly
                  :value="row.item ? row.item.part_number : null"
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :dark="LAYOUT.isDark" />
              </q-td>
              <q-td key="quantity" width="25%">
                <q-input type="number" v-if="WITH_RO" style="min-width:120px"
                  :name="`delivery_order_items.${index}.quantity`"
                  v-model="row.quantity"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  v-validate="`required|max_value:${numUnitConvertion(row, MaxMount[index])}`"
                  :error="errors.has(`delivery_order_items.${index}.quantity`)">
                  <span slot="append" class="text-body2">
                  / <q-badge :label="numUnitConvertion(row, MaxMount[index])" />
                  </span>
                </q-input>

                <q-input type="number" v-else style="min-width:120px"
                  :name="`delivery_order_items.${index}.quantity`"
                  v-model="row.quantity"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  v-validate="`required|gt_value:0`"
                  :error="errors.has(`delivery_order_items.${index}.quantity`)" />
              </q-td>
              <q-td key="unit_id" width="20%" >
                <q-select style="min-width:100px"
                  :name="`delivery_order_items.${index}.unit_id`"
                  v-model="row.unit_id"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  :options="ItemUnitOptions[index]"
                  map-options emit-value
                  v-validate="row.item_id ? 'required' : ''"
                  :error="errors.has(`delivery_order_items.${index}.unit_id`)"
                  @input="(val)=>{ setUnitReference(index, val) }"
                />
              </q-td>
            </q-tr>
            <q-tr>
              <q-td colspan="100%">
                <q-btn-dropdown split dense icon="add" color="green"
                  :label="$tc('form.add')"
                  :disable-dropdown="!Boolean(rsForm.exclude_items.length > 0)"
                  @click="addNewItem()">
                  <q-list>
                    <q-item v-for="(row, index) in rsForm.exclude_items" :key="index"
                      clickable v-close-popup @click="includeItem(index)">
                      <q-item-section>
                        <q-item-label>{{row.item.part_number}}</q-item-label>
                        <q-item-label caption>{{row.item.part_name}}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge :label="row.quantity" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-td>
            </q-tr>
          </q-markup-table>
        </div>
        <!-- COLUMN::4th Description -->
        <div class="col-12">
          <q-input type="textarea" rows="3"
            name="description"
            :data-vv-as="$tc('label.description')"
            :label="$tc('label.description')" stack-label
            filled
            v-model="rsForm.description"/>
        </div>
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"></q-btn>
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark">
    <q-spinner-dots size="70px" color="primary" />
  </q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'
import { error } from 'util';

export default {
  mixins: [MixForm],
  data () {
    return {
      SHEET:{
        request_orders: {autoload: false, api:'/api/v1/incomes/request-orders?mode=all'},
        request_order_items: {autoload: false, api:''},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        employees: {api:'/api/v1/common/employees?mode=all'},
        vehicles: {api:'/api/v1/references/vehicles?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
      },
      FORM:{
        resource:{
          api: '/api/v1/incomes/delivery-orders',
          uri: '/admin/deliveries/delivery-orders',
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          transaction: null,

          customer_id: null,
          customer_name: null,
          customer_phone: null,
          customer_address: null,

          operator_id: null,
          // transport_number: null,
          // transport_rate: null,

          date: this.$app.moment().format('YYYY-MM-DD'),
          due_date: this.$app.moment().format('YYYY-MM-DD'),
          time: this.$app.moment().format('HH:mm'),
          due_time: this.$app.moment().format('HH:mm'),

          revise_id: 0,
          revise_number: null,
          description: null,
          delivery_order_items: [{
            id:null,
            item_id: null, item: {},
            quantity: null,

            unit_id: null,
            unit_rate: 1
          }],
          exclude_items: []
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
      if (!this.rsForm.hasOwnProperty('revise_id')) return false

      return !this.rsForm.revise_id
    },
    WITH_RO() {
      if (this.rsForm.request_order) {
        if(this.rsForm.request_order.transaction == 'REGULER' && this.rsForm.request_order.order_mode == 'ACCUMULATE') {
          return false
        }
      }

      return true
    },
    RequestOrderOptions() {
      if (!this.rsForm.customer_id) return []

      let data = this.SHEET.request_orders.data || []
      // data = data.filter(row => row.customer_id === this.rsForm.customer_id)

      return data.map(row => ({
        data: row,
        label: `${row.number}`,
        value: row.id
      }))
    },
    RequestOrderItemOptions() {
      if (!this.rsForm.customer_id) return []
      if (!this.rsForm.request_order_id) return []
      if (!this.ItemOptions.length) return []

      let data = this.SHEET.request_order_items.data || []

      return data.map(row => ({
        data: row,
        label: row.item.part_name,
        sublabel: `[${row.item.code}] ${row.item.part_number}`,
        stamp: `#${row.id}`,
        value: row.id,
        disable: !row.enable,
        item_id: row.item_id
      }))
    },
    EmployeeOptions() {
      return (this.SHEET.employees.data.map(item => ({label: `[${item.code}] ${item.name}`, value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let ITEM = this.SHEET.items.data.filter((item) => item.customer_id === this.rsForm.customer_id)
      return (ITEM.map(item => ({label: `${item.part_name}`, sublabel:`${item.code} - ${item.part_number}`, value: item.id})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.delivery_order_items) {
        if (this.rsForm.delivery_order_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.delivery_order_items[i]
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
    MaxMount() {
      if(this.RequestOrderOptions.length == 0) return []
      let maxitem = {}
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }

      this.RequestOrderOptions.map((opt) => {
        opt.data.request_order_items.map((detail) => {
          if(!maxitem.hasOwnProperty(detail.item_id)) maxitem[detail.item_id] = 0
           maxitem[detail.item_id] += Number(detail.unit_amount || 0)
           maxitem[detail.item_id] -= Number(detail.total_delivery_item || 0)
        })
      })

      let data = []
      if(this.rsForm.delivery_order_items) {
        data = this.rsForm.delivery_order_items.map((detail, index) => {
          let use = 0;
          if (maxitem[detail.item_id] && detail.item_id) {
            use = Number(moveItem.get(detail.item_id) || 0)
            moveItem.set(detail.item_id, (Number(detail.quantity) * Number(detail.unit_rate)) )
          }
          return Number(maxitem[detail.item_id] || 0) - use

        })
      }

      return data
    },
    MaxStock() {
      let stockItem =  JSON.parse(JSON.stringify(this.MAPINGKEY['itemstocks']))
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }
      this.FORM.data.delivery_order_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id].totals['FG'] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.delivery_order_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id].totals['FG'] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }

      })

      return data
    },
    MAPINGKEY(){
      let variables = {
        'request_order_items': {},
        'customers' : {},
        'units': {},
        'items': {},
        'itemstocks': {}
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['itemstocks'][value.id] = value })
      this.SHEET['request_order_items'].data.map(value => { variables['request_order_items'][value.id] = value })

      return variables;
    }
  },
  watch:{
      '$route' : 'init',
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        this.setForm(data || this.setDefault())
      })
    },
    numUnitConvertion(row, val = 0) {
      return Number(val) / Number(row.unit_rate || 1)
    },
    setRequestOrderItem(index, val) {
      if(!val){
        this.rsForm.delivery_order_items[index].item_id = null
        this.rsForm.delivery_order_items[index].unit_id = null
        this.rsForm.delivery_order_items[index].unit = {}
        this.rsForm.delivery_order_items[index].item = {}
      }
      else{
        this.rsForm.delivery_order_items[index].request_order_item = this.MAPINGKEY['request_order_items'][val]
        this.rsForm.delivery_order_items[index].item_id = this.MAPINGKEY['request_order_items'][val].item_id
        this.setItemReference(index, this.rsForm.delivery_order_items[index].item_id)
      }
    },
    setItemReference(index, val) {
      if(!val){
        this.rsForm.delivery_order_items[index].unit_id = null
        this.rsForm.delivery_order_items[index].unit = {}
        this.rsForm.delivery_order_items[index].item = {}
      }
      else{
        this.rsForm.delivery_order_items[index].item = this.MAPINGKEY['items'][val]

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.delivery_order_items[index].unit_id = baseUnitID
        this.rsForm.delivery_order_items[index].unit_rate = 1
        this.rsForm.delivery_order_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {
      if(!val) return;
      else if (this.rsForm.delivery_order_items[index].item.unit_id === val) {
        this.rsForm.delivery_order_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.delivery_order_items[index].item.item_units) {
          this.rsForm.delivery_order_items[index].item.item_units.map((itemUnit)=> {
            if (itemUnit.unit_id == val) this.rsForm.delivery_order_items[index].unit_rate = itemUnit.rate
          })
        }
      }
    },
    loadRequestOrderItems(id) {
      if(id) {
        this.$axios.get(`/api/v1/incomes/request-orders/${id}?mode=view`)
        .then(response => {
          this.SHEET['request_order_items'].data = response.data.request_order_items || []
        })
        .catch(error => {
          this.$app.error(error.response || error)
        })

      }
    },
    setForm(data) {
      this.rsForm =  Object.assign({},this.setDefault(), data)
      this.loadRequestOrderItems(data.request_order_id)
      this.SHEET.load('request_orders',`id=${this.rsForm.request_order_id}`,
        (res)=> {
          if(res && res.hasOwnProperty('data')) {
            const parameter = this.WITH_RO
              ? `or_ids=${[...res.data[0].request_order_items.map(x => x.item_id)].join(',')}`
              : `customer_id=${this.rsForm.customer_id}`
            if (res.data[0].request_order_items.length) {
              this.SHEET.load('items', parameter)
            }
          }
        }
      )

    },

    addNewItem() {
      let newEntri = this.setDefault().delivery_order_items[0]
      this.rsForm.delivery_order_items.push(newEntri)
    },
    removeItem(index) {
      if (this.rsForm.delivery_order_items[index].id) {
        this.rsForm.exclude_items.push(Object.assign({},this.rsForm.delivery_order_items[index]))
      }
      this.rsForm.delivery_order_items.splice(index, 1)
    },
    includeItem(index) {
      if (this.rsForm.exclude_items[index]) {
        this.rsForm.delivery_order_items.push(Object.assign({},this.rsForm.exclude_items[index]))
        this.rsForm.exclude_items.splice(index, 1)
      }
    },
    onSave() {
      const submit = () => {
        this.FORM.loading = true
        // const {method, mode, apiUrl} = this.FORM.meta();
        const method = 'PUT'
        const apiUrl = `${this.FORM.resource.api}/${this.ROUTE.params.id}?mode=revision`

        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({ message: message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response || error, 'REVISION FAILED')
        })
        .finally(()=>{
          this.FORM.loading = false
        });
      }
      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          })
        }

        this.$q.dialog({
          title: this.$tc('form.confirm'),
          message: this.$tc('messages.to_sure', 1, {v: this.$tc('form.revision')}),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
      })
    },
  },
}
</script>
