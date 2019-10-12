<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10">
      <Col class="user-left" span="5">
        <div class="user-bg">
          <div class="ibox-title">
						<h5>选择部门</h5>
          </div>
          <Tree :data="treeData1"></Tree>
        </div>
      </Col>
      <Col class="user-right" span="19">
        <Card title="用户管理">
          <Row class="role-top">
            <div class="role-top-left">
              <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn">添加</Button>
              <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button>
            </div>
            <div class="role-top-right">
              <Input class="ipt" v-model="value" placeholder="请输入姓名" style="width: 200px"></Input>
              <Button  type="primary" icon="ios-search" :loading="uploadLoading" @click="searchFn">搜索</Button>
            </div>
          </Row>
          <Row>
            <div class="ivu-upload-list-file" v-if="file !== null">
              <Icon type="ios-stats"></Icon>
                {{ file.name }}
              <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
            </div>
          </Row>
          <Row>
            <transition name="fade">
              <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                <div v-if="progressPercent == 100">
                  <Icon type="ios-checkmark-circle"></Icon>
                  <span>成功</span>
                </div>
              </Progress>
            </transition>
          </Row>
        </Card>
        <Row class="margin-top-10">
          <!-- <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table> -->
          <div class="bank_table" style="position:relative;">
              <Table
                :columns="columnsList"
                :data="dataList"
                height="450"
                border
                ref="mainTable"
                stripe
                :loading="tableLoading"
                no-data-text
                @on-selection-change="selected"
              >
                <template slot-scope="{ row, index }" slot="action">
                  <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)">
                    <i></i>
                    <span>编辑</span>
                  </Button>
                  <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)">
                    <i></i>
                    <span>删除</span>
                  </Button>
                  <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)">
                    <i></i>
                    <span>重置密码</span>
                  </Button>
                </template>
              </Table>
              <div class="no-data" v-if="dataList.length < 1">
                <!-- <div class="no-data-img"></div> -->
                <div class="no-tit">暂无数据</div>
              </div>
            </div>
            <div class="pages">
              <Page
                :current="pageNum"
                :page-size="pageSize"
                :total="total"
                show-total
                show-elevator
                show-sizer
                @on-page-size-change="changePageSize"
                @on-change="pageChange"
              />
            </div>
        </Row>
      </Col>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="operationShow? '编辑用户': '新增用户'"  width="640" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="姓名:" prop="name">
					<Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
				</FormItem>
				<FormItem label="用户名:" prop="username">
					<Input v-model="formValidate.username" placeholder="请输入用户名"></Input>
				</FormItem>
        <FormItem label="密码:" prop="pwd">
					<Input type="password" v-model="formValidate.pwd" placeholder="请输入密码"></Input>
				</FormItem>
        <FormItem label="部门:" prop="dept">
					<Input class="dept-ipt" v-model="formValidate.dept" disabled placeholder="所属部门"></Input>
				</FormItem>
				<FormItem label="E-mail:" prop="email">
					<Input v-model="formValidate.email" placeholder="请输入E-mail"></Input>
				</FormItem>
        <FormItem label="状态:" prop="status">
					<RadioGroup v-model="formValidate.status">
            <Radio label="1">正常</Radio>
            <Radio label="0">禁用</Radio>
          </RadioGroup>
				</FormItem>
        <FormItem label="角色:" prop="roleIds">
          <CheckboxGroup v-model="formValidate.roleIds" @on-change="checkAllGroupChange">
              <Checkbox v-for="(item,index) in rolelistArr" :key="index" :label="item.roleId"><span>{{item.roleName}}</span></Checkbox>
          </CheckboxGroup>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="operationRole" type="primary">确定</Button>
			</div>
		</Modal>
    <Modal
				width="20"
				v-model="delModal"
				@on-ok="delRole"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除？</p>
		</Modal>
    <Modal
				width="20"
				v-model="delBatchModal"
				@on-ok="batchRemove"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除选中的数据？</p>
		</Modal>
  </div>
</template>
<script>
import { sysDeptTree, userList, roleList, menuTree, userSave, roleDetail, roleUpdate, roleremove, batchRemove } from '@/api/sys'
export default {
  name: 'role-name',
  data () {
    return {
      value: '',
      modal1: false,
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      checkedIds: [],
      checkedId: '',
      deptId: '',
      menuIdsArr: [],
      treeData1: [],
      ztreesData: [],
      formValidate: {
        name: '',
        username: '',
        pwd: '',
        dept: '',
        deptId: '',
        email: '',
        status: '',
        roleIds: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      roleName: '',
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'userId'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '操作',
          width: 200,
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      userIdCreate: '',
      roleSign: '',
      dataDel: [],
      addShow: false,
      sendContractBut: false,
      selectedList: [],
      contractInfo: '',
      delIndex: '',
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      rolelistArr: [],
      loading: false, // 分割线
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      tableData: [],
      tableTitle: [],
      tableLoading: false
    }
  },
  methods: {
    async getPageList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        name: this.value,
        deptId: this.deptId
      }
      let res = await userList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.dataList.forEach((item) => {
          item.status = item.status == 1 ? '正常' : '禁用'
        })
      }
    },
    async getRoleList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        roleName: this.value,
        roleSign: this.roleSign,
        userIdCreate: this.userIdCreate
      }
      let res = await roleList(data)
      if (res.data.code === 0) {
        this.rolelistArr = res.data.content.rows
      }
    },
    async roleDetail (id) {
      let res = await roleDetail(id)
      if (res.data.code === 0) {
        this.formValidate = {
          roleName: res.data.content.roleName,
          roleDesc: res.data.content.remark,
          roleSign: res.data.content.roleSign,
          power: ''
        }
        this.menuIds = res.data.content.menuIds
        if (this.menuIds && this.menuIds.length > 0) {
          this.forIds(this.menuIds)
        }
      }
    },
    forIds (arr) {
      let zTreeData = [...this.ztreesData]
      for (let i = 0; i < arr.length; i++) {
        this.parentFn(zTreeData, arr[i])
      }
      this.ztreesData = [...zTreeData]
    },
    parentFn (arr, roleId) {
      arr.forEach((item, index) => {
        if (item.id == roleId) {
          this.$set(item, 'checked', true)
        } else {
          if (item.children) {
            this.parentFn(item.children, roleId)
          }
        }
      })
    },
    checkAllGroupChange (data) {
      this.roleIds = data
    },
    async roleUpdate () {
      let data = {
        FLAG: 1,
        menuIds: menuIds,
        roleId: this.checkedId,
        remark: this.formValidate.roleDesc,
        roleName: this.formValidate.roleName,
        roleSign: this.formValidate.roleSign
      }
      let res = await roleUpdate(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '编辑成功'
        })
        this.checkedId = ''
        this.checkedIds = []
        this.formValidate = {
          roleName: '',
          roleDesc: '',
          roleSign: '',
          power: ''
        }
        this.getPageList()
      }
    },
    forArr1 (arr, num) { // 循环部门树形数据
      let data = []
      arr.forEach((value, index, array) => {
        let datav
        if (value.children) {
          datav = {
            id: value.id,
            parentId: value.parentId,
            title: value.text,
            checked: value.selected === 'true',
            expand: num < 1,
            children: this.forArr1(value.children, num + 1),
            hasParent: value.hasParent,
            hasChildren: value.hasChildren
          }
        } else {
          datav = {
            id: value.id,
            parentId: value.parentId,
            title: value.text,
            expand: true,
            hasParent: value.hasParent,
            hasChildren: value.hasChildren
          }
        }
        data.push(datav)
      })
      return data
    },
    // 循环树形结构，得到选中id
    forTreesIds (arr) {
      arr.forEach((item, index) => {
        if (item.checked == true) {
          this.checkedIds.push(item.id)
        }
        if (item.children) {
          this.forTreesIds(item.children)
        }
      })
    },
    // 循环树形结构，得到选中id
    forTrees () {
      this.ztreesData.forEach((item, index) => {
        if (item.checked == true) {
          this.checkedIds.push(item.id)
        }
        if (item.children) {
          item.children.forEach((value, index) => {
            if (value.checked == true) {
              this.checkedIds.push(value.id)
              // this.checkedIds.push(item.id)
              // value.children.forEach
            }
            if (value.children) {}
          })
        }
      })
      this.checkedIds = [...new Set(this.checkedIds)]
      this.formValidate.power = this.checkedIds.join(',')
    },
    //  菜单树结构
    async menuTree () {
      let res = await menuTree({})
      console.log(res.data)
      if (res.data.code === 0) {
        let data = [{ ...res.data.content }]
        console.log(data)
        this.ztreesData = this.forArr1(data, 0)
      }
    },
    async sysDeptTree () {
      let res = await sysDeptTree({})
      console.log(res.data)
      if (res.data.code === 0) {
        let data = [{ ...res.data.content }]
        this.treeData1 = this.forArr1(data, 0)
      }
    },
    //  添加用户
    saveUser () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.addUser()
        }
      })
    },
    async addUser () {
      let data = {
        FLAG: 1,
        deptId: this.formValidate.deptId,
        deptName: this.formValidate.dept,
        email: this.formValidate.email,
        status: parseInt(this.formValidate.status),
        deptName: this.formValidate.dept,
        username: this.formValidate.username,
        name: this.formValidate.name,
        roleIds: this.formValidate.roleIds,
        password: this.formValidate.pwd
      }
      let res = await userSave(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '添加成功'
        })
        this.checkedIds = []
        this.getPageList()
      }
    },
    addFn () {
      this.modal1 = true
      this.operationShow = false
      this.formValidate = {
        roleName: '',
        roleDesc: '',
        roleSign: '',
        power: ''
      }
    },
    bactchDel () {
      this.delBatchModal = true
    },
    async batchRemove () {
      let ids = []
      this.selectedList.forEach(item => {
        ids.push(item.roleId)
      })
      if (ids && ids.length == 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择数据进行删除'
        })
        return
      }
      let data = {
        FLAG: 1,
        ids: ids
      }
      let res = await batchRemove(data)
      if (res.data.code === 0) {
        this.delBatchModal = false
        this.$Modal.success({
          title: '提示',
          content: '删除成功'
        })
        this.selectedList = []
        this.getPageList()
      }
    },
    searchFn () {
      this.getPageList()
    },
    operationRole () {
      if (this.operationShow) {
        // this.forTreesIds(this.ztreesData)
        this.roleUpdate()
      } else {
        // this.forTreesIds(this.ztreesData)
        this.saveUser()
      }
    },
    edit (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].roleId
      this.roleDetail(this.dataList[i].roleId)
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
      console.log(this.delIndex)
    },
    async delRole () {
      let data = {
        id: parseInt(this.dataList[this.delIndex].roleId)
      }
      let res = await roleremove(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '删除成功'
        })
        this.checkedIds = []
        this.delIndex = ''
        this.getPageList()
      }
    },
    checkedPrentFn (arr) {
      arr.forEach((item, index) => {
        this.$set(item, 'checked', false)
        if (item.children) {
          this.checkedPrentFn(item.children)
        }
      })
    },
    // 取消
    cancelModal1 () {
      // this.formValidate = { companyId: '', appId: '', appName: '' }
      // this.parentDataId = ''
      this.modal1 = false
      this.menuIds = []
      this.checkedPrentFn(this.ztreesData)
    },
    selected (res) {
      this.selectedList = res
      console.log(res)
    },
    changePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.getPageList()
    },
    updateDataList () {
      this.pageNum = 1
      this.pageSize = 10
      this.getPageList()
    },
    pageChange (value) {
      this.pageNum = value
      this.getPageList()
    },
    clearInputs () {
      this.pageNum = 1
      this.pageSize = 10
      this.keyword2 = ''
      this.getPageList()
    },
    goBack () {
      this.$router.go(-1)
    }, // 分割线
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    }

  },
  created () {
    this.getPageList()
    this.getRoleList()
    this.menuTree()
    this.sysDeptTree()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.ibox-title {
    background-color: #ffffff;
    color: inherit;
    margin-bottom: 0;
    padding: 14px 15px 7px;
    min-height: 48px;
    border-bottom: 1px solid #e7eaec;
    h5{
      display: inline-block;
      font-size: 14px;
      margin: 0 0 7px;
      padding: 0;
      text-overflow: ellipsis;
    }
}
.user-left{
  .user-bg{
    background: #fff;
    width: 95%;
    margin-right: 15px;
  }
  /deep/ .ivu-tree{
    padding-bottom: 15px;
    padding-left: 8px;
  }
  /deep/ .ivu-tree ul li:first-child{
    margin-top: 0px;
    padding: 8px 0 0;
  }
}
.role-top{
  overflow: hidden;
  width: 100%;
  .role-top-left{
    float: left;
    width: 300px;
  }
  .role-top-right{
    float: right;
  }
  .btn{
    margin-right: 10px;
  }
  .ipt{
    margin-right: 10px;
  }
}
.no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .no-data-img {
      // background: url(../../assets/img/no-data.png) center no-repeat;
      width: 404px;
      height: 253px;
      background-size: contain;
    }
    .no-tit {
      width: 404px;
      text-align: center;
      font-size: 14px;
    }
  }
.pages {
  position: relative;
  padding: 10px 0;
  text-align: center;
  background: #fff;
  .operation {
    position: absolute;
    left: 0px;
  }
}
.btn-item{
  margin-left: 6px;
}
</style>
