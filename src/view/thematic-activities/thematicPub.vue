<template>
  <div>
    <Card :title="type == 'edit' ? '专题活动编辑' : '专题活动发布'">
      <Row class="role-top">
      </Row>
    </Card>
    <Row class="margin-top-10" style="background:#fff;padding:30px;">
      <div class="nav-top">
        <span class="nav-top-item" @click="navSave(0)" :class="vsShowNav == 0 ? 'nav-top-item-active' : ''">活动基本信息</span>
        <span class="nav-top-item" @click="navSave(1)" :class="vsShowNav == 1 ? 'nav-top-item-active' : ''">添加活动商品</span>
        <span class="nav-top-item" v-show="false" @click="navSave(2)" :class="vsShowNav == 2 ? 'nav-top-item-active' : ''">添加模板</span>
      </div>
      <div class="bank_table bank_content" style="position: relative" v-show="vsShowNav == 0">
        <Row style="margin-top: 35px;">
          <div class="tb-line">
            <Row class="title-sub">基本信息</Row>
            <div class="content-box">
              <Row class="content-item">
                <Col class="table-left lh70" span="4">活动名称</Col>
                <Col class="table-right lh70" span="20">
                  <Input class="w362" v-model="activityName" :maxlength="5" placeholder="请输入活动名称" />
                  <span class="title-span-tips">(名称请勿超过五个字)</span>
                </Col>
              </Row>
              <Row class="content-item content-item1">
                <Col class="table-left lh35" span="4">活动详情页banner（必填）</Col>
                <Col class="table-right" span="20">
                  <Row>
                    <Col span="6" class="active-imgbox">
                      <img v-show="!imgShow" class="active-imgurl" src="https://ec-platform-dev.oss-cn-shenzhen.aliyuncs.com/product/20191031/fd9b8888-a8c1-4ed4-80c5-166a4d45ea97/20191031183109.png" alt="">
                      <img v-show="imgShow" class="active-imgurl" :src="pictureUrl" />
                    </Col>
                    <Col span="18">
                      <div class="upload-img-box">
                        <Button class="upload-btn" type="success" ghost>上传图片</Button>
                        <input type="file" class="img-ipt"
                          @change="fileUplaod($event)"
                          accept="image/*"
                          capture="camera">
                      </div>
                      <div><span class="title-span-tips">(图片尺寸宽度1125，高度不限，jpg，jpeg，gif，小于500k)</span></div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row class="content-item">
                <Col class="table-left lh70" span="4">起止时间</Col>
                <Col class="table-right lh70" span="20">
                  <DatePicker v-model="beginTime" type="datetime" @on-change="changeStartTime" :options="options1" placeholder="开始日期" style="width: 208px"></DatePicker>
                  <span style="margin:0 5px;" class="span-table">——</span>
                  <DatePicker v-model="endTime" type="datetime" @on-change="endDate" placeholder="结束日期" :options="options1" placement="bottom-end" style="width: 208px"></DatePicker>
                </Col>
              </Row>
            </div>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn">
            <Button class="save-goods-info-btn" type="success" @click="navSave(1)">下一步</Button>
          </div>
        </Row>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 1">
        <Row style="margin-top: 35px;">
          <div class="tb-line">
            <Row class="title-sub">添加活动商品</Row>
            <Row class="nav-box">
              <Col class="nav-left" span="20">
                <ul class="nav-list" v-if="actNavs && actNavs.length > 0">
                  <li class="nav-item" v-for="(item, index) in actNavs" :class="navIndex === index ? 'nav-active-item' : ''" :key="index" @click="changgeNav(index)">类目{{index+1}}</li>
                </ul>
              </Col>
              <Col class="nav-right" span="4" style="text-align: right;">
                <Button class="nav-right-btn" type="warning" ghost @click="addCatgModal">添加类目模块</Button>
              </Col>
            </Row>
            <div class="content-box" v-for="(item, index) in actNavs" :key="index" v-show="navIndex === index" >
              <Row class="content-item content-item1">
                <Col class="table-left lh35" span="4">类目名称</Col>
                <Col class="table-right" span="20">
                  <Row>
                    <Col span="24">
                      <div class="upload-img-box">
                        <Input class="w362" v-model="item.navigationName" :maxlength="5" placeholder="请输入" />
                        <span class="title-span-tips">（类目名称请勿超过5个字）</span>
                      </div>
                      <div>
                        <Checkbox v-model="item.isShow">隐藏类目</Checkbox>
                        <span class="title-span-tips">(*勾选后该类目和类目下商品不会展示给用户)</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row class="content-item">
                <Col class="table-left lh70" span="4">权重</Col>
                <Col class="table-right lh70" span="20">
                  <Input class="w362" v-model="item.sortOrder" type="number" placeholder="请输入" />
                  <span class="title-span-tips">（1~5之间数字，1为最高权重）</span>
                </Col>
              </Row>
              <Row class="content-item2">
                <Col class="table-left" span="4">活动商品</Col>
                <Col class="table-right" span="20">
                  <Row>
                    <Button type="success" ghost @click="addGoodsModal">添加商品</Button>
                  </Row>
                  <Row v-if="item.navDets && item.navDets.length > 0">
                    <ul class="agoods-list">
                      <li class="agoods-item" v-for="(val,indx) in item.navDets" :key="indx">
                        <Icon class="close-btn" type="ios-close-circle" size="22" @click="removeGoods(indx)" />
                        <div class="goods-img"><img :src="val.images != null ? val.images[0] : ''" alt=""></div>
                        <div class="goods-title" :title="val.title">{{val.title}}</div>
                        <div class="goods-price">￥{{val.retailPrice}}</div>
                      </li>
                    </ul>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn btn-goods">
            <Button class="save-goods-info-btn save-btns" v-show="false" type="warning" @click="navSave(2)">下一步</Button>
            <Button class="save-goods-info-btn save-btns" style="margin-left: 16px;" type="success" @click="submitPub">提交发布</Button>
          </div>
        </Row>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 2 && false">
        <Row style="margin-top: 35px;" >
          <div class="tb-line">
            <Row class="title-sub">添加模板</Row>
            <div class="content-box">
              <Row class="content-item2">
                <Col class="table-left" span="4">模板图片</Col>
                <Col class="table-right" span="20">
                  <Row>
                    <Select v-model="modalsel" style="width:200px">
                        <Option v-for="(item,index) in modalList" :value="item.id" :key="index">{{ item.value }}</Option>
                    </Select>
                    <Button type="success" ghost style="margin-left:6px;" @click="addModal">添加模板</Button>
                  </Row>
                  <Row>
                    <span class="title-span-tips">(图片规格：模板A宽度为1126，模板B宽度563，模板C宽度为375，高度自适应JPG，JPEG，GIF，小于500k)</span>
                  </Row>
                  <Row style="margin-bottom: 15px">
                    <Row class="modal-item">
                      <Col span="10" class="modal-left">
                        <div class="modal-text">
                          <span class="num">1</span>
                          <span class="txt">模板A</span>
                          <span class="btn">上传图片</span>
                          <span class="del">删除</span>
                        </div>
                        <input type="file" class="img-ipt"
                          ref="filezm1"
                          @change="fileUploadGoods($event,1)"
                          accept="image/*"
                          capture="camera">
                        <img v-show="false" src="" alt="">
                      </Col>
                      <Col span="14" class="modal-right">
                        <div class="content">
                          <div class="con-left">图1内容：</div>
                          <div class="con-right">
                            <span class="add-goods">添加商品</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row class="modal-item modal-item1">
                      <Col span="10" class="modal-left">
                        <Row class="modal-aitem">
                          <Col span="12">
                            <div class="modal-text">
                              <span class="num">1</span>
                              <span class="txt">模板B</span>
                              <span class="btn">上传图片</span>
                            </div>
                            <input type="file" class="img-ipt"
                              ref="filezm1"
                              @change="fileUploadGoods($event)"
                              accept="image/*"
                              capture="camera">
                            <img v-show="false" src="" alt="">
                          </Col>
                          <Col span="12">
                            <div class="modal-text">
                              <span class="num">2</span>
                              <span class="btn">上传图片</span>
                              <span class="del">删除</span>
                            </div>
                            <input type="file" class="img-ipt"
                              ref="filezm1"
                              @change="fileUploadGoods($event)"
                              accept="image/*"
                              capture="camera">
                            <img v-show="false" src="" alt="">
                          </Col>
                        </Row>
                      </Col>
                      <Col span="14" class="modal-right">
                        <div class="content">
                          <Row style="padding-top: 10px">
                            <div class="con-left">图1内容：</div>
                            <div class="con-right">
                              <span class="add-goods">添加商品</span>
                            </div>
                          </Row>
                          <Row style="margin-top: 15px">
                            <div class="con-left">图2内容：</div>
                            <div class="con-right">
                              <span class="add-goods">添加商品</span>
                            </div>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    <Row class="modal-item modal-item1">
                      <Col span="10" class="modal-left">
                        <Row class="modal-aitem">
                          <Col span="8">
                            <div class="modal-text">
                              <span class="num">1</span>
                              <span class="txt">模板B</span>
                              <span class="btn">上传图片</span>
                            </div>
                            <input type="file" class="img-ipt"
                              ref="filezm1"
                              @change="fileUploadGoods($event)"
                              accept="image/*"
                              capture="camera">
                            <img v-show="false" src="" alt="">
                          </Col>
                          <Col span="8">
                            <div class="modal-text">
                              <span class="num">2</span>
                              <span class="btn">上传图片</span>
                            </div>
                            <input type="file" class="img-ipt"
                              ref="filezm1"
                              @change="fileUploadGoods($event)"
                              accept="image/*"
                              capture="camera">
                            <img v-show="false" src="" alt="">
                          </Col>
                          <Col span="8">
                            <div class="modal-text">
                              <span class="num">3</span>
                              <span class="btn">上传图片</span>
                              <span class="del">删除</span>
                            </div>
                            <input type="file" class="img-ipt"
                              ref="filezm1"
                              @change="fileUploadGoods($event)"
                              accept="image/*"
                              capture="camera">
                            <img v-show="false" src="" alt="">
                          </Col>
                        </Row>
                      </Col>
                      <Col span="14" class="modal-right">
                        <div class="content">
                          <Row>
                            <div class="con-left">图1内容：</div>
                            <div class="con-right">
                              <span class="add-goods">添加商品</span>

                            </div>
                          </Row>
                          <Row style="margin-top: 15px">
                            <div class="con-left">图2内容：</div>
                            <div class="con-right">
                              <span class="add-goods">添加商品</span>
                            </div>
                          </Row>
                          <Row style="margin-top: 15px">
                            <div class="con-left">图3内容：</div>
                            <div class="con-right">
                              <span class="add-goods">添加商品</span>
                            </div>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn btn-goods">
            <Button class="save-goods-info-btn" type="success" @click="navSave(3)">保&nbsp;&nbsp;存</Button>
          </div>
        </Row>
      </div>
    </Row>
    <Modal v-model="modal1" class="smsModel" title="添加商品"  width="940" @on-cancel="cancelModal">
     <div class="edit-skubox">
        <Row class="edit-sku-search">
          <div class="goods-search-item">
            <span class="name">品牌</span>
            <Select class="w162" v-model="brandId" filterable>
                <Option v-for="item in brandArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="goods-search-item">
            <span class="name">类目分类</span>
            <Select class="w132" v-model="cid1" filterable style="margin-right:6px" @on-change="selClist1">
                <Option v-for="item in clist1" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select class="w132" v-model="cid2" filterable style="margin-right:6px" @on-change="selClist2">
                <Option v-for="item in clist2" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select class="w132" v-model="cid3" filterable @on-change="selClist3">
                <Option v-for="item in clist3" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="goods-search-item">
            <span class="name">商品标题</span>
            <Input class="w162" placeholder="商品标题" v-model="goodsTitle" />
          </div>
          <div class="goods-search-item">
            <Button type="warning" ghost class="sku-btn" style="margin-right: 8px;" @click="clearInputList">重置</Button>
            <Button type="info" ghost class="sku-btn" @click="searchPageList">查询</Button>
          </div>
        </Row>
        <Table v-show="vsShowNav == 1" ref="selection" class="table-height" @on-selection-change="selectedSku" :columns="columnsList" :data="dataList" border>
        </Table>
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
     </div>
			<div slot="footer">
				<Button size="large" @click="cancelModal" type="warning" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="saveGoods" type="primary">保存</Button>
			</div>
		</Modal>
  </div>
</template>
<script>
import { listGoodsPage } from '@/api/goods'
import { supplierList, categList } from '@/api/supplier'
import { listBrandsPage } from '@/api/nature'
import { arrayTiff, arrayChecked, date2string } from '@/libs/util'
import { singleUpload } from '@/api/base'
import { activityDetail, saveActivity, updateActivity } from '@/api/thematic'
export default {
  name: 'thematicPub',
  data () {
    return {
      vsShowNav: 0,
      brandId: '',
      brandArr: [],
      cid1: '',
      cid2: '',
      cid3: '',
      clist1: [],
      clist2: [],
      clist3: [],
      options1: { // 禁用已经过去的日期时间
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      modal1: false,
      goodsTitle: '',
      activityName: '',
      imgShow: false,
      pictureUrl: '',
      modalsel: '',
      modalList: [
        { id: 0, value: '模板A' },
        { id: 1, value: '模板B' },
        { id: 2, value: '模板C' }
      ],
      actNavs: [{
        isShow: false,
        navDets: [],
        navigationName: '',
        sortOrder: ''
      }],
      navIndex: 0,
      selectedListSpu: [],
      type: this.$route.query.type,
      activeId: this.$route.query.id,
      beginTime: '',
      endTime: '',
      isShowCatg: false,
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品ID',
          width: 120,
          key: 'id'
        },
        {
          title: '商品标题',
          key: 'title'
        },
        {
          title: '品牌',
          key: 'brandName',
          width: 240
        }
      ],
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      tableLoading: false
    }
  },
  components: {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 因为当钩子执行前，组件实例还没被创建
      if (vm.$route.query.type === 'edit') {
        vm.vsShowNav = 0
        vm.type = vm.$route.query.type,
        vm.activeId = vm.$route.query.id,
        // console.log('vm.$route', vm.$route)
        vm.activityDetail(vm.$route.query.id)
      }
      if (vm.$route.query.type !== 'edit') {
        vm.vsShowNav = 0
        vm.type = ''
        vm.activeId = ''
        vm.goodsTitle = ''
        vm.activityName = ''
        vm.imgShow = false
        vm.pictureUrl = ''
        vm.beginTime = ''
        vm.endTime = ''
        vm.actNavs = [{
          isShow: false,
          navDets: [],
          navigationName: '',
          sortOrder: ''
        }]
      }
    })
  },
  computed: {
    columnsListUpdata: function () {
      let columnsList = [...this.columnsListOriginal]
      return columnsList
    }
  },
  methods: {
    async getPageList () {
      let data = {
        FLAG: 1,
        brandId: this.brandId,
        categoryId: this.cid3 ? +this.cid3 : '',
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        title: this.goodsTitle
      }
      let res = await listGoodsPage(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.total = +res.data.content.total
        this.dataList.forEach((item) => {
          item.catg = (item.cid1 ? item.cid1.categoryName : '') + (item.cid2 ? ' > ' + item.cid2.categoryName : '') + (item.cid3 ? ' > ' + item.cid3.categoryName : '')
        })
        this.dataList = arrayChecked(this.dataList, this.actNavs[this.navIndex].navDets)
        // if (this.actNavs && this.actNavs.length) {
        //   this.dataList = arrayChecked(this.dataList, this.actNavs[this.navIndex].navDets)
        // }
      }
    },
    // 查看详情
    async activityDetail (id) {
      let data = {
        FLAG: 1,
        id: id
      }
      let res = await activityDetail(data)
      if (res.data.code === 0) {
        console.log('res', res)
        let data = res.data.content
        this.activityName = data.activityName
        this.imgShow = true
        this.pictureUrl = data.pictureUrl
        this.beginTime = data.beginTime
        this.endTime = data.endTime
        // console.log('data.actNavs1', data.actNavs)
        data.actNavs.forEach(item => {
          item.isShow = item.isShow !== 0
        })
        // console.log('data.actNavs2', data.actNavs)
        this.actNavs = data.actNavs
      }
    },
    async updateActivity () {
      let actNavs = [...this.actNavs]
      actNavs.forEach(item => {
        item.isShow = item.isShow ? 1 : 0
      })
      let data = {
        FLAG: 1,
        id: this.activeId,
        activityName: this.activityName,
        pictureUrl: this.pictureUrl,
        beginTime: this.beginTime != '' ? date2string(this.beginTime) : '',
        endTime: this.endTime != '' ? date2string(this.endTime) : '',
        actNavs: actNavs
      }
      let res = await updateActivity(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '修改成功'
        })
        this.$router.push('thematicList')
      } else {
        console.log('失败处理')
      }
    },
    clearInputList () {
      this.brandId = ''
      this.cid1 = ''
      this.cid2 = ''
      this.cid3 = ''
      this.clist2 = []
      this.clist3 = []
      this.goodsTitle = ''
      this.getPageList()
    },
    searchPageList () {
      this.getPageList()
    },
    async getSupplierList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100
      }
      let res = await supplierList(data)
      if (res.data.code === 0) {
        this.supplierListArr = res.data.content.rows
      }
    },
    // 上传图片
    async fileUplaod (e) {
      let file = e.target.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(file.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        this.$refs.filezm.value = ''
        return
      }
      let data = {
        file: file,
        tag: 2
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        console.log(res)
        this.imgShow = true
        e.target.value = ''
        this.pictureUrl = res.data.content
      }
    },
    // 添加模板
    addModal () {

    },
    async saveActivity () {
      let actNavs = [...this.actNavs]
      actNavs.forEach(item => {
        item.isShow = item.isShow ? 1 : 0
      })
      let data = {
        FLAG: 1,
        activityName: this.activityName,
        pictureUrl: this.pictureUrl,
        beginTime: this.beginTime != '' ? date2string(this.beginTime) : '',
        endTime: this.endTime != '' ? date2string(this.endTime) : '',
        actNavs: actNavs
      }
      let res = await saveActivity(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '发布成功'
        })
        this.$router.push('thematicList')
      } else {
        console.log('失败处理')
      }
    },
    // 提交发布
    submitPub () {
      // console.log(date2string(this.beginTime))
      let isAllWrite = false
      this.actNavs.filter(item => {
        if (item.navigationName === '') {
          isAllWrite = true
          return item
        }
        if (item.sortOrder === '') {
          isAllWrite = true
          return item
        }
        if (item.navDets && item.navDets.length === 0) {
          isAllWrite = true
          return item
        }
        return item
      })
      if (isAllWrite) {
        this.$Modal.warning({
          title: '提示',
          content: '请填写完整'
        })
        return
      }

      if (this.type !== 'edit') {
        this.saveActivity()
      } else {
        this.updateActivity()
      }
    },
    fileUploadGoods (e) {
      console.log(e)
    },
    // 品牌数据
    async getlistBrandsPage () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 200
      }
      let res = await listBrandsPage(data)
      if (res.data.code === 0) {
        this.brandArr = res.data.content.rows
      }
    },
    // 移除商品
    removeGoods (i) {
      this.actNavs[this.navIndex].navDets.splice(i, 1)
    },
    // 添加商品
    addGoods () {
      console.log('this.actNavs', this.actNavs)
    },
    // 获取分类
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
    // 添加类目模块
    addCatgModal () {
      if (this.actNavs && this.actNavs.length >= 5) {
        this.$Message.warning('类目模块最多五个')
        return
      }
      this.actNavs.push({
        isShow: false,
        navDets: [],
        navigationName: '',
        sortOrder: ''
      })
    },
    // navIndex切换导航
    changgeNav (index) {
      this.navIndex = index
    },
    selectedSku (res) {
      this.selectedListSpu = res
      // console.log(res)
      // console.log(this.dataList)
    },
    selClist1 (id) {
      this.getcategList(id, '', 1)
      this.cid2 = ''
      this.cid3 = ''
    },
    selClist2 (id) {
      if (id) {
        this.getcategList(id, '', 2)
        this.cid3 = ''
      }
    },
    selClist3 (id) {
      this.cid3 = id
      // this.listBrands(this.clist3[i].id)
      let selObj = this.clist3.filter(item => {
        return item.id === id
      })
      this.selObj = selObj[0]
    },
    // 打开商品列表弹出
    addGoodsModal () {
      this.modal1 = true
      this.brandId = ''
      this.cid1 = ''
      this.cid2 = ''
      this.cid3 = ''
      this.clist2 = []
      this.clist3 = []
      this.goodsTitle = ''
      this.dataList = arrayChecked(this.dataList, this.actNavs[this.navIndex].navDets)
    },
    // 保存选中商品
    saveGoods () {
      // console.log(this.selectedListSpu)
      this.selectedListSpu.forEach(item => {
        item.productId = item.id
      })
      let slectList = []
      slectList = arrayTiff(this.selectedListSpu, this.actNavs[this.navIndex].navDets)
      this.actNavs[this.navIndex].navDets = [...this.actNavs[this.navIndex].navDets, ...slectList]
      this.modal1 = false
      // this.actNavs[this.navIndex].navDets
      // this.$refs.selection.selectAll(true)
    },
    cancelModal () {
      // console.log('取消')
      this.modal1 = false
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
    navSave (val) {
      switch (val) {
        case 0:
          this.vsShowNav = 0
          break
        case 1:
          if (this.activityName === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写活动名称'
            })
            return
          }
          if (this.pictureUrl === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请上传图片'
            })
            return
          }
          if (this.beginTime === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写开始时间'
            })
            return
          }
          if (this.endTime === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写结束时间'
            })
            return
          }
          this.vsShowNav = 1
          break
        case 2:
          this.vsShowNav = 2
          break
        case 3:
          break
      }
    },
    endDate (val) {
      // 時間关联判断(判断开始时间)
      if (new Date(val) < new Date(this.beginTime)) {
        this.$Message.warning('结束时间不能在开始时间之前')
        this.endTime = ''
      }
    },
    changeStartTime (val) {
      // 時間关联判断(判断结束时间)
      if (new Date(val) > new Date(this.endTime)) {
        this.$Message.warning('开始时间不能在结束时间之后')
        this.beginTime = ''
        this.endTime = ''
      }
    },
    edit (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].roleId
      this.roleDetail(this.dataList[i].roleId)
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
    this.getPageList()
    this.getcategList(0, '', 1)
    this.getlistBrandsPage()
  },
  mounted () {
  },
  destroyed () {
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-table,.ivu-table{
  height: 300px;
  overflow-y: auto;
}
.modal-item{
  width: 100%;
  height: 125px;
  .modal-left{
    height: 125px;
    line-height: 20px;
    background-color: #f9f9f9;
    border: 1px solid #bababa;
    position: relative;
    .modal-text{
      .num{
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background-color: #6a6a6a;
        color: #fff;
        font-size: 18px;
        border-radius: 50%;
        text-align: center;
      }
      .txt{
        display: inline-block;
        color: #169BD5;
        margin-left: 10px;
      }
      .btn{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 90px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background-color: #c3c3c3;
        color: #333;
        font-size: 12px;
        transform: translate(-50%,-50%)
      }
      .del{
        position: absolute;
        right: -28px;
        color: #f20;
        cursor: pointer;
        top: 0px;
      }
    }
    .img-ipt{
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
  }
  .modal-right{
    position: relative;
    height: 125px;
    .content{
      margin: 50px 0 0 30px;
      line-height: 30px;
      .con-left{
        float: left;
      }
      .con-right{
        float: left;
        .add-goods{
          display: inline-block;
          width: 90px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          background-color: #c3c3c3;
          color: #333;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
.modal-item1{
  height: 200px;
  .modal-left{
    height: 200px;
  }
  .modal-aitem{
    .img-ipt{
      height: 200px;
    }
    .modal-text{
      height: 200px;
      border-right: 1px solid #bababa;
      box-sizing: border-box;
      &:last-child{
        border-right: 0;
      }
    }
  }
  .modal-right{
    height: 200px;
  }
}
.nav-box{
  .nav-left{
    .nav-list{
      overflow: hidden;
      .nav-item{
        float: left;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #b9b8b8;
        cursor: pointer;
      }
      .nav-active-item{
        color: #2d8cf0;
      }
    }
  }
  .nav-right{
    .nav-right-btn{
      display: inline-block;
      width: 100px;
      height: 30px;
    }
  }
}
.content-box{
  border-bottom: 1px solid #b9b8b8;
  margin-bottom: 20px;
  .content-item{
    height: 70px;
    border: 1px solid #b9b8b8;
    box-sizing: border-box;
    border-bottom: 0px;
    .table-left{
      height: 100%;
      text-align: center;
      background-color: rgba(244, 244, 244, 1);
    }
    .table-right{
      height: 100%;
      border-left: 1px solid #b9b8b8;
      padding-left: 10px;
    }
  }
  .content-item1{
    height: 110px;
    .table-left{
      padding: 40px 10px 0px;
    }
  }
  .content-item2{
    border: 1px solid #b9b8b8;
    box-sizing: border-box;
    border-bottom: 0px;
    min-height: 70px;
    .table-left{
      line-height: 70px;
      height: 100%;
      text-align: center;
      background-color: rgba(244, 244, 244, 1);
    }
    .table-right{
      line-height: 70px;
      height: 100%;
      border-left: 1px solid #b9b8b8;
      padding-left: 10px;
    }
  }
}
.agoods-list{
  height: 300px;
  background-color: #f9f9f9;
  margin-right: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  .agoods-item{
    position: relative;
    width: 160px;
    height: 200px;
    margin: 6px;
    padding: 6px;
    float: left;
    box-sizing: border-box;
    background-color: #fff;
    .goods-img{
      width: 130px;
      height: 120px;
      margin: 0 auto;
      img{
        width: 130px;
        height: 120px;
      }
    }
    .goods-title{
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin: 6px 0;
    }
    .goods-price{
      line-height: 20px;
      font-size: 14px;
      color: #f00;
      font-weight: bold;
    }
    .close-btn{
      position: absolute;
      right: -6px;
      top: -5px;
      cursor: pointer;
    }
  }
}
.edit-sku-search{
  margin-bottom: 20px;
}
.goods-search-item{
  float: left;
  margin-right: 16px;
  margin-bottom: 6px;
  .name{
    margin-right: 6px;
  }
}
.search-ipt{
  margin-bottom: 8px;
  margin-right: 4px;
  float: left;
}
ul{
  list-style: none;
  li{
    list-style: none;
    position: relative;
  }
}
.lh70{
  line-height: 70px
}
.w160{
  width: 160px;
}
.w362{
  width: 360px;
}
.upload-img-box{
  padding-top: 28px;
  padding-bottom: 8px;
  position: relative;
  .img-ipt{
    position: absolute;
    opacity: 0;
    left: 0;
    width: 80px;
    height: 32px;
  }
}
.span-table{
  color: #999;
}
.active-imgurl{
  display: inline-block;
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  width: 90%;
  height: 100px;
  margin-top: 4px;
}
.check-box[data-v-5c127369] {
    max-width: 560px;
    margin-left: 10px;
}
.nav-top{
  text-align: center;
  .nav-top-item{
    display: inline-block;
    font-size: 16px;
    color: rgb(102, 153, 204);
    padding: 10px 60px;
    border: 1px solid #e6e6e6;
    cursor: pointer;
  }
  .nav-top-item-active{
    background: #19be6b;
    color: #fff;
    border-color: #19be6b;
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
.bank_content{
  min-height: 350px;
  margin-top: 16px;
  padding-bottom: 30px;
  .tb-line{
    text-align: left;
    margin-bottom: 25px;
    .title-sub{
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 15px;
    }
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
  .tb-line.btn{
    margin-top: 50px;
    text-align: center;
  }
  .btn.btn-goods{
    margin-top: 50px;
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
.uploader{
  opacity: 0;
  position: absolute;
}
.boxNone{
  display: none;
}
.edit-item{
  float: left;
  margin-left: 10px;
}
.goods-info-title{
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  color: #666666;
  margin: 6px 10px 20px 10px;
  padding-left: 12px;
}
.save-goods-info-btn{
  width: 360px;
  font-size: 14px;
}
.save-btns{
  width: 240px;
  margin-right: 20px;
  &:last-child{
    margin-right: 0;
  }
}
/deep/ .ivu-card-body,.ivu-card-body{
  padding: 0;
}
.title-span-tips{
  padding-left: 6px;
  font-size: 12px;
  color: #999;
  font-weight: 400;
}
.text-left{
  text-align: left;
}
.text-right{
  text-align: right;
}
.text-center{
  text-align:  center;
}
.w80{
  width: 80px;
}
.w100{
  width: 100px;
}
</style>
