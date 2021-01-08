<template>
  <span @click="redirectLoginForm">
    <v-btn
          color="success"
          class="mr-4"
        >
          ログイン
        </v-btn>
  </span>
</template>

<script>
export default {
  methods: {
    redirectLoginForm () {
      this.$router.push({ path: '/user/login' })
    }
  }
}
</script>
