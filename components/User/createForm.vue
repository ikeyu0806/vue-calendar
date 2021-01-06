<template>
  <div>
    <v-form
    ref="form"
    >
      <p>{{ sendMessage }}</p>
      <v-text-field
        v-model="name"
        label="ユーザ名"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        label="メールアドレス"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="パスワード"
        required
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        label="パスワード(確認)"
        required
      ></v-text-field>

      <v-checkbox
        v-model="checkbox"
        :rules="[v => !!v || '規約に同意していません。']"
        label="規約に同意します"
        required
      ></v-checkbox>

      <span @click="registerUser">
        <v-btn
          color="primary"
          class="mr-4"
        >
          ユーザ登録
        </v-btn>
      </span>
    </v-form>
  </div>
</template>

<script>
/* eslint-disable */
import createUser from '~/apollo/mutations/createUser.gql'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      checkbox: false,
      sendMessage: '',
      createSuccess: false
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    returnTop(){
      this.$router.push({path: '/', query: {createSuccess: this.createSuccess}})
    },
    async registerUser () {
      try {
        const response = await this.$apollo.mutate({
          mutation: createUser,
          variables: {
            name: this.name,
            email: this.email,
            password: this.password
          }
        })
        localStorage.setItem('calendarCurrentUser', JSON.stringify({ token: response.data.createUser.token, id: response.data.createUser.id, name: response.data.createUser.name }))
        this.createSuccess = true
        this.returnTop()
      } catch (error) {
        this.sendMessage = 'ユーザ登録に失敗しました。'
      }
    }
  }
}
</script>
