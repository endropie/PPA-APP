<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" class="table-index th-uppercase" color="primary" :dark="LAYOUT.isDark"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        :filter="TABLE.filter"
        selection="none"
        :selected.sync="TABLE.selected"
        row-key="id"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading">

        <!-- Table Header -->
        <template v-slot:top>
          <table-header hide-search
            :title="($tc('general.schedule_board', 2)).toUpperCase()"
            :TABLE.sync="TABLE"
            :menus="[
              { label: $tc('form.add'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                shortcut: true,
                hidden:!$app.can('pre-deliveries-create'),
                to: `${TABLE.resource.uri}/create`
              },
              { label: $tc('label.trash'),
                detail:  $tc('messages.show_deleted'),
                shortcut: true,
                icon: Boolean(FILTERABLE.fill.withTrashed.value)? 'mdi-cup' : 'mdi-cup-off',
                closePopup: false,
                outline: true,
                actions:() => {
                  FILTERABLE.toggleTrash()
                  FILTERABLE.submit()
                }
              }
            ]">

            <div class="row q-col-gutter-xs" >
              <ux-select-filter class="col-12 col-sm-6"
                v-model="FILTERABLE.fill.vehicle_id.value" clearable
                :label="$tc('general.vehicle')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark" :options-dark="LAYOUT.isDark"
                :options="VehicleOptions"
                @input="FILTERABLE.submit" />

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.begin')"
                v-model="FILTERABLE.fill.begin_date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <ux-date class="col-12 col-sm-3"
                stack-label :label="$tc('label.until')"
                v-model="FILTERABLE.fill.until_date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>


              <q-select class="col-12" autocomplete="off"
                multiple use-chips use-input new-value-mode="add"
                dense hide-dropdown-icon
                v-model="FILTERABLE.search" emit-value
                :placeholder="`${$tc('form.search',2)}...`"
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit">

                <template slot="before">
                </template>
                <template slot="append">
                  <q-btn flat dense icon="search" dark-percentage color="fadded" @click="FILTERABLE.submit"/>
                </template>
              </q-select>
            </div>
          </table-header>
        </template>

        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn-dropdown auto-close dense flat color="light" dropdown-icon="more_horiz" menu-self="top right" class="no-label-dropdown">
            <q-list dense style="width:180px">
              <q-item clickable @click="setChangeState(rs.row, 'DEPARTED')" v-if="hasChangeState(rs.row) && rs.row.status !== 'DEPARTED'">
                <q-item-section>{{$tc('form.tag', 1, {v:'DEPARTED'})}}</q-item-section>
              </q-item>
              <q-item clickable @click="setChangeState(rs.row, 'ARRIVED')" v-if="hasChangeState(rs.row) && rs.row.status !== 'ARRIVED'">
                <q-item-section>{{$tc('form.tag', 1, {v:'ARRIVED'})}}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="setChangeState(rs.row, 'CLOSED')" v-if="hasChangeState(rs.row) && !isEditable(rs.row)">
                <q-item-section>CLOSED</q-item-section>
              </q-item>
              <q-item clickable @click="setChangeState(rs.row, 'VOID')" v-if="!isEditable(rs.row) && rs.row.status !== 'VOID'">
                <q-item-section>VOID</q-item-section>
              </q-item>
              <q-item clickable :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" v-if="isCanUpdate && isEditable(rs.row)">
                <q-item-section>{{$tc('form.edit')}}</q-item-section>
              </q-item>
              <q-item clickable @click="TABLE.delete(rs.row)" v-if="isCanDelete && isEditable(rs.row)">
                <q-item-section>{{$tc('form.delete')}}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs">
          <div :class="{'text-strike': Boolean(rs.row.revise_id)}">
            {{ rs.row.fullnumber || rs.row.number }}
          </div>
        </q-td>

        <q-td slot="body-cell-schedule" slot-scope="rs" :props="rs">
          <!-- {{$app.moment(`${rs.row.date} ${rs.row.time}`).format('lll')}} -->
          <div>
            <span>{{$app.moment(`${rs.row.date} ${rs.row.time}`).format('ll')}}</span>
            <q-space />
            <q-icon name="timer" />
            <span>{{$app.moment(`${rs.row.date} ${rs.row.time}`).format('h:mm')}}</span>
          </div>
        </q-td>

        <q-td slot="body-cell-status" slot-scope="rs" :props="rs" class="no-padding">
          <ux-chip-status dense square :row="rs.row"
            :dark="LAYOUT.isDark"
            :colorOptions="{'DEPARTED' : 'green-7', 'ARRIVED': 'blue-grey-9'}"
            :labelOptions="{'OPEN': getOntimeLabel(rs.row)}"
          />
          <q-chip dense square class="text-weight-medium"
            :dark="LAYOUT.isDark"
            :label="getOntimeLabel(rs.row)"
            :color="getOntimeColor(rs.row)"
            text-color="white"
            v-if="!Boolean(rs.row.deleted_at) && getOntimeLabel(rs.row) === 'DELAYED'"/>
        </q-td>

        <q-td slot="body-cell-vehicle_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.vehicle"> {{ rs.row.vehicle.number }}</span>
          <span v-else>-</span>
        </q-td>

        <q-td slot="body-cell-operator_id" slot-scope="rs" :props="rs">
          <span v-if="rs.row.operator">
            <!-- <div class="extend-line">{{$tc('label.no')}} {{ rs.row.operator.code }}</div> -->
            {{ rs.row.operator.name }}
          </span>
          <span v-else>-</span>
        </q-td>

        <q-td slot="body-cell-customers" slot-scope="rs" :props="rs" class="no-padding">
          <span v-if="rs.row.customers && rs.row.customers.length > 0" class="row flex">
            <q-chip dense square v-for="(customer, i) in rs.row.customers" :key="i">
              {{customer.name || 'no-name'}}
            </q-chip>
          </span>
          <span v-else>-</span>
        </q-td>

      </q-table>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import MixIndex from '@/mixins/mix-index.vue'

export default {
  mixins: [MixIndex],
  data () {
    return {
      SHEET: {
        vehicles: {data:[], api:'/api/v1/references/vehicles?mode=all'}
      },
      FILTERABLE: {
        fill: {
          vehicle_id: {
            value: null,
            type: 'integer',
            transform: (value) => { return null }
          },
          begin_date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          },
          until_date: {
            value: null,
            type: 'date',
            transform: (value) => { return null }
          }
        }
      },
      TABLE:{
        mode: 'index',
        resource:{
          api: '/api/v1/transports/schedule-boards',
          uri: '/admin/deliveries/schedule-boards',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'schedule', label: this.$tc('transports.schedule'), align: 'center', sortable: true},
          { name: 'vehicle_id', label: this.$tc('general.vehicle'), field: 'vehicle_id', align: 'left', sortable: true },
          { name: 'operator_id', label: this.$tc('general.operator'), field: 'operator_id', align: 'left', sortable: true },
          { name: 'status', label: '', field: 'status', align: 'center'},
          { name: 'customers', label: this.$tc('transports.destination'), align: 'left', style:'width:45%' },
        ]
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('items-update')
    },
    isCanDelete(){
      return this.$app.can('items-delete')
    },
    VehicleOptions() {
      return (this.SHEET.vehicles.data.map(item => ({label: item.number, value: item.id})) || [])
    },
  },
  methods: {
    hasChangeState (row) {
      if (row.deleted_at) return false
      if (row.status === 'CLOSED') return false
      return true
    },
    isEditable (row) {
      // if(row.order_mode === 'NONE') return false
      if(row.status !== 'OPEN') return false
      if(row.is_relationship) return false
      return true
    },
    setChangeState (row, state) {

      const submit = () => {

        // this.VIEW.loading = true
        // const method = / ? 'PUT' : 'DELETE';
        let apiUrl = this.TABLE.resource.api + '/' + row.id
        apiUrl += `?mode=${state}&nodata=true`

        const axi = () =>  state !== 'VOID'
          ? this.$axios.put(apiUrl, {})
          : this.$axios.delete(apiUrl)

        axi()
        .then((response) => {
          this.$app.notify.success({
            message: this.$tc('messages.success', 1, {v:state}).toUpperCase(),
            // detail: this.$tc('messages.form_has_validated',1, {v:response.data.number})
          })
          this.INDEX.load()
        })
        .catch((error) => {
          this.$app.response.error(error.response || error, (`${state} FAILED`).toUpperCase());
        })
        .finally(()=>{
          setTimeout(() => {
            this.TABLE.loading = false
          }, 1000)

        });
      }

      this.$q.dialog({
        title: this.$tc('form.confirm'),
        message: this.$tc('messages.to_sure', 1, {v: (state).toUpperCase()}),
        cancel: true,
        persistent: true
      }).onOk(() => {
        submit()
      })
    },
    duration(datetime, after = null) {
      after = this.$app.moment(after || undefined)
      datetime = this.$app.moment(datetime)

      //Difference in number of Minutes
      return this.$app.moment.duration(after.diff(datetime)).asMinutes();
    },
    getOntimeLabel(row) {
      const duration = this.duration(`${row.date} ${row.time}`, row.departed_at)
      if (duration > 0) return 'DELAYED'
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
}
</script>
<style lang="stylus">
.extend-line
  position: relative;
  line-height: 90%;
  font-size: smaller;
  font-weight: 300;
.q-btn.no-label-dropdown
  .q-btn-dropdown__arrow
    margin: 0
</style>
