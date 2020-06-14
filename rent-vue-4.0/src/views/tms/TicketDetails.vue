<template>
  <div class="app-container">
    <h3>{{ ticket.title }}</h3>
    <el-divider/>
    <aside v-html="ticket.content"/>
    <el-divider/>
    <h3 style="margin-top: 50px;">回复</h3>
    <aside v-if="ticket.replied">{{ ticket.reply }}</aside>
    <aside v-else>暂无回复</aside>
  </div>
</template>

<script>
  export default {
    computed: {
      id() {
        return JSON.parse(sessionStorage.getItem('UserinfoqueryId'))
      }
    },
    data() {
      return {
        ticket: ''
      }
    },
    methods: {
      getTicket() {
        this.getRequest('/ticket', {id: this.id }).then(resp => {
          this.ticket = resp
        })
      }
    },
    created() {
      sessionStorage.setItem('UserinfoqueryId', this.$route.query.id)
      this.getTicket()
    }
  }
</script>