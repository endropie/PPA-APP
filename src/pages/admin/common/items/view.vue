<template>
  <q-page padding class="row justify-center">
    <q-card :dark="LAYOUT.isDark" class="col" v-if="VIEW.show">
      <!-- <q-img src="https://cdn.quasar.dev/img/parallax2.jpg"
        style="max-height:150px">
        <div class="absolute-bottom">
          <div class="text-h6">{{ rsView.part_name }}</div>
          <div class="text-subtitle2">{{ rsView.part_number }}</div>
        </div>
      </q-img> -->
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ rsView.part_name }}</div>
        <div class="text-subtitle2">{{ rsView.part_number }}</div>
      </q-card-section>
      <q-tabs class="bg-light text-white shadow-2"
        v-model="tab"
        align="left"
        inline-label
        active-color="primary">
        <q-tab name="info" icon="mail" label="Info" />
        <q-tab name="detail" icon="alarm" label="Detail" />
        <q-tab name="timeline" icon="movie" label="Timeline" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="">
        <q-tab-panel name="info">
          <div class="text-h6">Info</div>
           {{rsView}}
        </q-tab-panel>

        <q-tab-panel name="detail">
          <div class="row">
            <q-list :dark="LAYOUT.isDark" class="col-12 col-sm-6 col-md-3">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="local_bar" color="primary"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('general.customer')}}</q-item-label>
                  <q-item-label>{{rsView.customer.name}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('general.brand')}}</q-item-label>
                  <q-item-label>{{rsView.brand ? rsView.brand.name : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('general.specification')}}</q-item-label>
                  <q-item-label>{{rsView.specification ? rsView.specification.name : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-list :dark="LAYOUT.isDark" class="col-12 col-sm-6 col-md-3">
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('items.part_name')}}</q-item-label>
                  <q-item-label>{{rsView.part_name || '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('items.part_number')}}</q-item-label>
                  <q-item-label>{{rsView.part_number || '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('items.part_alias')}}</q-item-label>
                  <q-item-label>{{rsView.part_alias || '-'}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-list :dark="LAYOUT.isDark" class="col-12 col-sm-6 col-md-3">
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('general.item_category')}}</q-item-label>
                  <q-item-label>{{rsView.category_item? rsView.category_item.name : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('general.item_type')}}</q-item-label>
                  <q-item-label>{{rsView.type_item ? rsView.type_item.name : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('general.size')}}</q-item-label>
                  <q-item-label>{{rsView.size ? rsView.size.name : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-list :dark="LAYOUT.isDark" class="col-12 col-sm-6 col-md-3">
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('items.packing_duration')}}</q-item-label>
                  <q-item-label>{{rsView.packing_duration ? $app.number_format(rsView.packing_duration) : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('items.sa_dm')}}</q-item-label>
                  <q-item-label>{{rsView.sa_dm ? $app.number_format(rsView.sa_dm) : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="local_bar" color="primary"/></q-item-section>
                <q-item-section>
                  <q-item-label caption>{{$tc('items.weight')}}</q-item-label>
                  <q-item-label>{{rsView.weight ? $app.number_format(rsView.weight) : '-'}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-tab-panel>

        <q-tab-panel name="timeline">
          <stock-timeline :item="rsView" />
        </q-tab-panel>
      </q-tab-panels>
      <q-card-section>
        <!-- code -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import MixView from '@/mixins/mix-view.vue'
import StockTimeline from './stock-timeline.vue'

export default {
  mixins: [MixView],
  components: {
    StockTimeline
  },
  data () {
    return {
      tab: 'info',
      VIEW: {
        data: {},
        resource:{
          api: '/api/v1/common/items',
          uri: '/admin/common/items',
        }
      },
      rsView: {},
    }
  },
  created() {
    this.init()
  },
  computed: {
    IS_VOID() {
      if (this.IS_EDITABLE) return false
      if (this.rsView.deleted_at) return false
      if (['VOID'].find(x => x === this.rsView.status)) return false
      return true
    },
    IS_EDITABLE() {
      if (this.rsView.revise_id) return false
      if (this.rsView.deleted_at) return false
      if (Object.keys(this.rsView.has_relationship || {}).length > 0) return false
      return true
    },
  },
  methods: {
    init() {
      this.VIEW.load((data) => {
        this.setView(data || {})
      })
    },
    setView(data) {
      this.rsView =  data
    }
  }
}
</script>
