<template>
<q-page padding class="form-page justify-center" >
  <q-card inline class="main-box " :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header :dark="LAYOUT.isDark"
        :title="String($tc('form.revision') +' - '+ $tc('general.pre_delivery')).toUpperCase()"
        :subtitle="FORM.subtitle()">
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

      <q-input class="col-6 col-sm-3"
        name="rit" type="number" min="0"
        stack-label label="RIT"
        v-model="rsForm.rit"
        v-validate="''"
        :dark="LAYOUT.isDark"
        :error="errors.has('rit')"
        :error-message="errors.first('rit')"/>

      <div class="col-12">

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
          <q-tr v-for="(row, index) in rsForm.pre_delivery_items" :key="index">
            <q-td key="prefix">
              <q-btn dense flat round icon="close" color="red" @click="removeItem(index)"/>
            </q-td>
            <q-td key="item_id" width="35%" style="min-width:150px">
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
            </q-td>
            <q-td key="part_number" width="35%" style="min-width:150px">
              <q-input readonly
                :value="row.item ? row.item.part_number : null"
                outlined dense hide-bottom-space color="blue-grey-5"
                :dark="LAYOUT.isDark" />
            </q-td>
            <q-td key="unit_id" width="15%">
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
            <q-td key="quantity" width="30%">
              <q-input style="min-width:100px"
                input-style="font-weight:bolder"
                :name="`pre_delivery_items.${index}.quantity`"
                v-model="row.quantity" type="number" min="0"
                outlined dense hide-bottom-space no-error-icon
                bg-color="grey-2" color="blue-grey-5"
                :dark="LAYOUT.isDark"
                :error="errors.has(`pre_delivery_items.${index}.quantity`)"
                @input="(val)=> {row.unit_qty = (val) * (row.unit_rate)}"/>
            </q-td>
            <q-td key="wrap" width="25%">
              <q-input style="min-width:100px"
                :name="`pre_delivery_items.${index}.wrap`"
                outlined dense hide-bottom-space  color="blue-grey-5"
                v-model="row.wrap" />
            </q-td>
          </q-tr>

          <!-- <q-tr v-for="(row, index) in row.outgoing_verifications" :key="index+'.'+index"
            >
            <q-td key="prefix"></q-td>
            <q-td colspan="2">
              <q-btn outline dense round icon="clear" size="xs" color="red-4"
                class="float-right q-my-xs"
                @click="removeVerify(index, index)" />
            </q-td>
            <q-td>
              <ux-date autofocus style="min-width:100px" class="slime-height"
                :name="`pre_delivery_items.${index}.outgoing_verifications.${index}.date`"
                outlined dense hide-bottom-space no-error-icon color="blue-grey-5"
                v-model="row.date" type="date"
                v-validate="`required|date_format:yyyy-MM-dd`"
                :dark="LAYOUT.isDark"
                :error="errors.has(`pre_delivery_items.${index}.outgoing_verifications.${index}.date`)"/>
            </q-td>
            <q-td>
              <q-input autofocus style="min-width:120px" class="slime-height"
                :name="`pre_delivery_items.${index}.outgoing_verifications.${index}.quantity`"
                v-model="row.quantity" type="number" min="0"
                outlined dense hide-bottom-space no-error-icon color="blue-grey-5"
                :dark="LAYOUT.isDark"
                :suffix="' / ' + $app.number_format(MaxTotal[index][index])"
                v-validate="`required|gt_value:0|max_value:${$app.number_format(MaxTotal[index][index])}`"
                :error="errors.has(`pre_delivery_items.${index}.outgoing_verifications.${index}.quantity`)"
                />
            </q-td>
          </q-tr> -->
          <!-- <q-tr>
            <q-td key="prefix"></q-td>
            <q-td colspan="3"></q-td>
            <q-td class="text-right">
              <q-btn dense icon-right="add" :label="$tc('form.add')" size="xs" color="green"
                align="center"
                @click="addNewVerify(index)" />
            </q-td>
          </q-tr> -->

          <q-tr>
            <q-td></q-td>
            <q-td>
              <q-btn dense outline :label="$tc('form.add')" icon="add_circle_outline" color="blue-grey" class="full-width" @click="addNewItem()"/>
            </q-td>
            <q-td colspan="100%"></q-td>
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
      <q-btn :label="$tc('form.revision')" icon="save" color="red-10" @click="onSave()" v-if="IS_REVISE" />
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
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
      },
      FORM: {
        resource: {
          api: '/api/v1/incomes/pre-deliveries',
          uri: '/admin/deliveries/pre-deliveries',
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
          pre_delivery_items:[
            {
              id:null,
              item_id: null,
              unit_id: null,
              unit_rate: 1,
              unit_qty: null,
              quantity: null,
              outgoing_verifications: [{
                id:null,
                item_id: null,
                unit_id: null,
                unit_rate: 1,
                unit_qty: null,
                quantity: null,
                wrap: null
              }]
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
    IS_REVISE() {
      if (this.rsForm.deleted_at) return false
      // if (Object.keys(this.rsForm.has_relationship || {}).length > 0) return false
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
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let data = this.SHEET.items.data

      return (data.map(item => ({
        label: `${item.part_name}`,
        sublabel: `${item.code} ${item.part_number}`,
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
    MaxTotal() {
      if (!this.rsForm.pre_delivery_items) return {}
      let data = {}
      this.rsForm.pre_delivery_items.map((detail, index) => {
        let sisa = detail.quantity
        data[index] = {}
        if (!detail.outgoing_verifications) return;
        detail.outgoing_verifications.map((item,key) => {
          data[index][key] = sisa
          sisa -= item.quantity
        })
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
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(this.rsForm.customer_id) {
        this.SHEET.load('items', 'customer_id='+ this.rsForm.customer_id)
      }
    },
    addNewItem(){
      let newEntri = this.setDefault().pre_delivery_items[0] // {id:null, item_id: null, quantity: null};

      this.rsForm.pre_delivery_items.push(newEntri)
    },
    addNewVerify(index){
      let newEntri = this.setDefault().pre_delivery_items[0].outgoing_verifications[0]

      this.rsForm.pre_delivery_items[index].outgoing_verifications.push(newEntri)
    },
    removeItem(index) {
        this.rsForm.pre_delivery_items.splice(index, 1)
        if(this.rsForm.pre_delivery_items.length < 1) this.addNewItem()
    },
    removeVerify(index, key) {
        this.rsForm.pre_delivery_items[index].outgoing_verifications.splice(key, 1)
        if(this.rsForm.pre_delivery_items[index].outgoing_verifications.length < 1) this.addNewVerify(index)
    },
    onSave() {
      const submit = () => {
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();
        apiUrl += `?mode=revision`
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
