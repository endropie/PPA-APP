<template>
  <q-page padding class="page-index">
    <q-pull-to-refresh @refresh="LIST.load">
      <q-card class="my-card">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <ux-date
              v-model="LIST.filter.trip_date"
              dense hide-bottom-space hide-dropdown-icon
              standout="bg-blue-grey-5 text-white"
              :debounce="3000"
              @input="LIST.load"
            />
            <q-space />
            <q-toggle left-label v-model="isFullTime" label="FULL TIME" />
          </div>
        </q-card-section>
        <q-markup-table dense flat bordered separator="cell">
          <thead>
            <tr class="head-column">
              <th class="text-left">
                <div class=" q-py-xs">CUST</div>
              </th>
              <template v-for="(cTime, iTime) in time24">
                <th :key="iTime" :row-time-code="cTime" v-show="!HIDE_TIME[iTime]" class="q-py-md">
                  {{cTime}}
                </th>
              </template>
            </tr>
          </thead>
          <tbody v-if="isFullTime">
            <tr v-for="(cust, index) in LIST.rowdata" :key="index">
              <td class="text-left">
                <div class=" q-py-xs">{{cust.code}}</div>
              </td>
              <template v-for="(cTime, iTime) in time24">
                <td :key="iTime" :row-time-value="cTime" v-show="!HIDE_TIME[iTime]"
                  :class="{'bg-blue-grey text-white': isTriped(cTime, cust)}"
                  align="center"
                >
                  <span v-text="'D'" v-if="isTriped(cTime, cust)" />
                </td>
              </template>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(cust, index) in LIST.rowdata" :key="index">
              <td class="q-pa-none text-left">
                <div class=" q-py-xs">{{cust.code}}</div>
              </td>
              <template v-for="(cTime, iTime) in time24">
                <td :key="iTime" :row-time-value="cTime"
                  v-show="!HIDE_TIME[iTime]"
                  class="q-py-sm" style="min-width:200px"
                  :class="{
                    'bg-grey-10 text-white': $q.dark.isActive && !isTriped(cTime, cust),
                    'bg-grey-4 text-white': !$q.dark.isActive && !isTriped(cTime, cust),
                  }"
                >
                <template v-if="TASK_TIME && TASK_TIME[iTime]" >
                  <q-chip v-for="(task, iTask) in TASK_TIME[iTime].filter(x => x.customer_id === cust.id)" :key="iTask"
                    dense square color="blue-grey" text-color="white"
                    :icon="task.is_loaded ? 'local_shipping' : 'done_all'"
                    :outline="!isTriped(cTime, cust)"
                    class="text-weight-medium"
                    :label="task.fullnumber"
                    v-show="iTask === 0"
                  />
                  <q-btn dense color="blue-grey" size="sm" icon="add" unelevated v-if="TASK_TIME[iTime].filter(x => x.customer_id === cust.id).length > 1" >
                    <q-menu>
                      <q-list bordered>
                        <q-item clickable v-ripple v-for="(task, iTask) in TASK_TIME[iTime].filter(x => x.customer_id === cust.id)" :key="iTask">
                          <q-item-section avatar>
                            <q-icon color="primary" :name="task.is_loaded ? 'local_shipping' : 'done_all'" />
                          </q-item-section>
                          <q-item-section>{{task.fullnumber}}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>

                  <q-icon name="warning" color="orange" class="float-right"
                    v-if="!TASK_TIME[iTime].filter(x => x.customer_id === cust.id).length && isTriped(cTime, cust)"
                  >
                    <q-tooltip>PDO undefined</q-tooltip>
                  </q-icon>
                </template>
                </td>
              </template>
            </tr>
            <tr v-for="(exCust, iEXData) in EXDATA.CUSTOMER" :key="iEXData">
              <td class="q-pa-none text-left">
                <div class=" q-py-xs">{{exCust.code}}
                </div>
              </td>
              <template v-for="(cTime, iTime) in time24">
                <td :key="iTime" :row-time-value="cTime"
                  v-show="!HIDE_TIME[iTime]"
                  class="q-py-sm" style="min-width:200px"
                  :class="{
                    'bg-grey-10 text-white': $q.dark.isActive,
                    'bg-grey-4 text-white': !$q.dark.isActive,
                  }"
                >
                <template v-if="EXDATA.TASK[iEXData]" >
                  <q-chip v-for="(task, iTask) in EXDATA.TASK[iEXData].filter(x => String(x.trip_time).substring(0,2) === cTime)" :key="iTask"
                    dense square
                    :label="task.fullnumber"
                    :icon="task.is_loaded ? 'local_shipping' : 'done_all'"
                    :outline="true"
                    color="blue-grey" text-color="white"
                    class="text-weight-medium"
                  />
                </template>
                </td>
              </template>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      time24: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      isFullTime: true,
      SHEET: {
        customers: { data: [], api: '/api/v1/incomes/customers?mode=all' }
      },
      LIST: {
        mode: 'index',
        resource: {
          api: '/api/v1/incomes/customers',
          uri: '/admin/deliveries/delivery-trips',
          delivery_task: '/api/v1/incomes/delivery-tasks',
          delivery_load: '/api/v1/incomes/delivery-loads'
        },
        rowdata: [],
        rowtask: [],
        rowload: [],
        filter: {
          trip_date: this.$app.moment().format('YYYY-MM-DD')
        },
        load: this.load
      }
    }
  },
  created () {
    this.load()
  },
  computed: {
    EXDATA () {
      const result = { CUSTOMER: {}, TASK: {} }
      const ex = this.LIST.rowtask.filter(x => !this.LIST.rowdata.find(cust => cust.id === x.customer_id))
      ex.every((item, i) => {
        if (!result.CUSTOMER[item.customer_id]) result.CUSTOMER[item.customer_id] = item.customer
        if (!result.TASK[item.customer_id]) result.TASK[item.customer_id] = []
        result.TASK[item.customer_id].push(item)
      })
      return result
    },
    TASK_TIME (task) {
      return this.time24.map(time => {
        return this.LIST.rowtask
          .filter(task => {
            return String(task.trip_time).substring(0, 2) === time // && this.$app.moment(task.date).day() === this.INTDAY
          })
      })
    },
    HIDE_TIME () {
      return this.time24.map((time, i) => {
        if (this.isFullTime) return false
        if (this.TASK_TIME && this.TASK_TIME[i].length) return false
        return Boolean(!this.LIST.rowdata.find(cust => {
          return cust.customer_trips.find(x => x.intday === this.INTDAY && String(x.time).substring(0, 2) === time)
        }))
      })
    },
    INTDAY () {
      if (this.LIST.filter.trip_date) {
        return this.$app.moment(this.LIST.filter.trip_date).day()
      }
      return undefined
    },
    isCanPush () {
      return this.$app.can('items-push')
    },
    isCanUpdate () {
      return this.$app.can('items-update')
    },
    isCanDelete () {
      return this.$app.can('items-delete')
    },
    CustomerOptions () {
      return (this.SHEET.customers.data.map(item => ({ label: `${item.code} - ${item.name}`, value: item.id, rowdata: item })) || [])
    }
  },
  methods: {
    isTriped (time, cust) {
      return cust.customer_trips.find(x => String(x.time).substring(0, 2) === time && x.intday === this.INTDAY)
    },
    getLoad () {
      let url = `${this.LIST.resource.delivery_load}?mode=all&date=${this.LIST.filter.trip_date}`
      this.$q.loading.show()
      this.$axios.get(url)
        .then((response) => {
          this.LIST.rowload = response.data
        }).catch((error) => {
          this.$app.response.error(error.response || error)
        }).finally(() => {
          this.$q.loading.hide()
        })
    },
    getTask () {
      let url = `${this.LIST.resource.delivery_task}?mode=all&--with=customer&date=${this.LIST.filter.trip_date}`
      this.$q.loading.show()
      this.$axios.get(url)
        .then((response) => {
          this.LIST.rowtask = response.data
        }).catch((error) => {
          this.$app.response.error(error.response || error)
        }).finally(() => {
          this.$q.loading.hide()
        })
    },
    getTrip (done = null) {
      const intday = this.$app.moment(this.LIST.filter.trip_date).day()
      let url = `${this.LIST.resource.api}?mode=all&trip_intday=${intday}&--with=customer_trips`
      this.$q.loading.show()
      this.$axios.get(url)
        .then((response) => {
          this.LIST.rowdata = response.data
        }).catch((error) => {
          this.$app.response.error(error.response || error)
        }).finally(() => {
          if (done && typeof done === 'function') done()
          this.$q.loading.hide()
        })
    },
    load (done = null) {
      if (!this.LIST.filter.trip_date) return console.warn('TRIP UNDEFINED!!!')
      this.getTrip(done)
      this.getTask()
      this.getLoad()
    }
  }
}
</script>
<style lang="stylus">
tr.head-column th
  border-top-width: 3px !important;
  border-top-style: double;
  border-bottom-width: 3px !important;
  border-bottom-style: double;
// .table-index
//   tr.top-row, tr.top-header
//     height unset !important

// tr.top-row th
//   padding: 2px 5px
//   border-bottom-width: thin
</style>
