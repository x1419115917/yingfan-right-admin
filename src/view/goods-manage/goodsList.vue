<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="商品列表">
      <Row class="role-top com_submenu">
        <Row>
          <div class="role-top-input">
            <div class="td-line">
              <span class="name">商品标题</span>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入商品标题"
                class="w162"
                v-model="value"
              />
            </div>
            <div class="td-line">
              <Select v-model="model1" style="width:80px;margin-right:6px">
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入"
                class="w162"
                v-model="value"
                style="margin-right:10px;"
              />
            </div>
            <div class="td-line">
              <span class="name">品牌</span>
              <Select class="w162" v-model="model1">
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">供应商</span>
              <Select class="w162" v-model="model1" filterable>
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">剩余库存</span>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入"
                class="w80"
                v-model="value"
              />
              <span style="margin:0 5px;">至</span>
              <Input
                placeholder="请输入"
                class="w80"
                v-model="value"
              />
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">是否新品</span>
              <Select class="w162" v-model="model1" filterable>
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">是否爆款</span>
              <Select class="w162" v-model="model1" filterable>
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">上架日期</span>
              <!-- @on-enter="updateDataList" -->
              <DatePicker type="date" placeholder="开始日期" style="width: 120px"></DatePicker>
              <span style="margin:0 5px;">-</span>
              <DatePicker type="date" placeholder="结束日期" placement="bottom-end" style="width: 120px"></DatePicker>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">类目分类</span>
              <Select class="w132" v-model="model1" filterable style="margin-right:6px">
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Select class="w132" v-model="model1" filterable style="margin-right:6px">
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Select class="w132" v-model="model1" filterable>
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">商品状态</span>
              <Select class="w162" v-model="model1" filterable>
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="expand-box" @click="expandFn(1)" v-show="isExpand == 0">展开 <Icon type="ios-arrow-down" /></div>
            <div class="expand-box" @click="expandFn(0)" v-show="isExpand == 1">收起 <Icon type="ios-arrow-up" /></div>
            <div class="td-line btn">
              <Button type="primary" @click="searchFn">查询</Button>
              <Button @click="">重置</Button>
            </div>
            <!-- <Button  type="primary" icon="ios-search" :loading="uploadLoading" @click="searchFn">搜索</Button> -->
          </div>
        </Row>
        <Row>
          <div class="set-con">
            <span style="margin-right: 10px">设置：</span>
            <Button class="btn" type="primary" :loading="uploadLoading" @click="addFn">上架</Button>
            <Button class="btn" type="primary" ghost :loading="uploadLoading" @click="addFn">下架</Button>
            <Button class="btn" type="info" :loading="uploadLoading" @click="addFn">设置新品</Button>
            <Button class="btn" type="info" ghost :loading="uploadLoading" @click="addFn">取消新品</Button>
            <Button class="btn" type="warning" :loading="uploadLoading" @click="addFn">设置爆款</Button>
            <Button class="btn" type="warning" ghost :loading="uploadLoading" @click="addFn">取消爆款</Button>
          </div>
        </Row>
        <!-- <div class="role-top-left">
          <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn">添加</Button>
          <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button>
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
    <Row class="margin-top-10">
      <Row>
        <div class="set-con set-top" style="background:#fff;">
          <span @click="upperShelfFn(1)" class="btn" :class="isupperShelf == 1 ? 'btn-active' : ''">已上架(50)</span>
          <span @click="upperShelfFn(0)" class="btn" :class="isupperShelf == 0 ? 'btn-active' : ''">待下架(10)</span>
        </div>
      </Row>
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
                <span>查看详情</span>
              </Button>
              <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)">
                <i></i>
                <span>编辑</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)" v-show="isupperShelf == 0">
                <i></i>
                <span>上架</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)" v-show="isupperShelf == 1">
                <i></i>
                <span>下架</span>
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
    <Modal v-model="modal1" class="smsModel" title="基本信息"  width="640" @on-cancel="cancelModal1">
     <div>
        <Table :columns="columns1" :data="data1" border></Table>
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
			<p>确定下架？</p>
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
import { roleList, menuTree, saveRole, roleDetail, roleUpdate, roleremove, batchRemove } from '@/api/sys'
export default {
  name: 'role-name',
  data () {
    return {
      value: '',
      modal1: false,
      columns1: [
        {
          title: '供货价',
          key: 'name'
        },
        {
          title: '零售价',
          key: 'age'
        },
        {
          title: '批发价',
          key: 'address'
        },
        {
          title: '可售卖库存',
          key: 'sku'
        },
        {
          title: '已售',
          key: 'buynum'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03',
          sku: 320,
          buynum: '10'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
          sku: 320,
          buynum: '10'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
          sku: 320,
          buynum: '10'
        }
      ],
      model1: '商品ID',
      goodsType: [
        {
          value: '商品ID',
          label: '商品ID'
        },
        {
          value: 'skuID',
          label: 'skuID'
        },
        {
          value: '商家编码',
          label: '商家编码'
        },
        {
          value: '商品条形码',
          label: '商品条形码'
        }
      ],
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      checkedIds: [],
      checkedId: '',
      menuIdsArr: [],
      ztreesData: [],
      formValidate: {
        roleName: '',
        roleDesc: '',
        roleSign: '',
        power: ''
      },
      ruleValidate: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleSign: [
          { required: true, message: '角色标识不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
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
          title: '商品图片',
          key: 'goodsImg'
        },
        {
          title: '商品ID',
          key: 'id'
        },
        {
          title: '商品标题',
          key: 'name'
        },
        {
          title: '品牌',
          key: 'pinpai'
        },
        {
          title: '类目',
          key: 'catg'
        },
        {
          title: '供应商',
          key: 'product'
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
      isExpand: 0,
      isupperShelf: 1,
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
        roleName: this.value,
        roleSign: this.roleSign,
        userIdCreate: this.userIdCreate
      }
      let res = await roleList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.dataList.forEach((item) => {
          item.menuIds = item.menuIds === null ? '-' : item.menuIds
        })
      }
    },
    expandFn (val) {
      this.isExpand = val
    },
    upperShelfFn (val) {
      this.isupperShelf = val
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
    this.getPageList()
    this.menuTree()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>

.set-top{
  padding: 10px;
  span{
    display: inline-block;
    width: 112px;
    height: 51px;
    text-align: center;
    line-height: 51px;
    border: 1px solid #e6e6e6;
    cursor: pointer;
  }
  .btn-active{
    color: #6699CC;
    // border-color: #6699CC;
  }
}
.role-top{
  width: 100%;
  position: relative;
  .set-con{
    margin-top: 15px;
  }
  .td-line{
    float: left;
    margin-right: 24px;
    margin-bottom: 10px;
    .name{
      display: inline-block;
      margin-right: 6px;
    }
  }
  .expand-box{
    position: absolute;
    right: 8px;
    top: 0px;
    font-size: 13px;
    cursor: pointer;
    &:hover{
      color: #ff0036;
      text-decoration: none;
    }
  }
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
