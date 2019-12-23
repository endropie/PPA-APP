<template>
<q-page padding class="form-page">
  <q-card inline class="main-box q-ma-sm " :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark"/>
    <q-card-section class="row q-col-gutter-x-md">
      <!-- COLUMN::1st Packing Identitity -->
      <div class="col-12 row">
        <q-field dense borderless class="col-12 col-sm-grow"
          :dark="LAYOUT.isDark"
          prefix="Work Time Process"
          :error="errors.has('worktime')"
          :error-message="errors.first('worktime')">
          <q-option-group slot="control"
            name="worktime" type="radio" inline
            v-model="rsForm.worktime"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :options="CONFIG.options['worktime']"
          />
        </q-field>
        <ux-select class="col-12 col-sm-auto" style="min-width:250px"
          name="operator_id"
          label="Operator"
          v-model="rsForm.operator"
          dense filled
          filter clearable
          :source-keys="['name']"
          source="/api/v1/common/employees?mode=all&limit=15&sort=name"
          option-label="name" option-value="id"
          @selected="(ol) => rsForm.operator_id = (ol ? ol.id : null)"
          :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
          v-validate="'required'" data-vv-as="Operator"
          :error="errors.has('operator_id')" da-vv-as="Operator"
          :error-message="errors.first('operator_id')"/>

      </div>
      <div class="col-12" >
        <div class="row q-col-gutter-xs">

          <ux-select-filter class="col-12 col-sm-6"
            name="customer_id"
            v-model="rsForm.customer_id"
            :label="$tc('general.customer')"
            :disable="IssetItemID"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :options="CustomerOptions" filter clearable
            @input="setCustomerReference"
            :error="errors.has('customer_id')"
            :error-message="errors.first('customer_id')"
            :loading="SHEET.customers.loading" />

          <ux-date class="col-12 col-sm-6" name="date"
            :label="$tc('label.date')"
            no-error-icon
            v-model="rsForm.date" type="date"
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :error="errors.has('date')"
            :error-message="errors.first('date')">

            <q-select slot="after" class="no-padding" style="min-width:100px"
              name="shift_id"
              hide-dropdown-icon no-error-icon
              :label="$tc('label.shift')" stack-label
              v-model="rsForm.shift_id"
              v-validate="'required'"
              :options="ShiftOptions" filter
              map-options emit-value
              :error="errors.has('shift_id')"
            />

           </ux-date>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-pa-md bordered">
        <!-- COLUMN::2.1th Items Part -->
        <div class="row q-col-gutter-x-md">
          <ux-select-filter class="col-12 col-sm-4"
            name="packing_items.item_id"
            :label="$tc('general.item')"
            :data-vv-as="$tc('general.item')"
            v-model="rsForm.packing_items.item_id" clearable
            v-validate="'required'"
            popup-content-class="options-striped"
            :options="ItemOptions"
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            :error="errors.has('packing_items.item_id')"
            :error-message="errors.first('packing_items.item_id')"
            :loading="SHEET.items.loading"
            @input="setItemReference" />

          <ux-select-filter class="col-12 col-sm-4"
            name="packing_items.work_order_item_id"
            :label="`${$tc('label.part')} ${$tc('general.work_order')}`"
            :data-vv-as="`${$tc('label.part')} ${$tc('general.work_order')}`"
            v-model="rsForm.packing_items.work_order_item_id" clearable
            :dark="LAYOUT.isDark"
            v-validate="'required'"
            :options="WorkOrderItemOptions.filter(opt => opt.rowdata.item_id === rsForm.packing_items.item_id)"
            :error="errors.has('packing_items.work_order_item_id')"
            :error-message="errors.first('packing_items.work_order_item_id')"
            :loading="SHEET['work_order_items'].loading"/>

          <q-input class="col-12 col-sm-4"
            name="packing_items.quantity"
            :label="$tc('label.quantity')"
            :data-vv-as="$tc('label.quantity')"
            v-model="rsForm.packing_items.quantity" type="number" :min="0"
            :dark="LAYOUT.isDark"
            v-validate="`required|gt_value:0|max_value:${MaxUnit}`"
            :suffix="rsForm.packing_items.item_id ? `/ ${$app.number_format(MaxUnit)}` : ''"
            :error="errors.has(`packing_items.quantity`)"
            :error-message="errors.first(`packing_items.quantity`)" >
            <!-- <q-badge :label="$app.number_format(MaxUnit)" /> -->
            <q-select slot="after" class="no-padding" style="min-width:80px"
              name="packing_items.unit_id"
              :label="$tc('label.unit')" :data-vv-as="$tc('label.unit')"
              :dark="LAYOUT.isDark"
              no-error-icon
              v-model="rsForm.packing_items.unit_id"
              :options="ItemUnitOptions"
              map-options emit-value
              v-validate="'required'"
              @input="setUnitReference"
              :error="errors.has('packing_items.unit_id')" />


          </q-input>
        </div>

        <!-- COLUMN::2.1th Items faults lists -->
        <div class="column">
          <q-select name="type_fault_id"
            label="Type of Faulty"
            v-model="rsForm.packing_items.type_fault_id"
            :dark="LAYOUT.isDark"
            v-validate="''"
            :options="TypeFaultOptions" clearable
            map-options emit-value
            :error="errors.has('type_fault_id')"
            :error-message="errors.first('type_fault_id')"
            :disable="rsForm.packing_items.packing_item_faults.some(x => Boolean(x.fault_id))" />


          <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
            dense separator="horizontal"
            :dark="LAYOUT.isDark"
            v-show="rsForm.packing_items.type_fault_id">
            <q-tr>
              <q-th key="prefix" width="50px"></q-th>
              <q-th key="quantity" width="35%">{{$tc('label.quantity')}}</q-th>
              <q-th key="fault_id">{{$tc('items.fault')}}</q-th>
            </q-tr>
            <q-tr v-for="(row, index) in rsForm.packing_items.packing_item_faults" :key="index">
              <q-td key="prefix">
                <q-btn dense flat  icon="clear" color="red" @click="removeItemFault(index)"/>
              </q-td>
              <q-td key="quantity">
                <q-input autofocus input-class="text-center"
                  :name="`packing_items.packing_item_faults.${index}.quantity`"
                  type="number" min="0" align="center"
                  outlined dense hide-bottom-space color="blue-grey"
                  :dark="LAYOUT.isDark"
                  v-model="row.quantity"
                  v-validate="row.fault_id ? 'required|gt_value:0' : ''"
                  :data-vv-as="$tc('label.quantity')"
                  :error="errors.has(`packing_items.packing_item_faults.${index}.quantity`)"
                  />
              </q-td>
              <q-td key="fault_id">
                <ux-select-filter
                  :name="`packing_items.packing_item_faults.${index}.fault_id`"
                  outlined style="min-width:150px"
                  dense hide-bottom-space color="blue-grey"
                  :dark="LAYOUT.isDark"
                  v-model="row.fault_id"
                  :options="FaultOptions" clearable
                  :disable="!row.quantity"
                  v-validate="row.quantity ? 'required' : ''"
                  data-vv-as="fault"
                  :error="errors.has(`packing_items.packing_item_faults.${index}.fault_id`)"
                />
              </q-td>
            </q-tr>
            <q-tr>
              <q-td></q-td>
              <q-td colspan="100%">
                <q-btn dense outline :label="$tc('form.add')" icon="add_circle_outline" class="full-width" color="blue-grey" @click="addNewItemFault()" />
              </q-td>
            </q-tr>
           </q-markup-table>

        </div>
      </div>


    </q-card-section>
     <q-card-section class="row q-col-gutter-x-md">
      <!-- COLUMN::4th Description -->
      <div class="col-12 column">
        <q-input name="description" type="textarea" rows="3"
          stack-label :label="$tc('label.description')"
          filled
          v-model="rsForm.description"
          :dark="LAYOUT.isDark"/>
      </div>

    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" />
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)" />
      <q-space />
      <q-btn :label="$tc('form.list')" icon="list" color="dark" class="on-right" :to="`${FORM.resource.uri}?return`"/>
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
      SHEET:{
        units: {api:'/api/v1/references/units?mode=all'},
        shifts: {api:'/api/v1/references/shifts?mode=all'},
        faults: {api:'/api/v1/references/faults?mode=all'},
        type_faults: {api:'/api/v1/references/type-faults?mode=all'},
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all&enable=true'},
        // work_orders: {autoload:false, api:'/api/v1/factories/work-orders?mode=all&has_amount_packing=true'},
        work_order_items: {autoload:false, api:'/api/v1/factories/work-orders?mode=items&has_amount_packing=true'},
      },
      FORM:{
        resource:{
          uri: '/admin/factories/packings',
          api: '/api/v1/factories/packings',
        },
      },
      rsForm: {
        packing_items:{}
      },
      rsData: {},
      setDefault:()=>{
        return {
          number: null,
          customer_id: null,

          date: this.$app.moment().format('YYYY-MM-DD'),
          shift_id: null,
          worktime: 'REGULER',
          description: null,
          operator_id: null,

          packing_items : {
            item_id: null,
            unit_id: null,
            unit_rate: 1,
            item: {},
            unit: {},
            quantity: null,
            work_order_item_id: null,
            type_fault_id: null,
            packing_item_faults:[
              {
                id:null,
                fault_id: null,
                quantity: null,
              }
            ]
          }
        }
      }
    }
  },
  created() {
    this.init()
  },
  computed: {
    IssetItemID() {
      if(!this.rsForm.hasOwnProperty('packing_items')) return false;

      return (this.rsForm.packing_items.item_id ? true : false)
    },
    WorkOrderItemOptions() {
      if (!this.rsForm.customer_id) return []
      if (!this.SHEET.work_order_items.data.length) return []

      const hasold = (id) => (this.FORM.data.packing_items && this.FORM.data.packing_items.work_order_item_id === id)
          ? Number(this.FORM.data.packing_items.unit_total) : 0

      let data = this.SHEET.work_order_items.data.filter(item => {
        if ((item.amount_process) <= (item.amount_packing - hasold(item.id))) return false
        return true
      })

      return data.map(item => {
        item.amount_packing -= hasold(item.id)
        let total = (Number(item.amount_process) - Number(item.amount_packing))
        if (item.id === this.rsForm.packing_items.item_id) total = total / UnitRate
        return ({
          label: item.work_order.full_number || item.work_order.number,
          value: item.id,
          rowdata: item,
          stamp: total
        })
      })
    },
    TypeFaultOptions() {
      return (this.SHEET.type_faults.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    FaultOptions() {
      if (!this.rsForm.packing_items.type_fault_id) return []

      let data = this.SHEET.faults.data
      data = data.filter(x => x.type_fault_id === this.rsForm.packing_items.type_fault_id)

      return (data.map(item => ({label: item.name, value: item.id})) || [])
    },
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(item => ({...item, label: item.name, value: item.id})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({...item, label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      if (!this.WorkOrderItemOptions.length) return []

      const hasItems = this.WorkOrderItemOptions.map(x => ({
        id: x.rowdata.item_id,
        total: Number(x.rowdata.amount_process) - Number(x.rowdata.amount_packing)
      }))

      const total = (id) => {
        let UnitRate = 1
        if (this.rsForm.packing_items.item_id && this.rsForm.packing_items.item_id === id) {
          UnitRate = this.rsForm.packing_items.unit_rate || 1
        }

        return hasItems.reduce((calc, item ) => {
          const add = item.id === id ? Number(item.total) : 0
          return Number(calc) + add
        }, 0) / UnitRate
      }

      let Items = this.SHEET.items.data.filter((item) => {
        if (!hasItems.find(x => item.id === x.id)) return false

        return item.customer_id == this.rsForm.customer_id
      } )
      return (Items.map(item => ({
        label: item.part_name,
        sublabel: `[${item.code}] ${item.part_number}`,
        value: item.id,
        stamp: total(item.id),
        disable: !item.enable,
        rowdata:item
      })) || [])
    },
    ItemUnitOptions() {
      let vars = []

      let rsItem = this.rsForm.packing_items
      vars = ( this.UnitOptions || [])
      vars = vars.filter((unit)=> {
        if(!rsItem.item_id) return false
        if(rsItem.item) {
          if(rsItem.item.unit_id === unit.value) return true
          if(rsItem.item.item_units) {
            let filters = rsItem.item.item_units.filter((fill)=> fill.unit_id === unit.value)
            if(filters.length > 0) return true
          }
        }
        return false;
      })
      return vars
    },
    MaxUnit() {
      let rsItem = this.rsForm.packing_items
      if(!rsItem.item_id) return 0
      if(this.WorkOrderItemOptions.length == 0) return 0

      const find = this.WorkOrderItemOptions.find(opt => {
        return opt.rowdata.id === rsItem.work_order_item_id
      })

      let faults = 0
      if(this.rsForm.packing_items && this.rsForm.packing_items.packing_item_faults) {
        faults = this.rsForm.packing_items.packing_item_faults.reduce( (calc, item ) => {
          return Number(calc) + Number(item.quantity)
        }, 0 )

      }
      const UnitRate = this.rsForm.packing_items.unit_rate || 1
      let total = 0
      if (find) {
        total = (Number(find.rowdata.amount_process) - Number(find.rowdata.amount_packing)) / UnitRate
        total -= faults
      }
      return total
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
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(data.customer_id) {
        this.SHEET.load('items', 'customer_id='+ data.customer_id)

        const params = [
          `customer_id=${data.customer_id}`,
          `or_detail_ids=${data.packing_items.work_order_item_id}`,
        ]
        this.SHEET.load('work_order_items', params.join('&') )
      }

      if(data.hasOwnProperty('has_relationship') && data['has_relationship'].length > 0) {
        this.FORM.has_relationship = data.has_relationship
        this.FORM.onRelationship({
          title: 'Packing Good has relation!',
          message: data['has_relationship'].join("-"),
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}/view`)
        })
      }

    },
    setCustomerReference(val) {
      if(!val) {
        this.rsForm.packing_items.item_id = null
      }
      else {
        this.SHEET.load('items', 'customer_id='+val)
        const params = [`customer_id=${val}`]
        if(this.FORM.data.packing_items && this.FORM.data.packing_items.work_order_item_id) {
          params.push(`or_detail_ids=${this.FORM.data.packing_items.work_order_item_id}`)
        }
        this.SHEET.load('work_order_items', params.join('&') )
      }
    },
    setItemReference(val) {
      if(!val) {
        this.rsForm.packing_items.unit_id = null
        this.rsForm.packing_items.work_order_item_id = null
        this.rsForm.packing_items.unit = {}
        this.rsForm.packing_items.item = {}
      }
      else{
        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.packing_items.unit_id = baseUnitID
        this.rsForm.packing_items.unit_rate = 1

        this.rsForm.packing_items.item = this.MAPINGKEY['items'][val]
        this.rsForm.packing_items.unit = this.MAPINGKEY['units'][baseUnitID]

        this.rsForm.packing_items.work_order_item_id = null
      }
    },
    setUnitReference(val) {
      if(!val) return;
      else if (this.rsForm.packing_items.item.unit_id === val) {
        this.rsForm.packing_items.unit_rate = 1
      }
      else {
        if(this.rsForm.packing_items.item.item_units) {
          this.rsForm.packing_items.item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.packing_items.unit_rate = unitItem.rate
          })
        }
      }
    },

    addNewItemFault(autofocus = true){
      let newEntri =  this.setDefault().packing_items.packing_item_faults[0];

      this.rsForm.packing_items.packing_item_faults.push(newEntri)
    },
    removeItemFault(index) {
        this.rsForm.packing_items.packing_item_faults.splice(index, 1)
        if(this.rsForm.packing_items.packing_item_faults.length < 1) this.addNewItemFault()
    },

    onSave() {

      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message: this.$tc('messages.to_complete_form')
          })
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta()
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
            this.FORM.loading = false
          });

      });
    },
  },
}
</script>
