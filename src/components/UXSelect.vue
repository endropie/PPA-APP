<template>
  <q-select
    ref="QSelect"
    class="ux-selet-filter"
    v-model="value"
    v-bind="$attrs"
    v-on="$listeners"
    @filter="filterFunc"
    @input="inputFunction"
    :options="opt"
    :use-input="useInput"
    :fill-input="fillInput"
    :emit-value="emitValue"
    :map-options="mapOptions"
    :hide-selected="hideSelected"
    :input-debounce="inputDebounce"
    autocomplete="off">

    <!--  -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <slot name="option-prepend" :option="scope.opt">
          <q-item-section side v-if="scope.opt.icon">
            <q-item-section avatar v-if="scope.opt.icon">
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
          </q-item-section>
        </slot>
        <q-item-section>
          <slot name="option-item" :option="scope.opt">
          <!-- => {{scope}} -->
            <q-item-label v-html="getOptionLabel(scope.opt)" />
            <q-item-label caption>{{ getOptionSublabel(scope.opt) }}</q-item-label>
          </slot>
        </q-item-section>
        <slot name="option-append" :option="scope.opt">
          <q-item-section side v-if="scope.opt.stamp || $attrs['option-stamp']">
            <q-badge :label="scope.opt.stamp || $attrs['option-stamp']" />
          </q-item-section>
          <q-item-section side v-if="scope.opt.disable">
            <q-icon name="block" color="red"/>
          </q-item-section>
        </slot>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          <span v-if="Boolean(isFilterSkip)" v-html="$tc('messages.input_min_character', 1, {v:filterSkip})"/>
          <span v-else v-html="$tc('messages.no_results')" />
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope">
      <slot name="selected-item" :scope="scope">
        {{getOptionLabel(scope.opt)}}
      </slot>
    </template>

    <template v-slot:before><slot name="before" /></template>
    <template v-slot:prepend><slot name="prepend" /></template>
    <template v-slot:append><slot name="append" /></template>
    <template v-slot:after><slot name="after" /></template>

    <template v-slot:hint><slot name="hint" /></template>
    <template v-slot:counter><slot name="counter" /></template>

    <template v-slot:default>
      <slot></slot>
    </template>

  </q-select>

</template>
<script>
export default {
  name: 'ux-select-filter',
  inheritAttrs: false,
  props: {
    source: {type: String, default:null},
    sourceKeys: {type: Array, default: () => []},
    filterSkip: {type: Number, default:0},
    filterSelf: {type: Boolean, default: true },
    useInput: {type: Boolean, default: true },
    fillInput: {type: Boolean, default: true },
    hideSelected: {type: Boolean, default: true },
    emitValue: {type: Boolean, default: true },
    mapOptions: {type: Boolean, default: true },
    inputDebounce: {type: Number, default: 600 }
  },
  data () {
    return {
      value: this.$attrs.value,
      options: this.$attrs.options || [],
      defaultOptions: [],
      isFilterSkip: false,
      isFiltering: false
    }
  },
  created() {
    this.$nextTick(() => {
      // this.init()
    })
  },
  watch:{
    '$attrs.value': 'setValue',
    '$attrs.options': 'setOptions',
  },
  methods: {
    init() {
      if (this.source && this.value) {
        const separator = String(this.source).indexOf('?') < 0 ? '?' : '&'
        const search = `${this.$attrs['option-value'] || 'label'}=${this.value}`
        const apiUrl = this.source + separator + search
        console.info(`[PLAY] Source GET: ${apiUrl}`);
        return this.$axios.get(apiUrl)
          .then(response => {
            this.defaultOptions = response.data
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    setValue(v) {
      this.value = v
    },
    setOptions(v) {
      this.options = v
    },
    getOptionDisable(option) {
      if (!Boolean(this.$attrs['option-disable'])) return option.disable

      if (typeof this.$attrs['option-disable'] === 'function') {
        return this.$attrs['option-disable'](option)
      }
      return option[this.$attrs['option-disable']]
    },
    getOptionLabel(option) {
      if (typeof option === 'string') {
        return option
      }
      else if (typeof this.$attrs['option-label'] === 'function') {
        return this.$attrs['option-label'](option)
      }

      const label = this.$attrs['option-label'] || 'label'
      return option[label]
    },
    getOptionSublabel(option) {
      if (!Boolean(this.$attrs['option-sublabel'])) return option.sublabel

      if (typeof this.$attrs['option-sublabel'] === 'function') {
        return this.$attrs['option-sublabel'](option)
      }
      return option[this.$attrs['option-sublabel']]
    },
    // use this default filter function
    filterFn (val, update, abort) {
      if (!this.filterSelf) {
        this.$emit('filter', val, update, abort)
        return
      }

      // if (abort) return update()
      if (this.filterSkip ) {
        if (String(val).length < this.filterSkip) {
          this.isFilterSkip = true
          return update()
        }
        this.isFilterSkip = false
      }

      if (this.source) {
        const separator = String(this.source).indexOf('?') < 0 ? '?' : '&'
        const fields = this.sourceKeys || []
        const search = fields
          ? `search=${val}&search-keys=${fields.join(',')}`
          : `search=${val}`
        const apiUrl = this.source + separator + search
        console.info(`[PLAY] Source GET: ${apiUrl}`, fields);
        return this.$axios.get(apiUrl)
          .then(response => {
            this.options = response.data
          })
          .catch(error => {
            console.error(error || error.response)
          })
          .finally(() => {
            return update()
          })
      }

      update(() => {
        const needle = val.toLowerCase()
        let attrOptions = this.$attrs.options || []
        this.options = attrOptions.filter(v => {

          if(!v.hasOwnProperty('sublabel')) v.sublabel = ''
          return String(v.label).toLowerCase().includes(needle) || String(v.sublabel).toLowerCase().includes(needle)
        })
      })
    },
    filterFunc (v, u, a) {
      this.filterSelf ? this.filterFn(v, u) : this.$emit('filter', v, u, a)
    },
    inputFunction(v) {
      this.$nextTick(() => {
        let innerValue = v
        if (this.QSelect) {
          if (this.QSelect.multiple) innerValue = this.QSelect.innerValue
          else {
            innerValue = this.QSelect.innerValue[0] || null
          }
        }

        this.$emit('selected', this.value, innerValue)
      })
    }
  },
  computed: {
    QSelect() {
      return this.$refs.QSelect || null
    },
    opt () {
      if (this.source && !Boolean(this.options.length)) return this.defaultOptions
      if (!this.filterSelf) return this.$attrs.options
      return this.options
    }
  }
}
</script>

<style lang="stylus">
.q-field__before:empty,
.q-field__prepend:empty
  display none

.q-field__bottom
  // display none
  min-height: 0px;
  padding-top: 0;

  .q-field__messages:not(:empty),
  .q-field__counter:not(:empty)
    min-height: 12px
    margin-top: 4px


</style>
