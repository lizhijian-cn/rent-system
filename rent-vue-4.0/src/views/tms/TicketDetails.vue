<template>
  <div class="app-container">
    <h3>{{ ticket.title }}</h3>
    <el-divider/>
    <aside v-html="ticket.content"/>
    <el-divider/>
    <h3 style="margin-top: 50px;">回复</h3>
    <div v-if="tenant">
      <aside v-if="ticket.replied">{{ ticket.reply }}</aside>
      <aside v-else>暂无回复</aside>
    </div>
    <div v-else>
      <aside v-if="ticket.replied">{{ ticket.reply }}</aside>
      <el-input></el-input>
    </div>
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
        tenant: sessionStorage.getItem('role') === 'ROLE_TENANT',
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