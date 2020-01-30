<template>
<q-page padding class="form-page justify-center">
  <q-card inline class="main-box" v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="rsForm.number ? `# ${rsForm.number}` : FORM.subtitle()" hide-menu>
        <template  slot="menu-append">
          <q-chip class="text-uppercase" label="Revised" small color="negative" v-if="rsForm.revise_id" />

          <q-chip class="text-uppercase" square outline
            :label="$tc('form.temporary')"
            :dark="LAYOUT.isDark"
            color="orange-10"
            v-if="rsForm.is_internal" />

          <q-chip class="text-uppercase" square outline
            :label="rsForm.customer.order_mode"
            :dark="LAYOUT.isDark"
            color="blue-grey"
            v-if="rsForm.transaction === 'REGULER' && rsForm.customer.order_mode == 'ACCUMULATE'"
          />

          <ux-chip-status square outline :row="rsForm" />
        </template>
      </form-header>
    </q-card-section>
    <q-separator />
    <q-card-section class="row q-col-gutter-x-md">
      <!-- COLUMN::1st delivery detail -->
      <div class="col-12 col-md-6" >
        <q-input disable hint=""
          :label="$tc('general.customer')"
          :dark="LAYOUT.isDark"
          :value="rsForm.customer ? `${rsForm.customer.code} - ${rsForm.customer.name}` : null"
        />
        <div class="row q-col-gutter-x-sm">
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
        </div>
      </div>
      <!-- COLUMN::2nd Customer Identity -->
      <div class="col-12 col-md-6" >
        <div class="row q-col-gutter-x-sm">
          <q-input class="col" name="customer_name"
            :label="$tc('label.name')"  stack-label
            v-model="rsForm.customer_name"
            :dark="LAYOUT.isDark"
            v-validate="'required'"/>
          <q-input class="col-12 col-sm-auto" name="customer_phone"
            :label="$tc('label.phone')"  stack-label
            v-model="rsForm.customer_phone"
            :dark="LAYOUT.isDark"
            v-validate="'required'"/>
        </div>
        <q-input type="textarea" autogrow rows="3"
          name="customer_address"
          :label="$tc('label.address')"  stack-label
          :dark="LAYOUT.isDark"
          v-model="rsForm.customer_address"
        />
      </div>
      <!-- COLUMN::3th Part items lists -->
      <div class="col-12 q-my-sm">

        <div class="row items-center">
          <ux-select v-if="WITH_RO && rsForm.customer_id"
            name="request_order"
            stack-label :label="$tc('general.request_order')"
            :data-vv-as="$tc('general.request_order')"
            v-model="rsForm.request_order"
            filter :source="`/api/v1/incomes/request-orders?mode=all&customer_id=${rsForm.customer_id}`"
            :option-label="(item) => item.number"
            :option-value="(item) => item"
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has(`request_order`)"
            :error-message="errors.first(`request_order`)"
            @input="setRequestOrder"
          />
          <q-space />
          <ux-select filter
            name="operator_id"
            stack-label label="Operator"
            v-model="rsForm.operator_id"
            emit-value map-options
            :options="EmployeeOptions"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has(`operator_id`)"
            :error-message="errors.first(`operator_id`)"
          />
        </div>
        <q-markup-table bordered class="main-box no-shadow no-highlight"
          dense separator="horizontal"
          :dark="LAYOUT.isDark">
          <thead>
            <q-tr class="text-uppercase" style="line-height:30px">
              <q-th key="prefix" width="50px"></q-th>
              <q-th key="part" width="50%">{{$tc('items.part_name')}}</q-th>
              <q-th key="quantity" width="30%">{{$tc('label.quantity')}}</q-th>
              <q-th key="unit_id" width="20%">{{$tc('label.unit')}}</q-th>
            </q-tr>
          </thead>
          <tbody>
            <q-tr v-for="(row, index) in rsForm.delivery_order_items" :key="index">
              <q-td key="prefix" style="width:50px">
                <q-btn dense flat round icon="clear" color="red" @click="removeItem(index)"/>
              </q-td>
              <q-td key="part" width="30%" >
                <ux-select v-if="WITH_RO" class="native-top" style="min-width:150px"
                  :name="`delivery_order_items.${index}.item_id`"
                  v-model="row.request_order_item_id"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  filter emit-value map-options clearable
                  :options="RequestOrderItemOptions"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  v-validate="`required`"
                  :error="errors.has(`delivery_order_items.${index}.item_id`)"
                  @input="(val)=>{ setRequestOrderItem(index, val) }" >
                  <small v-if="row.item.part_number" class="absolute-bottom">{{row.item.part_number}} (RO)</small>
                </ux-select>

                <ux-select v-else class="native-top" style="min-width:150px"
                  :name="`delivery_order_items.${index}.item_id`"
                  v-model="row.item_id"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  filter emit-value map-options
                  :options="ItemOptions"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  v-validate="`required`"
                  :error="errors.has(`delivery_order_items.${index}.item_id`)"
                  @input="(val)=>{ setItemReference(index, val) }"
                  :loading="SHEET['items'].loading" >
                  <small v-if="row.item.part_number" class="absolute-bottom">[{{row.item.customer_code}}] {{row.item.part_number}}</small>
                </ux-select>

              </q-td>
              <q-td key="quantity" width="25%">
                <q-input type="number" v-if="WITH_RO" style="min-width:120px"
                  :name="`delivery_order_items.${index}.quantity`"
                  v-model="row.quantity"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  :dark="LAYOUT.isDark"
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
                  :dark="LAYOUT.isDark"
                  v-validate="`required|gt_value:0`"
                  :error="errors.has(`delivery_order_items.${index}.quantity`)" />
              </q-td>
              <q-td key="unit_id" width="20%" >
                <q-select style="min-width:100px"
                  :name="`delivery_order_items.${index}.unit_id`"
                  v-model="row.unit_id"
                  outlined dense color="blue-grey-5"
                  hide-bottom-space no-error-icon
                  map-options emit-value
                  :options="ItemUnitOptions[index]"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
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
          </tbody>
        </q-markup-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12">
        <q-input type="textarea" rows="3"
          name="description"
          :data-vv-as="$tc('label.description')"
          :label="$tc('label.description')" stack-label
          filled :dark="LAYOUT.isDark"
          v-model="rsForm.description"/>
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

          date: this.$app.moment().format('YYYY-MM-DD'),
          due_date: this.$app.moment().format('YYYY-MM-DD'),

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
      console.warn('CEK', this.rsForm.transaction, this.rsForm.customer.order_mode);
      if (this.rsForm.is_internal) return false
      if (this.rsForm.request_order) {
        if(this.rsForm.transaction == 'REGULER' && this.rsForm.customer.order_mode == 'ACCUMULATE') {
          return false
        }
      }

      return true
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
        disable: !row.item.enable,
        item: row.item
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
      // if(this.RequestOrderOptions.length == 0) return []
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

      this.SHEET['request_order_items'].data.map(detail => {
        if (!maxitem[detail.item_id]) maxitem[detail.item_id] = 0
        maxitem[detail.item_id] += Number(detail.unit_amount) - Number(detail.amount_delivery)
      })

      if (this.FORM.data.request_order.id == this.rsForm.request_order.id) {
        this.FORM.data.delivery_order_items.map(detail => {
          if (!maxitem[detail.item_id]) maxitem[detail.item_id] = 0
          maxitem[detail.item_id] += Number(detail.unit_amount)
        })
      }

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
    MAPINGKEY(){
      let variables = {
        'request_order_items': {},
        'units': {},
        'items': {},
      }
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
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
    setRequestOrder(val) {
      if (val) {
        this.loadRequestOrderItems(val.id)
      }
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
      this.SHEET.load('items', `customer_id=${this.rsForm.customer_id}`)

      if (this.WITH_RO) {
        this.loadRequestOrderItems(data.request_order_id)
      }
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
