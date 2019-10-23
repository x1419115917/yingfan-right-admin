<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card :title="type == 'edit' ? '编辑供应商' : '新增供应商'">
      <Row class="role-top">
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
                    <!-- <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)">
                      <i></i>
                      <span>编辑</span>
                    </Button> -->
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
            <Button size="large" @click="cancelList" class="cancel" style="margin-right: 15px; padding: 5px 38px;">取消</Button>
            <Button size="large" @click="saveSupplierData" type="primary" style="padding: 5px 38px;">确定</Button>
          </div>
      </div>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="'新增代理类目/品牌'"  width="840" @on-cancel="cancelModal1">
      <div class="create-catg" style="min-height: 400px;">
        <div class="title">
          <div class="row">
              <span>基本信息</span>
              <span>没有相关类目？去创建类目</span>
          </div>
        </div>
        <Row style="margin-top: 40px;">
          <Col span="3" class="sub-left-item">类目：</Col>
          <Col span="21">
            <!-- <Row>
              <Tree :data="treeData1" @on-check-change="catgCheckFn" show-checkbox multiple style="height: 200px;overflow: auto;"></Tree>
            </Row> -->
            <Row style="margin-bottom: 35px;">
              <Col span="7">
                <Select v-model="cur1" filterable allow-create @on-change="selClist1">
                  <Option v-for="item in clist1" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span="1" style="width: 15px;height: 10px;">
              </Col>
              <Col span="7">
                <Select v-model="cur2" filterable allow-create @on-change="selClist2">
                  <Option v-for="item in clist2" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span="1" style="width: 15px;height: 10px;">
              </Col>
              <Col span="7">
                <Select v-model="cur3" filterable allow-create @on-change="selClist3">
                  <Option v-for="(item, index) in clist3" :value="index" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="3" class="sub-left-item">代理品牌：</Col>
          <Col span="21">
            <Row>
              <Col span="7">
                <Input v-model="checkName" placeholder="输入品牌关键字" style="width: 200px" />
              </Col>
              <Col span="3">
                <Button size="large" @click="searchBrand" type="primary">确定</Button>
              </Col>
              <Col span="6">
                <span class="goto-brand">没有相关品牌？去创建品牌</span>
              </Col>
            </Row>
            <Row style="margin-top: 30px;">
              <CheckboxGroup v-model="brandListcheck">
                <Checkbox class="check-item" :label="item.id" v-for="(item, index) in brandListArr" :key="index">
                    <span class="brand-name">{{item.name}}</span>
                </Checkbox>
            </CheckboxGroup>
            </Row>
          </Col>
        </Row>
      </div>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="opearSave" type="primary">确定</Button>
			</div>
		</Modal>
    <Modal
				width="20"
				v-model="delModal"
				@on-ok="removeBrand"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定移除列表？</p>
		</Modal>
    <!-- <Modal
				width="20"
				v-model="delBatchModal"
				@on-ok=""
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除选中的数据？</p>
		</Modal> -->
  </div>
</template>
<script>
import { categoryTreeList, brandListBrands } from '@/api/nature'
import { editSupplier, categList, listBrands, saveSupplier, updateSupplier } from '@/api/supplier'
export default {
  name: 'supplier',
  data () {
    return {
      brandListcheck: [],
      brandListArr: [],
      title: '新增供应商',
      type: '',
      editId: '',
      clist1: [],
      clist2: [],
      clist3: [],
      cur1: '',
      cur2: '',
      cur3: '',
      value: '',
      value3: '',
      modal1: false,
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      checkedIds: [],
      checkedId: '',
      menuIdsArr: [],
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
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        // {
        //   title: '序号',
        //   key: 'id'
        // },
        {
          title: '类目名称',
          key: 'fullCategoryName'
        },
        {
          title: '操作',
          width: 180,
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      treeData1: [],
      userIdCreate: '',
      parentId: 0,
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
      checkName: '',
      checkSelId: '',
      selList: [],
      selObj: {},
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      console.log('vm', vm) // 当前组件的实例
      vm.editId = sessionStorage.getItem('id') || ''
      vm.type = sessionStorage.getItem('type') || ''
      if (vm.type == 'edit') {
        // this.$router.go(0)
        vm.SupplierDetail(vm.editId)
      } else {
        vm.formValidate = {
          operator: '',
          name: '',
          phone: ''
        }
        vm.dataList = []
      }
    })
  },
  methods: {
    selClist1 (id) {
      this.getcategList(id, '', 1)
      this.cur2 = ''
      this.cur3 = ''
      this.brandListcheck = []
      this.brandListArr = []
    },
    selClist2 (id) {
      if (id) {
        this.getcategList(id, '', 2)
        this.cur3 = ''
        this.brandListcheck = []
        this.brandListArr = []
      }
    },
    selClist3 (i) {
      if (i >= 0) {
        this.checkSelId = this.clist3[i].id
        this.listBrands(this.clist3[i].id)
        this.selObj = { ...this.clist3[i] }
      }
    },
    opearSave () {
      // console.log('this.selObj',this.selObj)
      // console.log('brandListcheck',this.brandListcheck)
      this.selList = JSON.parse(sessionStorage.getItem('selList')) || []
      let selCatgArr = this.selObj.branchIds.split('>')
      let obj = {
        firstCategoryId: selCatgArr[0],
        secondCategoryId: selCatgArr[1],
        thirdCategoryId: selCatgArr[2],
        brandIds: this.brandListcheck,
        fullCategoryName: this.selObj.branchNames
      }
      this.selList.push(obj)
      this.dataList = [...this.selList]
      // console.log('this.selList',this.dataList)
      sessionStorage.setItem('selList', JSON.stringify(this.selList))
      this.clist2 = []
      this.clist3 = []
      this.cur1 = this.cur2 = this.cur3 = ''
      this.modal1 = false
      this.brandListArr = []
      this.brandListcheck = []
      this.selObj = {}
      this.$Modal.success({
        title: '提示',
        content: '已加入列表'
      })
    },
    saveSupplierData () {
      if (this.type == 'edit') {
        this.updateSupplier()
      } else {
        this.saveSupplier()
      }
    },
    async saveSupplier () {
      let supCatAges = JSON.parse(sessionStorage.getItem('selList')) || []
      if (supCatAges && supCatAges.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请添加代理类目/品牌'
        })
        return
      }
      let data = {
        FLAG: 1,
        contacts: this.formValidate.operator,
        name: this.formValidate.name,
        phone: this.formValidate.phone,
        supCatAges: supCatAges
      }
      let res = await saveSupplier(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.$Modal.success({
          title: '提示',
          content: '保存成功'
        })
        this.formValidate = {
          operator: '',
          name: '',
          phone: ''
        }
        this.dataList = []
        sessionStorage.removeItem('selList')
        this.$router.push({ name: 'supplier' })
      }
    },
    cancelList () {
      this.$router.push({ name: 'supplier' })
    },
    async updateSupplier () {
      let supCatAges = JSON.parse(sessionStorage.getItem('selList')) || []
      if (supCatAges && supCatAges.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请添加代理类目/品牌'
        })
        return
      }
      let data = {
        FLAG: 1,
        id: this.editId,
        contacts: this.formValidate.operator,
        name: this.formValidate.name,
        phone: this.formValidate.phone,
        supCatAges: supCatAges
      }
      let res = await updateSupplier(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.$Modal.success({
          title: '提示',
          content: '更新成功'
        })
        this.formValidate = {
          operator: '',
          name: '',
          phone: ''
        }
        this.dataList = []
        sessionStorage.removeItem('selList')
        this.$router.push({ name: 'supplier' })
      }
    },
    removeBrand () {
      this.dataList.splice(this.delIndex, 1)
      sessionStorage.setItem('selList', JSON.stringify(this.dataList))
      this.$Modal.success({
        title: '提示',
        content: '已移除列表'
      })
    },
    async getcategList (parentId, i, val) {
      let data = {
        FLAG: 1,
        parentId: parentId
      }
      let res = await categList(data)
      if (res.data.code === 0) {
        let data = res.data.content
        if (data && data.length > 0) {
          let levelNo = data[0].level
          switch (levelNo) {
            case 1:
              this.clist1 = data
              this.clist2 = []
              this.clist3 = []
              break
            case 2:
              this.clist2 = data
              this.clist3 = []
              break
            case 3:
              this.clist3 = data
              break
          }
        }
      }
    },
    async listBrands (id) {
      let data = {
        FLAG: 1,
        name: this.checkName,
        thirdCategoryId: id
      }
      let res = await listBrands(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.brandListArr = res.data.content
      }
    },
    async SupplierDetail (id) {
      let data = {
        id: id,
        FLAG: 1
      }
      let res = await editSupplier(data)
      if (res.data.code === 0) {
        console.log(res)
        let data = res.data.content
        this.formValidate = {
          operator: data.contacts,
          name: data.name,
          phone: data.phone
        }
        this.dataList = data.supCatAges
        sessionStorage.setItem('selList', JSON.stringify(this.dataList))
      }
    },
    searchBrand () {
      this.listBrands(this.checkSelId)
    },
    addFn () {
      this.modal1 = true
      this.getcategList(0, '', 1)
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
            dataInfo: value.data,
            expand: num < 1,
            children: this.forArr1(value.children, num + 1),
            hasParent: value.hasParent,
            hasChildren: value.hasChildren
          }
        } else {
          datav = {
            id: value.id,
            parentId: value.parentId,
            dataInfo: value.data,
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
      this.checkSelObj = this.dataList[i]
      this.getcategList(0, '', 1)
      // this.roleDetail(this.dataList[i].roleId)
    },
    editBarndList () {

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
    this.getcategList(0, '', 1)
    // this.getPageList()
    sessionStorage.removeItem('selList')
    this.dataList = JSON.parse(sessionStorage.getItem('selList')) || []
    // this.procategoryList()
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
  margin-right: 20px;
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
  text-align: right;
  color: rgba(51, 51, 51, 0.8);
}
.list-group{
  height: 200px;
  overflow: auto;
  li{
    list-style: none;
    background-color: inherit;
    border: 1px solid #e7eaec;
    border-left: 0;
    border-right: 0;
    display: block;
    margin-bottom: -1px;
    padding: 10px 15px;
    position: relative;
    border-bottom: 0;
    &:last-child{
      border-bottom: 1px solid #e7eaec;
    }
  }
  .list-group-item-active{
    background-color: #f6f6f6;
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
.ul-content{
  border: 1px solid #e6e6e6;
  border-top: 0;
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
