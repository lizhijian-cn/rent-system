<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select class="filter-item" v-model="listQuery.type" placeholder="房间人数" :clearable = "true" style="width: 120px" @change="handleFilter">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>

      <el-select class="filter-item" v-model="listQuery.status" placeholder="房间状态" :clearable = "true" style="width:120px; margin-left:15px;" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>

      <el-select class="filter-item" v-model="listQuery.sort" style="width: 140px; margin-left: 15px;" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>
    <div class="filter-container">
      <el-checkbox-group class="filter-item" v-model="listQuery.checkList" @change="handleFilter">
        <el-checkbox :label="0">空调</el-checkbox>
        <el-checkbox :label="1">独卫</el-checkbox>
        <el-checkbox :label="2">洗衣机</el-checkbox>
      </el-checkbox-group>
    </div>

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

      <el-table-column label="房间号" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roomNumber }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="房间类型" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ hash.type[row.type] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="租金/天" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.rent }}</span>
        </template>
      </el-table-column>

      <el-table-column label="附加服务" min-width="180px" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="item in row.checkList" :key="item">{{ hash.checkList[item] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="剩余床位" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type - row.lived }}</span>
        </template>
      </el-table-column>

      <el-table-column label="房间状态" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ hash.status[row.status] }}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleApply(row)">
            申请租房
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="roomFormVisible">
      <el-form class="form-container" ref="roomForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="temp.roomNumber" placeholder="请输入"/>
        </el-form-item>

        <el-form-item label="房间类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="租金" prop="rent">
          <el-input v-model="temp.rent" placeholder="请输入"/>
        </el-form-item>

        <el-form-item label="附加服务">
          <el-checkbox-group v-model="temp.checkList">
            <el-checkbox :label="0">空调</el-checkbox>
            <el-checkbox :label="1">独卫</el-checkbox>
            <el-checkbox :label="2">洗衣机</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="已住人数">
          <el-input v-model="temp.lived"/>
        </el-form-item>

        <el-form-item label="需要维修">
          <el-switch v-model="temp.repaired"/>
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roomFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="申请租赁" :visible.sync="applyFormVisible">
      <el-form class="form-container" ref="applyForm" v-model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入用户名"/>
        </el-form-item>

        <el-form-item label="房间号">
          <span>{{ curRoom.roomNumber }}</span>
        </el-form-item>

        <el-form-item label="租赁方式">
          <el-radio v-model="temp.rentType" label="shortRent">短租</el-radio>
          <el-radio v-model="temp.rentType" label="longRent">长租</el-radio>
        </el-form-item>

        <el-form-item label="起始日期">
          <el-date-picker
            v-model="temp.startDay"
            type="date"
            placeholder="选择起始日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>

        <div v-if="temp.rentType=== 'shortRent'">
          <el-form-item label="租房时长: ">
            <el-input v-model="temp.time" placeholder="请输入天数"/>
          </el-form-item>
          <el-form-item label="总价: ">
            <span>￥{{ cost }}</span>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="租房时长: ">
            <el-input v-model="temp.time" placeholder="请选择月数"/>
          </el-form-item>
          <el-form-item label="每个月房租: ">
            <span>￥{{ cost }}</span>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createApply()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  // directives: { waves },
  computed: {
    userId() {
      return sessionStorage.getItem('userId')
    },
    username() {
      return sessionStorage.getItem('username')
    },
    cost() {
      if (!this.temp || !this.curRoom) return 0
      if (this.temp.rentType === 'shortRent') return this.curRoom.rent * this.temp.time 
      if (this.temp.rentType === 'longRent') return this.curRoom.rent * 20
      return 0
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: "",
        status: "",
        checkList: [],
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      hash: {
        type: {
          1: '单人间',
          2: '双人间',
          4: '四人间'
        },
        status: {
          0: '未满',
          1: '已满',
          2: '维修中'
        },
        checkList: {
          0: '空调',
          1: '独卫',
          2: '洗衣机'
        }
      },
      typeOptions: [
        {
          value: 1,
          label: '单人间'
        },
        {
          value: 2,
          label: '双人间'
        },
        {
          value: 4,
          label: '四人间'
        }],
      statusOptions: [
        {
          value: 0,
          label: '未满'
        },
        {
          value: 1,
          label: '已满'
        },
        {
          value: 2,
          label: '维修中'
        }],
      temp: '',
      roomFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false,

      applyFormVisible: false,
      curRoom: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.getRequest('/room/list', this.listQuery).then(response => {
        this.list = response.items
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetRoomTemp() {
      this.temp = {
        id: '',
        roomNumber: '1001',
        type: 1,
        rent: 10,
        checkList: [0],
        lived: 0,
        repaired: false
      }
    },
    handleCreate() {
      this.resetRoomTemp()
      this.dialogStatus = 'create'
      this.roomFormVisible = true
      this.$nextTick(() => {
        this.$refs['roomForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['roomForm'].validate((valid) => {
        if (valid) {
          this.postRequest('/room/add', this.temp).then(() => {
            this.roomFormVisible = false
            this.handleFilter()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.roomFormVisible = true
      this.$nextTick(() => {
        this.$refs['roomForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['roomForm'].validate((valid) => {
        if (valid) {
          this.postRequest('/room/update', this.temp).then(() => {
            this.roomFormVisible = false
            this.handleFilter()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.postRequest('/room/remove', { id: row.id }).then(() => {
        this.handleFilter()
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        
      })
    },
    resetApplyTemp() {
      this.temp = {
        userId: this.userId,
        rentType: 'shortRent',
        time: 0,
        startDay: '',
        cost: this.cost
      }
    },
    handleApply(row) {
      this.resetApplyTemp()
      this.applyFormVisible = true
      this.curRoom = row
      this.$nextTick(() => {
        this.$refs['applyForm'].clearValidate()
      })
    },
    createApply() {
      this.postRequest('/apply/add', this.temp)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
