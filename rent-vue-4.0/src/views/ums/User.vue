<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="账户类型" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.role === 'ROLE_TENANT'">租客</el-tag>
          <el-tag v-else>客服</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="用户名" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.activated">已激活</el-tag>
          <el-tag v-else>未激活</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetails(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    components: { Pagination },
    data() {
      return {
        tenant: sessionStorage.getItem('role') === 'ROLE_TENANT',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.getRequest('/user/list', {}).then(resp => {
          this.list = resp.items
          this.total = resp.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      handleDetails(row) {
        this.$router.push({
          path: '/ums/userinfo',
          query: {
            id: row.id
          }
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>