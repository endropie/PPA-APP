<template>
  <q-page padding class="form-page">
    <q-card inline class="main-box q-ma-sm" v-if="FORM.show" :dark="LAYOUT.isDark">
      <q-card-section>
        <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        </form-header>
      </q-card-section>
      <q-separator :dark="LAYOUT.isDark" />
      <q-card-section class="row q-col-gutter-x-lg">
        <!-- COLUMN::1st customer Identitity -->
        <div class="col-12 col-sm-6">
          <div class="row q-col-gutter-x-sm">
            <ux-select-filter class="col-12"
              name="line_id"
              v-model="rsForm.line_id"
              :label="$tc('items.preline')"
              :disable="IssetWorkProductionItems"
              :dark="LAYOUT.isDark"
              :options="LineOptions" clearable
              v-validate="'required'"
              :error="errors.has('line_id')"
              :error-message="errors.first('line_id')"
              @input="(val) => val ? loadItemOptions() : false" />

          </div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="row q-col-gutter-x-sm">
            <ux-date name="date" type="date" class="col-12" style="min-width:200px"
              :label="$tc('label.date')" stack-label
              v-model="rsForm.date"
              v-validate="`required|date_format:yyyy-MM-dd` + FORM.ifCreate(`|after:${$app.moment().add(-1,'days').format('YYYY-MM-DD')}`,'')"
              :date-options="(date) => FORM.ifCreate(date >= $app.moment().format('YYYY/MM/DD'), true)"
              :dark="LAYOUT.isDark"
              :error="errors.has('date')"
              :error-message="errors.first('date')">

              <q-select slot="after" class="no-padding" style="min-width:80px"
                name="shift_id"
                :label="$tc('label.shift')" stack-label
                v-model="rsForm.shift_id"
                :dark="LAYOUT.isDark"
                :options="ShiftOptions" filter
                map-options emit-value
                v-validate="'required'"
                :error="errors.has('shift_id')"
              />
            </ux-date>
          </div>
        </div>
        <div class="col-12">
          <q-table dense hide-bottom
            class="bordered no-shadow th-uppercase no-highlight"
            separator="vertical"
            :dark="LAYOUT.isDark"
            :data="rsForm.work_production_items"
            :rows-per-page-options ="[0]"
            :columns="[
              { name: 'prefix', label: '',  align: 'left'},
              { name: 'item_id', label: $tc('items.part_name'), align: 'left'},
              { name: 'part_number', label: $tc('items.part_number'), align: 'left'},
              { name: 'work_order_item_line_id', label: 'WO [#]', align: 'left'},
              { name: 'unit_id', label: $tc('label.unit'), align: 'center'},
              { name: 'quantity', label: $tc('label.quantity'), align: 'center'},
            ]"
            :pagination=" {sortBy: null, descending: false, page: null, rowsPerPage: 0}">
            <template slot="body" slot-scope="rsItem">
              <q-tr>
                <q-td key="prefix" style="width:50px">
                  <q-btn dense flat round icon="clear" color="negative" tabindex="100"
                    @click="removeItem(rsItem.row.__index)"/>
                </q-td>
                <q-td key="item_id" width="30%" >
                  <ux-select-filter autofocus
                    :name="`work_production_items.${rsItem.row.__index}.item_id`"
                    :dark="LAYOUT.isDark"
                    v-model="rsItem.row.item_id"
                    v-validate="'required'"
                    outlined dense color="blue-grey-4"
                    hide-bottom-space hide-dropdown-icon
                    :disable="!rsForm.line_id"
                    :options="ItemOptions" clearable
                    @input="(val) => setItemReference(rsItem.row.__index, val)"
                    :error="errors.has(`work_production_items.${rsItem.row.__index}.item_id`)"
                    :loading="SHEET['items'].loading">
                  </ux-select-filter>
                </q-td>
                <q-td key="part_number" width="30%" style="min-width:150px">
                  <q-input readonly
                    :value="rsItem.row.item ? rsItem.row.item.part_number : null"
                    outlined dense hide-bottom-space color="blue-grey-5"
                    :dark="LAYOUT.isDark" />
                </q-td>
                <q-td key="work_order_item_line_id" width="30%" >
                  <ux-select-filter
                    :name="`work_production_items.${rsItem.row.__index}.work_order_item_line_id`"
                    :dark="LAYOUT.isDark"
                    v-model="rsItem.row.work_order_item_line_id"
                    v-validate="'required'"
                    outlined dense color="blue-grey-4"
                    no-error-icon hide-bottom-space hide-dropdown-icon
                    :disable="!rsForm.line_id"
                    :options="WorkOrderItemLineOptions.filter(x => x.item_id === rsItem.row.item.id)" clearable
                    :error="errors.has(`work_production_items.${rsItem.row.__index}.work_order_item_line_id`)"
                    :loading="SHEET['work_orders'].loading"
                  >
                    <q-badge slot="prepend" color="grey-5"
                      :label="'#'+rsItem.row.work_order_item_line_id"
                      v-show="Boolean(rsItem.row.work_order_item_line_id)" />
                  </ux-select-filter>

                </q-td>
                <q-td key="unit_id"  width="15%">
                  <q-select
                    :name="`work_production_items.${rsItem.row.__index}.unit_id`"
                    :dark="LAYOUT.isDark"
                    v-model="rsItem.row.unit_id"
                    outlined dense hide-bottom-space color="blue-grey-4"
                    :options="ItemUnitOptions[rsItem.row.__index]"
                    map-options  emit-value
                    v-validate="rsItem.row.item_id ? 'required' : ''"
                    :error="errors.has(`work_production_items.${rsItem.row.__index}.unit_id`)"
                    :disable="!rsForm.line_id || !rsItem.row.item_id"
                    @input="(val) => setUnitReference(rsItem.row.__index, val)"
                  />
                </q-td>
                <q-td key="quantity"  width="15%">
                  <q-input type="number" style="min-width:120px"
                    :name="`work_production_items.${rsItem.row.__index}.quantity`"
                    :dark="LAYOUT.isDark" color="blue-grey-6"
                    v-model="rsItem.row.quantity"
                    outlined dense hide-bottom-space no-error-icon align="right"
                    v-validate="`required|gt_value:0|max_value:${MaxStock[rsItem.row.__index]}`"
                    :error="errors.has(`work_production_items.${rsItem.row.__index}.quantity`)"
                    :suffix="' / '+ $app.number_format(MaxStock[rsItem.row.__index] / (rsItem.row.unit_rate||1))" />
                </q-td>
              </q-tr>
            </template>
            <q-tr slot="bottom-row" class="border-top">
              <q-td> </q-td>
              <q-td>
                <q-btn outline dense color="positive" class="full-width"
                  :label="$tc('form.add')" icon-right="add"
                  @click="addNewItem()" />
                </q-td>
              <q-td colspan="100%"></q-td>
            </q-tr>
          </q-table>
        </div>
        <!-- COLUMN::4th Description -->
        <div class="col-12 cloumn q-mt-md">
          <q-input name="description" type="textarea" rows="3"
            stack-label :label="$tc('label.description')"
            filled
            :dark="LAYOUT.isDark"
            v-model="rsForm.description"/>

        </div>
      </q-card-section>
      <q-separator :dark="LAYOUT.isDark" />
      <q-card-actions >
        <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()"
          :disabled="FORM.has_relationship.length > 0">
        </q-btn>
        <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
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
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
        lines: {api:'/api/v1/references/lines?mode=all'},
        shifts: {api:'/api/v1/references/shifts?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
        work_orders: {autoload:false, api:'/api/v1/factories/work-orders?mode=all'},
      },
      FORM: {
        resource:{
          uri: '/admin/factories/work-productions',
          api: '/api/v1/factories/work-productions',
        }
      },
      rsForm: {},
      setDefault: () => {
        return {
          number: null,
          line_id: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          shift_id: null,
          description: null,
          work_production_items: [
            {
              id:null,
              item_id: null,
              quantity: null,
              target:null,
              unit_id: null,
              unit_rate: 1,
              ngratio: 0,
              item: {}, unit: {},
              work_order_item_line_id: null
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
    IssetWorkProductionItems() {
      if (this.rsForm.work_production_items) {
        return this.rsForm.work_production_items.some((item) => item.item_id)
      }
      return false
    },
    WorkOrderItemLineOptions() {
      if (!this.rsForm.line_id) return []
      if (!this.SHEET['work_orders'].data.length) return []

      const oldKeys = this.FORM.data.work_production_items
        ? this.FORM.data.work_production_items.map(detail => detail.work_order_item_line_id)
        : []

      let Data = []
      let Item = []
      this.SHEET['work_orders'].data.map(rs => {
        rs.work_order_item_lines.map(detail => {
          if (this.rsForm.line_id !== detail.line_id) return false
          if (!oldKeys.find(x => x === detail.id) && detail.unit_amount <= detail.amount_line) return false

          detail.work_order_number = rs.number
          Data.push(detail)
          if (!Item.find(x => x === (detail.work_order_item.item_id || null))) Item.push(detail.work_order_item.item_id)

        })
      })

      if(Item.length) this.SHEET.load('items', `or_ids=${Item.join(',')}`)

      return Data.map(detail => {
        let total = (Number(detail.unit_amount) - Number(detail.amount_line))
        return ({
          label: detail.work_order_number,
          value: detail.id,
          stamp: this.$app.number_format(total),
          item_id: (detail.work_order_item.item_id || null),
          rowdata: detail
        })
      })
    },
    LineOptions() {
      let data = this.SHEET.lines.data || []
      return data.map(line => ({label: line.name, value: line.id, row:line}))
    },
    ShiftOptions() {
      return (this.SHEET.shifts.data.map(line => ({label: line.name, value: line.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      if (this.SHEET.items.data.length <= 0) return []

      // const stockist = 'WO'
      // let OrKeys = this.FORM.data.work_production_items.map(x => x.item_id, [])

      let ITEM = this.SHEET.items.data.filter((item) => {
        // if (!item.item_prelines || !item.item_prelines.length) return false
        // if (item.item_prelines[0].line_id !== this.rsForm.line_id) return false
        // if(item.totals[stockist] <= 0 && !OrKeys.find(x=> x === item.id)) return false
        return true
      })
      return (ITEM.map(item => ({
        label: item.part_name,
        sublabel: `[${item.customer_code}] ${item.part_number}`,
        value: item.id,
        disable: !item.enable,
        row: item
      })) || [])
    },
    ItemUnitOptions() {
      let vars = []

      for (const i in this.rsForm.work_production_items) {
        if (this.rsForm.work_production_items.hasOwnProperty(i)) {
          let rsItem = this.rsForm.work_production_items[i]
          vars[i] = ( this.UnitOptions || [])
          vars[i] = vars[i].filter((unit)=> {
            if(!rsItem.item_id) return false
            if(rsItem.item) {

              if(rsItem.item.unit_id === unit.value) return true
              if(rsItem.item.item_units) {
                let filtered = rsItem.item.item_units.filter((fill)=> fill.unit_id === unit.value)
                if(filtered.length > 0) return true
              }
            }
            return false;
          })
        }
      }
      return vars
    },
    MaxStock() {
      let stockItem =  {}
      let moveItem = {
        set: function (id, val) {
          if (!this.hasOwnProperty(id)) this[id] = 0
            this[id] += Number(val)
        },
        get: function (id) {
          return this.hasOwnProperty(id) ? this[id] : 0
        }
      }

      this.WorkOrderItemLineOptions.map(detail => {
        stockItem[detail.rowdata.id] = Number(detail.rowdata.unit_amount) - Number(detail.rowdata.amount_line)
      })


      this.FORM.data.work_production_items.map(detail => {
        if (stockItem.hasOwnProperty(detail.work_order_item_line_id)) {
          stockItem[detail.work_order_item_line_id] += Number(detail.unit_amount)
        }
      })

      return this.rsForm.work_production_items.map((detail, index) => {
        let max = 0
        if (detail.work_order_item_line_id) {
          max = Number(stockItem[detail.work_order_item_line_id] || 0) - Number(moveItem.get(detail.work_order_item_line_id) || 0)
          moveItem.set(detail.work_order_item_line_id, detail.quantity * detail.unit_rate)
        }
        return max
      })
    },
    MAPINGKEY() {
      let variables = {
        'customers' : {},
        'units': {},
        'items': {},
      }

      this.SHEET['customers'].data.map(value => { variables['customers'][value.id] = value })
      this.SHEET['units'].data.map(value => { variables['units'][value.id] = value })
      this.SHEET['items'].data.map(value => { variables['items'][value.id] = value })

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
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))
      if(data.id) this.loadItemOptions(data)
      if(data.hasOwnProperty('has_relationship') && data['has_relationship'].length > 0) {
        this.FORM.has_relationship = data.has_relationship

        let message = data['has_relationship'].join("-")
        this.$q.dialog({
          title: 'Work Order has Related',
          message: message,
          preventClose: true,
          ok: 'Direct to Detail Page',
          cancel: 'Continue'
        }).then(() => {
          this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        }).catch(() => {
          //
        })
      }
    },
    loadItemOptions(data = this.rsForm) {
      let params = [`has_amount_line=${data.line_id}`]
      if (this.FORM.data.work_production_items) {
        let orKeys = this.FORM.data.work_production_items.map(x => x.work_order_item_line_id)
        params.push(`or_work_order_item_line_ids=${orKeys.join(',')}`)
      }
      this.SHEET.load('work_orders', params.join('&'))

    },
    setItemReference(index, val) {
      this.rsForm.work_production_items[index].work_order_item_line_id = null

      if(!val){
        this.rsForm.work_production_items[index].unit_id = null
        this.rsForm.work_production_items[index].unit = {}
        this.rsForm.work_production_items[index].item = {}
      }
      else{
        this.rsForm.work_production_items[index].item = this.MAPINGKEY['items'][val]
        let baseUnitID = this.MAPINGKEY['items'][val].unit_id
        this.rsForm.work_production_items[index].unit_id = baseUnitID
        this.rsForm.work_production_items[index].unit_rate = 1
        this.rsForm.work_production_items[index].unit = this.MAPINGKEY['units'][baseUnitID]
      }
    },
    setUnitReference(index, val) {

      if(!val) return;
      else if (this.rsForm.work_production_items[index].item.unit_id === val) {
        this.rsForm.work_production_items[index].unit_rate = 1
      }
      else {
        if(this.rsForm.work_production_items[index].item.item_units) {
          this.rsForm.work_production_items[index].item.item_units.find((unitItem)=> {
            if (unitItem.unit_id == val) {
              this.rsForm.work_production_items[index].unit_rate = unitItem.rate
              return true
            }
          })
        }
      }
    },
    addNewItem() {
      let newEntri = Object.assign(this.setDefault().work_production_items[0])
      this.rsForm.work_production_items.push(newEntri)
    },
    removeItem(index) {
      this.rsForm.work_production_items.splice(index, 1)
      if(this.rsForm.work_production_items.length < 1) this.addNewItem()
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
          this.FORM.response.fields(error.response)
          this.FORM.response.error(error.response || error, this.$tc('messages.fail', 1, {v:this.$tc('form.save')}).toUpperCase())
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
          message: this.$tc('messages.to_sure', 1, {v: this.$tc('form.save')}),
          cancel: true,
          persistent: true
        }).onOk(() => {
          submit()
        })
      });
    },
  },
}
</script>

<style lang="stylus">
.border-top td
  border-top-width 1px

.suffix-floating
  margin-right 2px
  .q-btn--round
    min-height: unset
    min-width: unset
  .q-btn--fab
    height: 26px
    width: 26px
    .q-icon
      font-size 20px
  .q-btn--fab-mini
    height: 24px
    width: 24px
    .q-icon
      font-size 18px

</style>

