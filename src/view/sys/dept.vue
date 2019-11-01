<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="部门管理">
      <Row class="role-top">
        <div class="role-top-left">
          <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn" v-has="'system:sysDept:add'">添加</Button>
          <!-- <Icon type="ios-checkmark" /> -->
          <!-- <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button> -->
        </div>
        <div class="role-top-right">
          <Input class="ipt" v-model="value" placeholder="请输入名称" style="width: 200px"></Input>
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
    <Row class="margin-top-10 bank-table-content">
      <!-- <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table> -->
      <div class="bank_table" style="position:relative;min-height: 200px;">
        <tree-grid
          :items='data'
          :columns='columns'
          @on-row-click='rowClick'
          @on-selection-change='selectionClick'
          @on-sort-change='sortClick'
        >>
        </tree-grid>
          <div class="no-data" v-if="data.length < 1">
            <!-- <div class="no-data-img"></div> -->
            <div class="no-tit">暂无数据</div>
          </div>
        </div>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="operationShow? '编辑部门': '新增部门'"  width="640" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="上级部门:" prop="pName">
					<Input v-model="formValidate.pName"  disabled></Input>
				</FormItem>
        <!-- <FormItem label="上级菜单:" prop="roleName">
					<RadioGroup v-model="formValidate.menuType">
            <Radio label="0">目录</Radio>
            <Radio label="1">菜单</Radio>
            <Radio label="2">按钮</Radio>
          </RadioGroup>
				</FormItem> -->
				<FormItem label="部门名称:" prop="name">
					<Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
				</FormItem>
        <FormItem label="排序:" prop="orderNum">
					<Input v-model="formValidate.orderNum" placeholder="请输入排序"></Input>
				</FormItem>
				<FormItem label="状态:" prop="delFlag">
					<Input v-model="formValidate.delFlag" placeholder="请输入状态"></Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="operationMenu" type="primary">确定</Button>
			</div>
		</Modal>
    <Modal
				width="20"
				v-model="delModal"
				@on-ok="delMenu"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除？</p>
		</Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import { deptTreeList, menuTree, deptsave, deptDetail, deptupdate, deptRemove } from '@/api/sys'
import TreeGrid from '@/components/tree-grid/treeGrid2.0.vue'
export default {
  name: 'role-name',
  data () {
    return {
      value: '',
      modal1: false,
      modal2: false,
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      pCheckedName: '',
      currentName: '',
      checkedIds: [],
      checkedId: '',
      menuIdsArr: [],
      ztreesData: [],
      formValidate: {
        parentId: 0,
        pName: '总部门',
        name: '',
        orderNum: '',
        delFlag: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      roleName: '',
      columns: [
      // {
      //   type: 'selection',
      //   width: '50'
      // },
        {
          title: '编码',
          key: 'id',
          sortable: true,
          width: '100'
        },
        {
          title: '部门名称',
          key: 'text',
          width: '150'
        },
        {
          title: '排序',
          key: 'orderNum',
          width: '80'
        }, {
          title: '状态',
          key: 'delFlag',
          width: '150'
        },
        // {
        //     title: '操作',
        //     width: 180,
        //     slot: 'action',
        //     align: 'center'
        //   }
        {
          title: '操作',
          type: 'action',
          actions: [
            {
              type: 'primary',
              text: '编辑'
            },
            {
              type: 'error',
              text: '删除'
            },
            {
              type: 'success',
              text: '添加'
            }
          ],
          width: '150'
        }
      ],
      data: [],
      dataList: [],
      userIdCreate: '',
      roleSign: '',
      dataDel: [],
      addShow: false,
      sendContractBut: false,
      selectedList: [],
      contractInfo: '',
      delIndex: '',
      delID: '',
      editID: '',
      editInfo: '',
      pageNum: 1,
      pageSize: 100,
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
  components: { TreeGrid },
  methods: {
    async getPageList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        name: this.value
      }
      let res = await deptTreeList(data)
      if (res.data.code === 0) {
        if (res.data.content && res.data.content.children.length > 0) {
          this.data = [...res.data.content.children]
        } else {
          this.data = [{ ...res.data.content }]
        }
        this.forDataRow(this.data)
      }
    },
    forDataRow (arr) {
      arr.forEach(item => {
        item.type = ((item.type == 0) ? '目录' : (item.type == 1) ? '菜单' : '按钮')
        if (item.children) {
          this.forDataRow(item.children)
        }
      })
    },
    openIconModal () {
      this.modal2 = true
    },
    chooseIcon (i) {
      this.formValidate.icon = this.icons[i]
      this.modal2 = false
    },
    async deptDetail (id) {
      let res = await deptDetail(id)
      if (res.data.code === 0) {
        let data = res.data.content
        this.formValidate = {
          parentId: data.parentId,
          pName: data.parentName === '顶级节点' ? '总部门' : data.parentName,
          name: data.name,
          orderNum: data.orderNum,
          delFlag: data.delFlag
        }
        console.log(data.type)
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
    async deptupdate () {
      let data = {
        FLAG: 1,
        deptId: this.editID,
        parentId: parseInt(this.formValidate.parentId),
        pName: this.formValidate.pName,
        name: this.formValidate.name,
        orderNum: this.formValidate.orderNum,
        delFlag: parseInt(this.formValidate.delFlag)
      }
      let res = await deptupdate(data)
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
          parentId: 0,
          pName: '总部门',
          name: '',
          orderNum: '',
          delFlag: ''
        }
        this.getPageList()
      }
    },
    rowClick (data, index, event, text) {
      console.log('当前行数据:' + data)
      console.log('点击行号:' + index)
      console.log('点击事件:' + event)
      console.log('text', text)
      switch (text) {
        case '添加':
          // this.formValidate.superiorMenu = data.text
          // this.formValidate.parentId = data.id
          this.formValidate = {
            parentId: data.id,
            pName: data.text,
            name: '',
            orderNum: '',
            delFlag: ''
          }
          this.currentName = data.text
          this.modal1 = true
          this.operationShow = false
          console.log(data)
          break
        case '删除':
          this.delModal = true
          this.delID = data.id
          break
        case '编辑':
          this.editID = data.id
          // this.pCheckedName = data.text
          this.deptDetail(this.editID)
          this.editInfo = data
          this.modal1 = true
          this.operationShow = true
          // this.formValidate = {
          //   superiorMenu: data.parentId ==0 ? '根目录' : ,
          //   parentId: data.parentId,
          //   menuType: '',
          //   menuName: '',
          //   url: '',
          //   roleSign: '',
          //   sort: '',
          //   icon: ''
          // }
          break
      }
    },
    selectionClick (arr) {
      console.log('选中数据id数组:' + arr)
    },
    sortClick (key, type) {
      console.log('排序字段:' + key)
      console.log('排序规则:' + type)
    }, // 分割线
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
    // 添加菜单
    saveMenu () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.deptsave()
        }
      })
    },
    async deptsave () {
      let data = {
        FLAG: 1,
        parentId: parseInt(this.formValidate.parentId),
        pName: this.formValidate.pName,
        name: this.formValidate.name,
        orderNum: this.formValidate.orderNum,
        delFlag: parseInt(this.formValidate.delFlag)
      }
      let res = await deptsave(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '添加成功'
        })
        this.formValidate = {
          parentId: 0,
          pName: '总部门',
          name: '',
          orderNum: '',
          delFlag: ''
        }
        this.getPageList()
      }
    },
    addFn () {
      this.modal1 = true
      this.operationShow = false
      this.formValidate = {
        parentId: 0,
        pName: '总部门',
        name: '',
        orderNum: '',
        delFlag: ''
      }
    },
    bactchDel () {
      this.delBatchModal = true
    },
    searchFn () {
      this.getPageList()
    },
    operationMenu () {
      if (this.operationShow) {
        // this.forTreesIds(this.ztreesData)
        this.deptupdate()
      } else {
        // this.forTreesIds(this.ztreesData)
        this.saveMenu()
      }
    },
    edit (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].roleId
      this.deptDetail(this.dataList[i].roleId)
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
      console.log(this.delIndex)
    },
    async delMenu () {
      let res = await deptRemove(parseInt(this.delID))
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
    // 取消
    cancelModal2 () {
      this.modal2 = false
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
    // this.menuTree()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.bank-table-content{
  position: relative;
}
.icons-list{
  span{
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 10px;
    cursor: pointer;
    border: 1px solid #fff;
    &:hover{
      border: 1px solid #e6e6e6;
    }
    .icon-wp{
      width: 100%;
      height: 100%;
    }
  }
}
.iconsd-modal /deep/ .ivu-modal-footer{
  display: none;
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
