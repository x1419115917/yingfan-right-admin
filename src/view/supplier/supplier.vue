<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="供应商列表">
      <Row class="role-top com_submenu">
        <Row>
          <div class="set-con">
            <Button class="btn" type="success" :loading="uploadLoading" @click="addFn" v-has="'sys:supplier:add'">添加供应商</Button>
            <!-- <Button class="btn" type="info" :loading="uploadLoading" @click="addFn">导入品牌</Button> -->
          </div>
          <div class="role-top-input">
            <div class="td-line">
              <span class="name">供应商名称</span>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入供应商名称"
                class="w162"
                v-model="value"
              />
            </div>
            <div class="td-line btn">
              <Button @click="clearInputs" style="margin-right: 6px;">重置</Button>
              <Button type="primary" @click="searchFn">查询</Button>
            </div>
          </div>
        </Row>
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
              <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)" v-has="'sys:supplier:edit'">
                <i></i>
                <span>编辑</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)" v-has="'sys:supplier:remove'">
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
    <Modal v-model="modal1" class="smsModel brand-list-modal" :title="operationShow? '编辑品牌': '新增品牌'"  width="640" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
				<FormItem label="中文名:" prop="name">
					<Input v-model="formValidate.name" placeholder="请输入中文名"></Input>
				</FormItem>
        <FormItem label="英文名:" prop="nameEn">
					<Input v-model="formValidate.nameEn" placeholder="请输入英文名"></Input>
				</FormItem>
        <div class="form-item">
          <span class="name"><span>*</span>品牌LOGO:</span>
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
				<FormItem label="品牌介绍:" prop="intro">
          <Input v-model="formValidate.intro" :maxlength="200" show-word-limit type="textarea" placeholder="请输入品牌介绍"  />
				</FormItem>
				<FormItem label="关联分类:" prop="power" class="is-checked">
					<Tree :data="ztreesData" @on-check-change="catgCheckFn" show-checkbox multiple style="height: 200px;overflow: auto;"></Tree>
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
				@on-ok="brandRemove"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除？</p>
		</Modal>
    <Modal
				width="20"
				v-model="delBatchModal"
				@on-ok="brandRemove"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除选中的数据？</p>
		</Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import { listBrandsPage, categoryTreeList, singleUpload, brandSave, brandDetail, brandUpdate, brandRemove } from '@/api/nature'
import { supplierList, removeSupplier } from '@/api/supplier'
export default {
  name: 'role-name',
  data () {
    return {
      value: '',
      imgShow1: '',
      imgUrl: '',
      modal1: false,
      columns1: [],
      data1: [],
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
        name: '',
        nameEn: '',
        intro: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '中文名不能为空', trigger: 'blur' }
        ],
        nameEn: [
          { required: true, message: '英文名不能为空', trigger: 'blur' }
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
          key: 'id'
        },
        {
          title: '供应商名称',
          width: 230,
          key: 'name'
        },
        {
          title: '联系人',
          key: 'contacts'
        },
        {
          title: '手机',
          key: 'phone'
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
      catgCheckList: [],
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
    async getPageListOld () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        name: this.value
      }
      let res = await listBrandsPage(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
      }
    },
    async getPageList () {
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        name: this.value
      }
      let res = await supplierList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.total = +res.data.content.total
      }
    },
    expandFn (val) {
      this.isExpand = val
    },
    upperShelfFn (val) {
      this.isupperShelf = val
    },
    catgCheckFn (res) {
      this.catgCheckList = []
      res.forEach((item, index) => {
        if (item.dataInfo.level === 3) {
          this.catgCheckList.push(item.dataInfo.branchIds)
        }
      })
      console.log('this.catgCheckList', this.catgCheckList)
    },
    async filezm () {
      console.log(this.$refs.filezm.files[0])
      let file = this.$refs.filezm.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(file.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        this.$refs.filezm.value = ''
        return
      }
      let data = {
        file: this.$refs.filezm.files[0],
        tag: 2
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        console.log(res)
        this.imgShow1 = true
        this.$refs.filezm.value = ''
        this.imgUrl = res.data.content
      }
    },
    async brandDetail (id) {
      let data = {
        FLAG: 1,
        id: id
      }
      let res = await brandDetail(data)
      if (res.data.code === 0) {
        let data = res.data.content
        this.formValidate = {
          name: data.name,
          nameEn: data.nameEn,
          intro: data.desc
        }
        this.imgShow1 = true
        this.imgUrl = data.pictureUrl
        this.menuIds = data.braCatRefs
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
          this.catgCheckList.push(item.branchIds)
        } else {
          if (item.children) {
            this.parentFn(item.children, roleId)
          }
        }
      })
    },
    async brandUpdate () {
      let branchIds = this.catgCheckList
      if (branchIds && branchIds.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择关联分类'
        })
        return
      }
      let data = {
        FLAG: 1,
        id: this.checkedId,
        branchIds: branchIds,
        desc: this.formValidate.intro,
        name: this.formValidate.name,
        nameEn: this.formValidate.nameEn,
        pictureUrl: this.imgUrl
      }
      // let data = {
      //   FLAG: 1,
      //   menuIds: menuIds,
      //   roleId: this.checkedId,
      //   remark: this.formValidate.roleDesc,
      //   roleName: this.formValidate.roleName,
      //   roleSign: this.formValidate.roleSign
      // }
      let res = await brandUpdate(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '编辑成功'
        })
        this.checkedId = ''
        this.catgCheckList = []
        this.formValidate = {
          name: '',
          nameEn: '',
          intro: ''
        }
        this.imgShow1 = false
        this.imgUrl = ''
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
    async categoryTreeList () {
      let data = {
        FLAG: 1
      }
      let res = await categoryTreeList(data)
      console.log(res.data)
      if (res.data.code === 0) {
        let data = [{ ...res.data.content }]
        this.ztreesData = this.forArr1(data, 0)
      }
    },
    // saveRole 添加角色
    saveRole () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.brandSave()
        }
      })
    },
    async brandSave () {
      let branchIds = this.catgCheckList
      if (branchIds && branchIds.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择关联分类'
        })
        return
      }
      let data = {
        FLAG: 1,
        branchIds: branchIds,
        desc: this.formValidate.intro,
        name: this.formValidate.name,
        nameEn: this.formValidate.nameEn,
        pictureUrl: this.imgUrl
      }
      let res = await brandSave(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '添加成功'
        })
        this.catgCheckList = []
        this.formValidate = {
          name: '',
          nameEn: '',
          intro: ''
        }
        this.imgShow1 = false
        this.imgUrl = ''
        this.getPageList()
      }
    },
    addFn () {
      this.$router.push({
        name: 'addsupr'
      })
      sessionStorage.setItem('type', 'add')
    },
    bactchDel () {
      this.delBatchModal = true
    },
    async brandRemove () {
      let ids = []
      ids.push(this.dataList[this.delIndex].id)
      // if (ids && ids.length == 0) {
      //   this.$Modal.warning({
      //     title: '提示',
      //     content: '请选择数据进行删除'
      //   })
      //   return
      // }
      let data = {
        FLAG: 1,
        ids: ids
      }
      let res = await removeSupplier(data)
      if (res.data.code === 0) {
        this.delModal = false
        this.$Modal.success({
          title: '提示',
          content: '删除成功'
        })
        this.delIndex = ''
        this.getPageList()
      }
    },
    searchFn () {
      this.getPageList()
    },
    operationRole () {
      if (this.operationShow) {
        this.forTreesIds(this.ztreesData)
        this.brandUpdate()
      } else {
        this.forTreesIds(this.ztreesData)
        this.saveRole()
      }
    },
    edit (i) {
      // this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].id
      sessionStorage.setItem('type', 'edit')
      sessionStorage.setItem('id', this.checkedId)
      this.$router.push({
        name: 'addsupr'
      })
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
    this.categoryTreeList()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
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
</style>
