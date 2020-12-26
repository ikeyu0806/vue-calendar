<template>
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
    renderCalendar () {
      let startDate = this.startDate()
      let startDay = this.startDay()
      let currentDate = startDate
      const calendars = []
      for(let i = 0; i < 5; i++){
        let weekRow = []
        for (let day = 0; day < 7; day++) {
          console.log("startday", startDay)
          console.log("i", i)
          console.log("day", day)
          console.log("weekRow", weekRow)
          console.log("比較", day > startDay)
          console.log("currentDate", currentDate.getDate())
          console.log("currentDay", currentDate.getDay())
          if (i > 0 || (i === 0 && day >= startDay)) {
            weekRow.push({
              date: currentDate.getDate()
            })
            currentDate.setDate(currentDate.getDate() + 1)
          } else {
            weekRow.push({
              date: ''
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
