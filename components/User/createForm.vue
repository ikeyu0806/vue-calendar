<template>
  <div>
    <span v-if="createFailure">
      <v-alert
        color="red"
        dense
        text
        type="error"
      >ユーザ登録に失敗しました。</v-alert>
    </span>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-text-field
        v-model="name"
        :counter="30"
        :rules="nameRules"
        label="ユーザ名"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="メールアドレス"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="パスワード"
        required
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
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
          :disabled="!(this.valid)"
          color="primary"
          class="mr-4"
          @click="validate"
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
      nameRules: [
        v => !!v || '名前は必須項目です。',
        v => (v && v.length <= 30) || '名前は30文字以下で入力してください。',
      ],
      email: '',
      emailRules: [
        v => !!v || 'Emailは必須項目です。',
        v => /.+@.+\..+/.test(v) || '不正な入力値です',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'パスワードは必須項目です。',
        v => (v && v.length >= 8) || 'パスワードは半角英数字8文字以上で入力してください。',
      ],
      confirmPassword: '',
      confirmPasswordRules: [
        v => !!v || 'パスワード(確認)は必須項目です。',
        v => v === this.password || 'パスワードと確認用パスワードは一致しません。',
      ],
      checkbox: false,
      sendMessage: '',
      createFailure: false,
      createSuccess: false,
      valid: false
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
        this.$store.commit('setLogin', { login: true })
        this.$store.commit('setUserId', { userId: response.data.createUser.id })
        this.returnTop()
      } catch (error) {
        this.createFailure = true
      }
    }
  }
}
</script>
