<template>
  <div class="app-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" label-position="left" label-width="70px" style="width: 400px; margin-left:500px; margin-top: 150px;">
      <el-form-item>
        <h3>登录</h3>
      </el-form-item>

      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" autocomplete="on"/>
      </el-form-item>

      <el-form-item>
        <el-tooltip v-model="capsToolTip" content="大写锁定已打开" placement="right" manual>
          <el-form-item prop="password">
            <el-input type="text" v-model="loginForm.password" autocomplete="on" 
              @keyup.native="checkCapslock" 
              @blur="capsToolTip = false"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-tooltip>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleLogin">Login</el-button>
        <el-button type="info" @click="registerDialogVisible = true">未注册？ 点击注册</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="注册" :visible.sync="registerDialogVisible" width="38%">
      <el-form class="form-container" v-model="registerForm" :rules="registerRules" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item label="账户类型">
          <el-radio v-model="registerForm.role" label="1">租客</el-radio>
          <el-radio v-model="registerForm.role" label="2" style="margin-left: 20px;">客服</el-radio>
        </el-form-item>

        <el-form-item prop="username" label="用户名">
          <el-input type="text" v-model="registerForm.username" autocomplete="on"/>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input type="text" v-model="registerForm.password" autocomplete="on"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="registerDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="register()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addDynamicRoutes } from '@/utils/router'

  export default {
    data() {
      return {
        loginForm: {
          username: 'zhijian',
          password: '123456',
        },
        loginRules: {
          // TODO
        },
        registerForm: {
          username: '',
          password: '',
          role: '1',
        },
        registerRules: {
          // TODO
        },
        capsToolTip: false,
        registerDialogVisible: false,
      }
    },
    methods: {
      checkCapslock(e) {
        const { key } = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      },
      handleLogin() {
        this.postRequest('/account/login', this.loginForm).then(resp => {
          if (resp) {
            console.log(resp)
            sessionStorage.setItem('userId', resp.id)
            sessionStorage.setItem('username', resp.username)
            sessionStorage.setItem('role', resp.role)
            this.$router.push('/home')
          }
        })
      },
      handleRegister() {
        // $TODO: AUTO LOGIN
        // this.getRequest('/tenant', this.loginForm, { test: "test" }).then(resp => {
        //   console.log(resp)
        // })
      }
    }
  }
</script>