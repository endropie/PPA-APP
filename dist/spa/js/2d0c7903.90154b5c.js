(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0c7903"],{"50c5":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.SHOW?a("q-page",{staticClass:"page-index",attrs:{padding:""}},[a("q-pull-to-refresh",{attrs:{handler:e.TABLE.refresh,inline:""}},[a("q-table",{ref:"table",staticClass:"table-index",attrs:{inline:"",color:"primary",dark:e.LAYOUT.isDark,title:e.TABLE.getTitle(),data:e.TABLE.rowData,columns:e.TABLE.columns,filter:e.TABLE.filter,selection:"none",selected:e.TABLE.selected,"row-key":"id",pagination:e.TABLE.pagination,loading:e.TABLE.loading},on:{"update:selected":function(t){return e.$set(e.TABLE,"selected",t)},"update:pagination":function(t){return e.$set(e.TABLE,"pagination",t)},request:e.TABLE.compute},scopedSlots:e._u([{key:"top-left",fn:function(t){return[a("div",[a("div",{staticClass:"row q-pa-xs q-gutter-xs"},[a("q-field",{staticClass:"col-auto",staticStyle:{width:"200px"}},[a("q-select",{attrs:{name:"customer_id","stack-label":"",label:"Customer",options:e.CustomerOptions,filter:""},model:{value:e.FILTERABLE.fill.customer_id.value,callback:function(t){e.$set(e.FILTERABLE.fill.customer_id,"value",t)},expression:"FILTERABLE.fill.customer_id.value"}})],1),a("q-field",{staticClass:"col"},[a("q-input",{attrs:{"stack-label":"",label:"Begin Date",type:"date"},model:{value:e.FILTERABLE.fill.date_start.value,callback:function(t){e.$set(e.FILTERABLE.fill.date_start,"value",t)},expression:"FILTERABLE.fill.date_start.value"}})],1),a("q-field",{staticClass:"col"},[a("q-input",{attrs:{"stack-label":"",label:"Until Date",type:"date"},model:{value:e.FILTERABLE.fill.date_end.value,callback:function(t){e.$set(e.FILTERABLE.fill.date_end,"value",t)},expression:"FILTERABLE.fill.date_end.value"}})],1)],1),a("div",{staticClass:"row q-pa-xs q-gutter-xs items-end"},[a("q-field",{ref:"filterable",staticClass:"col-12",attrs:{"label-width":"1"}},[a("q-chips-input",{attrs:{name:"filterable","add-icon":" ",value:e.FILLABEL.value,placeholder:"Searching...",color:"blue-grey-5"},on:{add:e.FILTERABLE.setCreate,remove:e.FILTERABLE.setRemove}},[a("q-popover",{attrs:{anchor:"bottom right",self:"top right",fit:"","no-focus":"","no-refocus":""}})],1)],1),a("span",{staticClass:"col q-ml-xs q-pt-xs"},[a("q-btn",{staticClass:"float-right",attrs:{icon:"search",label:"Search",size:"sm",color:"secondary",right:""},on:{click:function(t){return e.FILTERABLE.submit()}}})],1)],1)])]}},{key:"body",fn:function(t){return[a("tr",{attrs:{rs:"rs"}},[a("q-td",{staticStyle:{width:"35px"},attrs:{slot:"body-cell-prefix"},slot:"body-cell-prefix"},[a("q-btn",{attrs:{dense:"",flat:"",color:"light",icon:"description",to:e.TABLE.resource.uri+"/"+t.row.id}})],1),a("q-td",[e._v("\n            "+e._s(t.row.number)+"\n            "),a("q-checkbox",{staticClass:"q-mr-md",attrs:{color:"primary","checked-icon":"remove","unchecked-icon":"add"},model:{value:t.expand,callback:function(a){e.$set(t,"expand",a)},expression:"rs.expand"}})],1),a("q-td",[t.row.customer?a("span",[e._v(" "+e._s(t.row.customer.name))]):a("span",[e._v("- undifined -")])]),a("q-td",[t.row.operator?a("span",[e._v(" "+e._s(t.row.operator.name))]):a("span",[e._v("- undifined -")])]),a("q-td",[e._v("\n            "+e._s(t.row.date)+"\n          ")]),a("q-td",[e._v("\n            "+e._s(t.row.time)+"\n          ")]),a("q-td",[e._v("\n            "+e._s(t.row.due_date)+"\n          ")]),a("q-td",[e._v("\n            "+e._s(t.row.due_time)+"\n          ")])],1),a("q-tr",{directives:[{name:"show",rawName:"v-show",value:t.expand,expression:"rs.expand"}],attrs:{rs:t}},[a("q-td",[e._v(" ")]),a("q-td",{staticClass:"group",attrs:{colspan:"100%"}},[e._l(t.row.delivery_orders,function(t,l){return[a("q-btn",{key:l,attrs:{dense:"",color:"secondary",icon:"open_in_new",to:e.TABLE.resource.delivery_orders+"/"+t.id}},[e._v("\n                "+e._s(t.number)+" "+e._s(t.numrev?" - REV."+t.numrev:"")+"\n              ")])]})],2)],1)]}}],null,!1,1217262854)})],1)],1):e._e()},n=[],r=(a("7f7f"),a("9155")),s={mixins:[r["a"]],data:function(){return{SHEET:{customers:{data:[],api:"/api/v1/incomes/customers?mode=all"}},FILTERABLE:{fill:{customer_id:{value:null,type:"integer",transform:function(e){return null}},date_start:{value:null,type:"date",transform:function(e){return null}},date_end:{value:null,type:"date",transform:function(e){return null}}}},TABLE:{mode:"index",resource:{api:"/api/v1/incomes/ship-deliveries",uri:"/admin/incomes/delivery/ship-deliveries",delivery_orders:"/admin/incomes/delivery/delivery-orders"},columns:[{name:"prefix",label:""},{name:"number",label:"Number",field:"number",align:"left",sortable:!0},{name:"customer_id",label:"Customer",field:"customer_id",align:"left",sortable:!0},{name:"operator_id",label:"Operator",field:"operator_id",align:"left",sortable:!0},{name:"date",label:"Ship date",field:"date",align:"left",sortable:!0},{name:"time",label:"Ship time",field:"time",align:"left",sortable:!0},{name:"due_date",label:"Due date",field:"due_date",align:"left",sortable:!0},{name:"due_time",label:"Due time",field:"due_time",align:"left",sortable:!0}]}}},created:function(){var e=this;console.log("[PLAY] Request Orders created!"),this.SHOW=!1,this.INDEX.load(function(){setTimeout(function(){return e.SHOW=!0},500)})},computed:{CustomerOptions:function(){return this.SHEET.customers.data.map(function(e){return{label:e.name,value:e.id}})||[]}},methods:{toggleExpanded:function(e){this.TABLE.rowData[e.row.__index].expanded=!e.row.expanded,console.log("click",e,this.TABLE.rowData[e.row.__index].expanded)}}},i=s,o=a("2877"),d=Object(o["a"])(i,l,n,!1,null,null,null);t["default"]=d.exports}}]);