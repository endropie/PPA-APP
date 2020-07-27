<template>
  <q-layout view="lHh LpR lFf" :class="LAYOUT.isDark ? 'bg-grey-10 text-white' : 'bg-white text-dark'">
    <q-header class="header print-hide" elevated>

      <q-toolbar color="primary" >
        <q-btn v-if="NODRAWER"
          icon="arrow_back" flat round dense
          aria-label="Menu" class="within-iframe-hide"
          @click.native="$router.go(-1)" />
        <q-btn v-else-if="!LEFTDRAWER"
          icon="menu" flat round dense
          aria-label="Menu" class="within-iframe-hide"
          @click="LEFTDRAWER = !LEFTDRAWER" />
        <q-icon v-else
          :name="$route.meta.icon"
          style="font-size:28px; margin-right: 5px;"
          v-show="$route.meta.icon" />
        <!-- <q-btn v-else class="cordova-only electron-only" icon="arrow_back" aria-label="Back" flat rounded dense v-go-back.single="PAGEMETA.backRoute" /> -->
        <q-toolbar-title>
          <!-- <q-avatar v-show="$route.meta.icon" :icon="$route.meta.icon" size="24px"  color="red" /> -->
          <span v-if="$route.meta.lang" class="text-uppercase text-weight-reguler" v-text="$tc($route.meta.lang)" />
          <span v-else class="text-uppercase text-weight-reguler" v-text="$route.meta.title" />
        </q-toolbar-title>
        <admin-header :class="LAYOUT.isDark ? ' ': ''" />
        <admin-accurate class="q-ml-sm" />
        <!-- <q-btn v-show="false" aria-label="Menu" class="within-iframe-hide" icon="assignment" flat round dense @click="RIGHTDRAWER = !RIGHTDRAWER" /> -->

      </q-toolbar>
    </q-header>

    <q-drawer class="print-hide" bordered
      content-class="bg-grey-2"
      v-model="LEFTDRAWER"
      :mini="!LEFTDRAWER || miniState"
      @click.capture="leftDrawerCapture"
      show-if-above
      v-if="!NODRAWER">
      <q-scroll-area :class="LAYOUT.isDark ? 'bg-black text-primary' : 'bg-white text-primary'" style="width: 100%; height: 100%;">
        <div :style="{'height': miniState ? '50px': '115px'}"
          class="row flex-center opacity-1"
          :class="{
            'bg-primary text-white' : LAYOUT.isDark,
            'bg-grey-2 text-primary': !LAYOUT.isDark,
          }" >
          <!-- <img alt="Quasar logo" src="~assets/quasar-logo.svg" style="height: 75px; width 75px;"> -->
          <q-icon name="widgets" :class="miniState ? 'text-h4' : 'text-h3'"  />
          <div class="column q-ml-md"  :class="{'hidden' : miniState}">
            <span class="text-h6">{{$app.setting('general.app_brand') || $app.name}}</span>
            <span class="caption text-small text-weight-light">MANUPLAY V.2</span>
          </div>
        </div>
        <q-list class="menu" :class="{'dimmed' : miniState}">
          <template v-for="(node, index) in DataMenu">
            <admin-menu-item :node="node" :isIndent="false" :prefix="`/admin/${node.path}`" :key="index" :dark="LAYOUT.isDark"/>
          </template>
        </q-list>
      </q-scroll-area>
       <div class="q-mini-drawer-hide absolute" style="bottom: 35px; right: -17px">
          <q-btn dense round unelevated color="primary" icon="chevron_left"
            @click="[miniState = true]"
          />
        </div>
    </q-drawer>
    <!-- <q-drawer class="hidden print-hide " side="right"
      content-class="bg-lime-2"
      v-model="RIGHTDRAWER"
      :width="300" bordered
      v-if="!NODRAWER" >
    </q-drawer> -->

    <q-page-container>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeIn"
        :duration="1500" @leave="resetScroll">
        <router-view />
      </transition>
      <q-page v-if="!SHOW" >
        <q-inner-loading :showing="!SHOW" :dark="LAYOUT.isDark">
          <q-spinner-facebook  size="70px" color="primary" />
        </q-inner-loading>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'
import MixPage from '@/mixins/mix-page.vue'
import DataMenu from "@/assets/data-menu"
import { type } from 'os';

export default {
  mixins: [MixPage],
  data () {
    return {
      DataMenu,
      miniState: false,
      PANELTAB:'messages'
    }
  },
  created() {
    this.$q.loading.show()
    this.$axios.validToken((response) => {
      this.$q.loading.hide()
      if(response.status >= 200 && response.status <= 300) {
        return
      }
      else if(response.status === 401) {
        this.setLogoff()
      }
      else if(response.status >= 400) {
        console.error('APA', response)
      }
      else this.$q.dialog({
        message: 'Netwok error!',
        ok: 'redirect',
        cancel: 'skip'
      }).onOk(() => { this.$router.push('/') })
    })
  },
  computed: {
    ...mapState('admin', [
      'NOW',
      'PAGEMETA',
      'AUTH',
      'USER'
    ]),
    NODRAWER() {
      return ['view','print','edit','create'].some(x => x === this.$route.meta.mode)
    }
  },
  methods: {
    openURL,
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },
    leftDrawerCapture (e) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false
        e.stopPropagation()
      }

    },
    setLogoff () {
      this.$axios.setHeader([
        {key: 'Accept', value: 'application/json'},
        {key: 'Authorization', value: null}
      ])
      this.$store.commit('admin/setLogoff');
      setTimeout(() => {
        this.$router.push('/auth')
      }, 500)
    },
    setLogout () {
      this.$axios.setHeader([
        {key: 'Accept', value: 'application/json'},
        {key: 'Authorization', value: null}
      ])
      this.$store.commit('admin/setLogoff');
      setTimeout(() => {
        this.$router.push('/')
      }, 500)
    }
  }
}
</script>
<style lang="stylus">
header.header
  // background-image: linear-gradient(145deg, ()$primary 11%, ()$dark-primary 75%)
  background-image: linear-gradient(145deg, rgba(255,255,255,0) 10%,  rgba(0, 0, 0, 0.5) 90%)

.menu.dimmed:after
  background-color transparent !important

aside.q-drawer
  background #fff0

@media print
  .q-loading-bar
    display none
</style>


