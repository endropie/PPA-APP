<template>
<q-page padding class="form-page justify-center" >
  <q-card inline class="main-box " :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" :dark="LAYOUT.isDark">
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <!-- COLUMN:: Transaction Identitity -->
    <q-card-section class="row q-col-gutter-sm">
      <q-field class="col-12"
        :label="$tc('label.mode',1, {v:$tc('label.transaction')})" stack-label
        borderless hide-bottom-space
        :dark="LAYOUT.isDark"
        :error="errors.has('transaction')"
        :error-message="errors.first('transaction')">

        <q-option-group slot="control" type="radio" inline
          name="transaction"
          v-model="rsForm.transaction"
          :disable="IssetItemDetails"
          :options="CONFIG.options.transaction_mode"
          :dark="LAYOUT.isDark"
          v-validate="'required'"
        />
      </q-field>

      <ux-select-filter class="col-12 col-sm-6"
        name="customer"
        :label="$tc('general.customer')"
        v-model="rsForm.customer_id"
        v-validate="'required'"
        :disable="IssetItemDetails"
        :options="CustomerOptions" filter clearable
        @input="setCustomerReference"
        :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
        :error="errors.has('customer')"
        :error-message="errors.first('customer')" >
        <q-badge slot="counter"
          :label="String($tc(`customers.order_${rsForm.order_mode}`).toUpperCase())"
          v-if="rsForm.order_mode"  />
      </ux-select-filter>
      <ux-date class="col-6 col-sm-3"
        name="date"  type="date"
        stack-label :label="$tc('label.date')"
        v-model="rsForm.date"
        v-validate="'required'"
        :dark="LAYOUT.isDark"
        :error="errors.has('date')"
        :error-message="errors.first('date')"/>

      <q-select class="col-6 col-sm-3"
        name="rit" label="RIT"
        v-model="rsForm.rit" clearable
        no-error-icon hide-dropdown-icon
        :options="RitOptions" options-dense
        :options-dark="LAYOUT.isDark" :dark="LAYOUT.isDark"
        v-validate="'min_value:0'"
        :error="errors.has('rit')"
        :error-message="errors.first('rit')" />

      <div class="col-12">
        <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
          dense separator="horizontal"
          :dark="LAYOUT.isDark">
          <q-tr>
            <q-th key="prefix"></q-th>
            <q-th key="item_id">{{$tc('items.part_name')}}</q-th>
            <q-th key="part_number">{{$tc('items.part_number')}}</q-th>
            <q-th key="unit_id">{{$tc('label.unit')}}</q-th>
            <q-th key="quantity">{{$tc('label.quantity')}}</q-th>
            <q-th key="encasement">{{$tc('label.encasement')}}</q-th>
          </q-tr>
          <q-tr v-for="(row, index) in rsForm.pre_delivery_items" :key="index">
              <q-td key="prefix">
                <q-btn dense flat round icon="close" color="red" @click="removeItem(index)"/>
              </q-td>
              <q-td key="item_id" width="25%" style="min-width:150px">
                <ux-select-filter autofocus
                  :name="`pre_delivery_items.${index}.item_id`"
                  v-model="row.item_id"
                  outlined dense hide-bottom-space no-error-icon hide-dropdown-icon color="blue-grey-5"
                  :readonly="!IssetCustomerID"
                  :options="ItemOptions"
                  :loading="SHEET.items.loading"
                  :data-vv-as="$tc('general.item')"
                  v-validate="`required|excluded:${rsForm.pre_delivery_items.map((x,index) => (index) < index ? x.item_id : -1)}`"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`pre_delivery_items.${index}.item_id`)"
                  :error-message="errors.first(`pre_delivery_items.${index}.item_id`)"
                  @input="(val)=>{ setItemReference(index, val) }" />
                <q-tooltip v-if="!IssetCustomerID" :offset="[0, 10]">Select a customer, first! </q-tooltip>
              </q-td>
              <q-td key="part_number" width="25%" style="min-width:150px">
                <q-input readonly
                  :value="row.item ? row.item.part_number : null"
                  outlined dense hide-bottom-space color="blue-grey-5"
                  :dark="LAYOUT.isDark" />
              </q-td>
              <q-td key="unit_id" width="10%">
                <q-select style="min-width:80px"
                  :name="`pre_delivery_items.${index}.unit_id`"
                  v-model="row.unit_id"
                  outlined dense hide-bottom-space
                  :options="ItemUnitOptions[index]"
                  map-options emit-value
                  :dark="LAYOUT.isDark" color="blue-grey-5"
                  :error="errors.has(`pre_delivery_items.${index}.unit_id`)"
                  :error-message="errors.first(`pre_delivery_items.${index}.unit_id`)"
                  @input="(val)=> { setUnitReference(index, val) }"
                />
              </q-td>
              <q-td key="quantity" width="15%">
                <q-input style="min-width:100px"
                  :name="`pre_delivery_items.${index}.quantity`"
                  v-model="row.quantity" type="number" min="0"
                  outlined dense hide-bottom-space no-error-icon color="blue-grey-5"
                  :dark="LAYOUT.isDark"
                  :suffix="' / ' + strUnitConvertion(row, MaxMount[index])"
                  v-validate="`required|gt_value:0|max_value:${numUnitConvertion(row, MaxMount[index])}`"
                  :error="errors.has(`pre_delivery_items.${index}.quantity`)"
                  @input="(val)=> {row.unit_qty = (val) * (row.unit_rate)}"/>
              </q-td>
              <q-td key="encasement" width="25%">
                <q-input style="min-width:100px"
                  :name="`pre_delivery_items.${index}.encasement`"
                  outlined dense hide-bottom-space  color="blue-grey-5"
                  v-model="row.encasement"
                  :dark="LAYOUT.isDark" />
              </q-td>
            </q-tr>

          <q-tr>
            <td></td>
            <q-td>
              <q-btn dense outline color="primary" :label="$tc('form.add')" icon="add_circle_outline" class="full-width" @click="addNewItem()"/>
            </q-td>
            <td colspan="100%"></td>
          </q-tr>
        </q-markup-table>
      </div>
      <!-- COLUMN::4th Description -->
      <q-input class="col-12"
        name="description" type="textarea" rows="3"
        stack-label :label="$tc('label.description')"
        filled
        :dark="LAYOUT.isDark"
        v-model="rsForm.description" />

    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()" />
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)" />
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"
      :loading="FORM.loading"/>
      <!-- <q-btn label="test" @click="test()"></q-btn>      -->
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark"><q-spinner-dots size="70px" color="primary" /></q-inner-loading>
</q-page>
</template>

<script>
import MixForm from '@/mixins/mix-form.vue'

export default {
  mixins: [MixForm],
  data () {
    return {
      SHEET: {
        // request_orders: {data:[], api:'/api/v1/incomes/request-orders?mode=all&--with=request_order_items;customer:name,phone,address'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
      },
      FORM: {
        resource: {
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/deliveries/pre-deliveries',
        },
        incoming_good: {
          api: '/api/v1/warehouses/incoming-goods'
        }
      },
      rsForm: {},
      submitLoading: 0,
      setDefault:()=>{
        return {
          number: null,
          transaction: null,

          customer_id: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          rit: null,

          description: null,
          order_mode: null,
          request_order_id: null,
          pre_delivery_items:[
            {
              id:null,
              item_id: null,
              unit_id: null,
              unit_rate: 1,
              unit_qty: null,
              quantity: null,
              encasement: null,
              request_order_item_id: null
            }
          ]
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
      if (this.rsForm.deleted_at) return false
      if (Object.keys(this.rsForm.has_relationship || {}).length > 0) return false
      return true
    },
    IssetItemDetails() {
        let items = this.rsForm.pre_delivery_items
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
    RitOptions() {
      let rits = []
      for (let i = 0; i < 10; i++) rits.push(i+1)
      return rits
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      // if (this.MAPINGKEY['itemstocks'].length == 0) return []
      const STOCKIST = this.rsForm.transaction === 'RETURN' ? 'RDO.RET' : 'RDO.REG'
      let olditems = this.FORM.data.pre_delivery_items.map(x => x.item_id)
      let data = this.SHEET.items.data.filter((item) => {
        if (this.rsForm.transaction == this.FORM.data.transaction && olditems.some(x => x === item.id)) return true
        if (item.customer_id !== this.rsForm.customer_id) return false
        return (Number(item.totals[STOCKIST]) > 0)
      })

      return (data.map(item => ({
        label: `${item.part_name}`,
        sublabel: `[${item.customer_code}] ${item.part_number}`,
        value: item.id,
        data: item
      })) || [])
    },
    ItemUnitOptions() {
      // return varItemUnits
      return this.rsForm.pre_delivery_items.map(rsItem => {
        return this.UnitOptions.filter((unit)=> {
            if(!rsItem.item_id) return
            if(rsItem.item.unit_id === unit.value) return true
            if(this.MAPINGKEY['items'][rsItem.item_id]) return this.MAPINGKEY['items'][rsItem.item_id].item_units.some((fill)=> fill.unit_id == unit.value)
            return
          })
      })
    },
    MaxMount() {
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

      const OLDSTOCKIST = this.FORM.data.transaction === 'RETURN' ? 'RDO.RET' : 'RDO.REG'
      this.FORM.data.pre_delivery_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id][OLDSTOCKIST] += Number(item.quantity)
        }
      })

      const NEWSTOCKIST = this.rsForm.transaction === 'RETURN' ? 'RDO.RET' : 'RDO.REG'
      let data = {}
      this.rsForm.pre_delivery_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id][NEWSTOCKIST] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }
      })

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
      this.FORM.data.pre_delivery_items.forEach(item => {
        if (stockItem.hasOwnProperty(item.item_id)) {
          stockItem[item.item_id]['PRE'] += Number(item.quantity)
        }
      })

      let data = {}
      this.rsForm.pre_delivery_items.map((detail, index) => {
        if (stockItem[detail.item_id] && detail.item_id) {
          data[index] = Number(stockItem[detail.item_id]['PRE'] || 0) - Number(moveItem.get(detail.item_id) || 0)
          moveItem.set(detail.item_id, detail.quantity)
        }

      })

      return data
    },
    MAPINGKEY() {
      let variables = {
        'customers' : {},
        'units': {},
        'items': {},
        'itemstocks': {}
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })
      this.ItemOptions.map(item => {
        item.data.totals['PRE'] = Number(item.data.totals['FM']) + Number(item.data.totals['WO'])
        variables['itemstocks'][item.data.id] = item.data.totals
      })

      return variables;
    }
  },
  watch:{
      '$route' : 'init',
  },
  methods: {
    init() {
      this.FORM.load((data) => {
        if (this.ROUTE.query.incoming_good_id){
          this.FORM.show = false
          this.FORM.loading = true

          const newEntri = this.setDefault().pre_delivery_items[0]
          this.$axios.get(`${this.FORM.incoming_good.api}/${this.ROUTE.query.incoming_good_id}`)
          .then(response => {
              data.customer_id = response.data.customer_id
              data.transaction = response.data.transaction
              data.pre_delivery_items = []

              response.data.incoming_good_items.map(detail => {
                  data.pre_delivery_items.push(Object.assign({}, newEntri, {
                  item_id: detail.item_id,
                  item: detail.item,
                  unit_id: detail.unit_id,
                  unit: detail.unit,
                  unit_rate: detail.unit_rate,
                  quantity: detail.quantity
                }))
              })

              this.setForm(data)
              // setTimeout(() => this.setForm(data), 0)
              setTimeout(() => this.FORM.show = true, 500)
          })
          .catch(error => {
            this.FORM.response.error(error.response || error, this.$tc('messages.fail', 1, {v:this.$tc('form.clone')}).toUpperCase())
            this.setForm(data || this.setDefault())
            setTimeout(() => this.FORM.show = true, 500)
          })
          .finally(() => {
            setTimeout(() => this.FORM.loading = false, 500)
          })
        }
        else this.setForm(data || this.setDefault())
      })
    },
    strUnitConvertion(row, val = 0) {
      if(val < 0) return '(-)'
      return this.numUnitConvertion(row, val)
    },
    numUnitConvertion(row, val = 0) {
      let result = Number(val) / Number(row.unit_rate || 1)
      let fix = ((+result).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
      if(fix > 2) fix = 2
      return result.toFixed(fix)
    },
    setCustomerReference(val) {
      if(!val) {
        this.rsForm.order_mode = null
      }
      else {

        this.SHEET.load('items', 'customer_id='+ val)
        if (this.MAPINGKEY['customers'].hasOwnProperty(val)) {
          this.rsForm.order_mode = this.MAPINGKEY['customers'][val].order_mode
        }
      }
    },
    setRequestOrderItemReference(index, val) {
      const detail = this.RequestOrderItemOptions.find(x => x.data.id === val)
      if(!detail) {
        console.warn('[PLAY] Set item part invalid!')
        return
      }

      const itemID = detail.data.item_id
      this.rsForm.pre_delivery_items[index].item_id = itemID

      this.setItemReference(index, itemID)
    },
    setItemReference(index, val) {
      this.rsForm.pre_delivery_items[index].item = this.MAPINGKEY['items'][val]

      let unitID = this.MAPINGKEY['items'][val].unit_id
      this.rsForm.pre_delivery_items[index].unit_id = unitID
      this.rsForm.pre_delivery_items[index].unit_rate = 1
      this.rsForm.pre_delivery_items[index].unit = this.MAPINGKEY['units'][unitID]
    },
    setUnitReference(index, val) {
      let detail = this.rsForm.pre_delivery_items[index]

      if(!val && !detail.hasOwnProperty('item')) return;
      else if (detail.item.unit_id === val) {
        this.rsForm.pre_delivery_items[index].unit_rate = 1
      }
      else {
        if(detail.item.item_units) {
          detail.item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.pre_delivery_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },
    hasDetailItems(index) {
      const hasItems = []
      const details = this.rsForm.pre_delivery_items
      for (let i = 0; i < details.length; i++) {
        if(index !== i) {
          hasItems.push(details[i].item_id)
        }
      }
      return hasItems
    },
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(this.rsForm.customer_id) {
        this.SHEET.load('items', 'customer_id='+ this.rsForm.customer_id)
      }

      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {
        this.FORM.response.relationship({
          title: 'Pre-Delivery has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
    },
    addNewItem(){
      let newEntri = this.setDefault().pre_delivery_items[0]

      this.rsForm.pre_delivery_items.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.pre_delivery_items.splice(index, 1)
        if(this.rsForm.pre_delivery_items.length < 1) this.addNewItem()
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
          }, 2000);
        });

      });
    },
  },
}
</script>
