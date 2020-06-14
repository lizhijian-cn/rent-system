<template>
  <div class="app-container">
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-card style="margin-top: 120px;">
          <div slot="header" align="center"><span>登录</span></div>
          <el-form class="form-container" :model="loginForm" :rules="loginRules" label-position="left" label-width="40px" style="width: 400px; margin-top: 10px;">
            <el-form-item prop="username">
              <el-input type="text" v-model="loginForm.username" autocomplete="on"/>
            </el-form-item>

            <el-tooltip v-model="capsToolTip" content="大写锁定已打开" placement="right" manual>
              <el-form-item prop="password">
                <el-input type="text" v-model="loginForm.password" autocomplete="on" 
                  @keyup.native="checkCapslock" 
                  @blur="capsToolTip = false"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
            </el-tooltip>

            <el-form-item>
              <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
              <el-button type="info" @click="registerDialogVisible = true">未注册？ 点击注册</el-button>
            </el-form-item>
            <div style="font-size: 14px; margin-bottom: 10px; margin-left: 40px;">
              <span>租客</span>
              <span style="margin-left: 16px;">username: tenant</span>
              <span style="margin-left: 16px;">password: 000000</span>
            </div>
            <div style="font-size: 14px; margin-bottom: 10px; margin-left: 40px;">
              <span>客服</span>
              <span style="margin-left: 16px;">username: staff</span>
              <span style="margin-left: 28px;">password: 000000</span>
            </div>
          </el-form>          
        </el-card>

      </el-col>
    </el-row>


    <el-dialog title="注册" :visible.sync="registerDialogVisible" width="38%">
      <el-form class="form-container" v-model="registerForm" :rules="registerRules" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item label="账户类型">
          <el-radio v-model="registerForm.role" label="ROLE_TENANT">租客</el-radio>
          <el-radio v-model="registerForm.role" label="ROLE_STAFF" style="margin-left: 20px;">客服</el-radio>
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
        <el-button type="primary" @click="handleRegister()">
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
          username: 'tenant',
          password: '000000',
        },
        loginRules: {
          // TODO
        },
        registerForm: {
          username: '',
          password: '',
          role: 'ROLE_TENANT',
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
        this.getRequest('/user/login', this.loginForm).then(resp => {
          if (resp) {
            sessionStorage.setItem('userId', resp.id)
            sessionStorage.setItem('username', resp.username)
            sessionStorage.setItem('role', resp.role)
            this.$router.push('/home')
          }
        })
      },
      handleRegister() {
        this.postRequest('/user/register', this.registerForm).then(resp => {
          if (resp) {
            this.registerDialogVisible = false
            this.$notify({
              title: 'auto login',
              message: '1秒后自动登录',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.loginForm.username = this.registerForm.username
              this.loginForm.password = this.registerForm.password
              this.handleLogin()
            }, 1500);
          }
        })
      }
    }
  }
</script>