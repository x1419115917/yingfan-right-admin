<!--订单管理-订单详情-->
<template>
  <div class="orderDetail">
    <div class="title">订单信息</div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">订单号</Col>
          <Col :span="14">{{ orderDetail.id }}</Col>
          <Col :span="10">订单状态</Col>
          <Col :span="14">{{ returnOrderStatus(orderDetail.orderStatus)}}</Col>
          <Col :span="10">供应商</Col>
          <Col :span="14">-</Col>
          <Col :span="10">下单时间</Col>
          <Col :span="14">{{ orderDetail.createTime }}</Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">商品总额</Col>
          <Col :span="14" class="money">¥{{ orderDetail.payAmt }}</Col>
          <Col :span="10">运费</Col>
          <Col :span="14" class="money">¥{{ orderDetail.logisticAmt }}</Col>
          <Col :span="10">税费</Col>
          <Col :span="14" class="money">-</Col>
          <Col :span="10">付款时间</Col>
          <Col :span="14">
            <template v-if="orderDetail.payTime">{{ orderDetail.payTime }}</template>
            <template v-else>-</template>
          </Col>
        </Row>
      </Col>
    </Row>
    <div class="title">收货人信息</div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">下单人</Col>
          <Col :span="14">
            <template v-if="orderDetail.userName">{{ orderDetail.userName }}</template>
            <template v-else>-</template>
          </Col>
          <Col :span="10">收货地址</Col>
          <Col :span="14">
            <template v-if="orderDetail.address">{{ orderDetail.address }}</template>
            <template v-else>-</template>
          </Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">收货人</Col>
          <Col :span="14">
            <template v-if="orderDetail.consignee">{{ orderDetail.consignee }}</template>
            <template v-else>-</template>
          </Col>
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
          <Select :style="{ width: inpWidth}" v-model="form.expressCode" placeholder="请输入物流公司" clearable :disabled="disabled">
            <Option v-for="item in logisticsCompanyOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        </Col>
        <Col span="12">
          <span>运单号</span>
          <Input class="expressNumber" v-model="form.expressNumber" :style="{ width: inpWidth}" placeholder="请输入运单号" clearable :disabled="disabled" />
        </Col>
      </Row>
    <div class="mark">
      <Input v-model="markMsg" placeholder="请输入备注" :disabled="disabled">
        <span slot="prepend">客服备注</span>
      </Input>
    </div>
    <div class="btnGroup">
      <template v-if="orderDetail.orderStatus === 1"><Button size="large" type="primary" @click="deliveryGood">发货</Button></template>
      <template v-else><Button size="large" type="primary" @click="close">确定</Button></template>
      <Button size="large" @click="close">取消</Button>
    </div>
  </div>
</template>
<script>
import { doOrderDetail, doDeliveryGood } from '@/api/order'
import { logisticsCompany } from './orderList.js'
export default {
  name: 'orderDetail',
  data () {
    return {
      disabled: false,
      inpWidth: '162px',
      orderDetailId: null,
      markMsg: null,
      orderDetail: {}, // 订单详情
      form: {
        FLAG: 1,
        expressCode: null, // 物流公司
        expressNumber: null // 运单号
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
          slot: 'barcode',
          align: 'center'
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
    returnOrderStatus (item) {
      switch (item) {
        case 0 : return '待付款'
        case 1 : return '待发货'
        case 2 : return '已发货'
        case 3 : return '已收货'
        case 4 : return '交易关闭'
        case 5 : return '退款'
      }
    },
    // 发货
    async deliveryGood () {
      let data = Object.assign(this.form, { orderId: this.orderDetailId })
      let res = await doDeliveryGood(data)
      if (res.data.code === 0) {
        this.$Message.success('操作成功！')
        this.$emit('close')
        this.$emit('updateList')
      }
    },
    close () {
      this.$emit('close')
    },
    async getOrderDetail () {
      let orderId = {
        FLAG: 1,
        orderId: this.orderDetailId
      }
      let res = await doOrderDetail(orderId)
      if (res.data.code === 0) {
        this.orderDetail = res.data.content
        this.goodsList = res.data.content.suborderSkuItemList
        if (this.orderDetail.orderStatus === 2) { // 已发货-显示物流公司信息等
          this.form.expressCode = this.orderDetail.expressCode
          this.form.expressNumber = this.orderDetail.expressNumber
          this.disabled = true
        } else {
          this.form.expressCode = ''
          this.form.expressNumber = ''
          this.disabled = false
        }
      }
    }
  },
  computed: {
    logisticsCompanyOpts () {
      return logisticsCompany()
    }
  },
  watch: {
    orderId (val) {
      this.orderDetailId = val
      this.getOrderDetail()
    }
  },
  created () {
    this.orderDetailId = this.orderId
    if (this.orderDetailId) {
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
  .btnGroup{
    margin-top: 16px;
    text-align: right;
    button:nth-child(2){
      margin-left: 16px;
    }
  }
}
</style>
