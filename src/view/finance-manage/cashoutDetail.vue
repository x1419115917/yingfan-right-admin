<!--财务管理-提现详情-->
<template>
  <div class="cashoutDetail">
    <div class="title">提现信息
      <span class="success" v-if="cashoutDetail.status == '1'">【{{ returnStatus(cashoutDetail.status) }}】</span>
      <span class="error" v-else-if="cashoutDetail.status == '2'">【{{ returnStatus(cashoutDetail.status) }}】</span>
      <span class="process" v-else-if="cashoutDetail.status == '0'">【{{ returnStatus(cashoutDetail.status) }}】</span>
    </div>
    <Row class="wrap">
      <Col :span="12">
        <Row>
          <Col :span="10">持卡人姓名</Col>
          <Col :span="14">{{ cashoutDetail.trueName != null ? cashoutDetail.trueName : '-' }}</Col>
          <Col :span="10">平台手机号</Col>
          <Col :span="14">{{ cashoutDetail.userPhone != null ? cashoutDetail.userPhone : '-' }}</Col>
          <Col :span="10">身份证号</Col>
          <Col :span="14">{{ cashoutDetail.idNumber != null ? cashoutDetail.idNumber : '-' }}</Col>
          <Col :span="10">银行</Col>
          <Col :span="14">{{ cashoutDetail.bankName != null ? cashoutDetail.bankName : '-' }}</Col>
          <Col :span="10">银行卡号</Col>
          <Col :span="14">{{ cashoutDetail.number != null ? cashoutDetail.number : '-' }}</Col>
          <Col :span="10">申请时间</Col>
          <Col :span="14">{{ cashoutDetail.handleTime != null ? cashoutDetail.handleTime : '-' }}</Col>
        </Row>
      </Col>
      <Col :span="12">
        <Row>
          <Col :span="10">可提现</Col>
          <Col :span="14" class="money">¥{{ cashoutDetail.beforeCash != null ? cashoutDetail.beforeCash : '-'}}</Col>
          <Col :span="10">提现金额</Col>
          <Col :span="14" class="money">¥{{ cashoutDetail.cash != null ? cashoutDetail.cash : '-'}}</Col>
          <Col :span="10">提现后金额</Col>
          <Col :span="14" class="money">¥{{ cashoutDetail.afterCash != null ? cashoutDetail.afterCash : '-'}}</Col>
          <Col :span="10">银行支行</Col>
          <Col :span="14">{{ cashoutDetail.branchAddress != null ? cashoutDetail.branchAddress : '-'}}</Col>
          <Col :span="10">银行预留手机号</Col>
          <Col :span="14">{{ cashoutDetail.userPhone != null ? cashoutDetail.userPhone : '-'}}</Col>
          <Col :span="10">手续费</Col>
          <Col :span="14" class="money">¥{{ cashoutDetail.commissionCharge != null ? cashoutDetail.commissionCharge : '-'}}</Col>
        </Row>
      </Col>
    </Row>
    <div class="mark" v-if="cashoutDetail.status != '1' ">
      <Input v-model="markMsg" placeholder="请输入备注" :disabled="cashoutDetail.status == '0' ? false : true" clearable>
        <span slot="prepend">审核备注</span>
      </Input>
    </div>
    <div class="tip">提醒：1.请认真核对提现金额和可提现的金额，以及提现后余额。2.认真核对绑定的银行卡信息和提现的银行卡信息是否相同。以上核对无误即可放款</div>
    <div class="btnGroup">
      <template v-if="cashoutDetail.status == '0' ">
        <Button size="large" type="success" @click="handle('1')">同意</Button>
        <Button size="large" type="error" @click="handle('2')">拒绝</Button>
        <Button size="large" @click="close">取消</Button>
      </template>
      <template v-else>
        <Button size="large" type="primary" @click="close">确定</Button>
      </template>
    </div>
  </div>
</template>
<script>
import { doCheckCashoutDetail, doHandelCashout } from '@/api/finance'
export default {
  name: 'cashoutDetail',
  data () {
    return {
      disabled: false,
      inpWidth: '162px',
      cashoutDetailId: null,
      markMsg: null,
      cashoutDetail: {}
    }
  },
  props: ['cashoutId'],
  methods: {
    returnStatus (item) {
      switch (item) {
        case 0 : return '待审核'
        case 1 : return '已放款'
        case 2 : return '已拒绝'
      }
    },
    close () {
      this.$emit('close')
    },
    async getDetail () {
      let obj = {
        FLAG: 1,
        id: this.cashoutDetailId
      }
      let res = await doCheckCashoutDetail(obj)
      if (res.data.code === 0) {
        this.cashoutDetail = res.data.content
        this.markMsg = res.data.content.refuseCause
      }
    },
    async handle (status) {
      let obj = {
        FLAG: 1,
        id: this.cashoutDetailId,
        refuseCause: this.markMsg,
        status: status
      }
      let res = await doHandelCashout(obj)
      if (res.data.code === 0) {
        this.$Message.success('操作成功！')
        this.$emit('close')
        this.$emit('updateList')
      }
    }
  },
  watch: {
    cashoutId (val) {
      this.cashoutDetailId = val
      this.getDetail()
    }
  },
  created () {
    this.cashoutDetailId = this.cashoutId
    if (this.cashoutDetailId) {
      this.getDetail()
    }
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
  .tip {
    margin-top: 15px;
    font-weight: bold;
  }
  .title {
    padding: 5px 0;
    font-weight: 600;
    font-size: 14px;
    .success {
      color: #19be6b;
    }
    .error {
      color: #ed4014;
    }
    .process {
      color: #2d8cf0;
    }
  }
  .btnGroup{
    margin-top: 16px;
    text-align: right;
    button{
      margin-left: 16px;
    }
  }
}
</style>
