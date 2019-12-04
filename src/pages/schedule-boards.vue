<template>
  <q-layout view="lHh Lpr lFf"  :class="ScreenMode ? 'bg-grey-10 text-white' : 'bg-white text-dark'">
    <q-page-container>
      <q-page padding class="page-index" >
        <q-pull-to-refresh @refresh="TABLE.refresh" inline>
          <q-table ref="table" class="table-index table-striped th-uppercase" color="primary" :dark="ScreenMode"
            :data="TABLE.rowData"
            :columns="TABLE.columns"
            :filter="TABLE.filter"
            :selected.sync="TABLE.selected"
            :pagination.sync="TABLE.pagination"
            @request="TABLE.compute"
            :loading="TABLE.loading"
            :hide-bottom="noBottom">

            <template v-slot:top-right="props">
              <q-btn flat round dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                class="q-ml-md"
              />
              <q-btn dense flat round color="faded" icon="more_horiz">
                <q-menu :content-class="{'q-menu--dark': ScreenMode}">
                  <q-list :dark="ScreenMode" style="min-width: 240px">
                    <q-item clickable @click="isDark = false" v-if="isDark === null">
                      <q-item-section>Screen</q-item-section>
                      <q-item-section side><q-badge label="AUTO" color="blue-grey"/></q-item-section>
                    </q-item>
                    <q-item clickable @click="isDark = true" v-if="isDark === false">
                      <q-item-section>Screen</q-item-section>
                      <q-item-section side><q-badge label="LIGHT" color="blue-grey"/></q-item-section>
                    </q-item>
                    <q-item clickable @click="isDark = null" v-if="isDark === true">
                      <q-item-section>Screen</q-item-section>
                      <q-item-section side><q-badge label="NIGHT" color="blue-grey"/></q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable @click="noBottom = !noBottom">
                      <q-item-section>Bottom Pagination</q-item-section>
                      <q-item-section side><q-badge :label="noBottom ? `HIDE` : 'SHOW'" color="blue-grey"/></q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/">
                      <q-item-section>Exit</q-item-section>
                      <q-item-section avatar><q-avatar icon="exit"/></q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
            <template slot="top-left">
              <div class="column no-wrap">
                <div class="q-table__title">
                  {{$tc(`general.schedule_board`, 2)}}
                </div>
                <div class="schedule-time">
                  {{$app.moment().format('dddd, DD MMMM YYYY hh:mm')}}
                </div>
              </div>
            </template>

            <q-td slot="body-cell-schedule" slot-scope="rs" :props="rs">
              <span v-if="rs.row.scheduled">{{$app.moment(`${rs.row.scheduled.date} ${rs.row.scheduled.time}`).format('dddd, DD MMM YY HH.mm')}}</span>
              <span v-else>-</span>
            </q-td>

            <q-td slot="body-cell-customers" slot-scope="rs" :props="rs">
              <span v-if="rs.row.scheduled.customers && rs.row.scheduled.customers.length > 0" class="row flex">
                <q-chip dense square v-for="(customer, i) in rs.row.scheduled.customers" :key="i">
                  {{customer.name || 'no-name'}}
                </q-chip>
              </span>
              <span v-else>-</span>
            </q-td>

            <q-td slot="body-cell-status" slot-scope="rs" :props="rs" class="no-padding">
              <span v-if="rs.row.scheduled">
                <ux-badge-status :row="rs.row.scheduled" class="shadow-0"
                  :dark="ScreenMode"

                  :colorOptions="{'DEPARTED' : 'green-7', 'ARRIVED': 'blue-grey-9'}"
                  v-if="rs.row.scheduled.status !== 'OPEN'"/>
                <q-chip dense square class="shadow-0"
                  :dark="ScreenMode"
                  :label="getOntimeLabel(rs.row.scheduled)"
                  :color="getOntimeColor(rs.row.scheduled)"
                  v-if="!Boolean(rs.row.scheduled.deleted_at)"/>
              </span>
              <span v-else>-</span>
            </q-td>

            <q-td slot="body-cell-number" slot-scope="rs" :props="rs">
              <span v-if="rs.row.number"> {{ rs.row.number }}</span>
              <span v-else>-</span>
            </q-td>

          </q-table>
        </q-pull-to-refresh>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MixIndex from '@/mixins/mix-index.vue'

export default {
  mixins: [MixIndex],
  data () {
    return {
      reload: null,
      isDark: null,
      noBottom: false,
      TABLE: {
        resource: {
          api: '/api/v1/landing/schedule-boards',
          uri: '/admin/deliveries/schedule-boards',
        },
        columns: [
          { name: 'schedule', label: this.$tc('transports.schedule'), align: 'center', sortable: true},
          { name: 'vehicle_id', label: this.$tc('general.vehicle'), field: 'number', align: 'center', sortable: true },
          { name: 'customers', label: this.$tc('general.customer'), field: 'customers', align: 'left', style:'width:40%' },
          { name: 'status', label: this.$tc('label.state'), field: 'status', align: 'center'},
        ]
      },
    }
  },
  created () {
    this.init()
  },
  computed: {
    ScreenMode() {
      if(this.isDark === null) return this.isNight
      return Boolean(this.isDark);
    },
    isNight() {
      const date = new Date();
      return (date.getHours() > 17 || date.getHours() < 6);
    }
  },
  methods: {
    init () {
      this.INDEX.load()
      this.reload = setInterval(() => this.INDEX.load(), 1000 * 30);
    },
    duration(datetime, after = null) {
      after = this.$app.moment(after || undefined)
      datetime = this.$app.moment(datetime)
      //Difference in number of Minutes
      return this.$app.moment.duration(after.diff(datetime)).asMinutes();
    },
    getOntimeLabel(row) {
      const duration = this.duration(`${row.date} ${row.time}`, row.departed_at)
      if (duration > 0) return 'DELAY'
      else if (row.departed_at) return 'ON-TIME'
      else return 'SCHEDULED'
    },
    getOntimeColor(row) {
      const duration = this.duration(`${row.date} ${row.time}`, row.departed_at)
      if (duration > 0) return 'negative'
      else if (row.departed_at) return 'green-8'
      else return 'primary'
    }
  },
  destroyed() {
    clearInterval(this.reload)
  }
}
</script>

<style lang="stylus">
.q-table__title
  text-transform: uppercase;
.schedule-time
  // font-size: 18px;
  letter-spacing: 0.005em;
  font-weight: 300;
  text-transform: uppercase;
.q-menu--isDark
  background-color #424242
</style>
