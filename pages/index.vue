<template>
  <div>
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
              dialogItems.month = day.month;">
              <div class="date">{{ day.date }}</div>
              <span v-for="(schedule_title, index) in day.schedule_titles" :key="index">
                <div class="schedule-title">{{ schedule_title }}</div>
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
      <v-card>
        <v-card-title>{{ dialogItems.header_title }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="タイトル" v-model="dialogItems.title"></v-text-field>
                <v-text-field label="内容" v-model="dialogItems.content"></v-text-field>
                <v-text-field label="メモ" v-model="dialogItems.memo"></v-text-field>
                <strong>開始時間</strong>
                <v-text-field type="time" name="time" v-model="dialogItems.start_at"></v-text-field>
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
            Close
          </v-btn>
          <span @click="registerSchedule" id="schedule-register-btn">
            <v-btn
              depressed
              color="primary"
              @click="dialog = false;"
            >
              Save
            </v-btn>
          </span>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
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
#schedule-register-btn {
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
/* eslint-disable */
import getSchedulesGql from '~/apollo/queries/getSchedules.gql'
import createSchedule from '~/apollo/mutations/createSchedule.gql'

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
        header_title: '',
        title: '',
        content: '',
        start_at: '',
        end_at: '',
        day: '',
        year: '',
        month: ''
      },
      // 予定登録直後に表示させるためのdata
      justRegisteredDates: []
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
    }
  },
  methods: {
    prevMonth () {
      this.currentMonth === 0 ? this.currentMonth = 11 : this.currentMonth--
      this.currentMonth === 11 && this.currentYear--
      this.lastMonthEndDate = new Date(this.currentYear, this.currentMonth, 0).getDate()
      const dt = new Date(this.currentYear, this.currentMonth, 1)
      this.startDate = dt
      this.startDay = dt.getDay()
      this.lastMonthEndDate = new Date(dt.getFullYear(), dt.getMonth(), 0).getDate()
    },
    nextMonth () {
      this.currentMonth === 11 ? this.currentMonth = 0 : this.currentMonth++
      this.currentMonth === 0 && this.currentYear++
      this.lastMonthEndDate = new Date(this.currentYear, this.currentMonth, 0).getDate()
      const dt = new Date(this.currentYear, this.currentMonth, 1)
      this.startDate = dt
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
    getScheduleTitle (year, month, date) {
      // 登録したスケジュールの中から該当の日時のタイトルの配列を返すメソッド
      const currentDate = String(year) + '-' + String(('0' + month).slice(-2)) + '-' + String('0' + Number(date)).slice(-2)
      const regexp = new RegExp('^' + currentDate)
      const matchDates = this.schedules.filter(schedule => schedule.start_at.match(regexp))
      let titles = matchDates.map(date => date.title)
      // 登録直後の予定をカレンダーに表示させる
      const justRegisterdMatchDates = this.justRegisteredDates.filter(schedule => schedule.start_at.match(regexp))
      const justRegisteredTitles = justRegisterdMatchDates.map(date => date.title)
      titles = titles.concat(justRegisteredTitles)
      return titles
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
    renderCalendar () {
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
              schedule_titles: this.getScheduleTitle(year, month, currentDate.getDate()),
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
              schedule_titles: this.getScheduleTitle(year, month, date),
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

      this.$apollo.mutate({
        mutation: createSchedule,
        variables: {
          title: this.dialogItems.title,
          content: this.dialogItems.content,
          memo: this.dialogItems.memo,
          start_at: startAt,
          end_at: endAt
        }
      })

      const registerdDate = { title: this.dialogItems.title, start_at: startAt }
      this.justRegisteredDates.push(registerdDate)
      this.startDate = new Date(year, month, 1)
    }
  },
  apollo: {
    schedules: {
      prefetch: true,
      query: getSchedulesGql
    }
  },
  components: {
  }
}
</script>
