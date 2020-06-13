<template>
  <div class="app-container">
    <el-form class="form-container" ref="ticketForm" v-model="ticketForm" :rules="ticketFormRules">

      <el-form-item>
        <el-switch v-model="applyRepaire" active-text="  申请维修" inactive-text="投诉  " style="margin-left: 15px;">
        </el-switch>
        <el-button v-loading="loading" style="margin-left: 30px;" type="success" @click="submitForm">
          提交
        </el-button>
      </el-form-item>

      <el-form-item style="margin-bottom: 40px;" label-width="70px" label="标题:">
        <el-input v-model="ticketForm.title" :rows="1" type="textarea" class="article-textarea" autosize
          placeholder="Please enter the title" />
        <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
      </el-form-item>

      <el-form-item prop="content" style="margin-bottom: 30px;">
        <Tinymce ref="editor" v-model="ticketForm.content" :height="400" />
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  // import Sticky from '@/components/Sticky' // 粘性header组件
  import Tinymce from '@/components/Tinymce'

  export default {
    components: {
      Tinymce
    },
    data() {
      return {
        applyRepaire: false,
        loading: false,
        ticketForm: {
          title: 'This is title',
          content: '<p>This is content.</p>'
        },
        ticketFormRules: {

        }
      }
    },
    computed: {
      contentShortLength() {
        return this.ticketForm.title.length
      }
    },
    methods: {
      submitForm() {
        this.loading = true
        const form = {
          userId: sessionStorage.getItem('userId'),
          applyRepaire: this.applyRepaire,
          ...this.ticketForm
        }
        this.postRequest('/ticket/add', form).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Submit Successfully',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        })
      }
    }
  }
</script>