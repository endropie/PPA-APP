(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d216bf6"],{c47f:function(e,t,i){"use strict";i.r(t);var r=function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.SHOW?i("q-page",{staticClass:"page-index",attrs:{padding:""}},[i("q-pull-to-refresh",{attrs:{handler:e.TABLE.refresh,inline:""}},[i("q-table",{ref:"table",staticClass:"table-index",attrs:{dark:e.LAYOUT.isDark,title:e.TABLE.getTitle(),data:e.TABLE.rowData,columns:e.TABLE.columns,filter:e.TABLE.filter,selection:"none",selected:e.TABLE.selected,"row-key":"id",pagination:e.TABLE.pagination,loading:e.TABLE.loading},on:{"update:selected":function(t){return e.$set(e.TABLE,"selected",t)},"update:pagination":function(t){return e.$set(e.TABLE,"pagination",t)},request:e.TABLE.compute},scopedSlots:e._u([{key:"top",fn:function(){return[i("table-header",{attrs:{title:e.TABLE.getTitle(),subtitle:"Data option of Spesifications",filter:e.TABLE.filter,menu:"","menu-preferences":"","menu-new":e.TABLE.resource.uri+"/create"},on:{"update:filter":function(t){return e.$set(e.TABLE,"filter",t)}},scopedSlots:e._u([{key:"menu-item",fn:function(){return[i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:"","prop-preferences":""}},[i("q-item-section",[e._v("Preferences")]),i("q-item-section",{attrs:{avatar:""}},[i("q-icon",{attrs:{name:"keyboard_arrow_right",color:"light"}})],1)],1),i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],staticClass:"vertical-middle",attrs:{clickable:"",to:e.TABLE.resource.uri+"/create"}},[i("q-item-section",[e._v("Add new")]),i("q-item-section",{attrs:{avatar:""}},[i("q-icon",{attrs:{name:"add_circle",color:"light"}})],1)],1),i("q-separator",{attrs:{dark:e.LAYOUT.isDark}})]},proxy:!0}],null,!1,3732733871)},[i("table-preferences")],1)]},proxy:!0},{key:"body-cell-prefix",fn:function(t){return i("q-td",{staticStyle:{width:"35px"},attrs:{props:t}},[i("q-btn",{attrs:{dense:"",flat:"",color:"light",icon:"edit",to:e.TABLE.resource.uri+"/"+t.row.id+"/edit"}}),i("q-btn",{attrs:{dense:"",flat:"",color:"light",icon:"delete"},nativeOn:{click:function(i){return e.TABLE.delete(t.row)}}})],1)}},{key:"body-cell-description",fn:function(t){return i("q-td",{staticClass:"ellipsis",staticStyle:{"max-width":"200px"},attrs:{props:t}},[e._v("\n        "+e._s(t.row.description)+"\n        "),t.row.description?i("q-tooltip",{staticStyle:{"max-width":"320px"},attrs:{anchor:"top middle",self:"bottom middle",offset:[1,1]}},[e._v(e._s(t.row.description))]):e._e()],1)}},{key:"body-cell-color",fn:function(t){return i("q-td",{attrs:{props:t}},[t.row.color?i("span",[e._v(" "+e._s(t.row.color.name))]):i("span",{staticClass:"text-warning"},[e._v("- undefined -")])])}}],null,!1,3190688027)})],1)],1):e._e()},n=[],a=i("9155"),o={mixins:[a["a"]],data:function(){return{TABLE:{resource:{api:"/api/v1/references/specifications",uri:"/admin/references/specifications"},columns:[{name:"prefix",label:""},{name:"code",field:"code",label:"Intern code",align:"left",sortable:!0},{name:"name",width:"200px",field:"name",label:"Spesification",align:"left",sortable:!0},{name:"color",label:"Color",field:"color",align:"center"},{name:"times_spray_white",label:"White spray (h)",field:"times_spray_white",sortable:!0},{name:"times_spray_red",label:"Red spray (h)",field:"times_spray_red",sortable:!0},{name:"description",label:"Description",field:"description",align:"left"}]}}},created:function(){var e=this;this.SHOW=!1,this.INDEX.load(function(){setTimeout(function(){return e.SHOW=!0},500)})}},s=o,l=i("2877"),c=Object(l["a"])(s,r,n,!1,null,null,null);t["default"]=c.exports}}]);