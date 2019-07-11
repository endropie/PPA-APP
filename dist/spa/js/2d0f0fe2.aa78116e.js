(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0f0fe2"],{"9f76":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.SHOW?i("q-page",{staticClass:"row justify-center",attrs:{padding:"",dark:t.LAYOUT.isDark}},[i("page-print",{staticClass:"q-pa-md q-pr-lg shadow-2",staticStyle:{"max-width":"210mm"}},[i("div",{staticStyle:{"padding-bottom":"45px"},attrs:{slot:"header"},slot:"header"},[i("div",{staticClass:"icon"},[i("q-icon",{staticClass:"q-display-3",attrs:{name:"widgets",color:"primary"}})],1),i("div",{staticClass:"title"},[i("div",{staticClass:"q-title "},[t._v("Priuk Perkasa Abadi, PT")]),i("div",{staticClass:"q-caption small"},[t._v("Planing & Production Control Division")])]),i("div",{staticClass:"no-print float-right"},[t.rsView.revise_id?i("q-chip",{attrs:{tag:"",outline:"",small:"",color:"negative"}},[t._v("\n          Revised\n        ")]):t._e()],1)]),i("div",{staticClass:"row  q-gutter-md"},[i("div",{staticClass:"col-12"},[i("div",{staticClass:"row justify-around q-gutter-sm"},[i("div",{staticClass:"self-center text-center"},[i("span",{staticClass:"q-headline"},[t._v("WORK-IN PRODUCTION")])]),i("div",{},[i("q-table",{ref:"table",staticClass:"table-bordered d-grid no-shadow",attrs:{color:"secondary",separator:"cell",grid:"",dense:"","hide-bottom":"",dark:t.LAYOUT.isDark,data:[{number:t.rsView.number,created_at:t.$app.moment(t.rsView.created_at).format("DD/MM/YYYY")}],columns:[{name:"number",label:"Number",align:"center",field:"number",classes:"q-headline text-weight-medium"},{name:"created_at",label:"Date",align:"center",field:"created_at"}]}})],1)])]),i("div",{staticClass:"col-12"},[i("dl",{staticClass:" horizontal"},[i("dt",{staticClass:"text-weight-light"},[t._v("Worktime")]),i("dd",[t._v(t._s(t.getWorktime(t.rsView.worktime)))]),i("dt",{staticClass:"text-weight-light"},[t._v("Line production")]),i("dd",[t._v(t._s(t.rsView.line.name))])])]),i("div",{staticClass:"col-12"},[i("q-table",{ref:"table",staticClass:"table-border d-grid no-shadow",attrs:{color:"secondary",separator:"vertical",dense:"","hide-bottom":"",dark:t.LAYOUT.isDark,data:t.rsView.workin_production_items,"no-data-label":"No Production",columns:[{name:"code",label:"code",align:"left",field:function(t){return t.item.code}},{name:"part_name",label:"Part name",align:"left",field:function(t){return t.item.part_name}},{name:"quantity",label:"Quantity",align:"right",field:function(t){return t.quantity}},{name:"unit_id",label:"Unit",align:"center",field:function(t){return t.unit.code}}]}})],1),i("div",{staticClass:"col-12"},[i("div",{staticClass:"q-my-xs text-italic"},[t._v("Description:")]),i("div",{staticClass:"q-my-xs text-weight-light",staticStyle:{"min-height":"30px"}},[t._v(t._s(t.rsView.description))])]),i("div",{staticClass:"col-12 group print-hide ",staticStyle:{"padding-top":"50px"}},[i("q-btn",{attrs:{label:"Back","icon-right":t.btnIcon("cancel"),color:"dark",to:t.VIEW.resource.uri+"?return"}}),t.IS_EDITABLE?i("q-btn",{attrs:{color:"positive","icon-right":t.btnIcon("edit"),label:"Edit",to:t.VIEW.resource.uri+"/"+t.$route.params.id+"/edit"}}):t._e(),i("q-btn",{attrs:{label:"Print","icon-right":t.btnIcon("print"),color:"grey"},nativeOn:{click:function(e){return t.print()}}}),t.IS_EDITABLE?i("q-btn",{attrs:{color:"negative","icon-right":t.btnIcon("delete"),label:"Delete",outline:""},on:{click:t.VIEW.delete}}):t._e()],1)])]),i("q-inner-loading",{attrs:{visible:t.VIEW.loading}},[i("q-spinner-gears",{attrs:{size:"50px",color:"primary"}})],1)],1):t._e()},n=[],r=(i("7514"),i("447e")),s=i("b44a"),o=i("3252"),l={mixins:[r["a"]],components:{PagePrint:s["a"],PagePrintBreak:o["a"]},data:function(){return{VIEW:{resource:{api:"/api/v1/factories/workin-productions",uri:"/admin/factories/workin-productions",params:"?mode=view"}},rsView:{},count:0}},created:function(){this.init()},computed:{IS_EDITABLE:function(){return!(this.rsView.hasOwnProperty("has_relathinship")&&this.rsView.has_relationship.length>0)}},methods:{init:function(){var t=this;this.SHOW=!1,this.VIEW.onLoad(function(e){t.setView(e),setTimeout(function(){t.SHOW=!0},500)})},btnIcon:function(t){return this.$q.screen.lt.sm?"":t},print:function(){window.print()},getWorktime:function(t){var e=[{label:"Reguler",value:"REGULER"},{label:"Overtime",value:"OVERTIME",color:"secondary"}],i=e.find(function(e){return e.value===t});return i?i.label:"N/A"},setView:function(t){this.rsView=t}}},c=l,d=i("2877"),u=Object(d["a"])(c,a,n,!1,null,null,null);e["default"]=u.exports}}]);