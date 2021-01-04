<template>
  <div>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    >
      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="ユーザ名"
        required
      ></v-text-field>

      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="メールアドレス"
        required
      ></v-text-field>

      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="パスワード"
        required
      ></v-text-field>

      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="パスワード(確認)"
        required
      ></v-text-field>

      <v-checkbox
        v-model="checkbox"
        :rules="[v => !!v || '規約に同意していません。']"
        label="規約に同意します"
        required
      ></v-checkbox>

      <v-btn
        color="primary"
        class="mr-4"
        @click="validate"
      >
        ユーザ登録
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  methods: {
    validate () {
      this.$refs.form.validate()
    }
  }
}
</script>
