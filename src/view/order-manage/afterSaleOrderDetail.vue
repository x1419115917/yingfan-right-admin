<!--订单管理-售后订单详情-->
<template>
  <div class="afterSaleOrderDetail">
    <div class="title">订单信息</div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">退款编号</Col>
          <Col :span="14">{{ orderDetail.id }}</Col>
          <Col :span="10">退款状态</Col>
          <Col :span="14">{{ returnAfterStatus(orderDetail.orderStatus)}}</Col>
          <Col :span="10">退款金额</Col>
          <Col :span="14" class="money">¥{{ orderDetail.refundAmt }}</Col>
          <Col :span="10">售后类型</Col>
          <Col :span="14">-</Col>
          <Col :span="10">运费</Col>
          <Col :span="14" class="money">-</Col>
          <Col :span="10">用户说明</Col>
          <Col :span="14">-</Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">订单号</Col>
          <Col :span="14">{{ orderDetail.subOrderId }}</Col>
          <Col :span="10">订单状态</Col>
          <Col :span="14">{{ returnOrderStatus(orderDetail.payStatus) }}</Col>
          <Col :span="10">供应商</Col>
          <Col :span="14">
            <template v-if="orderDetail.supplierName">{{ orderDetail.supplierName }}</template>
            <template v-else>-</template>
          </Col>
          <Col :span="10">商品总额</Col>
          <Col :span="14" class="money">¥{{ orderDetail.payAmt }}</Col>
          <Col :span="10">税费</Col>
          <Col :span="14" class="money">-</Col>
        </Row>
      </Col>
    </Row>
    <div class="title">商品清单</div>
    <Table border :columns="columns" :data="goodsList">
      <template slot-scope="{ row }" slot="merchantCode">
        <template v-if="row.merchantCode">¥{{ row.merchantCode }}</template>
        <template v-else>-</template>
      </template>
      <template slot-scope="{ row }" slot="barcode">
        <template v-if="row.barcode">¥{{ row.barcode }}</template>
        <template v-else>-</template>
      </template>
      <template slot-scope="{ row }" slot="retailPrice">
        <span>¥{{ row.retailPrice }}</span>
      </template>
      <template slot-scope="{ row }" slot="money">
        <span>¥{{ row.num*row.retailPrice }}</span>
      </template>
    </Table>
    <div class="title">物流信息</div>
    <Row class="logistics">
      <Col span="12">
        <span>国内配送公司</span>
        <Input v-model="form.company" :style="{ width: inpWidth}" placeholder="请输入物流公司" clearable disabled />
      </Col>
      </Col>
      <Col span="12">
        <span>运单号</span>
        <Input v-model="form.number" :style="{ width: inpWidth}" placeholder="请输入运单号" clearable disabled />
      </Col>
    </Row>
    <div class="mark">
      <Input v-model="form.markMsg" placeholder="请输入备注" disabled>
        <span slot="prepend">客服备注</span>
      </Input>
    </div>
  </div>
</template>
<script>
import { doAfterSaleOrderDetail } from '@/api/order'
export default {
  name: 'afterSaleOrderDetail',
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
          slot: 'merchantCode',
          align: 'center'
        },
        {
          title: '商品条形码',
          slot: 'barcode'
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
          slot: 'money'
        }
      ],
      goodsList: []
    }
  },
  props: ['orderId'],
  methods: {
    returnAfterStatus (item) {
      switch (item) {
        case 0 : return '退款中'
          break
        case 1 : return '退款成功'
          break
        case 2 : return '退款关闭'
          break
        case 3 : return '拒绝退款'
          break
      }
    },
    // 订单状态
    returnOrderStatus (item) {
      switch (item) {
        case 0 : return '待支付'
          break
        case 1 : return '已支付(待发货)'
          break
        case 2 : return '已发货'
          break
        case 3 : return '已收货'
          break
        case 4 : return '交易关闭'
          break
        case 5 : return '退款'
          break
      }
    },
    async getAfterSaleOrderDetail () {
      let obj = {
        FLAG: 1,
        subOrderId: this.orderId
      }
      let res = await doAfterSaleOrderDetail(obj)
      if (res.data.code === 0) {
        this.orderDetail = res.data.content
        this.goodsList = res.data.content.items
      }
    }
  },
  watch: {
    orderId (val) {
      this.orderId = val
      this.getAfterSaleOrderDetail()
    }
  }
}
</script>
<style lang="less" scoped>
.afterSaleOrderDetail {
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
      .money {
        color: red;
      }
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
