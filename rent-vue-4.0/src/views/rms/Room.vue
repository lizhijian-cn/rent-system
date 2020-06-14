<template>
  <div class="app-container">
    <!-- <div class="filter-container">
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
    </div> -->
    <el-card style="margin-top: 10px; margin-left: 30px; margin-bottom: 20px; border-radius: 2px; width: 500px;" >
      <div class="filter-container" >
        <span class="filter-item">房间类型</span>
        <el-radio-group class="filter-item" v-model="listQuery.type" @change="handleFilter">
          <el-radio :label="1" style="margin-left: 20px;">单人间</el-radio>
          <el-radio :label="2">双人间</el-radio>
          <el-radio :label="4">四人间</el-radio>
          <el-radio :label="undefined">全部</el-radio>
        </el-radio-group>      
      </div>
      <div class="filter-container">
        <span class="filter-item">特殊服务</span>
        <el-checkbox-group class="filter-item" v-model="listQuery.checkList" @change="handleFilter">
          <el-checkbox :label="0" style="margin-left: 20px;">独立阳台</el-checkbox>
          <el-checkbox :label="1">独卫</el-checkbox>
          <el-checkbox :label="2">洗衣机</el-checkbox>
        </el-checkbox-group>
      </div> 
      <div v-if="!tenant">
        <div class="filter-container">
          <span class="filter-item">房屋状态</span>
          <el-radio-group class="filter-item" v-model="listQuery.status" @change="handleFilter">
            <el-radio :label="1" style="margin-left: 20px;">未满</el-radio>
            <el-radio :label="2">已满</el-radio>
            <el-radio :label="3">维修中</el-radio>
            <el-radio :label="undefined">全部</el-radio>
          </el-radio-group>      
        </div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加房源
        </el-button>
      </div>
    </el-card>

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
          <el-button v-if="!tenant" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="!tenant" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="roomFormVisible">
      <el-form class="form-container" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="temp.roomNumber" placeholder="请输入"/>
        </el-form-item>

        <el-form-item label="房间类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="附加服务">
          <el-checkbox-group v-model="temp.checkList">
            <el-checkbox :label="0">空调</el-checkbox>
            <el-checkbox :label="1">独卫</el-checkbox>
            <el-checkbox :label="2">洗衣机</el-checkbox>
          </el-checkbox-group>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="roomUpdateVisible">
      <el-form class="form-container" ref="roomForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item label="房间号" prop="roomNumber">
          <span>{{ temp.roomNumber }}</span>
        </el-form-item>

        <el-form-item label="房间类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
        <el-button @click="roomUpdateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="申请租赁" :visible.sync="applyFormVisible">
      <el-form class="form-container" v-model="temp" label-position="left" label-width="90px" style="width: 310px; margin-left:50px;">
        
        <el-form-item label="用户名">
          <span v-if="tenant">{{ temp.username }}</span>
          <el-input v-else v-model="temp.username" placeholder="请输入用户名"/>
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
          <el-form-item label="租房天数: ">
            <el-input v-model="temp.time" placeholder="请输入天数"/>
          </el-form-item>
          <el-form-item label="总价: ">
            <span>￥{{ cost }}</span>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="租房月数: ">
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
  name: 'RoomList',
  components: { Pagination },
  // directives: { waves },
  computed: {
    userId() {
      return sessionStorage.getItem('userId')
    },
    cost() {
      if (this.temp.rentType === 'shortRent') return this.curRoom.rent * this.temp.time 
      else return this.curRoom.rent * this.temp.time * 15
    }
  },
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
        type: "",
        status: "",
        checkList: [],
        sort: '+id'
      },
      hash: {
        type: {
          1: '单人间',
          2: '双人间',
          4: '四人间'
        },
        status: {
          1: '未满',
          2: '已满',
          3: '维修中'
        },
        checkList: {
          0: '独立阳台',
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
        }
      ],
      temp: '',
      roomFormVisible: false,
      roomUpdateVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
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
      if (this.tenant) this.listQuery.status = 1
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
    handleCreate() {
      this.temp = {
        roomNumber: '1001',
        type: 1,
        checkList: [0]
      }
      this.dialogStatus = 'create'
      this.roomFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['roomForm'].clearValidate()
      // })
    },
    createData() {
      this.postRequest('/room/add', this.temp).then(() => {
        this.roomFormVisible = false
        this.handleFilter()
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.roomUpdateVisible = true
    },
    updateData() {
      this.postRequest('/room/update', this.temp).then(() => {
        this.roomUpdateVisible = false
        this.handleFilter()
        this.$notify({
          title: 'Success',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
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
    handleApply(row) {
      const username = this.tenant ? sessionStorage.getItem('username') : ''
      this.curRoom = row
      this.temp = {
        username,
        roomId: this.curRoom.id,
        rentType: 'shortRent',
        time: 0,
        startDay: ''
      }
      this.applyFormVisible = true
    },
    createApply() {
      this.postRequest('/apply/add', this.temp).then(() => {
        this.applyFormVisible = false
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
