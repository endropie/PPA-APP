<template>
<div>
  <q-card dense class="main-box" :dark="LAYOUT.isDark" style="min-width:200px">
    <q-card-section class="bg-primary text-white" style="opacity: 0.85">
      <q-btn dense flat round
        class="float-right relative-position" style="top:-5px"
        :icon="show ? 'arrow_drop_up' : 'arrow_drop_down'"
        @click="show = !show"/>
      <div class="text-subtitle2 text-uppercase no-wrap">Validasi Incoming Good</div>
    </q-card-section>
    <q-separator :dark="LAYOUT.isDark" />
    <q-card-section v-show="show" class="q-pa-sm">
      <q-table dense class="no-shadow th-uppercase"
        :data="rowData"
        :columns="columns"
        :loading="loading"
        :no-data-label="TEXT_BOTTOM"
        row-key="id">

        <q-tr slot="body" slot-scope="rs" :props="rs"
          class="cursor-pointer"
          @click.native="$router.push(`${resource.uri}/${rs.row.id}`)">
          <q-td >
            {{rs.row.number}}<br/>
            <span class="text-caption text-faded" v-if="rs.row.customer">
              {{ rs.row.customer.name }}
            </span>
          </q-td>
          <q-td >
            {{$app.moment(rs.row.date || undefined).format('D MMMM')}}<br/>
            <span class="text-caption text-faded" v-if="rs.row.user">
              {{ rs.row.user.name }}
            </span>
          </q-td>
        </q-tr>



        <template v-slot:bottom>
          {{TEXT_BOTTOM}}
        </template>

      </q-table>
    </q-card-section>
  </q-card>

</div>
</template>

<script>
import MixPage from '@/mixins/mix-page.vue'
import { isError } from 'util';

export default {
  mixins:[MixPage],
  data () {
    return {
      resource: {
        api: '/api/v1/warehouses/incoming-goods',
        uri: '/admin/warehouses/incoming-goods',
      },
      show: true,
      loading: false,
      columns: [
        {
          name: 'number',
          required: true,
          label: this.$tc('label.number'),
          align: 'left',
          field: row => row.number,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'date', align: 'center', label: this.$tc('label.date'), field: 'date', sortable: true,
          format: val => this.$app.moment(val || undefined).format('D MMMM'),
        },
      ],
      data: [],
      rowData: [],
      isLoadError: false,
    }
  },
  created() {
    // console.info('This component created!')
    this.init()
  },
  computed: {
    TEXT_BOTTOM() {
      if(this.textLoadError) return this.isLoadError

      if(this.rowData.length > 0) return "Terdapat ("+ this.rowData.length +") Data untuk Validasi"

      return "Good Job!. Tidak terdapat Data untuk Validasi"
    }
  },
  methods: {
    init() {
      this.loading = true
      let params = ['mode=all', '--with=customer', 'status=OPEN']
      this.$axios.get(`${this.resource.api}?${params.join('&')}`)
      .then((response) => {
        this.data = JSON.parse(JSON.stringify(response.data))
        let rows = JSON.parse(JSON.stringify(response.data))
        this.rowData =  rows.slice(0)

        this.isLoadError = false
        this.textLoadError = null
      })
      .catch((error) => {
        this.isLoadError = true
        this.textLoadError = error.response ? error.response.statusText : error
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 500);
      })
    }
  }
}
</script>

<style lang="stylus">

</style>
