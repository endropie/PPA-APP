<template>
<q-page padding class="form-page row justify-center " >
  <q-card class="main-box self-start" v-if="FORM.show" style="min-width:80%">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-section class="row q-col-gutter-x-sm">
      <ux-select-filter class="col-12 col-sm-4"
        name="customer_id"
        v-model="rsForm.customer_id"
        stack-label :label="$tc('general.customer')"
        :options="CustomerOptions" clearable
        @input="setCustomerReference"
        v-validate="'required'"
        :error="errors.has('customer_id')"
        :error-message="errors.first('customer_id')"
        :loading="SHEET['customers'].loading"/>

      <ux-select-filter class="col-12 col-sm-4"
        name="pre_delivery_id"
        v-model="rsForm.pre_delivery_id"
        stack-label label="No. PDO"
        :options="PreDeliveryOptions" clearable
        @input="setPreDelivery"
        v-validate="'required'"
        :error="errors.has('pre_delivery_id')"
        :error-message="errors.first('pre_delivery_id')"
        :loading="SHEET['pre_deliveries'].loading"/>

        <ux-date class="col-sm-4"
          name="date" type="date"
          stack-label :label="$tc('label.date')"
          v-model="rsForm.date"
          v-validate="`required|date_format:yyyy-MM-dd`"
          :date-options="(date) => date <= $app.moment().format('YYYY/MM/DD')"
          :dark="LAYOUT.isDark"
          :error="errors.has('date')"
          :error-message="errors.first('date')"/>

    </q-card-section>
    <q-card-section>
      <q-markup-table class="main-box bordered no-shadow no-highlight th-uppercase"
        dense separator="horizontal"
        :dark="LAYOUT.isDark">
        <thead>
          <q-tr>
            <q-th key="item_id">{{$tc('items.part_name')}}</q-th>
            <!-- <q-th key="part_number">{{$tc('items.part_number')}}</q-th> -->
            <q-th key="quantity">{{$tc('label.quantity')}}</q-th>
            <q-th key="unit_id">{{$tc('label.unit')}}</q-th>
            <q-th key="AVA">{{$tc('label.available')}}</q-th>
            <q-th key="encasement">{{$tc('label.encasement')}}</q-th>
          </q-tr>
        </thead>
        <tbody>
          <q-tr v-for="(row, index) in rsForm.outgoing_good_verifications" :key="index">
            <q-td key="item_id" width="35%" >
              <!-- <q-input readonly
                :value="row.item ? row.item.part_name : null"
                outlined dense hide-bottom-space color="blue-grey-5"
                :dark="LAYOUT.isDark" /> -->
              <div v-if="row.item" class="column">
                <span class="text-subtitle">{{row.item.part_name}}</span>
                <span class="text-small">{{row.item.part_number}}</span>
              </div>
            </q-td>
            <q-td key="unit_id" width="10%" >
              <q-select
                v-model="row.unit_id"
                :options="ItemUnitOptions[index]"
                map-options emit-value
                outlined dense hide-bottom-space color="blue-grey-5"
                :dark="LAYOUT.isDark"
                @input="(val) => setUnitReference(index, val)" />
            </q-td>
            <q-td key="quantity" width="15%">
              <q-input :name="`outgoing_good_verifications.${index}.quantity`"
                style="min-width:120px"
                v-model="row.quantity" type="number" :min="0"
                outlined dense hide-bottom-space no-error-icon align="center"
                :dark="LAYOUT.isDark" color="blue-grey-5"
                :suffix="row.item_id ? `/ ${$app.number_format(row.maximum / row.unit_rate)}` : ''"
                v-validate="`gt_value:0|max_value: ${maximality(row.maximum, STOCKS[index]) / row.unit_rate}`"
                :error="errors.has(`outgoing_good_verifications.${index}.quantity`)"
              />
            </q-td>
            <q-td key="AVA" width="15%" align="right">
              <q-chip square class="text-weight-medium">
                {{$app.number_format(STOCKS[index] / row.unit_rate)}}
              </q-chip>
            </q-td>
            <q-td key="encasement" width="35%">
              <q-input :name="`outgoing_good_verifications.${index}.encasement`"
                style="min-width:120px"
                v-model="row.encasement"
                outlined dense hide-bottom-space no-error-icon align="center"
                :dark="LAYOUT.isDark" color="blue-grey-5"
                v-validate="``"
                :error="errors.has(`outgoing_good_verifications.${index}.encasement`)"
              />
            </q-td>
          </q-tr>
          <q-tr  v-if="AllDetail && AllDetail.length == 0">
            <q-td colspan="100%" class="text-center">
              <div v-show="!Boolean(rsForm.outgoing_good_verifications.length)" class="q-pa-sm">{{$tc('messages.no_details')}}</div>
            </q-td>
          </q-tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions align="right" class="items-end self-end">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn>
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" :loading="FORM.loading" />
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
        customers: {api:'/api/v1/incomes/customers?mode=all'},
        units: {api:'/api/v1/references/units?mode=all'},
        items: {autoload:false, api:'/api/v1/common/items?mode=all'},
        pre_deliveries: {autoload:false, api:'/api/v1/incomes/pre-deliveries?mode=all'},
      },
      FORM:{
        resource:{
          pdo_api: '/api/v1/incomes/pre-deliveries',
          pdo_uri: '/admin/deliveries/pre-deliveries',
          api: '/api/v1/warehouses/outgoing-good-verifications',
          uri: '/admin/deliveries/outgoing-verifications',
        }
      },
      rsForm: {},
      MapItems: {},
      setDefault:()=>{
        return {
          customer_id: null,
          pre_delivery_id: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          outgoing_good_verifications:[]
        }
      }
    }
  },
  created() {
    // Component Page Created!
    this.init()
  },
  computed: {
    IssetIncomeItems() {
        let items = this.rsForm.outgoing_good_verifications
        for (const i in items) {
          if (items.hasOwnProperty(i) && items[i].item_id) {
            return true
          }
        }

        return false
    },
    IssetCustomerID() {
      return (this.rsForm.customer_id ? true : false)
    },
    PreDeliveryOptions() {
      return (this.SHEET.pre_deliveries.data.map(item => ({label: item.number, value: item.id, stamp:item.transaction === 'RETURN' ? 'RET' : undefined})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: [item.code, item.name].join(' - '), value: item.id})) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({label: item.code, value: item.id})) || [])
    },
    ItemOptions() {
      let ITEM = this.SHEET.items.data.filter((item) => item.customer_id === this.rsForm.customer_id)
      return (ITEM.map(item => ({label: `${item.code} - ${item.part_name}`, value: item.id})) || [])
    },
    ItemUnitOptions() {
      if (!this.rsForm.outgoing_good_verifications) return []

      return this.rsForm.outgoing_good_verifications.map((detail) => {
        if(!detail.item) return []

        return (this.UnitOptions || []).filter((unit)=> {

          if(detail.item.unit_id === unit.value) return true
          if(detail.item.item_units) {
            if (detail.item.item_units.some((fill)=> fill.unit_id == unit.value)) return true
          }

          return false
        })

      })
    },
    AllDetail() {
      if(! this.rsForm.customer_id || this.SHEET.items.data.length == 0) return []

      let data = []
      data.slice()
      const maxi = (sto, pdo) => {
        if(Number(sto) >= Number(pdo)) return Number(pdo)
        return Number(sto)
      }

      this.SHEET.items.data.map((detail, index) => {

        const available = Number(detail.totals['FG']) - Number(detail.totals['VDO'])

        if (detail.customer_id !== this.rsForm.customer_id) return
        if (Number(detail.totals['PDO']) <= 0) return

        data.push({
          item_id: detail.id,
          unit_id: detail.unit_id,
          unit_rate: 1,
          quantity: null,
          maximum: maxi(available, detail.totals['PDO']),
          PDO: Number(detail.totals['PDO']),
          AVA: available,
          item: detail,
        })
      })

      this.rsForm.outgoing_good_verifications = data
      return data
    },
    STOCKS() {
      if (!this.rsForm.outgoing_good_verifications.length) return []

      let Stocks = Object.assign({}) // JSON.parse(JSON.stringify(this.MapItems))
      for (const i in this.MapItems) {
        if (this.MapItems.hasOwnProperty(i)) {
          Stocks[i] = Number(this.MapItems[i]['FG']) - Number(this.MapItems[i]['VDO'])

        }
      }

      return this.rsForm.outgoing_good_verifications.map(detail => {
        const available = Number(Stocks[detail.item_id])
        Stocks[detail.item_id] -= detail.quantity * detail.unit_rate
        return available
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
    maximality (maximal, available) {
      if (maximal > available) return available
      return maximal
    },
    setPreDelivery(val) {
      this.rsForm.outgoing_good_verifications = []
      if(val) {
        this.$axios.get(`${this.FORM.resource.pdo_api}/${val}`)
        .then((response) => {

          if(response.data && response.data.pre_delivery_items) {
            this.MapItems = Object.assign({})
            response.data.pre_delivery_items.map((detail, index) => {

              this.MapItems[detail.item.id] = detail.item.totals
              this.rsForm.outgoing_good_verifications.push({
                item_id: detail.item_id,
                unit_id: detail.unit_id,
                unit_rate: detail.unit_rate,
                quantity: null,
                maximum: Number(detail.unit_amount) - Number(detail.amount_verification),
                item: detail.item,
                unit: detail.unit,
                pre_delivery_item_id: detail.id
              })
            })

          }
        })
        .catch((error) => {
          console.warn(error.response || error);
        })

      }
    },
    setCustomerReference(val) {
      this.rsForm.pre_delivery_id = null
      this.rsForm.outgoing_good_verifications = []

      if(this.rsForm.customer_id) {
        this.SHEET.load('pre_deliveries', `customer_id=${val}&available_outgoing_verification=true`)
        this.rsForm.outgoing_good_verifications = this.AllDetail
      }
    },
    setUnitReference(index, val) {
      if(!val) return;
      else if (this.rsForm.outgoing_good_verifications[index].item.unit_id === val) {
        this.rsForm.outgoing_good_verifications[index].unit_rate = 1
      }
      else {
        if(this.rsForm.outgoing_good_verifications[index].item.item_units) {
          this.rsForm.outgoing_good_verifications[index].item.item_units.map((itemUnit)=> {
            if (itemUnit.unit_id == val) this.rsForm.outgoing_good_verifications[index].unit_rate = itemUnit.rate
          })
        }
      }
    },
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))

      if(data.customer_id) this.SHEET.load('items', 'customer_id='+ data.customer_id)

      if(data.hasOwnProperty('has_relationship') && Object.keys(data['has_relationship']).length > 0) {
        this.FORM.response.relationship({
          title: 'Verify has relations!',
          messages: data['has_relationship'],
          then: () => this.$router.push(`${this.FORM.resource.uri}/${data.id}`)
        })
      }
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

        if (0 === this.rsForm.outgoing_good_verifications.reduce((total, x) => total + Number(x.quantity || 0),0)) {

          this.$app.notify.error('Submit Invalid', 'Total must be grather than 0!')
          return;
        }
        this.FORM.loading = true
        let {method, mode, apiUrl} = this.FORM.meta();

        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = 'The Items parts has been created!'
          this.FORM.response.success({message:message})
          this.FORM.toIndex()
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
