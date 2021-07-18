<template>
  <span @click="redirectCreateForm">
    <v-btn
          color="primary"
          class="mr-4"
        >
          サインイン
        </v-btn>
  </span>
</template>

<script>
export default {
  methods: {
    redirectCreateForm () {
      this.$router.push({ path: '/user/create' })
    }
  }
}
</script>
