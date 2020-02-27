<template>
  <div class="index-page bg-grey-2 window-height window-width column items-center no-wrap">
    <div class="banner bg-primary flex flex-center">
      PPA
    </div>
    <div class="text-center">
      <div class="card bg-white shadow-4 column no-wrap flex-center group q-gutter-xs">
        <!-- <img src="~assets/quasar-play-logo-full.svg"> -->
        <q-icon name="widgets" class="text-h2" color="blue-7" />
          <p class="text-h4 text-orange-14 text-weight-bolder" style="font: courier">
            PPA PLAY
          </p>
        <br>

        <q-btn
          label="PPA Administration"
          to="/admin"
          color="primary"
          class="full-width"
          icon="launch"
          no-ripple
        />

        <q-btn outline
          label="Schedule Board"
          to="/schedule-boards"
          color="primary"
          class="full-width"
          icon="launch"
          no-ripple
        />


        <div class="fit row q-mt-lg">

          <q-btn flat no-caps color="grey-7"
            label="Read Privacy Policy"
            @click.native="$refs.privacy.show()"
            class="q-mt-sm"
          />
          <q-space />
          <q-btn no-ripple
            label="PPA SYSTEM APP"
            color="green-8"
            icon="android"
            type="a" href="/statics/apps/ppa-system.apk"
          >
            <q-tooltip>Download PPA System Mobile App</q-tooltip>
          </q-btn>
        </div>


        <privacy-policy ref="privacy" />
        <modal ref="modal" >
          <template slot="footer" >
            <div class="row justify-around text-light full-width">
              <span>
                store:{{$store.getters['admin/CONFIG'].general.baseURL}} <br/>
              </span>
              <span>
                axios:{{$axios.defaults.baseURL}}
              </span>
            </div>
          </template>
          <div class="column" style="min-width:300px">
            <q-select
              label="Host API"
              v-model="baseURL"
              :options="servers"
              :loading="loadingSeturl">
              <template slot="after">
                <q-btn dense
                  :disable="baseURL === BASEURL"
                  :flat="baseURL === BASEURL"
                  :icon="baseURL !== BASEURL ? 'refresh' : 'done'"
                  :color="baseURL !== BASEURL ? 'warning' : 'primary'"
                 @click="saveBaseURL()" />

              </template>
            </q-select>
          </div>
        </modal>
      </div>
    </div>
    <a class="ribbon" :title="`PPA Built on v${$q.version}`" />
  </div>
</template>

<script>
import { openURL } from 'quasar'
import PrivacyPolicy from 'components/PrivacyPolicy'

export default {
  components: {
    PrivacyPolicy,
  },
  data(){
    return {
      servers:['http://localhost:8000', 'http://ppa.virmata.com'],
      baseURL: null,
      loadingSeturl: false
    }
  },
  mounted() {
    // console.warn('Modal -> ')
  },
  computed: {
    BASEURL() {
      return this.$store.state.admin.CONFIG.general.baseURL
    }
  },
  methods: {
    launch () {
      openURL('http://quasar-framework.org')
    },
    openSetURL(){
      this.baseURL = this.$store.state.admin.CONFIG.general.baseURL
      this.$refs.modal.show()
    },
    saveBaseURL(){
      this.loadingSeturl = true

      setTimeout(() => {
        const newURL = this.$store.commit('admin/setBaseURL', this.baseURL)
        this.loadingSeturl = false
      }, 1000);
    },
    viewPrivacyPolicy () {
      this.$refs.privacy.show()
    }
  }
}
</script>

<style lang="stylus">
.index-page
  .banner
    height 50vh
    width 100%
    font-size 30vmax
    color rgba(255, 255, 255, .2)
    overflow hidden
  .card
    width 80vw
    max-width 500px
    padding 10px 25px
    margin-top -90px
    border-radius 2px
    img
      height 140px
      width 140px

.ribbon
  width 14.1em
  height 14.1em
  position absolute
  overflow hidden
  top 0
  right 0
  z-index 39
  pointer-events none
  font-size 17px
  text-decoration none
  text-indent -999999px
  opacity 0.7
  &.fixed
    position fixed
  &:before
    content ''
    padding 4px
    background-color white
    background-image linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .15))
    box-shadow 0 .15em .23em 0 rgba(0, 0, 0, .5)
    pointer-events auto
  &:after
    content attr(title)
    color #027be3
    line-height 1.54em
    text-decoration none
    text-align center
    text-indent 0
    padding .15em 0
    margin .15em 0

  &:before, &:after
    position absolute
    display block
    width 23.38em
    height 1.74em
    top 4.8em
    right -5.8em
    transform rotate(45deg)
</style>
