<template>
<q-page padding class="form-page">
  <q-card inline class="main-box" :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header
        :title="FORM.title()"
        :subtitle="FORM.subtitle()">
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark"></q-separator>
    <!-- COLUMN::1st Transaction details -->
    <q-card-section class="row q-col-gutter-x-md">
      <div class="col-12 col-sm-6 column">
        <ux-date autofocus name="date" type="date"
          :label="$tc('label.date')" stack-label
          v-model="rsForm.date"
          v-validate="`required`"
          :dark="LAYOUT.isDark"
          :error="errors.has('date')"
          :error-message="errors.first('date')"/>

        <ux-select
          name="item_id"
          :data-vv-as="$tc('items.part_name')"
          popup-content-class="options-striped"
          v-model="rsForm.item_id" clearable
          v-validate="'required'"
          filter
          source="api/v1/common/items?mode=all&--limit=50"
          :source-keys="['part_name', 'part_number']"
          option-value="id" emit-value map-options
          :option-label="(item) => item.part_name || rsForm.item.part_name"
          :option-sublabel="(item) => `[${item.customer_code}] ${item.part_number}`"
          :option-disable="(item) => !item.enable"
          :options-dark="LAYOUT.isDark"
          :dark="LAYOUT.isDark"
          @selected="(val, opt)=>{ setItemReference(val, opt) }"
          :error="errors.has(`item_id`)"
          :error-message="errors.first(`item_id`)" />

        <q-input readonly
          :value="rsForm.item ? rsForm.item.part_number : null"
          outlined dense hide-bottom-space color="blue-grey-5"
          :dark="LAYOUT.isDark" />
      </div>

      <div class="col-12 col-sm-6 column">
        <q-select
          :name="`stockist`"
          label="STOCKIST" stack-label
          :data-vv-as="$tc('items.stockist')"
          v-model="rsForm.stockist"
          :disable="!Boolean(rsForm.item_id)"
          :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
          :options="StockistOptions"
          option-label="code"
          option-value="value"
          emit-value map-options
          v-validate="'required'"
          :error="errors.has(`stockist`)"
          :error-message="errors.first(`stockist`)"
          @input="(val) => setStockistReference(val) " />

        <q-input type="number" style="min-width:120px"
          :name="`init_amount`"
          :data-vv-as="$tc('items.stock_init')"
          v-model="rsForm.init_amount" readonly dense outlined
          v-validate="'required'"
          :dark="LAYOUT.isDark"
          :error="errors.has(`init_amount`)"
          :error-message="errors.first(`init_amount`)">
          <span slot="prepend" class="text-caption" v-text="$tc('items.stock_init')"></span>
        </q-input>

        <q-input type="number" style="min-width:120px"
          :name="`total_amount`"
          :data-vv-as="$tc('items.stock_final')"
          :value="FinalAmount" dense outlined readonly
          v-validate="'required'"
          :dark="LAYOUT.isDark"
          :error="errors.has(`total_amount`)"
          :error-message="errors.first(`total_amount`)">
          <span slot="prepend" class="text-caption" v-text="$tc('items.stock_final')"></span>
        </q-input>
      </div>

    </q-card-section>
    <!-- COLUMN::2nd Request orders -->
    <q-separator inset spaced :dark="LAYOUT.isDark"></q-separator>
    <q-card-section class="row q-col-gutter-sm">

      <div class="col-12">
        <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
          dense separator="horizontal"
          :dark="LAYOUT.isDark">
            <q-tr>
              <q-th key="prefix"></q-th>
              <q-th key="reference">{{$tc('label.reference')}}</q-th>
              <q-th key="quantity">{{$tc('label.quantity')}}</q-th>
              <q-th key="unit_id">{{$tc('label.unit')}}</q-th>
            </q-tr>
            <q-tr v-for="(row, index) in rsForm.opname_stock_items" :key="index" style="vertical-align:top">
              <q-td  style="width:50px">
                <q-btn dense flat round icon="clear" color="negative" tabindex="100" @click="removeItem(index)"/>
              </q-td>
              <q-td width="25%">
                <q-input autofocus style="min-width:120px"
                  :name="`opname_stock_items.${index}.reference`"
                  :data-vv-as="$tc('label.reference')"
                  v-model="row.reference"
                  v-validate="'required|integer'"
                  dense outlined hide-bottom-space no-error-icon color="blue-grey-5"
                  :dark="LAYOUT.isDark"
                  :error="errors.has(`opname_stock_items.${index}.reference`)"
                  :error-message="errors.first(`opname_stock_items.${index}.reference`)"/>
              </q-td>
              <q-td width="45%">
                <q-input type="number" style="min-width:120px"
                  :name="`opname_stock_items.${index}.quantity`"
                  :data-vv-as="$tc('label.quantity')"
                  v-model="row.quantity"
                  v-validate="'required'"
                  dense outlined hide-bottom-space no-error-icon color="blue-grey-5"
                  :dark="LAYOUT.isDark"
                  @input="row.unit_id = (rsForm.item) ? rsForm.item.unit_id : null"
                  :error="errors.has(`opname_stock_items.${index}.quantity`)"
                  :error-message="errors.first(`opname_stock_items.${index}.quantity`)"/>
              </q-td>
              <q-td width="30%">
                <q-select map-options emit-value style="min-width:100px"
                  :name="`opname_stock_items.${index}.unit_id`"
                  :data-vv-as="$tc('label.unit')"
                  v-model="row.unit_id" disable
                  dense outlined hide-bottom-space color="blue-grey-5"
                  :dark="LAYOUT.isDark"
                  :options="ItemUnitOptions"
                  :options-dark="LAYOUT.isDark"
                  v-validate="row.item_id ? 'required' : ''"
                  :error="errors.has(`opname_stock_items.${index}.unit_id`)"
                  @input="(val)=> { setUnitReference(index, val) }"/>
                <q-input class="hidden" v-model="row.unit_rate" />
              </q-td>
            </q-tr>

          <q-tr>
            <q-td></q-td>
            <q-td>
              <q-btn dense color="positive" :label="$tc('form.add')" icon-right="add" class="full-width" @click="addNewItem()"/>
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
        v-model="rsForm.description"/>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="q-mx-lg">
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" v-if="IS_EDITABLE"
        :loading="FORM.loading" />

      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.list')" icon="list" color="dark" :to="`${FORM.resource.uri}?return`"></q-btn>
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
      },
      FORM:{
        resource:{
          uri: '/admin/warehouses/opname-stocks',
          api: '/api/v1/warehouses/opname-stocks',
        },
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number: null,
          date: this.$app.moment().format('YYYY-MM-DD'),

          item_id: null, item: null,
          stockist: null,
          init_amount: 0,
          description: null,

          opname_stock_items:[
            {
              id:null,
              quantity: null,
              unit_id: null,
              unit_rate: 1,
            }
          ]

        }
      }
    }
  },
  created(){
    // Component Page Mounted!
    this.init()

  },
  computed: {
    IS_EDITABLE() {
      if (Object.keys(this.FORM.data.has_relationship || {}).length > 0) return false
      return this.$app.can('opname-stocks-update')
    },
    FinalAmount() {
      const total = this.rsForm.opname_stock_items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_rate)
      }, 0);
      return Number(total)
    },
    StockistOptions() {
      let excluded = ['WO', 'RDO.REG', 'RDO.RET', 'PDO.REG', 'PDO.RET', 'VDO']

      if (this.ROUTE.query && this.ROUTE.query.DEV) excluded = []
      return this.$store.state['admin'].CONFIG.items.stockists
        .filter(x => !excluded.some(e => e === x.value))
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemUnitOptions() {
      if (!this.UnitOptions) return []
      if (!this.rsForm.item) return []

      const item = this.rsForm.item
      return this.UnitOptions.filter(unit => {
        if (unit.value === item.unit_id) return true
        return item.item_units.find(x => x.unit_id === unit.value)
      })
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
      this.rsForm = JSON.parse(JSON.stringify(data))

      if(Object.keys(data['has_relationship'] || {}).length > 0) {

        this.FORM.response.relationship({
          title: 'Stock Opname has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
    },
    setItemReference(val, opt) {
      this.rsForm.init_amount = 0
      this.rsForm.item = (val) ? opt : null

      if (this.rsForm.item && this.rsForm.stockist) {
        this.setStockistReference(this.rsForm.stockist)
      }
    },
    setStockistReference(val) {
      const totals = this.rsForm.item.totals || {}
      this.rsForm.init_amount = Number(totals[val] || 0)
    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.item.unit_id === val) {
        this.rsForm.opname_stock_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.item.item_units) {
          this.rsForm.item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.opname_stock_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },
    addNewItem(autofocus){
      autofocus = autofocus || false
      let newEntri = this.setDefault().opname_stock_items[0] // {id:null, item_id: null, quantity: null};
      if (this.rsForm.item) newEntri.unit_id = this.rsForm.item.unit_id

      this.rsForm.opname_stock_items.push(newEntri)
    },
    removeItem(index) {
      this.rsForm.opname_stock_items.splice(index, 1)
      if(this.rsForm.opname_stock_items.length < 1) this.addNewItem()
    },

    onSave() {

      const submit = () => {
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();
        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toView(response.data.id)
        })
        .catch((error) => {
          this.FORM.response.error(error.response || error, 'UPDATE FAILED');
          this.FORM.response.fields(error.response);
        })
        .finally(()=>{
          setTimeout(() => {
            this.FORM.loading = false
          }, 2000)

        })
      }

      this.$validator.validate().then(result => {
        if (!result) {
          return this.$q.notify({
            color:'negative', icon:'error', position:'top-right', timeout: 3000,
            message:this.$tc('messages.to_complete_form')
          })
        }

        submit()
      })
    },
  },
}
</script>
