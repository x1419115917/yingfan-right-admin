<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10">
      <Col class="user-left" span="5">
        <div class="user-bg">
          <div class="ibox-title">
						<h5>商品分类</h5>
          </div>
          <Tree :data="treeData1" @on-select-change="treeChange"></Tree>
        </div>
      </Col>
      <Col class="user-right" span="19">
        <Card title="该类目属性列表">
          <!-- <Row class="role-top">
            <div class="role-top-left">
              <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn">添加</Button>
              <!-- <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button> -->
            <!-- </div>
            <div class="role-top-right">
              <Input class="ipt" v-model="value" placeholder="请输入属性模板名称" style="width: 200px"></Input>
              <Button  type="primary" icon="ios-search" :loading="uploadLoading" @click="searchFn">搜索</Button>
            </div>
          </Row> -->
          <Row class="role-top com_submenu">
            <Row>
              <div class="set-con">
                <Button class="btn" type="success" @click="addFn" v-has="'sys:spec:add'">添加属性</Button>
                <!-- <Button class="btn" type="info" :loading="uploadLoading" @click="addFn">导入品牌</Button> -->
              </div>
              <!-- <div class="role-top-input">
                <div class="td-line">
                  <span class="name">关键词</span>
                  <!-- @on-enter="updateDataList" -->
                  <!--<Input
                    placeholder="请输入属性模板名称"
                    class="w162"
                    v-model="value"
                  />
                </div>
                <div class="td-line btn">
                  <Button @click="clearInputs" style="margin-right: 6px;">重置</Button>
                  <Button type="primary" @click="searchFn">查询</Button>
                </div>
              </div> -->
            </Row>
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
                  <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)" v-has="'sys:spec:edit'">
                    <i></i>
                    <span>编辑</span>
                  </Button>
                  <!-- <Button class="btn-item del-btn" type="text" size="small" @click="replacePwd(index)">
                    <i></i>
                    <span>取消关联类目</span>
                  </Button> -->
                  <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)" v-has="'sys:spec:remove'">
                    <i></i>
                    <span>删除</span>
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
    <Modal v-model="modal1" class="smsModel" :title="operationShow? '编辑属性': '新增属性'"  width="660" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="属性类型:" prop="status">
					<RadioGroup v-model="formValidate.status" @on-change="radioChange">
            <Radio label="1">基本属性</Radio>
            <Radio label="0">规格属性</Radio>
          </RadioGroup>
				</FormItem>
        <FormItem label="属性值性质:" prop="natures" :class="formValidate.status==0 ? 'boxNone' : ''">
          <RadioGroup v-model="formValidate.natures">
            <Radio label="1">下拉框</Radio>
            <Radio label="2">复选框</Radio>
            <Radio label="3">文本框</Radio>
          </RadioGroup>
				</FormItem>
				<FormItem label="属性名称:" prop="name">
					<Input v-model="formValidate.name" placeholder="请输入属性名称"></Input>
				</FormItem>
        <FormItem label="属性值:" class="check-attr">
          <div class="attr-list">
            <div class="attr-item" v-for="(item,index) in attrListArr" :key="index">
              <Input class="attr-ipt" v-model="item.attrItem" placeholder="请输入属性值"></Input>
              <Icon class="attr-close" size="20" type="md-close-circle" @click="removeAttr(index)" />
            </div>
            <span class="add-attr" size="large" type="primary" @click="addAttr" v-show="formValidate.natures !=3 || formValidate.status == 0">增加属性值</span>
            <span class="add-attr" size="large" type="primary" @click="addAttr" v-show="formValidate.status == 1 && formValidate.natures ==3 && attrListArr && attrListArr.length === 0">增加属性值</span>
          </div>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="operationRole" type="primary">确定</Button>
			</div>
		</Modal>
    <Modal v-model="modal5" class="smsModel deptsms-modal" title="选择部门"  width="340" @on-cancel="cancelModal5">
      <div class="dept-list" :label-width="90">
          <Tree :data="treeData1" @on-select-change="treeChangeDept"></Tree>
      </div>
			<div slot="footer">
			</div>
		</Modal>
    <Modal
				width="20"
				v-model="delModal"
				@on-ok="batchRemove"
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
import has from '@/directive/module/has.js'
import { sysDeptTree, userList, menuTree, userSave, detailUser, updateUser, adminResetPwd, removeUser, batchRemoveUser } from '@/api/sys'
import { categoryTreeList, specList, saveSpec, editSpec, updateSpec, batchRemoveSpec } from '@/api/nature'
export default {
  name: 'spec-name',
  data () {
    return {
      value: '',
      modal1: false,
      modal5: false,
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      checkedIds: [],
      attrList: [],
      attrListArr: [],
      checkedId: '',
      deptId: '',
      menuIdsArr: [],
      levelCheck: '',
      branchIdsCheck: '',
      treeData1: [],
      ztreesData: [],
      formValidate: {
        status: '',
        natures: '',
        name: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        natures: [
          { required: true, message: '请选择', trigger: 'blur' }
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
          width: 80,
          key: 'id'
        },
        {
          title: '属性名称',
          width: 240,
          key: 'specName'
        },
        {
          title: '属性值',
          width: 240,
          key: 'specValsStr'
        },
        {
          title: '属性类型',
          width: 100,
          key: 'operate'
        },
        {
          title: '权重',
          width: 80,
          key: 'operateType'
        },
        {
          title: '操作',
          width: 180,
          fixed: 'right',
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      userIdCreate: '',
      categoryId: '',
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
      detailInfo: {},
      loading: false, // 分割线
      tableLoading: false
    }
  },
  methods: {
    async getPageList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        specName: this.value,
        categoryId: this.categoryId
      }
      let res = await specList(data)
      console.log(res.data.content)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.total = +res.data.content.total
        this.dataList.forEach((item) => {
          item.specValsStr = item.specVals.join('，')
          // item.catg = (item.cid1 ? item.cid1.categoryName : '') + (item.cid2 ? ' > ' + item.cid2.categoryName : '') + (item.cid3 ? ' > ' + item.cid3.categoryName : '')
        })
      }
    },
    radioChange () {
      if (this.formValidate.status == 0) {
        this.formValidate.natures = '3'
      }
    },
    async getCategoryTreeList () {
      let data = {
        FLAG: 1
      }
      let res = await categoryTreeList(data)
      if (res.data.code === 0) {
        let data = [{ ...res.data.content }]
        this.treeData1 = this.forArr1(data, -2)
      }
    },
    removeAttr (index) {
      this.attrListArr.splice(index, 1)
    },
    addAttr () {
      this.attrListArr.push({ attrItem: '' })
    },
    forTreeCatg (arr) {
      arr.forEach(item => {
        item.levelNo = item.data.level
        item.showIS = item.data.isShow
        if (item.children) {
          this.forTreeCatg(item.children)
        }
      })
    },
    async editSpec (id) {
      let res = await editSpec(id)
      if (res.data.code === 0) {
        let data = res.data.content
        this.detailInfo = data
        this.formValidate = {
          name: data.specName,
          status: data.specType.toString(),
          natures: data.operateType.toString()
        }
        this.attrListArr = []
        data.specVals.forEach(item => {
          this.attrListArr.push({
            attrItem: item
          })
        })
        console.log(this.attrListArr)
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
    async updateSpec () {
      let specVals = []
      this.attrListArr.forEach((item, index) => {
        if (item.attrItem != '') {
          specVals.push(item.attrItem)
        }
      })
      let data = {
        FLAG: 1,
        id: this.checkedId,
        cid1: this.detailInfo.cid1.categoryId,
        cid2: this.detailInfo.cid2.categoryId,
        cid3: this.detailInfo.cid3.categoryId,
        specName: this.formValidate.name,
        specType: this.formValidate.status,
        operateType: this.formValidate.natures,
        specVals: specVals
      }
      let res = await updateSpec(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '编辑成功'
        })
        this.checkedIds = []
        this.branchIdsCheck = ''
        this.attrListArr = []
        this.formValidate = {
          name: '',
          status: '',
          natures: ''
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
            data: value.data,
            checked: value.selected === 'true',
            selected: false,
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
            data: value.data,
            expand: true,
            selected: false,
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
    // 取消选中的部门
    forTreesIds (arr) {
      arr.forEach((item, index) => {
        if (item.selected == true) {
          this.$set(item, 'selected', false)
        }
        if (item.children) {
          this.forTreesIds(item.children)
        }
      })
    },
    // 选择部门
    treeChangeDept (data) {
      console.log(data)
      if (data[0].id == -1) {
        return
      }
      this.formValidate.deptId = data[0].id
      this.formValidate.dept = data[0].title
      this.modal5 = false
      this.forTreesIds(this.treeData1)
    },
    treeChange (data) {
      console.log(data)
      this.categoryId = data[0].id
      this.levelCheck = data[0].data.level
      this.branchIdsCheck = data[0].data.branchIds.split('>')
      this.getPageList()
      console.log('this.levelCheck', this.levelCheck)
      // this.formValidate.deptId = data[0].id == -1 ? '' : data[0].id
      // this.formValidate.dept = data[0].title == '顶级节点' ? '' : data[0].title
      // this.getPageList()
    },
    //  添加属性
    saveSepcs () {
      let itemVal = []
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          itemVal = this.attrListArr.filter((item, index) => {
            return item.attrItem != ''
          })
          if (itemVal && itemVal.length === 0) {
            this.$Modal.warning({
              title: '提示',
              content: '请添加属性值'
            })
            return
          }
          this.addSpec()
        }
      })
    },
    async addSpec () {
      let specVals = []
      this.attrListArr.forEach((item, index) => {
        if (item.attrItem != '') {
          specVals.push(item.attrItem)
        }
      })
      let data = {
        FLAG: 1,
        cid1: this.branchIdsCheck[0],
        cid2: this.branchIdsCheck[1],
        cid3: this.branchIdsCheck[2],
        specName: this.formValidate.name,
        specType: this.formValidate.status,
        operateType: this.formValidate.natures,
        specVals: specVals
      }
      let res = await saveSpec(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '添加成功'
        })
        this.checkedIds = []
        this.attrListArr = []
        this.formValidate = {
          name: '',
          status: '',
          operateType: ''
        }
        this.getPageList()
      }
    },
    addFn () {
      if (this.levelCheck === 3) {
        this.modal1 = true
        this.operationShow = false
        this.checkedIds = []
        this.formValidate = {
          name: '',
          status: '',
          natures: ''
        }
      } else {
        this.$Modal.warning({
          title: '提示',
          content: '请选择第三级分类添加属性'
        })
      }
    },
    bactchDel () {
      let ids = []
      this.selectedList.forEach(item => {
        ids.push(item.id)
      })
      if (ids && ids.length == 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择数据进行删除'
        })
        return
      }
      this.delBatchModal = true
    },
    async batchRemove () {
      let ids = []
      this.selectedList.forEach(item => {
        ids.push(item.id)
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
      let res = await batchRemoveSpec(data)
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
        this.updateSpec()
      } else {
        this.saveSepcs()
      }
    },
    edit (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].id
      this.editSpec(this.dataList[i].id)
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
      this.selectedList = [{ ...this.dataList[i] }]
      console.log(this.delIndex)
    },
    async delRole () {
      // let data = {
      //   id: parseInt(this.dataList[this.delIndex].userId)
      // }
      let res = await removeUser(this.dataList[this.delIndex].userId)
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
    deptModal () {
      this.modal5 = true
    },
    cancelModal5 () {
      this.modal5 = false
    },
    chooseDept () {},
    // 取消
    cancelModal1 () {
      this.modal1 = false
      this.menuIds = []
      this.checkedId = ''
      this.formValidate = {
        name: '',
        status: '',
        natures: ''
      }
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
      this.value = ''
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
    // this.getRoleList()
    // this.menuTree()
    this.getCategoryTreeList()
  },
  mounted () {
    // this.getPageList()
    // this.sysDeptTree()
  }
}
</script>
<style lang="less" scoped>
.dept-ipt{
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  background-color: #f3f3f3;
  opacity: 1;
  cursor: pointer;
  color: #ccc;
}
.attr-list{
  list-style: none;
  margin-right: 6px;
  &::before{
    clear: both;
  }
  .attr-item{
    position: relative;
    margin-right: 4px;
    float: left;
    margin-bottom: 6px;
    .attr-close{
      position: absolute;
      right: -6px;
      top: -10px;
      cursor: pointer;
    }
    .attr-ipt{
      width: 100px;
      height: 34px;
    }
  }
}
.add-attr{
  // display: inline-block;
  float: left;
  background-color: #78b5f6;
  border-radius: 4px;
  width: 90px;
  height: 34px;
  line-height: 34px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.check-attr{
  ::before{
    clear: both;
    overflow: hidden;
  }
  .attr-list{
    float: left;
  }
}
.check-attr /deep/ .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}
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
.com_submenu{
  padding: 0;
  margin-bottom: 0;
  border: 0;
}
.role-top .set-con{
  float: left;
  margin-top: 0;
}
.role-top-input{
  float: right;
}
.brand-list-modal{
  /deep/ .ivu-modal, .ivu-modal{
    top: 22px;
  }
}
/deep/ .ivu-tree-title{
    overflow: hidden;
    width: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.boxNone{
  display: none;
}
/deep/ .ivu-card-body,.ivu-card-body{
  padding: 0;
}
</style>
