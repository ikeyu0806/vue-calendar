<template>
    <div>
      <span v-if="createSuccess">
        <v-alert
          dense
          text
          type="success"
        >ユーザ登録に成功しました。</v-alert>
      </span>
      <span v-if="loginSuccess">
        <v-alert
          dense
          text
          type="success"
        >ログインに成功しました。</v-alert>
      </span>
      <span v-if="logoutSuccess">
        <v-alert
          dense
          text
          type="success"
        >ログアウトしました。</v-alert>
      </span>
    <v-row justify="center" align="center">
      <v-col><h3 id="date-title">{{ dateTitle }}</h3></v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col>
        <div class="month-select">
          <span @click="prevMonth"><v-btn outlined>前の月</v-btn></span>
          <span @click="nextMonth"><v-btn outlined>次の月</v-btn></span>
        </div>
      </v-col>
    </v-row>
    <br />
    <v-row justify="center" align="center">
      <table>
        <thead>
          <tr>
            <th v-for="week in weeks" :key="week.id" :class="{sunday: week.id === 0}">{{ week.value }}</th>
          </tr>
          <tr v-for="(week, index) in calendars" :key="index">
            <td
              v-for="(day, index) in week"
              :key="index"
              :class="{sunday: index === 0}"
              @click="dialog = true;
              dialogItems.header_title = (currentMonth + 1) + '月' + day.date + '日の予定登録';
              dialogItems.day = day.date;
              dialogItems.year = day.year;
              dialogItems.month = day.month;
              !Object.keys(day.schedule_data).length && clearDialog()">
              <div class="date">{{ day.date }}</div>
              <span v-for="(data, index) in day.schedule_data" :key="index">
                <div class="schedule-title" @click="editSchedule(data)">{{ data.title }}</div>
              </span>
            </td>
          </tr>
        </thead>
      </table>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="600"
      >
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card>
        <v-card-title>{{ dialogItems.header_title }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="タイトル" :rules="dialogItems.titleRules" v-model="dialogItems.title"></v-text-field>
                <v-text-field label="内容" v-model="dialogItems.content"></v-text-field>
                <v-text-field label="メモ" v-model="dialogItems.memo"></v-text-field>
                <strong>開始時間</strong>
                <v-text-field type="time" :rules="dialogItems.startAtRules" name="time" v-model="dialogItems.start_at"></v-text-field>
                <strong>終了時間</strong>
                <v-text-field type="time" name="time" v-model="dialogItems.end_at"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="error"
            @click="dialog = false"
          >
            閉じる
          </v-btn>
          <span v-if="this.dialogItems.edit">
            <span @click="deleteSchedule(dialogItems.id)" class="margin-left-10">
              <v-btn
                depressed
                color="warning"
                @click="dialog = false;"
              >
                予定を削除
              </v-btn>
            </span>
            <span class="margin-left-10">
              <v-btn
                :disabled="!(this.valid)"
                depressed
                color="info"
                @click="dialog = false;scheduleValidate;"
              >
                予定を更新
              </v-btn>
            </span>
          </span>
          <span v-if="!this.dialogItems.edit">
            <span @click="registerSchedule" class="margin-left-10">
              <v-btn
                :disabled="!(this.valid)"
                depressed
                color="primary"
                @click="dialog = false;scheduleValidate;"
              >
                予定を登録
              </v-btn>
            </span>
          </span>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<style>
#date-title {
  margin-left: 60px;
}
.month-select {
  margin-right: 10px;
}
.sunday {
  color: red;
}
.date {
  vertical-align: top;
}
.schedule-title {
  color: black;
  background-color: aqua;
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  margin: 5px;
}
.margin-left-10 {
  margin-left: 10px;
}
th {
    border: 1px solid #ddd;
    padding: 30px;
    text-align: center;
}
td {
    border: 1px solid #ddd;
    padding: 30px;
    text-align: center;
}
</style>

<script>
import getSchedulesGql from '~/apollo/queries/getSchedules.gql'
import createSchedule from '~/apollo/mutations/createSchedule.gql'
import deleteSchedule from '~/apollo/mutations/deleteSchedule.gql'

export default {
  data () {
    return {
      weeks: [
        { id: 0, value: 'SUNDAY' },
        { id: 1, value: 'MONDAY' },
        { id: 2, value: 'TUESDAY' },
        { id: 3, value: 'WEDNESDAY' },
        { id: 4, value: 'THURSDAY' },
        { id: 5, value: 'FRIDAY' },
        { id: 6, value: 'SATURDAY' }
      ],
      startDay: new Date(this.date().getFullYear(), this.date().getMonth(), 1).getDay(),
      startDate: new Date(this.date().getFullYear(), this.date().getMonth(), 1),
      currentMonth: this.date().getMonth(),
      currentYear: this.date().getFullYear(),
      lastMonthEndDate: new Date(this.date().getFullYear(), this.date().getMonth(), 0).getDate(),
      dialog: false,
      dialogItems: {
        id: 0,
        header_title: '',
        title: '',
        titleRules: [
          v => !!v || 'タイトルは必須項目です。'
        ],
        memo: '',
        content: '',
        start_at: '',
        startAtRules: [
          v => !!v || '開始時間は必須項目です。'
        ],
        end_at: '',
        day: '',
        year: '',
        month: '',
        edit: false
      },
      // 予定登録直後に表示させるためのdata
      justRegisteredDates: [],
      valid: false
    }
  },
  computed: {
    dateTitle () {
      // jsのgetMonthが0-11なので1加算
      const month = this.currentMonth + 1
      const result = this.currentYear + '年' + month + '月'
      return result
    },
    calendars () {
      return this.renderCalendar()
    },
    createSuccess () {
      return this.$route.query.createSuccess === 'true'
    },
    loginSuccess () {
      return this.$route.query.loginSuccess === 'true'
    },
    logoutSuccess () {
      return this.$route.query.logoutSuccess === 'true'
    }
  },
  methods: {
    scheduleValidate () {
      this.$refs.form.validate()
    },
    prevMonth () {
      this.currentMonth === 0 ? this.currentMonth = 11 : this.currentMonth--
      this.currentMonth === 11 && this.currentYear--
      this.lastMonthEndDate = new Date(this.currentYear, this.currentMonth, 0).getDate()
      const dt = new Date(this.currentYear, this.currentMonth, 1)
      this.startDay = dt.getDay()
      this.lastMonthEndDate = new Date(dt.getFullYear(), dt.getMonth(), 0).getDate()
    },
    nextMonth () {
      this.currentMonth === 11 ? this.currentMonth = 0 : this.currentMonth++
      this.currentMonth === 0 && this.currentYear++
      this.lastMonthEndDate = new Date(this.currentYear, this.currentMonth, 0).getDate()
      const dt = new Date(this.currentYear, this.currentMonth, 1)
      this.startDay = dt.getDay()
      this.lastMonthEndDate = new Date(dt.getFullYear(), dt.getMonth(), 0).getDate()
    },
    date () {
      return new Date()
    },
    year () {
      return this.date().getFullYear()
    },
    month () {
      return this.date().getMonth()
    },
    endDate () {
      return new Date(this.year(), this.month(), 0)
    },
    endDayCount () {
      return this.endDate().getDay()
    },
    getScheduleData (year, month, date) {
      // 登録したスケジュールの中から該当の日時のデータを返すメソッド
      const currentDate = String(year) + '-' + String(('0' + month).slice(-2)) + '-' + String('0' + Number(date)).slice(-2)
      const regexp = new RegExp('^' + currentDate)
      const matchDates = this.schedules.filter(schedule => schedule.start_at.match(regexp))
      let data = matchDates.map(date => date.title)
      const justRegisterdMatchDates = this.justRegisteredDates.filter(schedule => schedule.start_at.match(regexp))
      data = Object.assign(matchDates, justRegisterdMatchDates)
      return data
    },
    // 表示するカレンダーの行数を判定するメソッド
    // startDayは日曜を0として「0-6」の曜日を指定
    weekCount (startDay, month) {
      const bigMoon = [1, 3, 5, 7, 8, 10, 12]
      // 一旦2月は28日前提
      // TODO dataのcurrentYearを元にうるう年判定
      const lastDate = bigMoon.indexOf(month) ? 31 : month === 2 ? 28 : 30
      const weekCount = Math.ceil((startDay + lastDate + 1) / 7)
      return weekCount
    },
    editSchedule (data) {
      this.dialogItems.id = data.id
      this.dialogItems.title = data.title
      this.dialogItems.content = data.content
      // DBから取り出した文字列に'Z'がつくとUTCになってしまうので削除。他にやり方あるきもするけどとりあえず。
      const startAt = data.start_at ? new Date(data.start_at.replace(/Z/g, '')) : new Date()
      this.dialogItems.start_at = ('0' + startAt.getHours()).slice(-2) + ':' + ('0' + startAt.getMinutes()).slice(-2)
      const endAt = data.end_at ? new Date(data.end_at.replace(/Z/g, '')) : new Date()
      this.dialogItems.end_at = ('0' + endAt.getHours()).slice(-2) + ':' + ('0' + endAt.getMinutes()).slice(-2)
      this.dialogItems.edit = true
    },
    clearDialog () {
      this.dialogItems.title = 'タイトルを入力してください'
      this.dialogItems.content = ''
      this.dialogItems.memo = ''
      this.dialogItems.start_at = '00:00'
      this.dialogItems.end_at = ''
      this.dialogItems.edit = false
    },
    renderCalendar () {
      const dt = new Date(this.currentYear, this.currentMonth, 1)
      this.startDate = dt
      const startDay = this.startDay
      const currentDate = this.startDate
      const lastMonthEndDate = this.lastMonthEndDate
      const calendars = []
      let lastDateCount = startDay - 1

      const weekCount = this.weekCount(startDay, this.currentMonth + 1)

      for (let i = 0; i < weekCount; i++) {
        const weekRow = []
        for (let day = 0; day < 7; day++) {
          if (i > 0 || (i === 0 && day >= startDay)) {
            const date = currentDate.getDate()
            // 翌月の範囲かどうか判定
            const month = (i > 0 && date < 7) ? this.currentMonth + 2 : this.currentMonth + 1
            const year = this.currentYear

            weekRow.push({
              date,
              schedule_data: this.getScheduleData(year, month, currentDate.getDate()),
              month,
              year
            })
            currentDate.setDate(currentDate.getDate() + 1)
          } else {
            const date = lastMonthEndDate - lastDateCount
            const month = this.currentMonth === 0 ? 12 : this.currentMonth
            const year = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
            weekRow.push({
              // 曜日を使ってつじつま合わせ
              date,
              schedule_data: this.getScheduleData(year, month, date),
              month,
              year
            })
            lastDateCount--
          }
        }
        calendars.push(weekRow)
      }
      return calendars
    },
    registerSchedule () {
      const year = this.dialogItems.year
      const month = this.dialogItems.month
      const startAt = year + '-' + String(('0' + month).slice(-2)) + '-' + String(('0' + this.dialogItems.day).slice(-2)) + ' ' + this.dialogItems.start_at
      const endAt = year + '-' + String(('0' + month).slice(-2)) + '-' + String(('0' + this.dialogItems.day).slice(-2)) + ' ' + this.dialogItems.end_at
      const currentUserId = this.$store.getters.userId

      this.$apollo.mutate({
        mutation: createSchedule,
        variables: {
          title: this.dialogItems.title,
          content: this.dialogItems.content,
          memo: this.dialogItems.memo,
          start_at: startAt,
          end_at: endAt,
          userId: currentUserId
        }
      })

      const registerdDate = {
        title: this.dialogItems.title,
        content: this.dialogItems.content,
        memo: this.dialogItems.memo,
        start_at: startAt,
        end_at: endAt
      }
      this.justRegisteredDates.push(registerdDate)
      this.startDate = new Date(year, month, 1)
    },
    deleteSchedule (ID) {
      this.$apollo.mutate({
        mutation: deleteSchedule,
        variables: {
          scheduleId: ID
        }
      })
      this.schedules = this.schedules.filter(schedule => schedule.id !== ID)
      this.justRegisteredDates = this.justRegisteredDates.filter(date => date.id !== ID)
    }
  },
  apollo: {
    schedules: {
      prefetch: true,
      query: getSchedulesGql,
      variables () {
        return { userId: this.$store.getters.userId }
      }
    }
  }
}
</script>
