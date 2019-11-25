<template>
  <q-page padding class="page-index" >
    <q-pull-to-refresh @refresh="TABLE.refresh" inline>
      <q-table ref="table" inline class="table-index table-striped th-uppercase" color="primary" :dark="LAYOUT.isDark"
        :title="TABLE.getTitle()"
        :data="TABLE.rowData"
        :columns="TABLE.columns"
        selection="none"
        :selected.sync="TABLE.selected"
        row-key="id"
        :pagination.sync="TABLE.pagination"
        @request="TABLE.compute"
        :loading="TABLE.loading">

        <!-- Table Header -->
        <template v-slot:top>
          <table-header hide-search
            :title="TABLE.getTitle()"
            :TABLE.sync="TABLE"
            :filter.sync="TABLE.filter"
            :menus="[
              { label: $tc('form.add'),
                detail: $tc('messages.form_new'),
                icon: 'add',
                shortcut: true,
                hidden:!$app.can('incoming-goods-create'),
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

            <div class="row items-start q-col-gutter-xs" >
              <ux-date class="col-8 col-sm-4"
                stack-label :label="$tc('label.date')"
                v-model="FILTERABLE.fill.date.value" type="date"  clearable
                dense hide-bottom-space
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit"/>

              <q-select class="col-4 col-sm-2 "
                v-model="FILTERABLE.fill.status.value" clearable
                :options="['OPEN','VALIDATED','VOID','DELETE']"
                :label=" $tc('label.state')"
                dense hide-bottom-space hide-dropdown-icon
                standout="bg-blue-grey-5 text-white"
                :bg-color="LAYOUT.isDark ? 'blue-grey-9' : 'blue-grey-1'"
                :dark="LAYOUT.isDark"
                @input="FILTERABLE.submit" />

              <q-select class="col-12 col-sm-6" autocomplete="off"
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

        <!-- slot name syntax: body-cell-<column_name> -->
        <q-td slot="body-cell-prefix" slot-scope="rs" :props="rs" style="width:35px">
          <q-btn flat dense color="light" icon="description" :to="`${TABLE.resource.uri}/${rs.row.id}`" />
          <q-btn v-if="isCanUpdate && isEditable(rs.row)" flat dense color="light" icon="edit" :to="`${TABLE.resource.uri}/${rs.row.id}/edit`" />
          <q-btn v-if="isCanDelete && isEditable(rs.row)" flat dense color="light" icon="delete"  @click.native="TABLE.delete(rs.row)" />
        </q-td>

        <q-td slot="body-cell-number" slot-scope="rs" :props="rs" style="width:35px">
          <div :class="{'text-strike': Boolean(rs.row.revise_id)}">
            {{ rs.row.number }}
            <span v-text="'REV.'+rs.row.revise_number" v-if="Boolean(rs.row.revise_number)"/>
          </div>
        </q-td>

        <q-td slot="body-cell-status" slot-scope="rs" :props="rs" style="width:35px">
          <div class="row q-gutter-xs no-wrap">
            <ux-badge-status :row="rs.row" class="shadow-1" />
            <q-badge label="RET" class="shadow-1 q-pa-xs"
              dense color="blue-grey" text-color="white"
              v-if="rs.row.transaction == 'RETURN'"
            />
          </div>
        </q-td>

        <q-td slot="body-cell-reference" slot-scope="rs" :props="rs">
          <span v-if="rs.row.reference"> {{ rs.row.reference }}</span>
          <span v-else>-</span>
        </q-td>
      </q-table>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import MixIndex from '@/mixins/mix-index.vue'
import MixSheet from '@/mixins/mix-sheet.vue'
export default {
  mixins: [MixIndex, MixSheet],
  data () {
    return {
      SHEET: {
        // customers: {data:[], api:'/api/v1/incomes/customers?mode=all'},
      },
      FILTERABLE: {
        fill: {
          status: {
            value: null,
            transform: (value) => { return null }
          },
          date: {
            value: null,
            transform: (value) => { return null }
          }
        }
      },
      TABLE: {
        mode: 'index',
        resource:{
          api: '/api/v1/warehouses/opname-stocks',
          uri: '/admin/warehouses/opname-stocks',
        },
        columns: [
          { name: 'prefix', label: '', align: 'left'},
          { name: 'number', label: this.$tc('label.number'), field: 'number', align: 'left', sortable: true },
          { name: 'status', label: '', field: 'status', align: 'left'},
          { name: 'date', label: this.$tc('label.date'), field: 'date', align: 'center', sortable: true},
          { name: 'reference', label: this.$tc('label.reference'), field: 'reference', align: 'left', sortable: true },
          { name: 'created_at', label: this.$tc('form.create', 2), field: 'created_at', align: 'center', sortable: true },
        ],
      },
    }
  },
  created () {
    this.INDEX.load()
  },
  computed: {
    isCanUpdate(){
      return this.$app.can('incoming-goods-update')
    },
    isCanDelete(){
      return this.$app.can('incoming-goods-delete')
    },
    CustomerOptions() {
      return (this.SHEET.customers.data.map(item => ({label: `${item.code} - ${item.name}`, value: item.id})) || [])
    },
  },
  methods:{
    isEditable(row) {
      if(row.deleted_at) return false
      if(row.status !== 'OPEN') return false
      if(row.hasOwnProperty('is_relationship') && row.is_relationship) return false
      return true
    }
  }
}
</script>
