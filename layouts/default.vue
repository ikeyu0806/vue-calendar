<template>
  <v-app>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <span v-if="login">
        <LogoutButton></LogoutButton>
      </span>
      <span v-else-if="!login">
        <LoginButton></LoginButton>
        <CreateButton></CreateButton>
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
import LogoutButton from '~/components/User/LogoutButton'
import LoginButton from '~/components/User/LoginButton'
import CreateButton from '~/components/User/CreateButton'

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
      isLoggin: false,
      userId: 0
    }
  },
  components: {
    LoginButton,
    CreateButton,
    LogoutButton
  },
  computed: {
    login () {
      return this.$store.getters.isLogin
    }
  },
  mounted () {
    if (localStorage.calendarCurrentUser) {
      const isLoggin = JSON.parse(localStorage.calendarCurrentUser).token !== null
      const currentUserId = JSON.parse(localStorage.calendarCurrentUser).id
      this.$store.commit('setLogin', { login: isLoggin })
      this.$store.commit('setUserId', { userId: currentUserId })
    }
  }
}
</script>
