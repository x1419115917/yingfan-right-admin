<template>
  <div class="member-active">
    <Row class="member-info">
      <Row class="member-item">
        <Col span="4" class="member-item-left">商品</Col>
        <Col span="20" class="member-item-right">col-18</Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left"> 商品标题 </Col>
        <Col span="20" class="member-item-right">默认展示商品标题，暂不支持编辑</Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left"> SKU选择 </Col>
        <Col span="20" class="member-item-right" style="padding: 20px">
          <Table class="table-height" :columns="columns1" :data="data1" border>
            <template slot-scope="{ row, index }" slot="activePrice">
              <Input style="width: 80px;" placeholder="活动价格" class="sku-ipt" type="number" v-model="row.stockNum" @on-change="changStockNum($event, index)" />
            </template>
            <template slot-scope="{ row, index }" slot="activeStock">
              <Input style="width: 80px;" placeholder="活动库存" class="sku-ipt" type="number" v-model="row.stockNum" @on-change="changStockNum($event, index)" />
            </template>
          </Table>
        </Col>
      </Row>
      <Row class="member-item">
        <Col span="4" class="member-item-left">每用户限制件数</Col>
        <Col span="20" class="member-item-right">col-18</Col>
      </Row>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'memberActive',
  components: {
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
    }
  },
  data () {
    return {
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '供货价',
          key: 'title'
        },
        {
          title: '零售价',
          key: 'brandName'
        },
        {
          title: '可售库存',
          key: 'stockNum'
        },
        {
          title: '活动价',
          widtn: 100,
          slot: 'activePrice'
        },
        {
          title: '活动库存',
          widtn: 100,
          slot: 'activeStock'
        }
      ],
      data1: [],
      tableLoading: false
    }
  },
  computed: {
    selectedList: function () {
      let selList = []
      // this.dataList.filter(item => {
      //   if (item.checkBox) {
      //     selList.push(item)
      //   }
      // })
      return selList
    },
    selectedSku () {

    }
  },
  methods: {

  },
  created () {
  },
  mounted () {
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
</style>
