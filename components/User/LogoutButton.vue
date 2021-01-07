<template>
  <span @click="logout">
    <v-btn
          color="error"
          class="mr-4"
          @click="validate"
        >
          ログアウト
        </v-btn>
  </span>
</template>

<script>
export default {
  methods: {
    logout () {
      localStorage.removeItem('calendarCurrentUser')
    }
  }
}
</script>
