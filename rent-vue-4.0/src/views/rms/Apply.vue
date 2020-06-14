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
      <el-table-column label="类型" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.rentType === 'shortRent'">短租</el-tag>
          <el-tag v-else>长租</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="用户名" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column label="房间号" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roomNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.passed">已通过</el-tag>
          <el-tag v-else>未通过</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="费用" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
        </template>        
      </el-table-column>

      <el-table-column label="缴费状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.payed">已支付</el-tag>
          <el-tag v-else>未支付</el-tag>
        </template>
      </el-table-column>     
      
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{row,$index}">
          <el-button v-if="!tenant" type="primary" size="mini" :disabled="row.passed" @click="pass(row)">
            通过
          </el-button>
          <div v-else>
            <el-button type="primary" size="mini" :disabled="!row.passed || row.payed" @click="pay(row)">
              付款
            </el-button>
            <el-button :disabled="!(row.passed && row.payed && row.rentType === 'longRent')" size="mini" type="danger" @click="print(row,$index)">
              打印
            </el-button>
          </div>
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
        limit: 20,
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.getRequest('/apply/list', this.listQuery).then(resp => {
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
    pass(row) {
      this.postRequest('/apply/pass', { id: row.id }).then(resp => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: '通过成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    pay(row) {
      this.postRequest('/apply/pay', { id: row.id, cost: row.cost }).then(resp => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: '付款成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>