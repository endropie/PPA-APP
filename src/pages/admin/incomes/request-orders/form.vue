<template>
<q-page padding class="main-page justify-center">
  <q-card inline class="main-box" :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" hide-menu>
          <q-chip slot="optional" v-if="rsForm.order_mode"
            icon="assignment"  class="text-weight-medium"
            :label="rsForm.order_mode" color="primary" outline/>

          <q-chip slot="optional" v-if="rsForm.status === 'VOID'"
            icon="bookmark"  class="text-weight-medium"
            label="void" color="negative" outline/>

      </form-header>
    </q-card-section>
    <!-- COLUMN::1st customer Identitity -->
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <q-input class="col-12" name="number"
            label="No Transaction"
            placeholder="[Auto Generate]"
            v-model="rsForm.number"
            :dark="LAYOUT.isDark"
            v-validate="ROUTE.meta.mode == 'edit' ? 'required':''"
            :error="errors.has('number')" :error-message="errors.first('number')"/>

          <ux-date class="col-12" name="date"
            stack-label :label="$tc('label.date')"
            v-model="rsForm.date"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('date')"
            :error-message="errors.first('date')" />

          <!-- <q-input class="col-12" name="date" type="date"
            stack-label label="Date"
            v-model="rsForm.date"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('date')"
            :error-message="errors.first('date')"/> -->
        </div>
      </div>
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <ux-select-filter name="customer" class="col-12"
            v-model="rsForm.customer_id"
            :label="$tc('general.customer')"
            :disable="IssetItemDetails" v-validate="'required'"
            :options="CustomerOptions" filter clearable
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            @input="(val)=>{ setCustomerReference(val) }"
            :error="errors.has('customer')"
            :error-message="errors.first('customer')"
            :loading="SHEET['customers'].loading">
            <q-tooltip v-if="IssetItemDetails" :offset="[0, 10]">To change: Please delete Part items first!</q-tooltip>
          </ux-select-filter>
          <q-input name="reference_number" class="col-12"
              stack-label label="PO / Qoutation / Memo"
              v-model="rsForm.reference_number"
              :dark="LAYOUT.isDark"
              v-validate="rsForm.order_mode === 'PO' ? 'required' :''"
              :error="errors.has('reference_number')"
              :error-message="errors.first('reference_number')"/>

        </div>
      </div>
    </q-card-section>
    <!-- COLUMN::2th Incoming Items lists -->
    <q-card-section class="row q-col-gutter-sm q-col-gutter-x-md">
      <div class="col-12 q-my-md">
        <q-table
          :data="rsForm.request_order_items" dense
          class="table-form full-width d-grid no-shadow" :dark="LAYOUT.isDark"
          hide-bottom
          :rows-per-page-options ="[0]"
          :columns="[
            { name: 'prefix', label: '',  align: 'left'},
            { name: 'item_id', label: $tc('items.part_name'), align: 'left'},
            { name: 'part_number', label: $tc('items.part_number'), align: 'left'},
            { name: 'quantity', label: 'Qty', align: 'center'},
            { name: 'unit_id', label: $tc('label.unit'), align: 'center'},
            { name: 'price', label: 'Price', align: 'center'},
            { name: 'total', label: 'Total', align: 'center'},
          ]"
          :pagination="{sortBy: null, descending: false, page: null,rowsPerPage: 0}"
        >
          <template slot="body" slot-scope="rsItem">
            <q-tr :rsItem="rsItem">
              <q-td key="prefix" :rsItem="rsItem" style="width:50px">
                <q-btn dense  icon="delete" color="blue-grey-5" @click="removeItem(rsItem.row.__index)"/>
              </q-td>
              <q-td key="item_id" :rsItem="rsItem" width="30%" style="min-width:150px">
                <ux-select-filter :name="`request_orders_items.${rsItem.row.__index}.item_id`"
                  v-model="rsItem.row.item_id"
                  v-validate="'required'"
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :options="ItemOptions"
                  :readonly="!IssetCustomerID"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  :error="errors.has(`request_orders_items.${rsItem.row.__index}.item_id`)"
                  :loading="SHEET['items'].loading"
                  @input="(val)=>{ setItemReference(rsItem.row.__index, val) }"
                />
                <q-tooltip v-if="!IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
              </q-td>
              <q-td key="part_number" width="30%" style="min-width:150px">
                <q-input readonly
                  :value="rsItem.row.item ? rsItem.row.item.part_number : null"
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :dark="LAYOUT.isDark" />
              </q-td>
              <q-td key="quantity" :rsItem="rsItem" width="10%">
                <q-input :name="`request_orders_items.${rsItem.row.__index}.quantity`"
                  v-model="rsItem.row.quantity" type="number"
                  outlined dense hide-bottom-space
                  color="blue-grey-5" style="width:80px"
                  v-validate="rsItem.row.item_id ? 'required' : ''"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`request_orders_items.${rsItem.row.__index}.quantity`)"
                />
              </q-td>
              <q-td key="unit_id" :rsItem="rsItem" width="10%">
                <q-select :name="`request_orders_items.${rsItem.row.__index}.unit_id`"
                  v-model="rsItem.row.unit_id"
                  :options="ItemUnitOptions[rsItem.row.__index]"
                  map-options emit-value
                  outlined dense hide-bottom-space
                  color="blue-grey-5" style="width:80px"
                  v-validate="rsItem.row.item_id ? 'required' : ''"
                  :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                  :error="errors.has(`request_orders_items.${rsItem.row.__index}.unit_id`)"
                  @input="(val)=> { setUnitReference(rsItem.row.__index, val) }" />
                <q-input v-model="rsItem.row.unit_rate" class="hidden" />
              </q-td>
              <q-td key="price" :rsItem="rsItem" width="20%" style="min-width:120px">
                <ux-numeric type="number" :name="`request_orders_items.${rsItem.row.__index}.price`"
                  v-model="rsItem.row.price"
                  outlined dense hide-bottom-space
                  color="blue-grey-5" style="width:120px"
                  v-validate="rsItem.row.item_id ? 'required' : ''"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`request_orders_items.${rsItem.row.__index}.price`)" />
              </q-td>
              <q-td key="total" :rsItem="rsItem" width="20%" style="min-width:150px">
                <ux-numeric :name="`total-${rsItem.row.__index}`"
                  :value="Number(rsItem.row.quantity) * Number(rsItem.row.price)"
                  readonly dense borderless hide-bottom-space
                  color="blue-grey-5" style="width:120px"
                  v-validate="rsItem.row.item_id ? '' : ''"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`total-${rsItem.row.__index}`)"
                />
              </q-td>
            </q-tr>
          </template>

          <q-tr slot="bottom-row" slot-scope="rsItem" :rsItem="rsItem">
            <q-td colspan="100%">
              <strong><q-btn dense  @click="addNewItem()" icon="add" color="positive"/></strong>
            </q-td>
          </q-tr>
        </q-table>
      </div>
      <!-- COLUMN::4th Description -->
      <div class="col-12">
        <q-input name="description" type="textarea" rows="3"
          stack-label :label="$tc('label.description')"
          filled
          v-model="rsForm.description"
          :dark="LAYOUT.isDark">

          <template slot="prepend">
            <q-icon name="rate_review"></q-icon>
          </template>
        </q-input>

      </div>

    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"></q-btn>
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" /></q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {
    return {
      SHEET: {
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        brands: {api:'/api/v1/references/brands?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
        vehicles: {api:'/api/v1/references/vehicles?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'}
      },
      FORM: {
        resource: {
          uri: '/admin/incomes/request-orders',
          api: '/api/v1/incomes/request-orders',
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          begin_date: this.$app.moment().format('YYYY-MM-DD'),
          until_date: this.$app.moment().format('YYYY-MM-DD'),

          customer_id: null,
          date: null,
          reference_number: null,
          transaction: 'REGULER',
          order_mode: null,
          description: null,

          request_order_items:[
            {
              id:null,
              item_id: null, item: {},
              quantity: null,
              price: 0,
              unit_id: null,
              unit_rate: 1
            }
          ]

        }
      }
    }
  },
  created(){
    // Component Page Created!
    this.init()
  },
  computed: {
    IS_EDITABLE() {
      if (this.rsForm.order_mode === 'NONE') return false
      if (this.rsForm.deleted_at) return false
      if (this.rsForm.hasOwnProperty('has_relationship') && Object.keys(this.rsForm.has_relationship).length > 0) {
        return false
      }

      return true
    },
    IssetItemDetails() {
        let items = this.rsForm.request_order_items
        for (const i in items) {
          if (items.hasOwnProperty(i)) {
            if(items[i].item_id) return true
          }
        }

        return false
    },
    IssetCustomerID() {
      return (this.rsForm.customer_id ? true : false)
    },
    CustomerOptions() {

      let data = this.SHEET.customers.data
      if(this.ROUTE.meta.mode !== 'edit'){
        data = data.filter(item => item.order_mode === 'PO')
      }

      return (data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    BrandOptions() {
      return (this.SHEET.brands.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    TransportOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let items = this.SHEET.items.data.filter((item) => item.customer_id === this.rsForm.customer_id)
      const sublabel = (val) => {
        return val != null ? `No.${val}` : null
      }
      return (items.map(item => ({label: `[${item.code}] ${item.part_name}`, sublabel: sublabel(item.part_number), value: item.id})) || [])
    },
    ItemUnitOptions() {
      let vars = []
      for (const i in this.rsForm.request_order_items) {
        if (this.rsForm.request_order_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.request_order_items[i]
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
    MAPINGKEY() {
      let variables = {
        'customers' : {},
        'units': {},
        'items': {}
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })

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
    setForm(data) {
      this.rsData = JSON.parse(JSON.stringify(data))
      this.rsForm = JSON.parse(JSON.stringify(data))

      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {
        this.FORM.response.relationship({
          title: 'Sale Orders has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
    },
    setCustomerReference(val) {
      if(!val) {
        this.rsForm.customer = {};
        this.rsForm.order_mode = null;
      }
      else {
        this.rsForm.customer = this.MAPINGKEY['customers'][val];
        this.rsForm.order_mode = this.MAPINGKEY['customers'][val].order_mode;

        this.SHEET.load('items', `customer_id=${val}`)

        if(this.rsForm.order_mode == 'PO') {
          this.rsForm.begin_date == null
          this.rsForm.until_date == null
        }
      }
    },
    setItemReference(index, val) {
      if(!val) {
        this.rsForm.request_order_items[index].unit_id = null
        this.rsForm.request_order_items[index].price = null
        this.rsForm.request_order_items[index].unit = {}
        this.rsForm.request_order_items[index].item = {}
      }
      else {
        this.rsForm.request_order_items[index].item = this.MAPINGKEY['items'][val]
        this.rsForm.request_order_items[index].price = this.MAPINGKEY['items'][val].price

        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.request_order_items[index].unit_id = baseUnitID
        this.rsForm.request_order_items[index].unit_rate = 1
        this.rsForm.request_order_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.request_order_items[index].item.unit_id === val) {
        this.rsForm.request_order_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.request_order_items[index].item.item_units) {
          this.rsForm.request_order_items[index].item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.request_order_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },
    routing() {
      if(this.ROUTE.meta.mode === 'edit') {

        this.FORM.loading = true
        let url = this.FORM.resource.api +'/'+ this.ROUTE.params.id
        this.$axios.get(url)
          .then((response) => {
            const data = response.data
            this.setRsForm(data)
            this.setRsData(data)
            this.setForm(data)
          })
          .catch(error => {
            console.warn('[FORM:routing]', error)
            this.$app.response.error(error.response, 'Load Form')
          })
          .finally(()=>{
            this.FORM.show = true
            this.FORM.loading = false
          });

      }
      else{
        this.rsForm = this.setDefault()
        this.FORM.show = true;
      }
    },
    addNewItem(autofocus = true){
      let newEntri = this.setDefault().request_order_items[0] // {id:null, item_id: null, quantity: null};

      this.rsForm.request_order_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.request_order_items.splice(index, 1)
        if(this.rsForm.request_order_items.length < 1) this.addNewItem()
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
          this.FORM.response.error(error.response || error)
          this.FORM.response.fields(error.response)
        })
        .finally(()=>{
          this.FORM.loading = false
        });

      });
    },
  },
}
</script>
