<template>
<q-page padding class="form-page row justify-center">
  <q-card inline class="main-box self-start" v-if="FORM.show" :dark="LAYOUT.isDark" :class="{ 'bg-grey-9': LAYOUT.isDark}">
    <q-card-section>
      <form-header :title="FORM.title()" :subtitle="FORM.subtitle()" >
        <template slot="menu-item">
          <list-item :label="$tc('form.remove')" icon="delete" clickable @click="FORM.delete" v-close-popup v-if="ROUTE.params.id"/>
        </template>
      </form-header>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark"/>
    <q-card-section class="row q-col-gutter-sm">

      <!-- ROW::1st -->
      <div class="col-12 col-sm-6" >
        <div class="column">
          <ux-select-filter
            name="customer_id"
            :label="$tc('general.customer')"
            :data-vv-as="$tc('general.customer')"
            v-model="rsForm.customer_id" options-cover clearable
            :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
            :options="CustomerOptions"
            v-validate="'required'"
            :error="errors.has('customer_id')"
            :error-message="errors.first('customer_id')"/>

          <ux-select-filter
            name="brand_id"
            :label="$tc('general.brand')"
            v-model="rsForm.brand_id"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :options="BrandOptions"
            input-debounce="0"
            :error="errors.has('brand_id')"
            :error-message="errors.first('brand_id')" />

          <ux-select-filter
            name="specification_id"
            v-model="rsForm.specification_id"
            :label="$tc('items.specification')"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :options="SpecificationOptions"
            :error="errors.has('specification_id')"
            :error-message="errors.first('specification_id')" />
        </div>
      </div>
      <div class="col-12 col-sm-6" >
        <div class="row q-col-gutter-x-sm">
          <q-input class="col-12"
            name="code"
            :placeholder="FORM.ifCreate('[Auto Generate]','')"
            :label="$tc('label.code_intern')"
            :dark="LAYOUT.isDark"
            v-model="rsForm.code"
            v-validate="FORM.ifCreate('','required')"
            :error="errors.has('code')"
            :error-message="errors.first('code')" >
            <q-toggle slot="after" class="bordered rounded-borders q-pa-xs no-margin"
              :label="rsForm.enable ? 'Enable':'Disable'" left-label
              v-model="rsForm.enable"
              :color="rsForm.enable ? 'primary':'red'"
              :true-value="1"
              :false-value="0" />
          </q-input>
          <ux-select-filter
            name="category_item_id"
            v-model="rsForm.category_item_id"
            label="Category of Items"
            v-validate="'required'"
            class="col-12"
            icon="table_chart"
            :dark="LAYOUT.isDark"
            :options="CategoryOptions"
            :error="errors.has('category_item_id')"
            :error-message="errors.first('category_item_id')" />
          <ux-select-filter
            name="type_item_id"
            label="Type of Items"
            class="col-6"
            icon="dehaze"
            v-model="rsForm.type_item_id"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :options="TypeOptions"
            :error="errors.has('type_item_id')"
            :error-message="errors.first('type_item_id')" />

          <ux-select-filter
            name="size_id"
            v-model="rsForm.size_id"
            label="Size"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :options="SizeOptions"
            class="col-6"
            icon="format_size"
            :error="errors.has('size_id')"
            :error-message="errors.first('size_id')" />
        </div>
      </div>
    </q-card-section>
    <q-separator spaced :dark="LAYOUT.isDark" class="inset-md"/>
    <!-- ROW::2nd -->
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6">
        <div class="column q-col-gutter-sm">
          <q-input
            name="part_number"
            label="Part Number"
            class="col-12"
            icon="layers"
            v-model="rsForm.part_number"
            v-validate="'required'"
            :error="errors.has('part_number')"
            :error-message="errors.first('part_number')"
            :dark="LAYOUT.isDark"
          />

          <q-input
              name="part_name"
              label="Part name"
              v-model="rsForm.part_name"
              v-validate="'required'"
              :dark="LAYOUT.isDark"
              class="col-12"
              icon="label"
              :error="errors.has('part_name')"
              :error-message="errors.first('part_name')"
          />
          <q-input
            name="part_alias"
            label="Part alias Finished"
            v-model="rsForm.part_alias"
            v-validate="''"
            :dark="LAYOUT.isDark"
              class="col-12" icon="beenhere" :error="errors.has('part_alias')" :error-message="errors.first('part_alias')"
          />
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="row q-col-gutter-sm">
          <q-input
            name="packing_duration"
            label="Packing duration"
            type="number"
            class="col-12"
            icon="timer"
            v-model="rsForm.packing_duration"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('packing_duration')"
            :error-message="errors.first('packing_duration')"
          />

          <q-input
            name="sa_dm"
            label="SA area"
            v-model="rsForm.sa_dm"
            type="number"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            class="col-12"
            :error="errors.has('sa_dm')"
            :error-message="errors.first('sa_dm')"
          />

          <q-input
            name="weight"
            label="Weight"
            v-model="rsForm.weight"
            type="number"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            class="col-12"
            :error="errors.has('weight')"
            :error-message="errors.first('weight')"
          />

        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="row q-col-gutter-sm ">
          <ux-select-filter
            name="unit_id"
            v-model="rsForm.unit_id"
            :label="$tc('label.unit')" stack-label
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :options="UnitOptions"
            class="col-12" icon="web_asset"
            :error="errors.has('unit_id')"
            :error-message="errors.first('unit_id')" />

          <q-select class="col-12"
            name="load_type"
            :label="$tc('label.mode', 1, {v:'Load'})" stack-label
            v-model="rsForm.load_type"
            :options="['HANGER', 'BAREL']"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('load_type')" />

          <q-input class="col-12"
            name="load_capacity"
            :label="$tc('label.capacity', 1, {v:'Load'})" stack-label
            type="number"
            v-model="rsForm.load_capacity"
            v-validate="'required'"
            :dark="LAYOUT.isDark"
            :error="errors.has('load_capacity')" />

        </div>
      </div>
      <ux-numeric class="col-12 col-sm-4"
        name="price"
        label="Normal Price"
        type="number"
        v-model="rsForm.price"
        v-validate="'required'"
        standout filled dark
        color="white"
        bg-color="primary"
        align="center"
        :error="errors.has('price')"
        :error-message="errors.first('price')"
      />
      <ux-numeric class="col-12 col-sm-4"
        name="price_area" type="number" readonly
        label="Price in DM"
        :value="price_area"
        standout filled dark
        color="white"
        bg-color="primary"
        align="center"
        :error="errors.has('price_area')"
        :error-message="errors.first('price_area')"
      />
      <ux-numeric class="col-12 col-sm-4"
        name="price_packaged"
        label="Price in BRL"
        type="number" readonly
        :value="price_packaged"
        standout filled dark
        color="white"
        bg-color="primary"
        align="center"
        :error="errors.has('price_packaged')"
        :error-message="errors.first('price_packaged')"
      />
    </q-card-section>
    <q-separator spaced :dark="LAYOUT.isDark" class="inset-md"/>
    <!-- ROW::4th Pre Production -->
    <q-card-section class="row q-col-gutter-md">
      <!-- ITEM - PRELINE -->
      <div class="col-12 col-md-6">
        <q-list class="q-pa-xs " bordered dense>
          <q-item-label header>Pre Line Production</q-item-label>
          <q-item v-for="(item, index) in rsForm.item_prelines" :key="index">
            <q-item-section>
              <ux-select-filter
                :ref="`pre-line`"
                :name="`pre-line-${index}`"
                v-model="rsForm.item_prelines[index].line_id"
                :dark="LAYOUT.isDark"
                inverted dense
                color="primary"
                :prefix="`${index+1}. `"
                :options="LineOptions"
                :inject-filter="(line) => { if(index === 0 && !line.ismain) return false}"
                v-validate="`required` + (index  === 0 ? `|included: ${LineOptions.filter(x=> x.ismain === 1).map(x => x.id)}` : '')"
                :error="errors.has(`pre-line-${index}`)"
                :error-message="errors.first(`pre-line-${index}`)"
              >
              <template v-slot:option-append="{option}">
                <q-item-section side>
                 <q-badge color="teal" label="main" v-if="option.ismain"/>
                </q-item-section>
              </template>
              </ux-select-filter>
            </q-item-section>
            <q-item-section side>
              <q-btn :class="{'invisible':!index}" dense flat round icon="clear" color="red-5" @click="removeProduction(index)"/>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn dense outline color="primary" :label="$tc('form.add',2)" @click="addNewProduction()" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- ITEM - CONVERTION -->
      <div class="col-12 col-md-6">
        <q-list class="q-pa-xs" bordered dense>
          <q-item-label header>Unit Convertion</q-item-label>
          <q-item v-for="(item, index) in rsForm.item_units" :key="index">
            <q-item-section>
              <q-input
                :name="`unit-${index}`"
                type="number"
                v-model="rsForm.item_units[index].rate"
                v-validate="'required'"
                dense
                :dark="LAYOUT.isDark"
                :error="errors.has(`unit-${index}`)"
                :error-message="errors.first(`unit-${index}`)">
                <template slot="prepend">
                  <q-select class="no-padding text-white"
                    :name="`unit-${index}`"
                    :placeholder="$tc('form.select')"
                    prefix="1 -"
                    v-model="rsForm.item_units[index].unit_id"
                    v-validate="'required'"
                    dense borderless style="width:110px"
                    map-options emit-value
                    :options="UnitOptions.filter(x => x.value !== rsForm.unit_id)"
                    :dark="LAYOUT.isDark"
                    :error="errors.has(`unit-${index}`)"
                    :error-message="errors.first(`unit-${index}`)"
                />
                <span class="text-caption">{{$tc('label.rate')}}</span>
                <q-icon size="24px" name="arrow_right_alt"></q-icon>
                </template>
              </q-input>
            </q-item-section>
            <q-item-section side>
              <q-btn dense round flat icon="clear" color="red-4" @click="removeUnit(index)"/>
            </q-item-section>
          </q-item>
          <q-item  class="">
            <q-item-section>
              <q-btn dense outline color="primary" :label="$tc('form.add', 2)" @click="addNewUnit()" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-input class="col-12" type="textarea" rows="3"
        :label="$tc('label.description')" stack-label
        v-model="rsForm.description"
        filled
        :dark="LAYOUT.isDark"
      />
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" spaced />
    <q-card-actions class="group float-right">
      <q-btn :label="$tc('form.cancel')" icon="cancel" color="dark" @click="FORM.toBack()" />
      <q-btn :label="$tc('form.reset')" icon="refresh" color="light" @click="setForm(FORM.data)" />
      <q-btn :label="$tc('form.save')" icon="save" color="positive" @click="onSave()" :loading="FORM.loading">
        <q-spinner-facebook slot="loading" />
      </q-btn>
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
        colors: {data:[], api:'/api/v1/references/colors?mode=all'},
        type_items: {data:[], api:'/api/v1/references/type-items?mode=all'},
        category_items: {data:[], api:'/api/v1/references/category-items?mode=all'},
        sizes: {data:[], api:'/api/v1/references/sizes?mode=all'},
        units: {data:[], api:'/api/v1/references/units?mode=all'},
        brands: {data:[], api:'/api/v1/references/brands?mode=all'},
        specifications: {data:[], api:'/api/v1/references/specifications?mode=all'},
        customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
        lines: {data:[], api:'/api/v1/references/lines?mode=all'},

      },
      FORM: {
        resource:{
          uri: '/admin/common/items',
          api: '/api/v1/common/items',
        },
      },
      rsForm:{},
      setDefault:()=>{
        return {
          code:null,
          customer_id:null,
          brand_id:null,
          specification_id:null,

          part_name:null,
          part_alias:null,
          part_number:null,

          load_type: null,
          load_capacity: null,
          packing_duration: null,
          sa_dm: null,
          weight: null,

          category_item_id: null,
          type_item_id: null,
          size_id: null,
          unit_id: null,

          price: null,
          item_prelines:[ {id:null, line_id: null, note: null} ],
          item_units:[ {id:null, unit_id:null, rate:null} ],
          item_contacts:[ {id:null} ],
          enable: true,
          description:null,
        }
      }
    }
  },
  created() {
    // Component Page Mounted!
    this.init()

  },
  computed: {
    LineOptions() {
      return (this.SHEET.lines.data.map(item => ({...item, label: item.name, value: item.id})) || [])
    },
    CategoryOptions() {
      return (this.SHEET.category_items.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    TypeOptions() {
      return (this.SHEET.type_items.data.map(item => ({label: item.name, value: item.id})) || [])
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({
        label: [item.code, item.name].join(' - '),
        value: item.id
      })) || [])
    },
    BrandOptions() {
      return (this.SHEET.brands.data.map(item => ({
        label: [item.code, item.name].join(' - '),
        value: item.id
      })) || [])
    },
    SpecificationOptions() {
      return (this.SHEET.specifications.data.map(item => ({
        label: [item.code, item.name].join(' - '),
        value: item.id
      })) || [])
    },
    SizeOptions() {
      return (this.SHEET.sizes.data.map(item => ({
        label: item.name,
        value: item.id
      })) || [])
    },
    UnitOptions() {
      return (this.SHEET.units.data.map(item => ({
        label: String(item.code).toUpperCase(),
        value: item.id
      })) || [])
    },
    price_area() {
      if(!Number(this.rsForm.price) || !Number(this.rsForm.sa_dm)) return 0
      return Number(this.rsForm.price) / Number(this.rsForm.sa_dm)
    },
    price_packaged() {
      return Number(this.rsForm.load_capacity|| 0) * Number(this.rsForm.price || 0)
    },
    MAPINGKEY(){
      let variables = {
        'brands' : {},
        'customers': {},
        'specifications': {}
      }
      this.SHEET['brands'].data.map(item => { variables['brands'][item.id] = item })
      this.SHEET['customers'].data.map(item => { variables['customers'][item.id] = item })
      this.SHEET['specifications'].data.map(item => { variables['specifications'][item.id] = item })

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
      this.rsForm = JSON.parse(JSON.stringify(data))
    },

    setCode() {
      let brand_id = this.rsForm.brand_id,
        customer_id = this.rsForm.customer_id,
        specification_id = this.rsForm.specification_id;

      if (!brand_id || !customer_id || !specification_id) {
        this.rsForm['code'] = this.rsForm['id'] || null
        return
      }

      let BRAND = this.MAPINGKEY['brands'][this.rsForm.brand_id] || {}
      let CUST = this.MAPINGKEY['customers'][this.rsForm.customer_id] || {}
      let SPEC = this.MAPINGKEY['specifications'][this.rsForm.specification_id] || {}

      // Set unique code
      this.rsForm['code'] = [CUST.code, BRAND.code, SPEC.code].join('-')
    },

    addNewProduction (autofocus = true) {
      var newEntri =this.setDefault().item_prelines[0];

      this.rsForm.item_prelines.push(newEntri)
    },

    removeProduction (index) {
        this.rsForm.item_prelines.splice(index, 1)
        if(this.rsForm.item_prelines.length < 1) this.addNewProduction()
    },

    addNewUnit (autofocus = true) {
      var newEntri =this.setDefault().item_units[0];

      this.rsForm.item_units.push(newEntri)
    },

    removeUnit (index) {
        this.rsForm.item_units.splice(index, 1)
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
          let message = response.data.code + ' - #' + response.data.id
          this.FORM.response.success({message:message})
          this.FORM.toIndex()
        })
        .catch((error) => {
          console.warn(error)
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
<!-- style lang="stylus">
@import '~variables'
.frame-box
  .frame-main
    padding 5px 15px 15px
    box-shadow $shadow-up-1
    border-top solid 1px #848484
    border-radius-g 2px
</style -->
