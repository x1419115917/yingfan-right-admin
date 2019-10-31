<!--订单管理-订单详情-->
<template>
  <div class="orderDetail">
    <div class="title">订单信息</div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">订单号</Col>
          <Col :span="14">{{ orderDetail.totalOrderId }}</Col>
          <Col :span="10">订单状态</Col>
          <Col :span="14">{{ returnOrderStatus(orderDetail.orderStatus)}}</Col>
          <Col :span="10">供应商</Col>
          <Col :span="14">爱奇艺</Col>
          <Col :span="10">下单时间</Col>
          <Col :span="14">{{ orderDetail.createTime }}</Col>
          <Col :span="10">付款时间</Col>
          <Col :span="14">2019-09-29 17:03:33</Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">商品总额</Col>
          <Col :span="14">¥{{ orderDetail.payAmt }}</Col>
          <Col :span="10">运费</Col>
          <Col :span="14">¥{{ orderDetail.logisticAmt }}</Col>
          <Col :span="10">税费</Col>
          <Col :span="14">¥111.00</Col>
        </Row>
      </Col>
    </Row>
    <div class="title">收货人信息</div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">下单人</Col>
          <Col :span="14">18915555555</Col>
          <Col :span="10">收货地址</Col>
          <Col :span="14">广东省 广州市 天河区 10区三楼820</Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">收货人</Col>
          <Col :span="14">13255558988</Col>
        </Row>
      </Col>
    </Row>
    <div class="title">商品订单</div>
    <Table border :columns="columns" :data="goodsList">
      <template slot-scope="{ row }" slot="retailPrice">
        <span>¥{{ row.retailPrice }}</span>
      </template></Table>
    <div class="title">物流信息</div>
    <Row class="logistics">
      <Col span="12">
        <span>国内配送公司</span>
        <Input v-model="form.company" :style="{ width: inpWidth}" placeholder="请输入物流公司" clearable />
      </Col>
      </Col>
      <Col span="12">
        <span>运单号</span>
        <Input v-model="form.number" :style="{ width: inpWidth}" placeholder="请输入运单号" clearable />
      </Col>
    </Row>
    <div class="mark">
      <Input v-model="form.markMsg" placeholder="请输入备注">
        <span slot="prepend">客服备注</span>
      </Input>
    </div>
  </div>
</template>
<script>
import { doOrderDetail } from '@/api/order'
export default {
  name: 'orderDetail',
  data () {
    return {
      inpWidth: '162px',
      orderDetail: {}, // 订单详情
      form: {
        company: null, // 物流公司
        number: null, // 运单号
        markMsg: null // 客服备注
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品编码',
          key: 'code',
          align: 'center'
        },
        {
          title: '商品条形码',
          key: 'name'
        },
        {
          title: '商品名称',
          width: 200,
          key: 'title'
        },
        {
          title: '单价',
          slot: 'retailPrice'
        },
        {
          title: '数量',
          key: 'num'
        },
        {
          title: '订单金额',
          key: 'age'
        }
      ],
      goodsList: []
    }
  },
  props: ['orderId'],
  methods: {
    returnOrderStatus (item) {
      switch (item) {
        case 0 : return '待付款'
        case 1 : return '待发货'
        case 2 : return '已发货'
        case 3 : return ''
        case 4 : return '交易关闭'
      }
    },
    async getOrderDetail () {
      let orderId = {
        FLAG: 1,
        orderId: this.orderId
      }
      let res = await doOrderDetail(orderId)
      if (res.data.code === 0) {
        this.orderDetail = res.data.content
        this.goodsList = res.data.content.suborderSkuItemList
      }
    }
  },
  watch: {
    orderId (val) {
      this.orderId = val
      this.getOrderDetail()
    }
  }
}
</script>
<style lang="less" scoped>
.orderDetail {
  .mark {
    margin-top: 16px;
  }
  .logistics {
    span {
      margin-right: 6px;
    }
  }
  .wrap {
    .ivu-row {
      .ivu-col {
        border: 1px solid #dcdee2;
        padding: 10px 0;
        text-align: center
      }
    }
  }
  .title {
    padding: 5px 0;
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
