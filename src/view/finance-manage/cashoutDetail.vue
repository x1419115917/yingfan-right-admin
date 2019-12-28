<!--财务管理-提现详情-->
<template>
  <div class="cashoutDetail">
    <div class="title">提现信息</div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">持卡人姓名</Col>
          <Col :span="14"></Col>
          <Col :span="10">可提现</Col>
          <Col :span="14"></Col>
          <Col :span="10">平台手机号</Col>
          <Col :span="14">-</Col>
          <Col :span="10">提现金额</Col>
          <Col :span="14"></Col>
          <Col :span="10">身份证号</Col>
          <Col :span="14" class="money">
          </Col>
          <Col :span="10">提现后金额</Col>
          <Col :span="14" class="money">
          </Col>
          <Col :span="10">银行</Col>
          <Col :span="14">
          </Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">商品总额</Col>
          <Col :span="14" class="money">¥</Col>
          <Col :span="10">运费</Col>
          <Col :span="14" class="money">¥</Col>
          <Col :span="10">税费</Col>
          <Col :span="14" class="money">-</Col>
          <Col :span="10">付款时间</Col>
          <Col :span="14">
            <template>-</template>
          </Col>
          <Col :span="10">积分支付</Col>
          <Col :span="14" class="money">
            <template>-</template>
          </Col>
          <Col :span="10">在线支付</Col>
          <Col :span="14" class="money">
            <template>-</template>
          </Col>
        </Row>
      </Col>
    </Row>
    <div class="mark">
      <Input v-model="markMsg" placeholder="请输入备注" :disabled="disabled">
        <span slot="prepend">客服备注</span>
      </Input>
    </div>
    <div class="btnGroup">
      <Button size="large" type="primary" @click="close">确定</Button>
      <Button size="large" @click="close">取消</Button>
    </div>
  </div>
</template>
<script>
import { } from '@/api/order'
export default {
  name: 'cashoutDetail',
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
      }
    }
  },
  props: [''],
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
    close () {
      this.$emit('close')
    }
    // async getOrderDetail () {
    //   let orderId = {
    //     FLAG: 1,
    //     orderId: this.orderDetailId
    //   }
    //   let res = await doOrderDetail(orderId)
    //   if (res.data.code === 0) {
    //     this.orderDetail = res.data.content
    //     this.goodsList = res.data.content.suborderSkuItemList
    //     if (this.orderDetail.orderStatus === 2) { // 已发货-显示物流公司信息等
    //       this.form.expressCode = this.orderDetail.expressCode
    //       this.form.expressNumber = this.orderDetail.expressNumber
    //       this.disabled = true
    //     } else {
    //       this.form.expressCode = ''
    //       this.form.expressNumber = ''
    //       this.disabled = false
    //     }
    //   }
    // }
  },
  computed: {
  },
  // watch: {
  //   orderId (val) {
  //     this.orderDetailId = val
  //     this.getOrderDetail()
  //   }
  // },
  created () {
    // this.orderDetailId = this.orderId
    // if (this.orderDetailId) {
    //   this.getOrderDetail()
    // }
  }
}
</script>
<style lang="less" scoped>
.cashoutDetail {
  .mark {
    margin-top: 16px;
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
