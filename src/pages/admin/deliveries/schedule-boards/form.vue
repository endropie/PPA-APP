<template>
<q-page padding class="form-page row justify-center">
  <q-card inline class="main-box self-start" :dark="LAYOUT.isDark" v-if="FORM.show">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
      </form-header>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <ux-select class="col-12 col-md-4 col-sm-6"
          name="vehicle_id"
          :label="$tc('general.vehicle')"
          v-model="rsForm.vehicle_id"
          v-validate="'required'"
          :options="VehicleOptions"
          :dark="LAYOUT.isDark"
          :error="errors.has('vehicle_id')"
          :error-message="errors.first('vehicle_id')"
        />

        <ux-select class="col-12 col-md-4 col-sm-6"
          name="operator_id"
          :label="$tc('general.operator')"
          v-model="rsForm.operator_id"
          v-validate="'required'"
          :options="OperatorOptions"
          :dark="LAYOUT.isDark"
          :error="errors.has('operator_id')"
          :error-message="errors.first('operator_id')"
        />

        <ux-date name="date" type="date" class="col-12 col-md-4 col-sm-12"
          :label="$tc('label.date')" stack-label
          v-model="rsForm.date"
          v-validate="`required|date_format:yyyy-MM-dd${ROUTE.meta.mode === 'create' ? '|after:'+$app.moment().add(-1,'days').format('YYYY-MM-DD') : '' }`"
          :date-options="(date) => date >= $app.moment().format('YYYY/MM/DD')"
          :dark="LAYOUT.isDark"
          :error="errors.has('date')"
          :error-message="errors.first('date')" >
          <div slot="after">
            <q-input  class="no-padding" input-style="width:80px"
              name="time" type="time"
              :label="$tc('label.time')" stack-label
              v-model="rsForm.time"
              v-validate="`required`"
              :dark="LAYOUT.isDark"
              :error="errors.has('time')"
              :error-message="errors.first('time')" />
          </div>
        </ux-date>

        <ux-select class="col-12 col-sm-6 self-start"
          name="customers"
          :label="$tc('general.customer')"
          v-model="rsForm.customers"
          multiple use-chips square
          option-value="id"  options-cover
          :option-label="(cust) => cust === null ? '-None-' : `[${cust.code}] ${cust.name}`"
          :options="CustomerOptions"
          :dark="LAYOUT.isDark"
          v-validate="'required'"
          :error="errors.has('customers')"
        />

        <ux-recurring class="col-12 col-sm-6 self-start"
          v-model="rsForm.recurring"
          :dark="LAYOUT.isDark"
        />

        <code>REC => {{rsForm.recurring}}</code>

        <q-input class="col-12"
          v-model="rsForm.description"
          type="textarea"
          rows="3"
          :label="$tc('label.description')"  stack-label
          :dark="LAYOUT.isDark"
        />
      </div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-actions class="group">
      <!-- <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()"></q-btn> -->
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="FORM.reset()"></q-btn>
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()"></q-btn>
    </q-card-actions>
  </q-card>
  <q-inner-loading :showing="FORM.loading" :dark="LAYOUT.isDark">
    <q-spinner-dots size="70px" color="primary" />
  </q-inner-loading>
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
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all&is_scheduled=1'},
        operators: {data:[], api:'/api/v1/common/employees?mode=all'}
      },
      FORM: {
        resource: {
          uri: '/admin/deliveries/schedule-boards',
          api: '/api/v1/transports/schedule-boards',
        },
      },
      rsForm: {},
      setDefault:()=>{
        return {
          number:null,
          vehicle_id: null,
          operator_id: null,
          date: this.$app.moment().format('YYYY-MM-DD'),
          time: null,
          description:null,
          customers: [],
        }
      }
    }
  },
  created() {
    // Component Page Mounted!
    this.init()

  },
  computed: {
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({...item, sublabel: item.address_raw})) || [])
    },
    VehicleOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.number, value: item.id})) || [])
    },
    OperatorOptions() {
      return (this.SHEET.operators.data.map(item => ({label: item.name, sublabel:item.code, value: item.id})) || [])
    },
  },
  watch: {
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
    },
    onReset(){
      this.$nextTick(() => {
        this.$validator.reset();
        this.setForm(this.FORM.data)
      });
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
          const label = response.data.number + ' - #' + response.data.id
          this.FORM.response.success({message:label})
          this.FORM.toIndex()
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
