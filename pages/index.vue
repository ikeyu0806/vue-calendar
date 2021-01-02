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
              dialogItems.day = day.date">
              {{ day.date }}
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
          <span @click="registerSchedule"><v-btn
            depressed
            color="primary"
            @click="dialog = false;"
          >
            Save
          </v-btn></span>
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
/* eslint-disable */
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
        day: ''
      },
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
    renderCalendar () {
      const startDay = this.startDay
      const currentDate = this.startDate
      const lastMonthEndDate = this.lastMonthEndDate
      const calendars = []
      let lastDateCount = startDay - 1

      for (let i = 0; i < 5; i++) {
        const weekRow = []
        for (let day = 0; day < 7; day++) {
          if (i > 0 || (i === 0 && day >= startDay)) {
            weekRow.push({
              date: currentDate.getDate()
            })
            currentDate.setDate(currentDate.getDate() + 1)
          } else {
            weekRow.push({
              // 曜日を使ってつじつま合わせ
              date: lastMonthEndDate - lastDateCount
            })
            lastDateCount--
          }
        }
        calendars.push(weekRow)
      }
      return calendars
    },
    registerSchedule () {
      const start_at = this.currentYear + "-0" + (this.currentMonth + 1) + "-" + this.dialogItems.day + " " + this.dialogItems.start_at
      const end_at = this.currentYear + "-0" + (this.currentMonth + 1) + "-" + this.dialogItems.day + " " + this.dialogItems.end_at

      this.$apollo.mutate({
        mutation: createSchedule,
        variables: {
          title: this.dialogItems.title,
          content: this.dialogItems.content,
          memo: this.dialogItems.memo,
          start_at: start_at,
          end_at: end_at
        }
      })
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
