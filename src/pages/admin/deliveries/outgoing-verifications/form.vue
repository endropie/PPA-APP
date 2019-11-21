<template>
<q-page padding class="form-page row justify-center " >
  <q-card class="main-box self-start" v-if="FORM.show" style="min-width:80%">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-section>
      <q-markup-table class="no-shadow th-uppercase th-text-left">
        <tr>
          <th>{{$tc('general.item')}}</th>
          <td>
            <span v-if="rsForm.item" class="text-body2">
              {{rsForm.item.part_name}}
              <div v-show="rsForm.item.part_number" class="text-small text-faded">
                No. {{rsForm.item.part_number}}
              </div>
            </span>
          </td>
        </tr>
        <tr>
          <th>{{$tc('label.code', 1, {v:$tc('label.part')})}}</th>
          <td>
            <div v-if="rsForm.item">
              {{rsForm.item.code}}
            </div>
          </td>
        </tr>
        <tr>
          <th>{{$tc('label.unit')}}</th>
          <td>
            <q-select style="max-width:120px"
              :name="`unit_id`"
              v-model="rsForm.unit_id"
              outlined dense hide-bottom-space
              :dark="LAYOUT.isDark" color="blue-grey-5"
              :options="ItemUnitOptions"
              map-options emit-value
              v-validate="'required'"
              :error="errors.has(`unit_id`)"
              @input="(val)=>{ setUnitReference(val) }"/>
          </td>
        </tr>
        <tr>
          <th>{{$tc('label.quantity')}}</th>
          <td>
            <q-input style="max-width:150px"
              :name="`quantity`"
              v-model="rsForm.quantity" type="number" :min="0"
              outlined dense hide-bottom-space no-error-icon align="center"
              :dark="LAYOUT.isDark" color="blue-grey-5"
              v-validate="`required|gt_value:0|max_value: ${ITEMSTOCK.MAX / rsForm.unit_rate}`"
              :error="errors.has(`quantity`)"
              :error-message="errors.first(`quantity`)" >

              <span slot="append" class="text-body2" v-show="rsForm.item_id">
                {{`/ ${$app.number_format(ITEMSTOCK.PRE / rsForm.unit_rate)}`}}
              </span>
            </q-input>
          </td>
        </tr>
        <tr>
          <th>{{$tc('label.available')}}</th>
          <td>
            <q-chip square class="text-weight-medium">
              {{$app.number_format(ITEMSTOCK.AVA / rsForm.unit_rate)}}
            </q-chip>
          </td>
        </tr>
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
      hasOnly: true,
      SHEET: {
        units: {api:'/api/v1/references/units?mode=all'},
      },
      FORM:{
        resource:{
          api: '/api/v1/warehouses/outgoing-good-verifications',
          uri: '/admin/deliveries/outgoing-verifications',
        }
      },
      rsForm: {},
      setDefault:()=>{
        return {
          item_id: null,
          unit_id: null,
          unit_rate: 1,
          quantity: null,
        }
      }
    }
  },
  created() {
    // Component Page Created!
    this.init()
  },
  computed: {
    UnitOptions() {
      return (this.SHEET.units.data.map(unit => ({label: unit.code, value: unit.id})) || [])
    },
    ItemOptions() {
      if (!this.rsForm.item) return []

      let Items = [this.rsForm.item]
      return (Items.map(item => ({label: `${item.code} - ${item.part_name}`, value: item.id})) || [])
    },
    ItemUnitOptions() {
      if(!this.rsForm.item) return []

      let data = (this.SHEET.units.data.map(unit => {
        let res = {label: unit.code, value: unit.id}
        if (unit.id === this.rsForm.item.unit_id) {
          res.unit_rate = 1
        }
        else if (find = this.rsForm.item.item_units.find(s => s.unit_id === unit.id)) {
          res.unit_rate = find.rate
        }
        return res
      }) || [])

      return data.filter(unit => {
        if (unit.value === this.rsForm.item.unit_id) return true
        return this.rsForm.item.item_units.some(s => s.unit_id === unit.value)
      })
    },
    ITEMSTOCK() {
      if(!this.rsForm.item) return {}

      const maxi = (sto, verify) => {
        if(Number(sto) >= Number(verify)) return Number(verify)
        return Number(sto)
      }

      const PdoItem = Object.assign({}, this.rsForm.pre_delivery_item)
      const PreItem = Number(PdoItem.unit_amount || 0)
                    - Number(PdoItem.amount_verification)
                    + Number(this.FORM.data.unit_amount)

      let totals = this.rsForm.item.totals
      totals.AVA = Number(totals['FG']) - Number(totals['VDO'])

      if (Number(this.FORM.data.unit_amount) > 0) {
        totals['AVA'] += this.FORM.data.unit_amount
        totals['VDO'] -= this.FORM.data.unit_amount
      }

      return {
          ...totals,
          PRE: PreItem,
          MAX: maxi(totals.AVA, PreItem)
        }
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
    setUnitReference(val) {
      if(!val) return;
      else if (this.rsForm.item.unit_id === val) {
        this.rsForm.unit_rate = 1
      }
      else {
        if(this.rsForm.item.item_units) {
          this.rsForm.item.item_units.map((itemUnit)=> {
            if (itemUnit.unit_id == val) this.rsForm.unit_rate = itemUnit.rate
          })
        }
      }
    },
    setForm(data) {
      this.rsForm =  JSON.parse(JSON.stringify(data))
      // if(data.item_id) this.SHEET.load('items', 'id='+ data.item_id)

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
        this.FORM.loading = true
        let {method, status, apiUrl} = this.FORM.meta();

        this.$axios.set(method, apiUrl, this.rsForm)
        .then((response) => {
          let message = `${this.$tc('general.item')} [${this.rsForm.item.code}] ${this.$tc('form.'+status, 2)}!`
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
