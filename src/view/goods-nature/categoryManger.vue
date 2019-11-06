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
        <Card title="类目管理">
          <Row class="role-top">
            <div class="role-top-left">
              <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn" v-has="'sys:category:add'">添加</Button>
              <!-- <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button> -->
            </div>
            <div class="role-top-right">
              <!-- <Input class="ipt" v-model="value" placeholder="请输入姓名" style="width: 200px"></Input>
              <Button  type="primary" icon="ios-search" :loading="uploadLoading" @click="searchFn">搜索</Button> -->
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
        >
        </tree-grid>
          <div class="no-data" v-if="data.length < 1">
            <!-- <div class="no-data-img"></div> -->
            <div class="no-tit">暂无数据</div>
          </div>
        </div>
    </Row>
      </Col>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="operationShow? '编辑类目': '新增类目'"  width="640" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate1" :label-width="90">
        <FormItem :disable="level > 1" label="一级类目:" prop="categoryFirst">
					<Input v-model="formValidate.categoryFirst" :disabled="level > 1" placeholder="请输入一级类目"></Input>
				</FormItem>
				<FormItem :disable="level > 2" label="二级类目:" prop="categorySecond" v-show="level >= 2">
					<Input v-model="formValidate.categorySecond" :disabled="level > 2" placeholder="请输入二级类目"></Input>
				</FormItem>
        <FormItem label="三级类目:" prop="categoryThird" v-show="level == 3">
					<Input v-model="formValidate.categoryThird" placeholder="请输入三级类目"></Input>
				</FormItem>
        <FormItem label="状态:" prop="status">
					<RadioGroup v-model="formValidate.status">
            <Radio label="1">显示</Radio>
            <Radio label="0">隐藏</Radio>
          </RadioGroup>
				</FormItem>
        <div class="form-item" v-show="level == 3">
          <span class="name"><span>*</span>类目图标:</span>
          <span class="form-item-img" v-show="!imgShow1"></span>
          <img :src="imgUrl" class="img-box1"
                    id="ad21" v-show="imgShow1">
          <div class="btn-upload">
            <Button type="primary" class="upload-img">上传图片</Button>
					  <input type="file" class="img-ipt"
              ref="filezm" @change="filezm" accept="image/*" capture="camera">
              <span class="tips-upload">(180*180，jpg，小于20k)</span>
          </div>
				</div>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="operationRole" type="primary">确定</Button>
			</div>
		</Modal>
    <Modal v-model="modal3" class="smsModel" title="重置密码"  width="540" @on-cancel="cancelModal3">
      <Form ref="formValidPwd" :model="formValidPwd" :rules="ruleValidPwd" :label-width="90">
        <FormItem label="密码:" prop="password">
					<Input type="password" v-model="formValidPwd.password" placeholder="请输入密码"></Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal3" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="replacePwdFn" type="primary">确定</Button>
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
				v-model="delBatchModal"
				@on-ok="catgRemove"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除？</p>
		</Modal>
    <!-- <Modal
				width="20"
				v-model="delBatchModal"
				@on-ok="catgRemove"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除选中的数据？</p> -->
		</Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import { sysDeptTree, userList, roleList, menuTree, userSave, detailUser, updateUser, adminResetPwd, removeUser, batchRemoveUser } from '@/api/sys'
import { categoryTreeList, catgSave, singleUpload, catgDetail, catgUpdate, catgRemove } from '@/api/nature'
import TreeGrid from '@/components/tree-grid/treeGrid2.0.vue'
export default {
  name: 'categoryManger',
  data () {
    return {
      value: '',
      modal1: false,
      imgShow1: false,
      imgUrl: '',
      modal3: false,
      modal5: false,
      operationShow: false,
      delBatchModal: false,
      delModal: false,
      checkedIds: [],
      checkedId: '',
      deptId: '',
      menuIdsArr: [],
      treeData1: [],
      ztreesData: [],
      formValidPwd: {
        password: ''
      },
      ruleValidPwd: {
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      level: 1,
      formValidate: {
        categoryFirst: '',
        categorySecond: '',
        categoryThird: '',
        parentId: '0',
        status: ''
      },
      ruleValidate1: {
        categoryFirst: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
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
          title: '序号',
          key: 'id',
          sortable: true,
          width: '100'
        },
        {
          title: '类目名称',
          key: 'text',
          width: '400'
        },
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
              text: '添加类目'
            }
          ],
          width: '180'
        }
      ],
      data: [],
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
  components: { TreeGrid },
  methods: {
    async getPageList () {
      let data = {
        FLAG: 1
      }
      let res = await categoryTreeList(data)
      if (res.data.code === 0) {
        this.data = [...res.data.content.children]
        this.forTreeCatg(this.data)
        let data = [{ ...res.data.content }]
        this.treeData1 = this.forArr1(data, -2)
      }
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
    async filezm () {
      // console.log(this.$refs.filezm.files[0])
      let file = this.$refs.filezm.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(file.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        this.$refs.filezm.value = ''
        return
      }
      let data = {
        file: this.$refs.filezm.files[0],
        tag: 1
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        console.log(res)
        this.imgShow1 = true
        this.$refs.filezm.value = ''
        this.imgUrl = res.data.content
      }
    },
    rowClick (data, index, event, text) {
      console.log('当前行数据:' + data)
      console.log('点击行号:' + index)
      console.log('点击事件:' + event)
      console.log('text', text)
      switch (text) {
        case '添加类目':
          let categoryFirst = ''
          this.level = data.levelNo + 1
          // console.log('data.parentId', data.parentId)
          if (data.levelNo === 1) {
            categoryFirst = data.text
          } else if (data.levelNo === 2) {
            categoryFirst = data.data.branchNames.split('>')[0]
          }
          this.formValidate = {
            categoryFirst: categoryFirst,
            categorySecond: data.levelNo === 2 ? data.text : '',
            categoryThird: '',
            parentId: data.id,
            status: ''
          }
          this.modal1 = true
          this.operationShow = false
          console.log(data)
          break
        case '删除':
          this.delBatchModal = true
          this.delID = data.id
          break
        case '编辑':
          this.editID = data.id
          this.catgDetail(this.editID)
          this.editInfo = data
          this.modal1 = true
          this.operationShow = true
          // this.formValidate = {
          //   superiorMenu: data.parentId ==0 ? '根目录' : data.parentId,
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
    async getRoleList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await roleList(data)
      if (res.data.code === 0) {
        this.rolelistArr = res.data.content.rows
      }
    },
    async catgDetail (id) {
      let data = {
        id: id,
        FLAG: 1
      }
      let res = await catgDetail(data)
      if (res.data.code === 0) {
        let data = res.data.content
        this.level = data.level
        this.imgShow1 = true
        this.imgUrl = data.pictureUrl
        let categoryFirst = ''
        let categorySecond = ''
        let categoryThird = ''
        let categoryArr = data.branchNames.split('>')
        if (categoryArr && categoryArr.length == 1) {
          categoryFirst = categoryArr[0]
        } else if (categoryArr && categoryArr.length == 2) {
          categoryFirst = categoryArr[0]
          categorySecond = categoryArr[1]
        } else if (categoryArr && categoryArr.length == 3) {
          categoryFirst = categoryArr[0]
          categorySecond = categoryArr[1]
          categoryThird = categoryArr[2]
        }
        this.formValidate = {
          categoryFirst: categoryFirst,
          categorySecond: categorySecond,
          categoryThird: categoryThird,
          parentId: data.parentId,
          status: data.isShow.toString()
        }
        // this.formValidate = {

        // }
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
    async updateUser () {
      let categoryName = this.level == 1 ? this.formValidate.categoryFirst : this.level == 2 ? this.formValidate.categorySecond : this.formValidate.categoryThird
      if (categoryName == '') {
        this.$Modal.warning({
          title: '提示',
          content: '请输入分类名称'
        })
        return
      }
      if (this.editID && this.level == 3 && this.imgUrl == '') {
        this.$Modal.warning({
          title: '提示',
          content: '请上传图片'
        })
        return
      }
      let data = {
        FLAG: 1,
        id: this.editID,
        isShow: this.formValidate.status,
        name: categoryName,
        // parentId: this.formValidate.parentId,
        pictureUrl: this.imgUrl,
        sortOrder: 0
      }
      let res = await catgUpdate(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '编辑成功'
        })
        this.checkedId = ''
        this.formValidate = {
          deptId: '',
          dept: '',
          email: '',
          status: '',
          username: '',
          name: '',
          roleIds: [],
          pwd: ''
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
      this.formValidate.deptId = data[0].id == -1 ? '' : data[0].id
      this.formValidate.dept = data[0].title == '顶级节点' ? '' : data[0].title
      this.getPageList()
    },
    //  添加
    saveUser () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.catgSave()
        }
      })
    },
    async catgSave () {
      let categoryName = this.level == 1 ? this.formValidate.categoryFirst : this.level == 2 ? this.formValidate.categorySecond : this.formValidate.categoryThird
      if (categoryName == '') {
        this.$Modal.warning({
          title: '提示',
          content: '请输入分类名称'
        })
        return
      }
      if (this.level == 3 && this.imgUrl == '') {
        this.$Modal.warning({
          title: '提示',
          content: '请上传图片'
        })
        return
      }
      let data = {
        FLAG: 1,
        isShow: this.formValidate.status,
        name: categoryName,
        parentId: this.formValidate.parentId,
        pictureUrl: this.imgUrl,
        sortOrder: 0
      }
      let res = await catgSave(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '添加成功'
        })
        this.checkedIds = []
        this.imgShow1 = false
        this.imgUrl = ''
        this.formValidate = {
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          parentId: 0,
          status: ''
        }
        this.getPageList()
      }
    },
    addFn () {
      this.level = 1
      this.modal1 = true
      this.operationShow = false
      this.formValidate = {
        categoryFirst: '',
        categorySecond: '',
        categoryThird: '',
        parentId: 0,
        status: ''
      }
    },
    async catgRemove () {
      let ids = []
      ids.push(this.delID)
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
      let res = await catgRemove(data)
      if (res.data.code === 0) {
        this.delBatchModal = false
        this.delID = ''
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
        this.updateUser()
      } else {
        // this.forTreesIds(this.ztreesData)
        this.saveUser()
      }
    },
    edit (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].userId
      this.catgDetail(this.dataList[i].userId)
    },
    replacePwd (i) {
      this.modal3 = true
      this.checkedId = this.dataList[i].userId
      this.detailUser(this.dataList[i].userId)
    },
    replacePwdValid () {
      this.$refs.formValidPwd.validate((valid) => {
        if (valid) {
          this.replacePwdFn()
        }
      })
    },
    async replacePwdFn () {
      let data = {
        FLAG: 1,
        pwdNew: this.formValidPwd.password,
        pwdOld: this.formValidate.pwd,
        userId: this.checkedId
      }
      let res = await adminResetPwd(data)
      if (res.data.code === 0) {
        this.modal3 = false
        this.formValidPwd.password = ''
        this.checkedId = ''
        this.$Modal.success({
          title: '提示',
          content: '修改成功'
        })
      }
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
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
      this.imgShow1 = false
      this.imgUrl = ''
      this.$refs.formValidate.resetFields()
      // this.formValidate = {
      //   deptId: '',
      //   dept: '',
      //   email: '',
      //   status: '',
      //   deptName: '',
      //   username: '',
      //   name: '',
      //   roleIds: [],
      //   pwd: ''
      // }
      // this.checkedPrentFn(this.ztreesData)
    },
    cancelModal3 () {
      this.modal3 = false
      this.checkedId = ''
      this.formValidate = {
        deptId: '',
        deptName: '',
        email: '',
        status: '',
        dept: '',
        username: '',
        name: '',
        roleIds: [],
        pwd: ''
      }
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
    // this.menuTree()
  },
  mounted () {
    // this.getPageList()
  }
}
</script>
<style lang="less" scoped>
.bank-table-content{
  position: relative;
}
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
.form-item{
  padding-left: 6px;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
  & > * {
    float: left;
  }
  .name{
    float: left;
    margin-right: 13px;
    span{
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .btn-upload{
    position: relative;
    .upload-img{
      margin-top: 10px;
      margin-left: 8px;
      width: 80px;
      height: 32px;
    }
    .img-ipt{
      position: absolute;
      left: 8px;
      top: 10px;
      opacity: 0;
      width: 80px;
      height: 32px;
    }
    .tips-upload{
      font-size: 12px;
      color: #999;
      position: absolute;
      top: 49px;
      width: 154px;
      left: 8px;
    }
  }
  .form-item-img{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #e6e6e6;
  }
  .img-box1{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #e6e6e6;
  }
}
// /deep/ .ivu-card-body,.ivu-card-body{
//   padding: 0;
// }
</style>
