<template>
  <q-layout view="lHh Lpr lFf"  :class="ScreenMode ? 'bg-grey-10 text-white' : 'bg-white text-dark'">
    <q-page-container>
      <q-page padding class="page-index" >
        <q-pull-to-refresh @refresh="TABLE.refresh" inline>
          <q-table ref="table" class="table-index th-uppercase" color="primary" :dark="ScreenMode"
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

            <q-td slot="body-cell-destination" slot-scope="rs" :props="rs">
              <span v-if="rs.row.scheduled"> {{ rs.row.scheduled.destination }}</span>
              <span v-else>-</span>
            </q-td>

            <q-td slot="body-cell-status" slot-scope="rs" :props="rs" class="no-padding">
              <div v-if="rs.row.scheduled">
                <ux-badge-status v-if="duration(`${rs.row.scheduled.date} ${rs.row.scheduled.time}`) < 0"
                  label="DELAY" color="red"/>
                <ux-badge-status v-else
                  :row="rs.row.scheduled"
                  :labelOptions="{'OPEN' : 'SCHEDULED'}"
                  :colorOptions="{'DEPARTED' : 'green-14', 'ARRIVED': 'green-10'}" />
              </div>
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
          api: '/api/v1/views/schedule-boards',
          uri: '/admin/deliveries/schedule-boards',
        },
        columns: [
          { name: 'schedule', label: this.$tc('transports.schedule'), align: 'center', sortable: true},
          { name: 'vehicle_id', label: this.$tc('general.vehicle'), field: 'number', align: 'center', sortable: true },
          { name: 'destination', label: this.$tc('transports.destination'), field: 'destination', align: 'left', style:'width:40%' },
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
    duration(datetime) {
      const now = this.$app.moment()
      datetime = this.$app.moment(datetime)

      //Difference in number of Minutes
      return this.$app.moment.duration(datetime.diff(now)).asMinutes();
    }
    // #
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
