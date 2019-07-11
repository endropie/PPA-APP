(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d0d0f6a"],{"69e6":function(e,t,r){"use strict";r.r(t);var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.SHOW?r("q-page",{staticClass:"form-page",attrs:{padding:""}},[r("q-card",{staticClass:"q-ma-sm ",attrs:{inline:""}},[r("q-card-section",[r("form-header",{attrs:{title:e.FORM.title(),subtitle:e.FORM.subtitle()}},[r("template",{slot:"menu-item"},[e.$route.params.id?r("list-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:e.$tc("label.remove"),icon:"delete",clickable:""},on:{click:e.FORM.delete}}):e._e()],1)],2)],1),r("q-card-section",{staticClass:"row q-col-gutter-x-sm"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"edit"==e.$route.meta.mode?"required":"",expression:"$route.meta.mode == 'edit' ? 'required':''"}],staticClass:"col-12 col-sm-6",attrs:{name:"number",label:"No Transaction",placeholder:"[Auto Generate]",error:e.errors.has("number"),"error-message":e.errors.first("number"),autofocus:""},model:{value:e.rsForm.number,callback:function(t){e.$set(e.rsForm,"number",t)},expression:"rsForm.number"}}),r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],staticClass:"col-12 col-sm-6",attrs:{name:"line_id",label:"Line Production",disable:e.IssetWorkOrderItems,options:e.LineOptions,clearable:"",error:e.errors.has("line_id"),"error-message":e.errors.first("line_id")},model:{value:e.rsForm.line_id,callback:function(t){e.$set(e.rsForm,"line_id",t)},expression:"rsForm.line_id"}}),r("q-tooltip",{attrs:{disable:!e.IssetWorkOrderItems,offset:[0,10]}},[e._v("To change, Please delete Work-Order items first!")]),r("q-field",{staticClass:"col-12",attrs:{prefix:"Material production",borderless:"",dense:"",error:e.errors.has("stockist_from"),"error-message":e.errors.first("stockist_from")}},[r("q-option-group",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"stockist_from",type:"radio",inline:"",options:[{value:"FM",label:"FRESH MATERIAL"},{value:"NG",label:"NOT GOOD",color:"warning"},{value:"NGR",label:"REPAIR",color:"orange-8"}]},model:{value:e.rsForm.stockist_from,callback:function(t){e.$set(e.rsForm,"stockist_from",t)},expression:"rsForm.stockist_from"}})],1),r("div",{staticClass:"col-12"},[r("q-table",{ref:"table-items",staticClass:"no-shadow inline full-width",staticStyle:{display:"grid"},attrs:{dense:"","hide-bottom":"",color:"secondary",data:e.rsForm.work_order_items,"rows-per-page-options":[0],columns:[{name:"prefix",label:"",align:"left",visibility:!1},{name:"item_id",label:"Part item ",align:"left"},{name:"target",label:"Quantity",align:"center"},{name:"unit_id",label:"Unit",align:"center"},{name:"ngratio",label:"NG Ratio",align:"center"},{name:"quantity",label:"Total",align:"center"}],pagination:{sortBy:null,descending:!1,page:null,rowsPerPage:0}},scopedSlots:e._u([{key:"body",fn:function(t){return[r("q-tr",{attrs:{rsItem:t}},[r("q-td",{key:"prefix",staticStyle:{width:"50px"},attrs:{rsItem:t}},[r("q-btn",{attrs:{dense:"",flat:"",round:"",icon:"clear",color:"negative"},on:{click:function(r){return e.removeItem(t.row.__index)}}})],1),r("q-td",{key:"item_id",attrs:{width:"40%"}},[r("select-filter",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"work_order_items."+t.row.__index+".item_id",filled:"",dense:"","hide-bottom-space":"",color:"blue-grey-4",clearable:"",disable:!e.rsForm.line_id,options:e.ItemOptions,error:e.errors.has("work_order_items."+t.row.__index+".item_id")},on:{input:function(r){return e.setItemReference(t.row.__index,r)}},model:{value:t.row.item_id,callback:function(r){e.$set(t.row,"item_id",r)},expression:"rsItem.row.item_id"}}),r("q-tooltip",{attrs:{disable:!!e.rsForm.work_order_items[t.row.__index].item_id,offset:[0,10]}},[e._v("Select a Part item, first! ")])],1),r("q-td",{key:"target",attrs:{width:"15%"}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:t.row.item_id?e.FORM.validator.quantity(t.row,e.loadItemStock[t.row.__index]):"",expression:"rsItem.row.item_id ? FORM.validator.quantity(rsItem.row, loadItemStock[rsItem.row.__index]) : ''"}],attrs:{name:"work_order_items."+t.row.__index+".target",type:"number",min:0,align:"center",filled:"",dense:"","hide-bottom-space":"",color:"blue-grey-4",error:e.errors.has("work_order_items."+t.row.__index+".target"),disable:!e.rsForm.line_id||!e.rsForm.work_order_items[t.row.__index].item_id},on:{input:function(){t.row.quantity=e.calcQuantity(t.row)}},model:{value:t.row.target,callback:function(r){e.$set(t.row,"target",r)},expression:"rsItem.row.target"}})],1),r("q-td",{key:"unit_id",attrs:{width:"15%"}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:t.row.item_id?"required":"",expression:"rsItem.row.item_id ? 'required' : ''"}],attrs:{name:"work_order_items."+t.row.__index+".unit_id",filled:"",dense:"","hide-bottom-space":"",color:"blue-grey-4",error:e.errors.has("work_order_items."+t.row.__index+".unit_id"),disable:!e.rsForm.line_id||!e.rsForm.work_order_items[t.row.__index].item_id,options:e.ItemUnitOptions[t.row.__index]},on:{input:function(r){return e.setUnitReference(t.row.__index,r)}},model:{value:t.row.unit_id,callback:function(r){e.$set(t.row,"unit_id",r)},expression:"rsItem.row.unit_id"}})],1),r("q-td",{key:"ngratio",attrs:{width:"15%"}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"work_order_items."+t.row.__index+".ngration",suffix:"%",type:"number",filled:"",dense:"","hide-bottom-space":"",align:"center",color:"blue-grey-4",error:e.errors.has("work_order_items."+t.row.__index+".ngration"),disable:!e.rsForm.line_id||!e.rsForm.work_order_items[t.row.__index].item_id},on:{input:function(){t.row.quantity=e.calcQuantity(t.row)}},model:{value:t.row.ngratio,callback:function(r){e.$set(t.row,"ngratio",r)},expression:"rsItem.row.ngratio"}})],1),r("q-td",{key:"quantity",attrs:{width:"15%"}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:t.row.item_id?e.FORM.validator.quantity(t.row,e.loadItemStock[t.row.__index]):"",expression:"rsItem.row.item_id ? FORM.validator.quantity(rsItem.row, loadItemStock[rsItem.row.__index]) : ''"}],attrs:{name:"work_order_items."+t.row.__index+".quantity",type:"number",filled:"",dense:"","hide-bottom-space":"",disable:"",align:"right",color:"blue-grey-6",error:e.errors.has("work_order_items."+t.row.__index+".quantity"),suffix:" / "+e.convertStock(t.row,e.loadItemStock[t.row.__index]),before:[{icon:"warning",warning:!0,handler:function(){return!0}}]},model:{value:t.row.quantity,callback:function(r){e.$set(t.row,"quantity",r)},expression:"rsItem.row.quantity"}})],1)],1),r("q-tr",{attrs:{rsItem:t}},[r("q-td"),r("q-td",{attrs:{colspan:"100%"}},[r("div",{staticClass:"row "},[r("div",{staticClass:"col-12 q-pb-md"},[r("q-table",{ref:"table-itemlines",staticClass:"no-shadow inline full-width",staticStyle:{display:"grid"},attrs:{dense:"","hide-bottom":"",color:"secondary",separator:"none",data:t.row.work_order_item_lines,"rows-per-page-options":[0],columns:[{name:"prefix",label:"",align:"left",visibility:!1},{name:"line_id",label:"Line production",align:"left"},{name:"begin_date",label:"Starting",align:"center"},{name:"until_date",label:"Finished",align:"center"}],pagination:{sortBy:null,descending:!1,page:null,rowsPerPage:0}},scopedSlots:e._u([{key:"body",fn:function(i){return[r("q-tr",{staticStyle:{height:"20px"},attrs:{propLine:i}},[r("q-td",{key:"prefix",staticStyle:{width:"50px"}},[e.SETTING.work_orders.item_lines_customize?r("q-btn",{attrs:{dense:"",flat:"",icon:"delete",color:"blue-grey-2 no-shadow","text-color":"grey-8"},on:{click:function(r){return e.removeItemLine(t.row.__index,i.row.__index)}}}):e._e()],1),r("q-td",{key:"line_id",attrs:{width:"50%"}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"line_id-"+i.row.__index,borderless:"","hide-bottom-space":"",readonly:"",color:"blue-grey-1",error:e.errors.has("line_id-"+i.row.__index),options:e.LineOptions,filter:""},model:{value:i.row.line_id,callback:function(t){e.$set(i.row,"line_id",t)},expression:"propLine.row.line_id"}}),r("q-tooltip",{attrs:{disable:!!e.rsForm.work_order_items[t.row.__index].item_id,offset:[0,10]}},[e._v("Select a Part item, first! ")])],1),r("q-td",{key:"begin_date",attrs:{width:"25%"}},[r("q-input",{attrs:{type:"date",filled:"",dense:"","hide-bottom-space":"",color:"blue-grey-1",disable:!e.rsForm.line_id||!e.rsForm.work_order_items[t.row.__index].item_id},model:{value:i.row.begin_date,callback:function(t){e.$set(i.row,"begin_date",t)},expression:"propLine.row.begin_date"}})],1),r("q-td",{key:"until_date",attrs:{width:"25%"}},[r("q-input",{attrs:{type:"date",filled:"",dense:"","hide-bottom-space":"",color:"blue-grey-1",disable:!e.rsForm.line_id||!e.rsForm.work_order_items[t.row.__index].item_id},model:{value:i.row.until_date,callback:function(t){e.$set(i.row,"until_date",t)},expression:"propLine.row.until_date"}})],1)],1)]}},{key:"bottom-row",fn:function(i){return e.SETTING.work_orders.item_lines_customize?r("q-tr",{attrs:{rsItem:i}},[r("q-td",{attrs:{colspan:"100%"}},[r("q-btn",{attrs:{dense:"",icon:"add",color:"positive"},on:{click:function(r){return e.addNewItemLine(t.row.__index)}}})],1)],1):e._e()}}],null,!0)})],1)])])],1)]}},{key:"bottom-row",fn:function(t){return r("q-tr",{attrs:{rsItem:t}},[r("q-td",{attrs:{colspan:"100%"}},[r("q-btn",{staticClass:"full-width",attrs:{dense:"",icon:"add",color:"positive"},on:{click:function(t){return e.addNewItem()}}})],1)],1)}}],null,!1,288377199)})],1),r("div",{staticClass:"col-12 q-mt-lg"},[r("div",{staticClass:"row q-gutter-x-lg q-mb-md"},[r("q-input",{staticClass:"col-12",attrs:{name:"description",type:"textarea",rows:"3","stack-label":"",label:"Description",filled:""},model:{value:e.rsForm.description,callback:function(t){e.$set(e.rsForm,"description",t)},expression:"rsForm.description"}})],1)])],1),r("q-separator",{attrs:{dark:e.LAYOUT.isDark}}),r("q-card-actions",[r("q-btn",{attrs:{label:e.$tc("label.cancel"),icon:"cancel",color:"dark"},on:{click:function(t){return e.FORM.toBack()}}}),r("q-btn",{attrs:{label:e.$tc("label.reset"),icon:"refresh",color:"light"},on:{click:function(t){return e.setForm(e.FORM.data)}}}),r("q-btn",{attrs:{label:e.$tc("label.save"),icon:"save",color:"positive",disabled:e.FORM.has_relationship.length>0},on:{click:function(t){return e.onSave()}}})],1)],1),r("q-inner-loading",{attrs:{visible:e.FORM.loading,dark:e.LAYOUT.isDark}},[r("q-spinner-dots",{attrs:{size:"70px",color:"primary"}})],1)],1):e._e()},o=[],s=(r("551c"),r("06db"),r("097d"),r("7514"),r("c5f6"),r("7f7f"),r("0ce1")),n={mixins:[s["a"]],data:function(){var e=this;return{SETTING:{work_orders:{item_lines_of_items:!1,item_lines_customize:!1}},SHEET:{customers:{data:[],api:"/api/v1/incomes/customers?mode=all"},units:{data:[],api:"/api/v1/references/units?mode=all"},items:{data:[],api:"/api/v1/common/items?mode=all&with=prelines"},itemstocks:{data:[],api:"/api/v1/common/items?mode=itemstock"},lines:{data:[],api:"/api/v1/references/lines?mode=all"},shifts:{data:[],api:"/api/v1/references/shifts?mode=all"}},FORM:{resource:{uri:"/admin/factories/work-orders",api:"/api/v1/factories/work-orders"},validator:{quantity:function(e,t){var r=["required"],i=!0;return e.item_id&&!0===i&&r.push("max_value:".concat(t)),r.join("|")}}},rsForm:{},setDefault:function(){return{number:null,line_id:null,stockist_from:"FM",description:null,work_order_items:[{id:null,item_id:null,quantity:null,target:null,unit_id:null,unit_rate:1,ngratio:0,item:{},unit:{},work_order_item_lines:[{line_id:null,shift_id:null,begin_date:e.$app.moment().format("YYYY-MM-DD"),until_date:e.$app.moment().format("YYYY-MM-DD")}]}]}}}},created:function(){this.init()},computed:{IssetWorkOrderItems:function(){return!!this.rsForm.work_order_items&&this.rsForm.work_order_items.some(function(e){return e.item_id})},LineOptions:function(){var e=this.SHEET.lines.data||[];return e.map(function(e){return{label:e.name,value:e.id}})},ShiftOptions:function(){return this.SHEET.shifts.data.map(function(e){return{label:e.name,value:e.id}})||[]},CustomerOptions:function(){return this.SHEET.customers.data.map(function(e){return{label:e.name,value:e.id}})||[]},UnitOptions:function(){return this.SHEET.units.data.map(function(e){return{label:e.code,value:e.id}})||[]},ItemOptions:function(){var e=this,t=this.SHEET.items.data.filter(function(t){return t.item_prelines[0].line_id===e.rsForm.line_id});return t.map(function(e){return{label:e.code+" - "+e.part_name,sublabel:e.part_number,value:e.id}})||[]},ItemUnitOptions:function(){var e=this,t=[];for(var r in this.rsForm.work_order_items)this.rsForm.work_order_items.hasOwnProperty(r)&&function(){var i=e.rsForm.work_order_items[r];t[r]=e.UnitOptions||[],t[r]=t[r].filter(function(e){if(!i.item_id)return!1;if(i.item){if(i.item.unit_id===e.value)return!0;if(i.item.item_units){var t=i.item.item_units.filter(function(t){return t.unit_id===e.value});if(t.length>0)return!0}}return!1})}();return t},loadItemStock:function(){var e=this,t=this.rsForm.stockist_from,r=JSON.parse(JSON.stringify(this.MAPINGKEY["itemstocks"])),i={set:function(e,t){this.hasOwnProperty(e)||(this[e]=0),this[e]+=Number(t)},get:function(e){return this.hasOwnProperty(e)?this[e]:0}};this.FORM.data.work_order_items.forEach(function(t){r.hasOwnProperty(t.item_id)&&(r[t.item_id].totals[e.FORM.data.stockist_from]+=Number(t.quantity))});var o={};return this.rsForm.work_order_items.map(function(e,s){r[e.item_id]&&e.item_id&&(o[s]=Number(r[e.item_id].totals[t]||0)-Number(i.get(e.item_id)||0),i.set(e.item_id,e.quantity))}),o},MAPINGKEY:function(){var e={customers:{},units:{},items:{},itemstocks:{}};return this.SHEET["customers"].data.map(function(t){e["customers"][t.id]=t}),this.SHEET["units"].data.map(function(t){e["units"][t.id]=t}),this.SHEET["items"].data.map(function(t){e["items"][t.id]=t}),this.SHEET["itemstocks"].data.map(function(t){e["itemstocks"][t.id]=t}),e}},watch:{$route:"init"},methods:{init:function(){var e=this;this.SHOW=!1,this.FORM.load(function(t){e.setForm(t),setTimeout(function(){e.SHOW=!0},500)})},setForm:function(e){var t=this;if(this.rsForm=e,e.hasOwnProperty("has_relationship")&&e["has_relationship"].length>0){this.FORM.has_relationship=e.has_relationship;var r=e["has_relationship"].join("-");this.$q.dialog({title:"Work Order has Related",message:r,preventClose:!0,ok:"Direct to Detail Page",cancel:"Continue"}).then(function(){t.$router.push("".concat(t.FORM.resource.uri,"/").concat(e.id))}).catch(function(){})}},convertStock:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t<0?"(-)":Number(t||0)/Number(e.unit_rate||1)},calcQuantity:function(e){return Math.ceil(Number(e.target)+Number(e.target)*Number(e.ngratio)/100)},setItemReference:function(e,t){if(t){if(this.rsForm.work_order_items[e].item=this.MAPINGKEY["items"][t],this.rsForm.work_order_items[e].item.item_prelines.length>0){var r=this.rsForm.work_order_items[e].item.item_prelines;this.rsForm.work_order_items[e].work_order_item_lines=[];for(var i=0;i<r.length;i++){var o=this.setDefault().work_order_items[0].work_order_item_lines[0];o.line_id=r[i].line_id,this.rsForm.work_order_items[e].work_order_item_lines.push(o)}}var s=this.MAPINGKEY["items"][t].unit_id;this.rsForm.work_order_items[e].unit_id=s,this.rsForm.work_order_items[e].unit_rate=1,this.rsForm.work_order_items[e].unit=this.MAPINGKEY["units"][s]}else this.rsForm.work_order_items[e].unit_id=null,this.rsForm.work_order_items[e].unit={},this.rsForm.work_order_items[e].item={}},setUnitReference:function(e,t){var r=this;t&&(this.rsForm.work_order_items[e].item.unit_id===t?this.rsForm.work_order_items[e].unit_rate=1:this.rsForm.work_order_items[e].item.item_units&&this.rsForm.work_order_items[e].item.item_units.find(function(i){if(i.unit_id==t)return r.rsForm.work_order_items[e].unit_rate=i.rate,!0}))},addNewItem:function(){var e=this.setDefault().work_order_items[0];e.work_order_item_lines=[],this.rsForm.work_order_items.push(e)},removeItem:function(e){this.rsForm.work_order_items.splice(e,1),this.rsForm.work_order_items.length<1&&this.addNewItem()},addNewItemLine:function(e){var t=this.setDefault().work_order_items[0].work_order_item_lines[0];this.rsForm.work_order_items[e].work_order_item_lines.push(t)},removeItemLine:function(e,t){this.rsForm.work_order_items[e].work_order_item_lines.splice(t,1),this.rsForm.work_order_items[e].work_order_item_lines.length<1&&this.addNewItemLine(e)},onSave:function(){var e=this;this.$validator.validate().then(function(t){if(t){e.FORM.loading=!0;var r=e.FORM.meta(),i=r.method,o=(r.mode,r.apiUrl);e.$axios.set(i,o,e.rsForm).then(function(t){var r=t.data.number+" - #"+t.data.id;e.FORM.response.success({message:r}),e.FORM.toView(t.data.id)}).catch(function(t){console.warn("[PLAY] onSave",t),e.FORM.response.fields(t.response),e.FORM.response.error(t.response,"Submit")}).finally(function(){e.FORM.loading=!1})}else e.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"})})}}},a=n,l=r("2877"),d=Object(l["a"])(a,i,o,!1,null,null,null);t["default"]=d.exports}}]);