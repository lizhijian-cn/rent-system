<template>
  <div class="app-container">
    <el-row type="flex" justify="center">
      <el-col :span="14">
        <el-card style="margin-top: 120px;">
          <div slot="header" align="center"><h3>主页</h3></div>
          <el-form class="form-container" :model="loginForm" :rules="loginRules" label-position="left" label-width="40px" style="width: 400px; margin-top: 10px;">
            <el-form-item>
              <span style="font-size: 18px;">这里是菜菜鸡青年租房管理系统</span>
            </el-form-item>
            <el-form-item>
              <span style="font-size: 18px;">主要功能有：</span>
            </el-form-item>
            <el-form-item>
              <span style="font-size: 18px;">blablabla...</span>
            </el-form-item>
          </el-form>          
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>