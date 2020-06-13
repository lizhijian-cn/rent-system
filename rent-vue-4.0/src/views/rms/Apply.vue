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
          <el-tag v-else>短租</el-tag>
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
          <el-tag v-if="row.passed">已支付</el-tag>
          <el-tag v-else>未支付</el-tag>
        </template>
      </el-table-column>     
      
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleApply(row)">
            通过
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            付款
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            打印
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableKey: 0,
        listLoading: false,
        list: [],
        total: 0,
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.getRequest('/apply/list').then(resp => {
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
      }
    },
    created() {
      this.getList()
    }
  }
</script>