<template>
  <div class="app-container">
    <h2>{{ info.role === 'ROLE_TENANT' ? '租客' : '客服' }}信息</h2>
    <!-- <h2>租客信息</h2> -->
    <el-divider/>
      <el-row type="flex" justify="space-around">
        <el-col :span="8">  
          <el-card style="background: #f5f5f7;">
            <div slot="header">
              <span>个人信息</span>
              <el-button v-if="info.role === 'ROLE_TENANT'" style="float: right; padding: 3px;" type="text" @click="handleChangePassword">修改密码</el-button>
              <el-button v-if="info.role === 'ROLE_TENANT'" style="float: right; padding: 3px;" type="text" @click="handleTopUp">充值</el-button>
            </div>
            <el-form class="form-container" label-position="left" label-width="60px" style="margin-left:10px;">
              <el-form-item label="用户名">
                <span>{{ info.username }}</span>
              </el-form-item>
              <el-form-item v-if="info.role === 'ROLE_TENANT'"class="filter-container" label="余额">
                <span>￥{{ info.balance }}</span>
              </el-form-item>
              <el-form-item class="filter-container" label="邮箱">
                <div class="filter-item">{{ info.email }}</div>
                <el-button v-if="info.activated" type="success" icon="el-icon-check" circle style="margin-left: 10px;" size="small"></el-button>
                <el-button v-else class="filter-item" type="primary" style="margin-left: 20px;" @click="activateEmail" size="mini">点我激活</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="10">
          <el-card>
            <div slot="header">
              <span>其他信息</span>
              <el-button style="float: right; padding: 3px;" type="text" @click="handleChangeUserinfo">修改信息</el-button>
            </div>
            <el-form class="form-container" label-position="left" label-width="60px" style="width: 300px; margin-left:10px;">
              <el-form-item label="姓名">
                <span>{{ info.name }}</span>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ info.address }}</span>
              </el-form-item>
              <el-form-item label="电话">
                <span>{{ info.telephone }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog title="充值" :visible.sync="TopUpVisible">
        <el-form class="form-container" v-model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          
          <el-form-item label="充值金额">
            <el-input v-model="temp.cost"/>
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="temp.password" placeholder="请输入密码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="TopUpVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="TopUp()">
            确认
          </el-button>
        </div>
      </el-dialog>
      
      <el-dialog title="修改密码" :visible.sync="changePasswordVisible">
        <el-form class="form-container" v-model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          
          <el-form-item label="原密码">
            <el-input v-model="temp.oldPassword" placeholder="请输入原密码"/>
          </el-form-item>

          <el-form-item label="新密码">
            <el-input v-model="temp.password" placeholder="请输入新密码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changePasswordVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="changePassword()">
            确认
          </el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改个人信息" :visible.sync="changeUserinfoVisible">
        <el-form class="form-container" v-model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          
          <el-form-item label="用户名">
            <el-input v-model="temp.username"/>
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="temp.email"/>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="temp.name"/>
          </el-form-item>

          <el-form-item label="地址">
            <el-input v-model="temp.address"/>
          </el-form-item>

          <el-form-item label="电话">
            <el-input v-model="temp.telephone"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changePasswordVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="changeUserinfo()">
            确认
          </el-button>
        </div>
      </el-dialog>
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
        info: '',
        TopUpVisible: false,
        changePasswordVisible: false,
        changeUserinfoVisible: false,
        temp: ''
      }
    },

    methods: {
      getUserinfo() {
        this.getRequest('/user', { id: this.id }).then(resp => {
          if (resp) {
            this.info = resp
          }
        })
      },
      activateEmail() {
        // $TODO
      },
      handleTopUp() {
        this.temp = {
          cost: 1000,
          password: ''
        }
        this.TopUpVisible = true
      },
      TopUp() {
        this.postRequest('/user/balance/update', { id: this.id, ...this.temp }).then(() => {
          this.TopUpVisible = false
          this.getUserinfo()
          this.$notify({
            titie: 'Success',
            message: '充值成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleChangePassword() {
        this.temp = {
          oldPassword: '',
          password: ''
        }
        this.changePasswordVisible = true
      },
      changePassword() {
        this.postRequest('/user/password/update', { id: this.id, ...this.temp }).then(() => {
          this.changePasswordVisible = false
          this.$notify({
            titie: 'Success',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleChangeUserinfo() {
        this.temp = Object.assign({}, this.info)
        this.changeUserinfoVisible = true
      },
      changeUserinfo() {
        this.postRequest('/user/update', { id: this.id, ...this.temp }).then(() => {
          this.changeUserinfoVisible = false
          this.getUserinfo()
          this.$notify({
            titie: 'Success',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    created() {
      sessionStorage.setItem('UserinfoqueryId', this.$route.query.id)
      this.getUserinfo()
    }
  }
</script>