<template>
  <v-app>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <span v-if="isLoggin">
        <LogoutButton></LogoutButton>
      </span>
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} Yuki Ikegaya</span>
    </v-footer>
  </v-app>
</template>

<script>
/* eslint-disable */
import LogoutButton from '~/components/User/LogoutButton'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'vue calendar',
      isLoggin: false
    }
  },
  components: {
    LogoutButton
  },
  mounted () {
    if (localStorage.calendarCurrentUser) {
      console.log
      this.isLoggin = localStorage.calendarCurrentUser.token !== null
    }
  }
}
</script>
