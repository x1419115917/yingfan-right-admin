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
        <Col span="4" class="member-item-left"> 起止时间 </Col>
        <Col span="20" class="member-item-right">
          <DatePicker v-model="beginTime" type="datetime" @on-change="changeStartTime" :options="options1" placeholder="开始日期" style="width: 208px"></DatePicker>
          <span style="margin:0 5px;" class="span-table">——</span>
          <DatePicker v-model="endTime" type="datetime" @on-change="endDate" placeholder="结束日期" :options="options1" placement="bottom-end" style="width: 208px"></DatePicker>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left"> SKU选择 </Col>
        <Col span="20" class="member-item-right" style="padding: 20px">
          <Table class="table-height" :loading="tableLoading" :columns="columns1" :data="data1" border max-height ="450" @on-selection-change="selectChange">
            <template slot-scope="{ row, index }" slot="activePrice">
              ￥ <InputNumber style="width: 80px;" placeholder="活动价格" :min="0" class="sku-ipt" type="number" v-model="row.activePrice" @on-change="changActivePrice($event, index)" ></InputNumber>
            </template>
          </Table>
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
import { skuSpecList } from '@/api/goods'
import memberChosses from './memberChosses.vue'
import { date2string } from '@/libs/util'
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
    }
  },
  data () {
    return {
      modal1: false,
      restrictNumber: 1,
      beginTime: '',
      endTime: '',
      status: '',
      specTemplates: [],
      isFull: false,
      skuList: [],
      goodsTitle: '',
      goodsInfo: {},
      selectList: [],
      options1: { // 禁用已经过去的日期时间
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      columnsOriginal1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
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
          slot: 'activePrice'
        }
      ],
      columns1: [],
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
          this.beginTime = ''
          this.endTime = ''
          this.specTemplates = []
          this.skuList = []
          this.goodsTitle = ''
          this.goodsInfo = {}
          this.data1 = []
          this.columns1 = []
          this.status = ''
          this.isFull = false
        }
      }
    }
  },
  computed: {
    columnsListUpdata: function () {
      let columns1 = [...this.columnsOriginal1]
      let specTemplates = this.specTemplates
      specTemplates.forEach((item, index) => {
        item.editShow = false
        columns1.splice(index + 1, 0, {
          title: item.specName,
          key: `guige${index}`,
          minWidth: 100
        })
      })
      return columns1
    },
    skuListUpdata: function () {
      // let data1 = this.data1
      let skuList = this.skuList
      skuList.forEach((item, index) => {
        if (item.skuSpecs) {
          if (item.skuSpecs.length === 1) {
            item.guige0 = item.skuSpecs[0].specValue
            // item.activePrice = null
            item.activePrice = null
          } else if (item.skuSpecs.length === 2) {
            item.guige0 = item.skuSpecs[0].specValue
            item.guige1 = item.skuSpecs[1].specValue
            item.activePrice = null
          }
        }
      })
      return skuList
    }
  },
  methods: {
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
    // sku信息
    async skuSpecList (id) {
      this.tableLoading = true
      let res = await skuSpecList(id)
      this.tableLoading = false
      if (res.data.code === 0) {
        // console.log(res)
        this.skuList = res.data.content.skus
        this.specTemplates = res.data.content.specTemplate
        this.columns1 = this.columnsListUpdata
        this.data1 = this.skuListUpdata
      }
    },
    changActivePrice (e, index) {
      // console.log('e++',e)
      this.data1[index].activePrice = e
      // 判断是否已选中数据，有则赋值给selectList里的activePrice
      if (this.selectList.length != 0) {
        this.selectList.forEach(item => {
          if (item.skuId === this.data1[index].skuId) {
            item.activePrice = e
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
      this.skuSpecList(obj.id)
      this.cancelModal()
      // console.log('this.goodsInfo',this.goodsInfo)
    },
    saveGoods () {
      let obj = {}
      // 选中的sku
      let sellist = []
      let fullArr = []
      sellist = [...this.selectList]
      // 筛选已选中的sku未填写活动价的数据
      fullArr = this.selectList.filter(item => {
        return item.activePrice === null
      })
      if (this.goodsTitle === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择活动商品'
        })
        return
      }
      if (this.beginTime === '') {
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
        goodsId: this.goodsInfo.id,
        goodsTitle: this.goodsTitle,
        beginTime: date2string(this.beginTime),
        endTime: date2string(this.endTime),
        restrictNumber: this.restrictNumber,
        skus: sellist,
        status: this.status
      }
      this.$emit('saveGoods', obj)
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
    this.columns1 = [...this.columnsListUpdata]
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
.smsAddModel /deep/ .ivu-modal-footer,.smsModel .ivu-modal-footer{
  padding: 0;
  display: none;
}
</style>
