<template>
  <div>
    <v-row justify="center" align="center">
      <h2>{{ currentDate }}</h2>
    </v-row>
    <br />
    <v-row justify="center" align="center">
      <table>
        <thead>
          <tr>
            <th v-for="week in weeks" v-bind:key="week.id">{{ week.value }}</th>
          </tr>
          <tr v-for="(week, index) in calendars" :key="index">
            <td v-for="(day, index) in week" :key="index">
              {{ day.date }}
            </td>
          </tr>
        </thead>
      </table>
    </v-row>
  </div>
</template>

<script>
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
      ]
    }
  },
  computed: {
    currentDate () {
      const dt = new Date();
      // jsのgetMonthが0-11なので1加算
      const month = dt.getMonth() + 1
      const result = this.year() + '年' + month + '月'
      return result
    },
    calendars () {
      return this.renderCalendar()
    }
  },
  methods: {
    date () {
      return new Date()
    },
    year () {
      return this.date().getFullYear()
    },
    month () {
      return this.date().getMonth()
    },
    endDayCount () {
      return this.endDate().getDay()
    },
    startDay () {
      return this.startDate().getDay()
    },
    startDate () {
      return new Date(this.date().getFullYear(), this.date().getMonth(), 1)
    },
    endDate () {
      return new Date(this.year(), this.month(), 0)
    },
    lastMonthEndDate () {
      const dt = this.date()
      return new Date(dt.getFullYear(), dt.getMonth(), 0).getDate()
    },
    renderCalendar () {
      let startDate = this.startDate()
      let startDay = this.startDay()
      let currentDate = startDate
      const lastMonthEndDate = this.lastMonthEndDate()

      const calendars = []

      for(let i = 0; i < 5; i++){
        let weekRow = []
        for (let day = 0; day < 7; day++) {
          if (i > 0 || (i === 0 && day >= startDay)) {
            weekRow.push({
              date: currentDate.getDate()
            })
            currentDate.setDate(currentDate.getDate() + 1)
          } else {
            weekRow.push({
              // 曜日を使ってつじつま合わせ
              date: lastMonthEndDate - (-day + 1)
            })
          }
        }
        calendars.push(weekRow)
      }
      return calendars
    }
  },
  components: {
  }
}
</script>
