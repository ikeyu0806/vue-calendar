<template>
  <v-row justify="center" align="center">
    <table>
      <thead>
        <tr>
          <th v-for="week in weeks" v-bind:key="week.id">{{ week.value }}</th>
        </tr>
        <tr v-for="n of 6" v-bind:key="n">
          <td v-for="n of 7" v-bind:key="n">{{ startDay }}</td>
        </tr>
      </thead>
    </table>
  </v-row>
</template>

<script>

export default {
  data () {
    return {
      weeks: [
        { id: 1, value: '月' },
        { id: 2, value: '火' },
        { id: 3, value: '水' },
        { id: 4, value: '木' },
        { id: 5, value: '金' },
        { id: 6, value: '土' },
        { id: 7, value: '日' }
      ]
    }
  },
  computed: {
    date () {
      return new Date()
    },
    year () {
      return this.date.getFullYear()
    },
    month () {
      return this.date.getMonth()
    },
    startDate () {
      return new Date(this.year, this.month - 1, 1)
    },
    endDate () {
      return new Date(this.year, this.month, 0)
    },
    endDayCount () {
      return this.endDate.getDay()
    },
    startDay () {
      return this.startDate.getDay()
    }
  },
  components: {
  }
}
</script>
