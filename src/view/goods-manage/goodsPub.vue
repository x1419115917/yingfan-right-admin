<style lang="less">
  // @import "./common.less";
</style>
<template>
  <div>
    <Card :title="type == 'edit' ? '编辑商品信息' : '发布商品'">
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
      <div class="nav-top">
        <span class="nav-top-item" @click="changeNav(0)" :class="vsShowNav == 0 ? 'nav-top-item-active' : ''">选择供应商</span>
        <span class="nav-top-item" @click="changeNav(1)" :class="vsShowNav == 1 ? 'nav-top-item-active' : ''">编辑商品共有信息</span>
        <span class="nav-top-item" @click="changeNav(2)" :class="vsShowNav == 2 ? 'nav-top-item-active' : ''">编辑商品属性信息</span>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 0">
        <Row>
          <div class="tb-line">
            <span class="name">供应商：</span>
            <Select class="w422" v-model="supplierId" filterable allow-create @on-change="selClistBrand">
                  <Option v-for="item in supplierListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn">
            <Button type="success" @click="navSave(1)">下一步，编辑商品共有信息</Button>
          </div>
        </Row>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 1">
        <Row style="width: 738px;margin: 40px auto 0;">
          <Row class="sub-left-item">商品类目：<span class="goto-brand" @click="goPage(1)">有相关类目？去创建类目</span></Row>
          <Row style="margin-top: 30px;">
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
                  <Option v-for="(item, index) in clist3" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>
          </Row>
        </Row>
        <Row class="">
          <div class="tb-title">
            <h5 class="name">商品基本信息</h5>
          </div>
          <div class="tb-line">
            <span class="name"><span>*</span>商品标题：</span>
            <Input class="w687" v-model="goodsTitle" placeholder="请输入商品标题" />
          </div>
          <div class="tb-line">
            <span class="name">商品副标题：</span>
            <Input class="w687" v-model="subTitle" placeholder="输入商品副标题"  />
          </div>
          <div class="tb-line">
            <span class="name"><span>*</span>品牌：</span>
            <Select class="w687" v-model="brandsId" filterable>
                <Option v-for="(item, index) in BrandsList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="tb-line">
            <span class="name"><span></span>是否新款：</span>
            <Select v-model="newGoods" style="width: 286px" filterable>
                <Option v-for="item in newGoodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="name"><span></span>是否爆款：</span>
            <Select style="width: 286px" v-model="explosiveGoods" filterable>
                <Option v-for="item in explosiveGoodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="tb-line photo-con">
            <span class="name"><span>*</span>商品图片：</span>
            <ul class="photo-list">
              <!-- <li class="photo-item" v-for="(item,index) in goodsImgList" :key="index">
                <input type="file" class="img-ipt"
                      ref="filezm"
                      @change="filezmFn(index)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <img :src="item.imgUrl" class="img-box1"
                    id="ad21" v-show="item.imgShow">
              </li> -->
              <li class="photo-item">
                <input type="file" class="img-ipt"
                      ref="filezm1"
                      @change="filezmFn(1)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <img :src="goodsImgList[0].imgUrl" class="img-box1"
                    id="ad21" v-show="goodsImgList[0].imgShow">
              </li>
              <li class="photo-item">
                <input type="file" class="img-ipt"
                      ref="filezm2"
                      @change="filezmFn(2)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <img :src="goodsImgList[1].imgUrl" class="img-box1"
                    id="ad21" v-show="goodsImgList[1].imgShow">
              </li>
              <li class="photo-item">
                <input type="file" class="img-ipt"
                      ref="filezm3"
                      @change="filezmFn(3)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <img :src="goodsImgList[2].imgUrl" class="img-box1"
                    id="ad21" v-show="goodsImgList[2].imgShow">
              </li>
              <li class="photo-item">
                <input type="file" class="img-ipt"
                      ref="filezm4"
                      @change="filezmFn(4)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <img :src="goodsImgList[3].imgUrl" class="img-box1"
                    id="ad21" v-show="goodsImgList[3].imgShow">
              </li>
              <li class="photo-item">
                <input type="file" class="img-ipt"
                      ref="filezm5"
                      @change="filezmFn(5)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <img :src="goodsImgList[4].imgUrl" class="img-box1"
                    id="ad21" v-show="goodsImgList[4].imgShow">
              </li>
            </ul>
          </div>
          <div class="tb-line tb-editor">
            <span class="name"><span>*</span>商品详情页：</span>
            <div class="editor">
              <v-editor @on-change="_getContext"></v-editor>
            </div>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn btn-goods">
            <Button type="success" @click="navSave(2)">下一步，编辑商品属性信息</Button>
          </div>
        </Row>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 2">
        <Row class="">
          <div class="tb-title">
            <h5 class="name">商品属性信息<span class="sub-name">（错误填写商品属性，可能会引起商品描述不正确，影响您的正常销售，请认真准确填写！）</span></h5>
          </div>
          <div class="tb-line tb-line2">
            <span class="name"><span>*</span>基本属性：</span>
            <div class="name-left w687">
              <div class="tb-top-item">
                <span class="top-name">适用人群：</span>
                <CheckboxGroup v-model="crowcd" class="check-box">
                  <Checkbox class="check-item" :label="item.id" v-for="(item, index) in crowcdListArr" :key="index">
                      <span class="brand-name">{{item.name}}</span>
                  </Checkbox>
                  <Checkbox class="check-item" label="0">
                      <span class="brand-name">男</span>
                  </Checkbox>
                  <Checkbox class="check-item" label="1">
                      <span class="brand-name">女</span>
                  </Checkbox>
              </CheckboxGroup>
              <div class="edit-item">
                <Icon v-show="!isEditCrowcd" @click="editFn(0)" type="ios-create-outline" size="22" />
                <div class="edit-ipt" style="float: left;" v-show="isEditCrowcd">
                  <Input class="edit-modal-ipt" v-model="value3" placeholder="请输入" style="width: 100px" />
                  <Button class="edit-btn" type="info">保存</Button>
                </div>
              </div>
              </div>
            </div>
          </div>
          <div class="tb-line">
            <span class="name">商品副标题：</span>
            <Input class="w687" v-model="value3" placeholder="输入商品副标题"  />
          </div>
          <div class="tb-line">
            <span class="name"><span>*</span>品牌：</span>
            <Select class="w687" v-model="model1" filterable>
                <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn btn-goods">
            <Button type="success" @click="navSave(3)">保存</Button>
          </div>
        </Row>
      </div>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="'新增代理类目/品牌'"  width="840" @on-cancel="cancelModal1">
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
import { menuTree, saveRole, roleDetail, roleUpdate, roleremove, batchRemove } from '@/api/sys'
import { listBrandsPage, singleUpload, specList } from '@/api/nature'
import { supplierList, categList } from '@/api/supplier'
// import editor from '@/components/editor'
import editors from '@/components/editors/editor'
export default {
  name: 'supplier',
  data () {
    return {
      vsShowNav: 0,
      brandsId: '',
      brandsIds: '',
      brandsIdsList: [],
      supplierListArr: [],
      supplierId: '',
      ctx: '',
      BrandsList: [], // 品牌列表
      goodsImgList: [
        {
          imgUrl: '',
          imgShow: false
        },
        {
          imgUrl: '',
          imgShow: false
        },
        {
          imgUrl: '',
          imgShow: false
        },
        {
          imgUrl: '',
          imgShow: false
        },
        {
          imgUrl: '',
          imgShow: false
        }
      ], // 商品图片列表
      clist1: [],
      clist2: [],
      clist3: [],
      cur1: '',
      cur2: '',
      cur3: '',
      checkSelId: '',
      goodsTitle: '',
      subTitle: '',
      selObj: {},
      crowcd: [],
      crowcdListArr: [],
      isEditCrowcd: false,
      imgUrl: '',
      img1: '',
      imgShow1: false,
      brandListcheck: ['facebook', 'github'],
      newGoods: '',
      newGoodsList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      explosiveGoods: '',
      explosiveGoodsList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
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
      brandListArr: [],
      title: '新增供应商',
      type: this.$route.query.type,
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
  components: {
    'v-editor': editors
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 因为当钩子执行前，组件实例还没被创建
      if (vm.type !== 'edit') {
        vm.vsShowNav = 0
        vm.brandsId = ''
        vm.supplierId = ''
        vm.goodsTitle = ''
        vm.clist2 = []
        vm.clist3 = []
        vm.cur1 = ''
        vm.cur2 = ''
        vm.cur3 = ''
        vm.cxt = ''
        vm.newGoods = ''
        vm.explosiveGoods = ''
        vm.goodsImgList = [
          {
            imgUrl: '',
            imgShow: false
          },
          {
            imgUrl: '',
            imgShow: false
          },
          {
            imgUrl: '',
            imgShow: false
          },
          {
            imgUrl: '',
            imgShow: false
          },
          {
            imgUrl: '',
            imgShow: false
          }
        ]
        sessionStorage.removeItem('BrandLists')
      }
    })
  },
  methods: {
    async getSupplierList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100
      }
      let res = await supplierList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.supplierListArr = res.data.content.rows
      }
    },
    async getSpecList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100,
        specName: '',
        categoryId: this.cur3
      }
      let res = await specList(data)
      if (res.data.code === 0) {
        console.log('this.specList', res.data.content)
        // this.dataList = res.data.content.rows
        // this.dataList.forEach((item) => {
        //   item.specValsStr = item.specVals.join('，')
        //   // item.catg = (item.cid1 ? item.cid1.categoryName : '') + (item.cid2 ? ' > ' + item.cid2.categoryName : '') + (item.cid3 ? ' > ' + item.cid3.categoryName : '')
        // })
      }
    },
    // 上传图片
    async filezmFn (val) {
      let data = {}
      let files = ''
      let res = ''
      // console.log(this.$refs.filezm1.files[0])
      switch (val) {
        case 1:
          files = this.$refs.filezm1.files[0]
          data = {
            file: files,
            tag: 0
          }
          res = await singleUpload(data)
          if (res.data.code === 0) {
            console.log(res)
            this.goodsImgList[0].imgShow = true
            this.goodsImgList[0].imgUrl = res.data.content
            this.$refs.filezm1.value = ''
          }
          break
        case 2:
          let files = this.$refs.filezm2.files[0]
          let data = {
            file: files,
            tag: 0
          }
          res = await singleUpload(data)
          if (res.data.code === 0) {
            console.log(res)
            this.goodsImgList[1].imgShow = true
            this.goodsImgList[1].imgUrl = res.data.content
            this.$refs.filezm2.value = ''
          }
          break
        case 3:
          files = this.$refs.filezm3.files[0]
          data = {
            file: files,
            tag: 0
          }
          res = await singleUpload(data)
          if (res.data.code === 0) {
            console.log(res)
            this.goodsImgList[2].imgShow = true
            this.goodsImgList[2].imgUrl = res.data.content
            this.$refs.filezm3.value = ''
          }
          break
        case 4:
          files = this.$refs.filezm4.files[0]
          data = {
            file: files,
            tag: 0
          }
          res = await singleUpload(data)
          if (res.data.code === 0) {
            console.log(res)
            this.goodsImgList[3].imgShow = true
            this.goodsImgList[3].imgUrl = res.data.content
            this.$refs.filezm4.value = ''
          }
          break
        case 5:
          files = this.$refs.filezm5.files[0]
          data = {
            file: files,
            tag: 0
          }
          res = await singleUpload(data)
          if (res.data.code === 0) {
            console.log(res)
            this.goodsImgList[4].imgShow = true
            this.goodsImgList[4].imgUrl = res.data.content
            this.$refs.filezm5.value = ''
          }
          break
      }
      console.log(this.goodsImgList)
    },
    _getContext (ctx) {
      // console.log(ctx)
      this.ctx = ctx
    },
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
    selClist3 (id) {
      this.checkSelId = id
      // this.listBrands(this.clist3[i].id)
      let selObj = this.clist3.filter(item => {
        return item.id === id
      })
      this.selObj = selObj[0]
      // console.log('selObj', selObj)
      // console.log(this.cur3)
      this.getSpecList()
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
    editFn (val) {
      switch (val) {
        case 0:
          this.isEditCrowcd = true
          break
        case 1:
          console.log(1)
          break
      }
    },
    async getlistBrandsPage () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 200
      }
      let res = await listBrandsPage(data)
      if (res.data.code === 0) {
        sessionStorage.setItem('BrandLists', JSON.stringify(res.data.content.rows))
        this.BrandsList = JSON.parse(sessionStorage.getItem('BrandLists'))
      }
    },
    selClistBrand (id) {
      console.log(id)
    },
    changeNav (val) {
      switch (val) {
        case 0:
          this.vsShowNav = 0
          break
        case 1:
          if (this.supplierId != '') {
            this.vsShowNav = 1
          } else {
            this.$Modal.warning({
              title: '提示',
              content: '请选择供应商'
            })
          }
          break
        case 2:
          if (this.cur3 == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择商品分类'
            })
            return
          }
          if (this.goodsTitle == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品标题'
            })
            return
          }
          if (this.brandsId === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择品牌'
            })
            return
          }
          if (imageUrl && imageUrl.length === 0) {
            this.$Modal.warning({
              title: '提示',
              content: '请上传商品图片'
            })
            return
          }
          if (this.ctx === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品详情'
            })
            return
          }

          this.vsShowNav = 2
          break
      }
    },
    navSave (val) {
      let imageUrl = this.goodsImgList.filter(item => {
        return item.imgUrl != ''
      })
      switch (val) {
        case 1:
          if (this.supplierId != '') {
            this.vsShowNav = 1
          } else {
            this.$Modal.warning({
              title: '提示',
              content: '请选择供应商'
            })
          }
          break
        case 2:
          if (this.cur3 == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择商品分类'
            })
            return
          }
          if (this.goodsTitle == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品标题'
            })
            return
          }
          if (this.brandsId === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择品牌'
            })
            return
          }
          if (imageUrl && imageUrl.length === 0) {
            this.$Modal.warning({
              title: '提示',
              content: '请上传商品图片'
            })
            return
          }
          if (this.ctx === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品详情'
            })
            return
          }
          this.vsShowNav = 2
          break
        case 3:
          console.log('保存')
          break
      }
    },
    filezm () {},
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
    goPage (val) {
      switch (val) {
        case 1:
          this.$router.push({ name: 'categoryManger' })
          this.modal1 = false
          break
      }
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
    // this.getcategList(0, '', 1)
  },
  mounted () {
    let brand = JSON.parse(sessionStorage.getItem('BrandLists')) || []
    this.getcategList(0, '', 1)
    this.getSupplierList()
    if (brand && brand.length === 0) {
      this.getlistBrandsPage()
    } else {
      this.BrandsList = brand
    }
  }
}
</script>
<style lang="less" scoped>
.sub-left-item{
  display: inline-block;
  margin-right: 10px;
}
.tb-top-item{
  overflow: hidden;
  .top-name{
    float: left;
    line-height: 32px;
  }
  .check-box{
    float: left;
    margin-left: 10px;
    .brand-name{
      font-size: 12px;
    }
    .check-item{
      margin-left: 0;
    }
  }
}
.photo-con{
  width: 800px;
  margin: 0 auto;
  overflow: hidden;
  .name{
    float: left;
  }
}
.photo-list{
  float: left;
  .photo-item{
    display: inline-block;
    position: relative;
    width: 120px;
    height: 140px;
    cursor: pointer;
    margin-right: 15px;
    &:last-child{
      margin-right: 0;
    }
    .img-box1{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 140px;
      z-index: 2;
      background-color: #f20;
    }
    .bg-glay-add{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 140px;
      z-index: 1;
      background-color: #f9f9f9;
      .icon-add{
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        color: #ccc;
      }
    }
    .img-ipt{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 140px;
      opacity: 0;
      z-index: 3;
    }
  }

}
.nav-top{
  text-align: center;
  .nav-top-item{
    display: inline-block;
    font-size: 16px;
    color: rgb(102, 153, 204);
    padding: 10px 34px;
    border: 1px solid #e6e6e6;
    cursor: pointer;
  }
  .nav-top-item-active{
    background: #19be6b;
    color: #fff;
    border-color: #19be6b;
  }
}
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
.sub-name{
  color: red;
  font-size: 12px;
  font-weight: 400;
}
.bank_content{
  min-height: 350px;
  margin-top: 30px;
  padding-bottom: 30px;
  .tb-line{
    text-align: center;
    margin-bottom: 25px;
    /deep/ .ivu-select-item{
      text-align: left;
    }
    .name{
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 10px;
      span{
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
      }
    }
  }
  .tb-line2{
    ::before{
      clear: both;
    }
    width: 800px;
    margin: 0 auto 25px;
    text-align: center;
    overflow: hidden;
    .name{
      float: left;
    }
    .name-left{
      float: left;
      text-align: left;
      padding: 10px;
      min-height: 50px;
      line-height: 30px;
      background-color: #f9f9f9;
      .edit-ipt{
        float: left;
        .edit-btn{
          height: 30px;
        }
        .edit-modal-ipt{
          margin-right: 6px;
          height: 32px;
        }
      }
    }
  }
  .tb-title{
    h5{
      width: 738px;
      margin: 0 auto;
      font-size: 14px;
      margin-bottom: 26px;
    }
  }
  .tb-line.btn{
    margin-top: 200px;
  }
  .btn.btn-goods{
    margin-top: 50px;
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
.tb-editor{
  width: 800px;
  margin: 0 auto 25px;
  .name{
    float: left;
  }
  .editor{
    float: left;
    text-align: left;
    width: 680px;
  }
}
.goto-brand{
  font-size: 14px;
  color: #6699CC;
  margin-left: 10px;
  cursor: pointer;
}
</style>
