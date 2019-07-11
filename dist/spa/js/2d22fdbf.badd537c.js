(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["2d22fdbf"],{ea8e:function(e,t,r){"use strict";r.r(t);var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.SHOW?r("q-page",{staticClass:"main-page justify-center",attrs:{padding:""}},[r("q-card",{staticClass:"q-ma-sm ",attrs:{inline:""}},[r("q-card-section",[r("form-header",{attrs:{title:e.FORM.title(),subtitle:e.FORM.subtitle()}},[r("template",{slot:"menu-item"},[e.$route.params.id?r("list-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:e.$tc("label.remove"),icon:"delete",clickable:""},on:{click:e.FORM.delete}}):e._e()],1)],2)],1),r("q-card-section",[r("div",{staticClass:"row q-gutter-sm q-gutter-x-md"},["edit"!==this.$route.meta.mode?r("q-field",{staticClass:"col-12 q-border",attrs:{label:"Transaction mode","label-width":"3",error:e.errors.has("transaction"),"error-message":e.errors.first("transaction")}},[r("q-option-group",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"transaction",type:"radio",color:"secondary",inline:"",disable:"edit"==this.$route.meta.mode,options:e.$store.state.admin.CONFIG.options.transaction_mode},model:{value:e.rsForm.transaction,callback:function(t){e.$set(e.rsForm,"transaction",t)},expression:"rsForm.transaction"}})],1):e._e(),r("div",{staticClass:"col-12 col-md-6"},[r("div",{staticClass:"row q-gutter-x-md"},[r("q-field",{staticClass:"col-12",attrs:{error:e.errors.has("number"),"error-message":e.errors.first("number")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"edit"==e.$route.meta.mode?"required":"",expression:"$route.meta.mode == 'edit' ? 'required':''"}],attrs:{name:"number",label:"No Transaction",placeholder:"[Auto Generate]"},model:{value:e.rsForm.number,callback:function(t){e.$set(e.rsForm,"number",t)},expression:"rsForm.number"}})],1),r("q-field",{staticClass:"col-12",attrs:{error:e.errors.has("customer"),"error-message":e.errors.first("customer")}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"customer",label:"Customer",disable:e.IssetItemDetails||null!=e.rsForm.request_order_id,options:e.CustomerOptions,filter:"",clearable:""},on:{input:e.setCustomerReference},model:{value:e.rsForm.customer_id,callback:function(t){e.$set(e.rsForm,"customer_id",t)},expression:"rsForm.customer_id"}}),r("q-tooltip",{attrs:{disable:!e.IssetItemDetails,offset:[0,10]}},[e._v("To change, Please remove all detail parts, first!")])],1),r("q-field",{staticClass:"col-12 col-md-6",attrs:{error:e.errors.has("plan_begin_date"),"error-message":e.errors.first("plan_begin_date")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"plan_begin_date","stack-label":"",label:"Begin date of Plan",type:"date"},model:{value:e.rsForm.plan_begin_date,callback:function(t){e.$set(e.rsForm,"plan_begin_date",t)},expression:"rsForm.plan_begin_date"}})],1),r("q-field",{staticClass:"col-12 col-md-6",attrs:{error:e.errors.has("plan_until_date"),"error-message":e.errors.first("plan_until_date")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"plan_until_date","stack-label":"",label:"Until date of Plan",type:"date"},model:{value:e.rsForm.plan_until_date,callback:function(t){e.$set(e.rsForm,"plan_until_date",t)},expression:"rsForm.plan_until_date"}})],1)],1)]),r("div",{staticClass:"col-12 col-md-6"},[r("div",{staticClass:"row q-gutter-x-md"},[r("q-field",{staticClass:"col-12"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"customer_name","stack-label":"",label:"Name"},model:{value:e.rsForm.customer_name,callback:function(t){e.$set(e.rsForm,"customer_name",t)},expression:"rsForm.customer_name"}})],1),r("q-field",{staticClass:"col-12"},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:"required",expression:"'required'"}],attrs:{name:"customer_phone","stack-label":"",label:"phone"},model:{value:e.rsForm.customer_phone,callback:function(t){e.$set(e.rsForm,"customer_phone",t)},expression:"rsForm.customer_phone"}})],1),r("q-field",{staticClass:"col-12"},[r("q-input",{attrs:{name:"customer_address","stack-label":"",label:"Address",type:"textarea",rows:"2"},model:{value:e.rsForm.customer_address,callback:function(t){e.$set(e.rsForm,"customer_address",t)},expression:"rsForm.customer_address"}})],1)],1)]),r("div",{staticClass:"col-12"},[r("div",{staticClass:"row no-wrap q-gutter-sm"},[r("q-field",[r("q-select",{attrs:{name:"order_mode",disable:"",label:"Request orders mode",radio:"",options:e.$store.state.admin.CONFIG.options.order_mode},model:{value:e.rsForm.order_mode,callback:function(t){e.$set(e.rsForm,"order_mode",t)},expression:"rsForm.order_mode"}})],1)],1)]),r("div",{staticClass:"col-12"},[r("q-table",{ref:"table",staticClass:"d-grid full-width no-shadow",attrs:{data:e.rsForm.pre_delivery_items,dense:"","hide-bottom":"","rows-per-page-options":[0],columns:[{name:"prefix",label:"",align:"left"},{name:"item_id",label:"Part Item",align:"left"},{name:"quantity",label:"Quantity",align:"center"},{name:"unit_id",label:"Unit",align:"center"}],pagination:{rowsPerPage:0}},scopedSlots:e._u([{key:"body",fn:function(t){return[r("q-tr",{attrs:{propItem:t}},[r("q-td",{key:"prefix"},[r("q-btn",{attrs:{dense:"",icon:"delete",color:"blue-grey-5"},on:{click:function(r){return e.removeItem(t.row.__index)}}})],1),r("q-td",{key:"item_id",attrs:{width:"50%"}},[r("q-field",{staticStyle:{"min-width":"150px"},attrs:{error:e.errors.has("pre_delivery_items."+t.row.__index+".item_id"),"error-message":e.errors.first("pre_delivery_items."+t.row.__index+".item_id")}},[r("q-select",{directives:[{name:"validate",rawName:"v-validate",value:"required|excluded:"+e.rsForm.pre_delivery_items.map(function(e,r){return r!==t.row.__index?e.item_id:-1}),expression:"`required|excluded:${rsForm.pre_delivery_items.map((x,index) => index !==propItem.row.__index ? x.item_id : -1)}`"}],staticClass:"col-auto",attrs:{name:"pre_delivery_items."+t.row.__index+".item_id",inverted:"",color:"blue-grey-5",readonly:!e.IssetCustomerID,options:e.ItemOptions,filter:""},on:{input:function(r){e.setItemReference(t.row.__index,r)}},model:{value:t.row.item_id,callback:function(r){e.$set(t.row,"item_id",r)},expression:"propItem.row.item_id"}}),r("q-tooltip",{attrs:{disable:e.IssetCustomerID,offset:[0,10]}},[e._v("Select a customer, first! ")])],1)],1),r("q-td",{key:"quantity",staticStyle:{"min-width":"120px"},attrs:{width:"30%"}},[r("q-field",{attrs:{error:e.errors.has("pre_delivery_items."+t.row.__index+".quantity")}},[r("q-input",{directives:[{name:"validate",rawName:"v-validate",value:e.FORM.validator.quantity(t.row,e.numUnitConvertion(t.row,e.MaxMount[t.row.__index])),expression:"FORM.validator.quantity(propItem.row, numUnitConvertion(propItem.row, MaxMount[propItem.row.__index]))"}],attrs:{minimal:"",name:"pre_delivery_items."+t.row.__index+".quantity",type:"number",align:"center",inverted:"",color:"blue-grey-5",suffix:"&nbsp;/&nbsp;"+e.strUnitConvertion(t.row,e.MaxMount[t.row.__index]),warning:t.row.quantity>e.MaxStock[t.row.__index],before:[{icon:"warning",warning:!0,handler:function(){}}]},on:{input:function(e){t.row.unit_qty=e*t.row.unit_rate}},model:{value:t.row.quantity,callback:function(r){e.$set(t.row,"quantity",r)},expression:"propItem.row.quantity"}})],1)],1),r("q-td",{key:"unit_id",attrs:{width:"15%"}},[r("q-field",{attrs:{error:e.errors.has("pre_delivery_items."+t.row.__index+".unit_id"),"error-message":e.errors.first("pre_delivery_items."+t.row.__index+".unit_id")}},[r("q-select",{attrs:{minimal:"",name:"unit_id-"+t.row.__index,options:e.ItemUnitOptions[t.row.__index],inverted:"",color:"blue-grey-5"},on:{input:function(r){e.setUnitReference(t.row.__index,r)}},model:{value:t.row.unit_id,callback:function(r){e.$set(t.row,"unit_id",r)},expression:"propItem.row.unit_id"}})],1)],1)],1),t.row.item?r("q-tr",{},[r("q-td"),r("q-td",[r("div",{staticClass:"text-left"},[r("table",{staticClass:"table-description full-width"},[r("tr",[r("td",[e._v("No Plate    ")]),r("td",[e._v(e._s(t.row.item.part_number))])]),r("tr",[r("td",[e._v("Plate name  ")]),r("td",[e._v(e._s(t.row.item.part_name))])])])])]),r("q-td",{attrs:{colspan:"2"}},[r("div",{staticClass:"text-left"},[r("table",{staticClass:"table-description full-width"},[r("tr",[r("td",[e._v("Quantity    ")]),r("td",[e._v(e._s(e.formatNumber(t.row.quantity*t.row.unit_rate))+" "+e._s(e.MAPINGKEY["items"][t.row.item_id]?e.MAPINGKEY["items"][t.row.item_id].unit.name:""))])]),r("tr",[r("td",[e._v("FG #alias    ")]),r("td",[e._v(e._s(t.row.item.part_alias))])])])])]),r("q-td",{attrs:{colspan:"100%"}})],1):e._e()]}},{key:"bottom-row",fn:function(t){return r("q-tr",{},[r("q-td",{attrs:{colspan:"100%",propItem:t}},[r("strong",[r("q-btn",{attrs:{dense:"",icon:"add",color:"positive"},on:{click:function(t){return e.addNewItem()}}})],1)])],1)}}],null,!1,1966676240)})],1),r("div",{staticClass:"col-12"},[r("div",{staticClass:"row q-gutter-x-lg q-mb-md"},[r("q-field",{staticClass:"col-12",attrs:{icon:"rate_review"}},[r("q-input",{attrs:{name:"description",type:"textarea",rows:"3","stack-label":"",label:"Description"},model:{value:e.rsForm.description,callback:function(t){e.$set(e.rsForm,"description",t)},expression:"rsForm.description"}})],1)],1)])],1)]),r("q-separator",{attrs:{dark:e.LAYOUT.isDark}}),r("q-card-actions",{staticClass:"q-mx-lg"},[r("q-btn",{attrs:{label:e.$tc("label.cancel"),icon:"cancel",color:"dark"},on:{click:function(t){return e.FORM.toBack()}}}),r("q-btn",{attrs:{label:e.$tc("label.reset"),icon:"refresh",color:"light"},on:{click:function(t){return e.setForm(e.FORM.data)}}}),e.IS_EDITABLE?r("q-btn",{attrs:{label:e.$tc("label.save"),icon:"save",color:"positive"},on:{click:function(t){return e.onSave()}}}):e._e()],1)],1),r("q-inner-loading",{attrs:{visible:e.FORM.loading,dark:e.LAYOUT.isDark}},[r("q-spinner-dots",{attrs:{size:"70px",color:"primary"}})],1)],1):e._e()},s=[],a=(r("551c"),r("097d"),r("a481"),r("c5f6"),r("7514"),r("7f7f"),r("ac6a"),r("cadf"),r("06db"),r("456d"),r("0ce1")),n={mixins:[a["a"]],data:function(){var e=this;return{SHEET:{customers:{data:[],api:"/api/v1/incomes/customers?mode=all"},units:{data:[],api:"/api/v1/references/units?mode=all"},items:{autoload:!1,api:"/api/v1/common/items?mode=all"},itemstocks:{data:[],api:"/api/v1/common/items?mode=itemstock"}},FORM:{resource:{api:"/api/v1/incomes/pre-deliveries",uri:"/admin/incomes/delivery/pre-deliveries"},validator:{quantity:function(t,r){var i=["required"],s=e.$store.state.admin.CONFIG.model.pre_deliveries.max_quantity_validation;return t.item_id&&!0===s&&i.push("max_value:".concat(r)),i.join("|")}}},rsForm:{},setDefault:function(){return{number:null,transaction:null,customer_id:null,rit_id:null,trans_qty:null,plan_begin_date:e.$app.moment().format("YYYY-MM-DD"),plan_until_date:e.$app.moment().format("YYYY-MM-DD"),description:null,order_mode:null,request_order_id:null,pre_delivery_items:[{id:null,item_id:null,unit_id:null,unit_rate:1,unit_qty:null,quantity:null,request_order_item_id:null}]}}}},created:function(){this.init()},computed:{IS_EDITABLE:function(){return!(this.rsForm.hasOwnProperty("has_relationship")&&Object.keys(this.rsForm.has_relationship).length>0)},IssetItemDetails:function(){var e=this.rsForm.pre_delivery_items;for(var t in e)if(e.hasOwnProperty(t)&&e[t].item_id)return!0;return!1},IssetCustomerID:function(){return!!this.rsForm.customer_id},CustomerOptions:function(){return this.SHEET.customers.data.map(function(e){return{label:[e.code,e.name].join(" - "),value:e.id}})||[]},UnitOptions:function(){return this.SHEET.units.data.map(function(e){return{label:e.code,value:e.id}})||[]},ItemOptions:function(){var e=this;if(0==this.MAPINGKEY["itemstocks"].length)return[];var t=this.SHEET.items.data.filter(function(t){return t.customer_id===e.rsForm.customer_id&&(e.FORM.data.pre_delivery_items.find(function(e){return e.item_id==t.id})||e.MAPINGKEY["itemstocks"][t.id].totals["RO"]>0)});return t.map(function(e){return{label:"".concat(e.code," ").concat(e.part_name),sublabel:e.part_number,value:e.id}})||[]},ItemUnitOptions:function(){var e=this;return this.rsForm.pre_delivery_items.map(function(t){return e.UnitOptions.filter(function(r){if(t.item_id)return t.item.unit_id===r.value||(e.MAPINGKEY["items"][t.item_id]?e.MAPINGKEY["items"][t.item_id].item_units.some(function(e){return e.unit_id==r.value}):void 0)})})},MaxMount:function(){var e=JSON.parse(JSON.stringify(this.MAPINGKEY["itemstocks"])),t={set:function(e,t){this.hasOwnProperty(e)||(this[e]=0),this[e]+=Number(t)},get:function(e){return this.hasOwnProperty(e)?this[e]:0}};this.FORM.data.pre_delivery_items.forEach(function(t){e.hasOwnProperty(t.item_id)&&(e[t.item_id].totals["RO"]+=Number(t.quantity))});var r={};return this.rsForm.pre_delivery_items.map(function(i,s){e[i.item_id]&&i.item_id&&(r[s]=Number(e[i.item_id].totals["RO"]||0)-Number(t.get(i.item_id)||0),t.set(i.item_id,i.quantity))}),r},MaxStock:function(){var e=JSON.parse(JSON.stringify(this.MAPINGKEY["itemstocks"])),t={set:function(e,t){this.hasOwnProperty(e)||(this[e]=0),this[e]+=Number(t)},get:function(e){return this.hasOwnProperty(e)?this[e]:0}};this.FORM.data.pre_delivery_items.forEach(function(t){e.hasOwnProperty(t.item_id)&&(e[t.item_id].totals["PRE"]+=Number(t.quantity))});var r={};return this.rsForm.pre_delivery_items.map(function(i,s){e[i.item_id]&&i.item_id&&(r[s]=Number(e[i.item_id].totals["PRE"]||0)-Number(t.get(i.item_id)||0),t.set(i.item_id,i.quantity))}),r},MAPINGKEY:function(){var e={customers:{},units:{},items:{},itemstocks:{}};return this.SHEET["customers"].data.map(function(t){e["customers"][t.id]=t}),this.SHEET["units"].data.map(function(t){e["units"][t.id]=t}),this.SHEET["items"].data.map(function(t){e["items"][t.id]=t}),this.SHEET["itemstocks"].data.map(function(t){t.totals["PRE"]=Number(t.totals["FM"])+Number(t.totals["WO"]),e["itemstocks"][t.id]=t}),e}},watch:{$route:"init"},methods:{init:function(){var e=this;this.SHOW=!1,this.FORM.load(function(t){e.setForm(t),setTimeout(function(){e.SHOW=!0},500)})},strUnitConvertion:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t<0?"(-)":this.numUnitConvertion(e,t)},numUnitConvertion:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=Number(t)/Number(e.unit_rate||1),i=(+r).toFixed(20).replace(/^-?\d*\.?|0+$/g,"").length;return i>2&&(i=2),r.toFixed(i)},setCustomerReference:function(e){this.rsForm.request_order_id=null,e?(this.rsForm.customer_name=this.MAPINGKEY["customers"][e].name,this.rsForm.customer_phone=this.MAPINGKEY["customers"][e].phone,this.rsForm.customer_address=this.MAPINGKEY["customers"][e].address_raw,this.SHEET.load("items","customer_id="+e),this.MAPINGKEY["customers"].hasOwnProperty(e)&&(this.rsForm.order_mode=this.MAPINGKEY["customers"][e].order_mode)):(this.rsForm.order_mode=null,this.rsForm.customer_name=null,this.rsForm.customer_phone=null,this.rsForm.customer_address=null)},setRequestOrderItemReference:function(e,t){var r=this.RequestOrderItemOptions.find(function(e){return e.data.id===t});if(r){var i=r.data.item_id;this.rsForm.pre_delivery_items[e].item_id=i,this.setItemReference(e,i)}else console.warn("[PLAY] Set item part invalid!")},setItemReference:function(e,t){this.rsForm.pre_delivery_items[e].item=this.MAPINGKEY["items"][t];var r=this.MAPINGKEY["items"][t].unit_id;this.rsForm.pre_delivery_items[e].unit_id=r,this.rsForm.pre_delivery_items[e].unit_rate=1,this.rsForm.pre_delivery_items[e].unit=this.MAPINGKEY["units"][r]},setUnitReference:function(e,t){var r=this,i=this.rsForm.pre_delivery_items[e];(t||i.hasOwnProperty("item"))&&(i.item.unit_id===t?this.rsForm.pre_delivery_items[e].unit_rate=1:i.item.item_units&&i.item.item_units.map(function(i){i.unit_id==t&&(r.rsForm.pre_delivery_items[e].unit_rate=i.rate)}))},hasDetailItems:function(e){for(var t=[],r=this.rsForm.pre_delivery_items,i=0;i<r.length;i++)e!==i&&t.push(r[i].item_id);return t},setForm:function(e){var t=this;this.rsForm=JSON.parse(JSON.stringify(e)),this.rsForm.customer_id&&this.SHEET.load("items","customer_id="+this.rsForm.customer_id),e.hasOwnProperty("has_relationship")&&Object.keys(e["has_relationship"]).length>0&&this.FORM.response.relationship({title:"Pre-Delivery has relations!",messages:e["has_relationship"],then:function(){return t.$router.push("".concat(t.FORM.resource.uri,"/").concat(e.id))}})},addNewItem:function(){var e=this.setDefault().pre_delivery_items[0];this.rsForm.pre_delivery_items.push(e)},removeItem:function(e){this.rsForm.pre_delivery_items.splice(e,1),this.rsForm.pre_delivery_items.length<1&&this.addNewItem()},onSave:function(){var e=this;this.$validator.validate().then(function(t){if(!t)return console.warn("error",e.$validator),void e.$q.notify({color:"negative",icon:"error",position:"top-right",timeout:3e3,message:"Please complete the form fields"});e.FORM.loading=!0;var r=e.FORM.meta(),i=r.method,s=(r.mode,r.apiUrl);e.$axios.set(i,s,e.rsForm).then(function(t){var r=t.data.number+" - #"+t.data.id;e.FORM.response.success({message:r}),e.FORM.toView(t.data.id)}).catch(function(t){e.FORM.response.fields(t.response),e.FORM.response.error(t.response,"Submit")}).finally(function(){e.FORM.loading=!1})})}}},o=n,l=r("2877"),m=Object(l["a"])(o,i,s,!1,null,null,null);t["default"]=m.exports}}]);