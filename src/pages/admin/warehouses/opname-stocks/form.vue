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
      <ux-date autofocus name="date" type="date" class="col-12 col-sm-6"
        :label="$tc('label.date')" stack-label
        v-model="rsForm.date"
        v-validate="`required`"
        :dark="LAYOUT.isDark"
        :error="errors.has('date')"
        :error-message="errors.first('date')"/>

      <q-input class="col-12 col-sm-6"
        name="reference"
        stack-label :label="$tc('label.reference')"
        v-model="rsForm.reference"
        v-validate="'required'"
        :dark="LAYOUT.isDark"
        :error="errors.has('reference')"
        :error-message="errors.first('reference')"/>
    </q-card-section>
    <!-- COLUMN::2nd Request orders -->
    <q-separator inset spaced :dark="LAYOUT.isDark"></q-separator>
    <q-card-section class="row q-col-gutter-sm">

      <div class="col-12">
        <q-table ref="table" class="main-box bordered no-shadow no-highlight th-uppercase"
          :data="rsForm.opname_stock_items" dense
          :dark="LAYOUT.isDark"
          :rows-per-page-options ="[0]" hide-bottom
          :columns="[
            { name: 'prefix', field: 'prefix', label: '',  align: 'left'},
            { name: 'item_id', field: 'item_id', label: $tc('items.part_name'), align: 'left'},
            { name: 'part_name', field: 'item_id', label: $tc('items.part_number'), align: 'left'},
            { name: 'stockist', field: 'stockist', label: $tc('items.stockist'), align: 'left'},
            { name: 'init_amount', field: 'pre_amount', label: $tc('items.stock_init'), align: 'center'},
            { name: 'final_amount', field: 'post_amount', label: $tc('items.stock_final'), align: 'center'},
            { name: 'unit_id', field: 'unit_id', label: $tc('label.unit'), align: 'center'},
          ]"
          :pagination="{ sortBy: null, descending: false, page: null, rowsPerPage: 0 }"
          >

            <template v-slot:body="rsItem">
              <q-tr style="vertical-align:top">
                <q-td  style="width:50px">
                  <q-btn dense flat round icon="clear" color="negative" tabindex="100" @click="removeItem(rsItem.row.__index)"/>
                </q-td>
                <q-td width="35%">
                  <ux-select autofocus
                    :name="`items.${rsItem.row.__index}.item_id`"
                    :data-vv-as="$tc('items.part_name')"
                    dense outlined hide-bottom-space color="blue-grey-5"
                    popup-content-class="options-striped"
                    v-model="rsItem.row.item_id" clearable
                    v-validate="'required'"
                    filter filter-min="3"
                    source="api/v1/common/items?mode=all&--limit=50"
                    :source-keys="['part_name', 'part_number']"
                    option-value="id"
                    :option-label="(item) => item.part_name || rsItem.row.item.part_name"
                    :option-sublabel="(item) => `[${item.customer_code}] ${item.part_number}`"
                    :option-disable="(item) => !item.enable"
                    :options-dark="LAYOUT.isDark"
                    :dark="LAYOUT.isDark"
                    @selected="(val, opt)=>{ setItemReference(rsItem.row.__index, val, opt) }"
                    :error="errors.has(`items.${rsItem.row.__index}.item_id`)"
                    :error-message="errors.first(`items.${rsItem.row.__index}.item_id`)"
                  />

                </q-td>
                <q-td key="part_number" width="35%" style="min-width:150px">
                  <q-input readonly
                    :value="rsItem.row.item ? rsItem.row.item.part_number : null"
                    outlined dense hide-bottom-space color="blue-grey-5"
                    :dark="LAYOUT.isDark" />
                </q-td>
                <q-td width="20%">
                  <q-select style="min-width:50px"
                    :name="`items.${rsItem.row.__index}.stockist`"
                    :data-vv-as="$tc('items.stockist')"
                    v-model="rsItem.row.stockist"
                    :disable="!Boolean(rsItem.row.item_id)"
                    dense outlined hide-bottom-space no-error-icon color="blue-grey-5"
                    :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                    :options="StockistOptions"
                    v-validate="'required'"
                    :error="errors.has(`items.${rsItem.row.__index}.stockist`)"
                    :error-message="errors.first(`items.${rsItem.row.__index}.stockist`)"
                    @input="(val) => setStockistReference(rsItem.row.__index, val) " />

                  <q-input class="hidden" v-model="rsItem.row.unit_rate" />
                </q-td>
                <q-td width="25%">
                  <q-input type="number" style="min-width:120px"
                    :name="`items.${rsItem.row.__index}.init_amount`"
                    :data-vv-as="$tc('items.stock_init')"
                    v-model="rsItem.row.init_amount" disable
                    v-validate="'required'"
                    dense outlined hide-bottom-space no-error-icon color="blue-grey-5"
                    :dark="LAYOUT.isDark"
                    :error="errors.has(`items.${rsItem.row.__index}.init_amount`)"
                    :error-message="errors.first(`items.${rsItem.row.__index}.init_amount`)"/>
                </q-td>
                <q-td width="25%">
                  <q-input type="number" style="min-width:120px"
                    :name="`items.${rsItem.row.__index}.final_amount`"
                    :data-vv-as="$tc('items.stock_final')"
                    v-model="rsItem.row.final_amount"
                    v-validate="'required'"
                    dense outlined hide-bottom-space no-error-icon color="blue-grey-5"
                    :dark="LAYOUT.isDark"
                    :error="errors.has(`items.${rsItem.row.__index}.final_amount`)"
                    :error-message="errors.first(`items.${rsItem.row.__index}.final_amount`)"/>
                </q-td>
                <q-td width="20%">
                  <q-select map-options emit-value style="min-width:100px"
                    :name="`items.${rsItem.row.__index}.unit_id`"
                    :data-vv-as="$tc('label.unit')"
                    v-model="rsItem.row.unit_id" disable
                    dense outlined hide-bottom-space color="blue-grey-5"
                    :dark="LAYOUT.isDark"
                    :options="ItemUnitOptions[rsItem.row.__index]"
                    :options-dark="LAYOUT.isDark"
                    v-validate="rsItem.row.item_id ? 'required' : ''"
                    :error="errors.has(`items.${rsItem.row.__index}.unit_id`)"
                    @input="(val)=> { setUnitReference(rsItem.row.__index, val) }"/>
                  <q-input class="hidden" v-model="rsItem.row.unit_rate" />
                </q-td>
              </q-tr>
            </template>

          <q-tr slot="bottom-row" slot-scope="props" :props="props">
            <q-td></q-td>
            <q-td>
              <q-btn dense color="positive" :label="$tc('form.add')" icon-right="add" class="full-width" @click="addNewItem()"/>
            </q-td>
            <q-td colspan="100%"></q-td>
          </q-tr>
        </q-table>
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
      StockistOptions: ['FM', 'WO', 'WIP', 'FG'],
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
          reference: null,
          description: null,

          opname_stock_items:[
            {
              id:null,
              item_id: null, item: {},
              quantity: null,

              unit_id: null,
              unit_rate: 1,
              init_amount: null,
              final_amount: null,
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
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemUnitOptions() {
      if (!this.rsForm.opname_stock_items) return []
      if (!this.UnitOptions) return []

      return this.rsForm.opname_stock_items.map(detail => {
        if (!detail.item.item_units) return []
        return this.UnitOptions.filter(unit => {
          if (unit.value === detail.item.unit_id) return unit
          return detail.item.item_units.find(x => x.unit_id === unit.value)
        })
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
    setItemReference(index, val, opt) {
      this.rsForm.opname_stock_items[index].stockist = null
      this.rsForm.opname_stock_items[index].init_amount = null
      this.rsForm.opname_stock_items[index].final_amount = null

      if(!val) {
        this.rsForm.opname_stock_items[index].unit_id = null
        this.rsForm.opname_stock_items[index].unit_rate = 1
        this.rsForm.opname_stock_items[index].unit = {}
        this.rsForm.opname_stock_items[index].item = {}
      }
      else {
        this.rsForm.opname_stock_items[index].item = opt
        this.rsForm.opname_stock_items[index].unit_id = opt.unit_id
        this.rsForm.opname_stock_items[index].unit_rate = 1
        this.rsForm.opname_stock_items[index].unit = opt.unit
      }

    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.opname_stock_items[index].item.unit_id === val) {
        this.rsForm.opname_stock_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.opname_stock_items[index].item.item_units) {
          this.rsForm.opname_stock_items[index].item.item_units.map((unitItem)=> {
            if (unitItem.unit_id == val) this.rsForm.opname_stock_items[index].unit_rate = unitItem.rate
          })
        }
      }
    },
    setStockistReference(index, val) {
      const totals = this.rsForm.opname_stock_items[index].item.totals || {}
      this.rsForm.opname_stock_items[index].init_amount = Number(totals[val] || 0)
    },

    addNewItem(autofocus){
      autofocus = autofocus || false
      let newEntri = this.setDefault().opname_stock_items[0] // {id:null, item_id: null, quantity: null};

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
