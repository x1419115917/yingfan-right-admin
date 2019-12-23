<template>
  <div class="member-active">
    <Row class="member-info">
      <Row class="member-item">
        <Col span="4" class="member-item-left">商品</Col>
        <Col span="20" class="member-item-right"><Button type="success" ghost @click="openModal">选择活动商品</Button></Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left"> 商品标题 </Col>
        <Col span="20" class="member-item-right"><Input v-model="goodsTitle" placeholder="默认展示选择商品标题，支持编辑" style="width: 500px" /></Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left member-banner"> 商品banner </Col>
        <Col span="20" class="member-item-right" style="padding-top: 12px">
          <Row>
            <Col span="6" class="active-imgbox">
              <img v-show="!imgShow" class="active-imgurl" src="https://ec-platform-dev.oss-cn-shenzhen.aliyuncs.com/product/20191031/fd9b8888-a8c1-4ed4-80c5-166a4d45ea97/20191031183109.png" alt="">
              <img v-show="imgShow" class="active-imgurl" :src="pictureUrl" />
              <Spin fix class="loading-box" v-show="loadingBox">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>上传中</div>
              </Spin>
            </Col>
            <Col span="18">
              <div class="upload-img-box">
                <Button class="upload-btn" type="success" ghost :loading="loadingBox">上传图片</Button>
                <input type="file" class="img-ipt"
                  @change="fileUplaod($event)"
                  accept="image/*"
                  capture="camera">
              </div>
              <div style="line-height: 30px"><span class="title-span-tips">(图片尺寸宽度710，高度250，jpg，jpeg，gif，小于500k)</span></div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left"> 起止时间 </Col>
        <Col span="20" class="member-item-right">
          <DatePicker v-model="startTime" type="datetime" @on-change="changeStartTime" :options="options1" placeholder="开始日期" style="width: 208px"></DatePicker>
          <span style="margin:0 5px;" class="span-table">——</span>
          <DatePicker v-model="endTime" type="datetime" @on-change="endDate" placeholder="结束日期" :options="options1" placement="bottom-end" style="width: 208px"></DatePicker>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left"> SKU选择 </Col>
        <Col span="20" class="member-item-right" style="padding: 20px">
          <Table class="table-height" :loading="tableLoading" :columns="columns1" :data="data1" border max-height ="450" @on-selection-change="selectChange">
            <template slot-scope="{ row, index }" slot="vipPrice">
              ￥ <InputNumber style="width: 80px;" placeholder="活动价格" :min="0" class="sku-ipt" type="number" v-model="row.vipPrice" @on-change="changActivePrice($event, index)" ></InputNumber>
            </template>
            <template slot-scope="{ row, index }" slot="sort">
              <InputNumber style="width: 80px;" placeholder="排序" :min="0" class="sku-ipt" type="number" v-model="row.sort" @on-change="changReorder($event, index)" ></InputNumber>
            </template>
          </Table>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left">权重</Col>
        <Col span="20" class="member-item-right">
          <InputNumber :max="10" :min="1" v-model="sort" placeholder="权重" style="width: 120px"></InputNumber><span class="tips">默认填1，权重数字越小，展示排序越前</span>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left">每用户限制件数</Col>
        <Col span="20" class="member-item-right">
          <InputNumber :max="10" :min="1" v-model="restrictNumber" placeholder="请输入每个用户限制件数" style="width: 120px"></InputNumber><span class="tips">默认填1，表示整个SPU商品限购一件</span>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left">状态</Col>
        <Col span="20" class="member-item-right">
          <RadioGroup v-model="status">
            <Radio label="0">
              <span>隐藏</span>
            </Radio>
            <Radio label="1">
              <span>显示</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
    </Row>
    <div class="footer">
      <Button size="large" @click="cancelModalWrite" type="warning" class="cancel" style="margin-right: 10px">取消</Button>
      <Button size="large" @click="saveGoods" type="primary">保存</Button>
    </div>
    <Modal v-model="modal1" class="smsAddModel" title="添加商品"  width="940" :mask-closable="false">
      <member-chosses @cancelModal="cancelModal" :modal1="modal1" @chooseGoods="chooseGoods"></member-chosses>
		</Modal>
  </div>
</template>
<script>
import { vipSave, skuSpecList } from '@/api/vip'
import memberChosses from './memberChosses.vue'
import { singleUpload } from '@/api/base'
export default {
  name: 'memberActive',
  components: {
    memberChosses
  },
  props: {
    activityList: {
      type: Array,
      default: function () {
        return []
      }
    },
    operationShow: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    modal0: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    editId: {
      type: Number,
      default: function () {
        return 0
      }
    },
    editInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      modal1: false,
      restrictNumber: 1,
      sort: 1,
      startTime: '',
      endTime: '',
      status: '',
      loadingBox: false,
      pictureUrl: '',
      imgShow: false,
      goodsTitle: '',
      goodsInfo: {},
      selectList: [],
      options1: { // 禁用已经过去的日期时间
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'SKU',
          key: 'specParam',
          minWidth: 100
        },
        {
          title: '供货价',
          key: 'supplyPrice'
        },
        {
          title: '零售价',
          key: 'retailPrice'
        },
        {
          title: '可售库存',
          key: 'stockNum'
        },
        {
          title: '活动价',
          widtn: 100,
          slot: 'vipPrice'
        },
        {
          title: '排序',
          widtn: 100,
          slot: 'sort'
        }
      ],
      data1: [],
      tableLoading: false
    }
  },
  watch: {
    modal0: {
      immediate: true, // 深度拷贝
      handler (val) {
        if (val && !this.operationShow) {
          this.restrictNumber = 1
          this.startTime = ''
          this.endTime = ''
          this.goodsTitle = ''
          this.goodsId = ''
          this.goodsInfo = {}
          this.data1 = []
          this.status = ''
          this.pictureUrl = ''
          this.imgShow = false
          this.pictureUrl = ''
        }
        if (val && this.operationShow) {
          this.data1 = this.editInfo.skus
          this.data1.forEach(item => {
            item._disabled = false
            item._checked = true
            item.specParam = item.specParam != '' ? item.specParam : '-'
          })
          this.goodsId = this.editInfo.spuId
          this.selectList = [...this.data1]
          this.goodsTitle = this.editInfo.title
          this.imgShow = true
          this.pictureUrl = this.editInfo.images
          this.startTime = this.editInfo.startTime
          this.endTime = this.editInfo.endTime
          this.restrictNumber = this.editInfo.limitNum
          this.sort = this.editInfo.sort
          this.status = this.editInfo.isShow.toString()
        }
      }
    }
  },
  computed: {
  },
  methods: {
    endDate (val) {
      // 時間关联判断(判断开始时间)
      if (new Date(val) < new Date(this.startTime)) {
        this.$Message.warning('结束时间不能在开始时间之前')
        this.endTime = ''
      }
    },
    changeStartTime (val) {
      // 時間关联判断(判断结束时间)
      if (new Date(val) > new Date(this.endTime)) {
        this.$Message.warning('开始时间不能在结束时间之后')
        this.startTime = ''
        this.endTime = ''
      }
    },
    // sku信息
    async skuSpecList (id) {
      this.tableLoading = true
      let res = await skuSpecList(id)
      this.tableLoading = false
      if (res.data.code === 0) {
        this.data1 = res.data.content
        this.data1.forEach(item => {
          item._disabled = !item.isShow
          item.vipPrice = null
          item.sort = null
          item.specParam = item.specParam != '' ? item.specParam : '-'
        })
        // this.skuList = res.data.content.skus
      }
    },
    async vipSave (obj) {
      let data = {
        FLAG: 1,
        activeType: 1,
        endTime: obj.endTime,
        id: this.editId === 0 ? '' : this.editId,
        images: obj.pictureUrl,
        isShow: obj.status,
        limitNum: obj.restrictNumber,
        skus: obj.skus,
        sort: obj.sort,
        spuId: obj.goodsId,
        startTime: obj.startTime,
        title: obj.goodsTitle
      }
      let res = await vipSave(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '保存成功'
        })
        this.$emit('saveGoods', obj)
      }
    },
    // 上传图片
    async fileUplaod (e) {
      this.loadingBox = true
      let file = e.target.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(file.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        this.loadingBox = false
        e.target.value = ''
        return
      }
      if (file.size > 1024 * 1024 * 0.5) {
        this.$Message.warning('请选择小于500k的图片上传')
        this.loadingBox = false
        e.target.value = ''
        return
      }
      let data = {
        file: file,
        tag: 2
      }
      let res = await singleUpload(data)
      this.loadingBox = false
      if (res.data.code === 0) {
        this.imgShow = true
        e.target.value = ''
        this.pictureUrl = res.data.content
      }
    },
    changReorder (e, index) {
      // console.log('e++',e)
      this.data1[index].sort = e
      // 判断是否已选中数据，有则赋值给selectList里的activePrice
      if (this.selectList.length != 0) {
        this.selectList.forEach(item => {
          if (item.skuId === this.data1[index].skuId) {
            item.sort = e
          }
        })
      }
    },
    changActivePrice (e, index) {
      this.data1[index].vipPrice = e
      // 判断是否已选中数据，有则赋值给selectList里的activePrice
      if (this.selectList.length != 0) {
        this.selectList.forEach(item => {
          if (item.skuId === this.data1[index].skuId) {
            item.vipPrice = e
          }
        })
      }
    },
    cancelModalWrite () {
      this.$emit('cancelModalWrite', false)
    },
    chooseGoods (obj) {
      this.goodsInfo = obj
      this.goodsTitle = obj.title
      this.goodsId = obj.id
      this.skuSpecList(obj.id)
      this.cancelModal()
      // console.log('this.goodsInfo',this.goodsInfo)
    },
    saveGoods () {
      let obj = {}
      // 选中的sku
      let sellist = []
      let fullArr = []
      let reorderArr = []
      sellist = [...this.selectList]
      // 筛选已选中的sku未填写活动价的数据
      fullArr = this.selectList.filter(item => {
        return item.vipPrice === null
      })
      reorderArr = this.selectList.filter(item => {
        return item.sort === null
      })
      if (this.goodsTitle === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择活动商品'
        })
        return
      }
      if (this.pictureUrl === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请上传banner'
        })
        return
      }
      if (this.startTime === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择开始时间'
        })
        return
      }
      if (this.endTime === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择结束时间'
        })
        return
      }
      // this.selectList
      if (sellist.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择sku数据且填写选中sku活动价格'
        })
        return
      }
      if (fullArr.length != 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请给选中sku数据填写活动价格'
        })
        return
      }
      // reorderArr
      if (reorderArr.length != 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请给选中sku数据填写排序序号'
        })
        return
      }
      if (this.restrictNumber === null) {
        this.$Modal.warning({
          title: '提示',
          content: '请填写每用户限制购买数'
        })
        return
      }
      if (this.status === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择状态'
        })
        return
      }
      obj = {
        goodsId: this.goodsId,
        goodsTitle: this.goodsTitle,
        startTime: this.$dateString(this.startTime),
        endTime: this.$dateString(this.endTime),
        restrictNumber: this.restrictNumber,
        skus: sellist,
        pictureUrl: this.pictureUrl,
        status: this.status,
        sort: this.sort
      }
      this.vipSave(obj)
    },
    selectChange (data) {
      // console.log('data++', data)、
      this.selectList = data
    },
    openModal () {
      this.modal1 = true
    },
    cancelModal () {
      this.modal1 = false
    }
  },
  created () {
  },
  mounted () {
    // this.columns1 = [...this.columnsListUpdata]
  }
}
</script>
<style lang="less" scoped>
.member-item{
  min-height: 50px;
  line-height: 50px;
  font-size: 14px;
  border: 1px solid #ebebeb;
  .member-item-left{
    text-align: center;
    background-color: #fbfbfb;
    &::before{
      content: "*";
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .member-banner{
    height: 136px;
    line-height: 136px;
  }
  .member-item-right{
    border-left: 1px solid #ebebeb;
    padding-left: 16px;
  }
}
.hide{
  display: block;
}
.tips{
  font-size: 12px;
  display: inline-block;
  color: #999;
  margin-left: 10px;
}
.footer{
  text-align: right;
  padding: 20px 0 10px;
}
// 图片样式
.active-imgbox{
  position: relative;
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
.upload-img-box{
  position: relative;
  .img-ipt{
    position: absolute;
    opacity: 0;
    left: 0;
    width: 80px;
    height: 32px;
  }
}
.title-span-tips{
  padding-left: 6px;
  font-size: 12px;
  color: #999;
  font-weight: 400;
}
// 底部模态按钮隐藏
.smsAddModel /deep/ .ivu-modal-footer,.smsModel .ivu-modal-footer{
  padding: 0;
  display: none;
}
/deep/ .ivu-table-cell,.ivu-table-cell{
  padding-left: 10px;
  pading-right: 10px;
}
</style>
