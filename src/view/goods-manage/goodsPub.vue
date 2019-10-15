<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card :title="type == 'edit' ? '编辑供应商' : '新增供应商'">
      <Row class="role-top">
        <!-- <div class="role-top-left">
          <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn">添加供应商</Button>
          <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button>
        </div> -->
        <!-- <div class="role-top-right">
          <Input class="ipt" v-model="value" placeholder="请输入供应商名称" style="width: 200px"></Input>
          <Button  type="primary" icon="ios-search" :loading="uploadLoading" @click="searchFn">搜索</Button>
        </div> -->
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
    <Row class="margin-top-10" style="background:#fff;padding:30px;">
      <!-- <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table> -->
      <div class="bank_table" style="position:relative;">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
            <FormItem label="供应商名称:" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入供应商名称"></Input>
            </FormItem>
            <FormItem label="联系人:" prop="operator">
              <Input v-model="formValidate.operator" placeholder="请输入联系人"></Input>
            </FormItem>
            <FormItem label="手机号码:" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入手机号码"></Input>
            </FormItem>
            <div class="deloy-pro">
              <div class="deloy-left">
                <span>代理类目/品牌：</span>
                <Button style="margin-left: 5px; padding: 5px 10px;" size="large" @click="addFn" type="primary">新增代理类目/品牌</Button>
              </div>
              <div class="deloy-right">
                <Table
                  :columns="columnsList"
                  :data="dataList"
                  height="350"
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
                  </template>
                </Table>
              </div>
            </div>
          </Form>
          <div class="bank_table_footer">
            <Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 15px; padding: 5px 38px;">取消</Button>
            <Button size="large" @click="operationRole" type="primary" style="padding: 5px 38px;">确定</Button>
          </div>
      </div>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="'新增代理类目/品牌'"  width="840" @on-cancel="cancelModal1">
      <div class="create-catg">
        <div class="title">
          <div class="row">
              <span>基本信息</span>
              <span>没有相关类目？去创建类目</span>
          </div>
        </div>
        <Row>
          <Col span="2" class="sub-left-item">类目：</Col>
          <Col span="22">
            <Row>
              <Col span="7">
                <p class="ul-title">选择一级分类</p>
                <ul class="list-group ul-content">
                    <li class="list-group-item">服装</li>
                    <li class="list-group-item">餐厨</li>
                    <li class="list-group-item">配件</li>
                    <li class="list-group-item">电子产品</li>
                    <li class="list-group-item">生活用品</li>
                </ul>
              </Col>
              <Col span="1">
                <Icon type="ios-arrow-dropright-circle" size="30" style="margin-top: 99px;" />
              </Col>
              <Col span="7">
                <p class="ul-title">选择二级分类</p>
                <ul class="list-group ul-content">
                    <li class="list-group-item">服装</li>
                    <li class="list-group-item">餐厨</li>
                    <li class="list-group-item">配件</li>
                    <li class="list-group-item">电子产品</li>
                    <li class="list-group-item">生活用品</li>
                </ul>
              </Col>
              <Col span="1">
                <Icon type="ios-arrow-dropright-circle" size="30" style="margin-top: 99px;" />
              </Col>
              <Col span="7">
                <p class="ul-title">选择三级分类</p>
                <ul class="list-group ul-content">
                    <li class="list-group-item">服装</li>
                    <li class="list-group-item">餐厨</li>
                    <li class="list-group-item">配件</li>
                    <li class="list-group-item">电子产品</li>
                    <li class="list-group-item">生活用品</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="3" class="sub-left-item">代理品牌：</Col>
          <Col span="21">
            <Row>
              <Col span="7">
                <Input v-model="value3" placeholder="输入品牌关键字" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button size="large" @click="operationRole" type="primary">确定</Button>
              </Col>
              <Col span="6">
                <span class="goto-brand">没有相关品牌？去创建品牌</span>
              </Col>
            </Row>
            <Row style="margin-top: 15px;">
              <CheckboxGroup v-model="brandListcheck">
                <Checkbox class="check-item" :label="item.id" v-for="(item, index) in brandListArr" :key="index">
                    <span class="brand-name">{{item.brandName}}</span>
                </Checkbox>
                <Checkbox class="check-item" label="facebook">
                    <span class="brand-name">品牌名称</span>
                </Checkbox>
                <Checkbox class="check-item" label="github">
                    <span class="brand-name">品牌名称</span>
                </Checkbox>
                <Checkbox class="check-item" label="snapchat">
                    <span class="brand-name">品牌名称</span>
                </Checkbox>
            </CheckboxGroup>
              <!-- <Col span="7">
                <Input v-model="value3" placeholder="输入品牌关键字" style="width: 200px" />
              </Col>
              <Col span="3">
              </Col>
              <Col span="6">
              </Col> -->
            </Row>
          </Col>
        </Row>
      </div>
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
import { brandList, procategoryList, menuTree, saveRole, roleDetail, roleUpdate, roleremove, batchRemove } from '@/api/supplier'
export default {
  name: 'supplier',
  data () {
    return {
      brandListcheck: ['facebook', 'github'],
      brandListArr: [],
      title: '新增供应商',
      type: this.$route.query.tyoe,
      value: '',
      value3: '',
      modal1: false,
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      checkedIds: [],
      checkedId: '',
      menuIdsArr: [],
      ztreesData: [],
      formValidate: {
        name: '',
        operator: '',
        phone: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      roleName: '',
      columnsList: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '类目名称',
          key: 'categoryName'
        },
        {
          title: '操作',
          width: 180,
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
    async getBrandList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await brandList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.brandListArr = res.data.content.rows
      }
    },
    async procategoryList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await procategoryList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
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
    async roleUpdate () {
      let menuIds = this.checkedIds
      if (menuIds && menuIds.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择菜单权限'
        })
        return
      }
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
    // saveRole 添加角色
    saveRole () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.addRole()
        }
      })
    },
    async addRole () {
      let menuIds = this.checkedIds
      if (menuIds && menuIds.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择菜单权限'
        })
        return
      }
      let data = {
        FLAG: 1,
        menuIds: menuIds,
        remark: this.formValidate.roleDesc,
        roleName: this.formValidate.roleName,
        roleSign: this.formValidate.roleSign
      }
      let res = await saveRole(data)
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
        this.forTreesIds(this.ztreesData)
        this.roleUpdate()
      } else {
        this.forTreesIds(this.ztreesData)
        this.saveRole()
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
    // this.getPageList()
    this.getBrandList()
    this.procategoryList()
    // this.menuTree()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.goto-brand{
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 35px;
  color: #6699CC;
  cursor: pointer;
}
.check-item{
  margin-left: 20px;
  &:first-child{
    margin-left: 0;
  }
}
.brand-name{
  font-size: 14px;
}
.sub-left-item{
  font-style: normal;
  font-size: 16px;
  color: rgba(51, 51, 51, 0.8);
}
.list-group{
  height: 200px;
  overflow: auto;
  li{
    list-style: none;
    background-color: inherit;
    border: 1px solid #e7eaec;
    display: block;
    margin-bottom: -1px;
    padding: 10px 15px;
    position: relative;
    border-bottom: 0;
    &:last-child{
      border-bottom: 1px solid #e7eaec;
    }
  }
}
.bank_table_footer{
  margin: 0 auto;
  margin-top: 15px;
  text-align: center
}
.deloy-right{
  margin-top: 15px;
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
.title{
    margin:15px 0 15px;
}
.title span:first-child{
    font-size: 18px;
    font-weight: bold;
}
.title span:last-child{
    font-size: 14px;
    color: #6699CC;
    margin-left: 10px;
}
.ul-title{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: relative;
    display: block;
    padding: 10px 15px;
    margin-bottom: -1px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
}
.catgimg{
    width: 50px;
    height: 45px;
    margin-top: 110px;
}
.ul-content li:hover{
    background: #f9f9f9;
    cursor: pointer;
}
.form-search{
    overflow: hidden;
    margin-left: 15px;
}
.form-search div{
    float: left;
    margin-right: 10px;
    line-height: 34px;
}
.blue-con{
    font-size: 14px;
    color: #6699CC;
    cursor: pointer;
}
.bot-row{
    margin: 15px;
}
.bot-row div{
    float: left;
    margin: 15px;
}
</style>
