<template>
  <div>
    <!-- ACCURATE -->
    <!-- <q-icon name="mdi-alpha-a-circle"></q-icon> -->
    <q-btn outline dense :color="isAccurated ? 'white' : 'warning'" icon="mdi-alpha-a" @click="onAccurate"/>
  </div>
</template>

<script>
import { openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      //
    }
  },
  computed: {
    ...mapState('admin', ['ACCURATE']),
    isAccurated () {
      return Object.keys(this.ACCURATE).length > 0
    }
  },
  created() {
    this.setup()
  },
  methods: {
    openURL,
    setup () {
      if (this.isAccurated) {
        if (this.ACCURATE['accurate[db][session]'] && this.ACCURATE['accurate[db][host]'] && this.ACCURATE['accurate[auth][access_token]'])
        {
          this.$axios.setHeader([
            { key: 'X-Accurate-DB-host', value: this.ACCURATE['accurate[db][host]'] },
            { key: 'X-Accurate-DB-session', value: this.ACCURATE['accurate[db][session]'] },
            { key: 'X-Accurate-Auth-access_token', value: this.ACCURATE['accurate[auth][access_token]'] },
          ])
        }
      }
    },
    onAccurate () {
      return this.$q.dialog({
        title: 'ACCURATE',
        message: 'Would you like to '+ (!this.isAccurated ? 'connect' : 're-connect') +' on the Accurate?',
        ok: 'Connect',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // window.location.href = ('http://localhost:8000/accurate/login?redirect_uri=http://localhost:8080/%23/accurate')

        let redirect = this.$axios.defaults.baseURL + '/accurate/login?redirect_uri=' + window.location.origin + '/%23/accurate'
        window.location.href = redirect
      })
    }
  }
}
</script>
