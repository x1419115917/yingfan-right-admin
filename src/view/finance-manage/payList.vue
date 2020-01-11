<!--财务管理-交易流水-->
<template>
  <div class="tradeList">
    <Card title="交易流水">
      <Row class="rowMargin">
        <Col span="6">
          <span>支付时间</span>
            <DatePicker
              type="daterange"
              @on-change="selectDate"
              v-model="date"
              placeholder="年/月/日" ></DatePicker>
        </Col>
        <Col span="6">
          <span>商户订单号</span>
          <Input v-model="form.serialNumber" :style="{ width: inpWidth}" placeholder="请输入商户订单号" clearable />
        </Col>
        <Col span="6">
          <span>订单号</span>
          <Input v-model="form.businessId" :style="{ width: inpWidth}" placeholder="请输入订单号" clearable />
        </Col>
        <Col span="6">
          <span>支付状态</span>
          <Select v-model="form.status" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in orderStatusOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span="6">
          <span>交易金额</span>
          <Input v-model.number="form.payFeeBegin" :style="{ width: moneyInpWidth}" clearable />
          <span class="line">-</span>
          <Input v-model.number="form.payFeeEnd" :style="{ width: moneyInpWidth}" clearable @on-blur="checkRange" />
        </Col>
        <Col span="6">
          <span>支付来源</span>
          <Select v-model="form.paySource" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in paySourceOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <Button type="primary" style="margin: 0 10px" @click="search">查询</Button>
          <Button type="primary" @click="download">数据下载</Button>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="dataList" stripe>
        <template slot-scope="{ row, index }" slot="timeEnd">
          <span v-if="row.timeEnd">{{ $moment(row.timeEnd).format("YYYY-MM-DD HH:mm:ss")}}</span>
          <span v-else>-</span>
        </template>
        <template slot-scope="{ row, index }" slot="status"><span>{{ returnStatus(row.status) }}</span></template>
        <template slot-scope="{ row, index }" slot="paySource"><span>{{ returnPaySource(row.paySource) }}</span></template>
        <template slot-scope="{ row, index }" slot="payFee">
          <span v-if="row.payFee">¥{{ row.payFee }}</span>
          <span v-else>-</span>
        </template>
      </Table>
      <Page
        :current="form.pageNum"
        :page-size="form.pageSize"
        :total="pageTotal"
        show-total
        show-elevator
        show-sizer
        @on-page-size-change="changePageSize"
        @on-change="pageChange"/>
      </div>
  </div>
</template>
<script>
import { doPayList } from '@/api/finance'
import { orderStatus, paySource } from './financeManage'
export default {
  name: 'payList',
  data () {
    return {
      inpWidth: '162px',
      moneyInpWidth: '80px',
      pageTotal: null,
      date: [], // 选择日期
      dataList: [], // 订单列表
      form: {
        FLAG: 1,
        payFeeBegin: null,
        payFeeEnd: null,
        paySource: null,
        businessId: null,
        serialNumber: null,
        timeEndBegin: null,
        timeEndEnd: null,
        status: null,
        pageIndex: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '商户订单号',
          key: 'serialNumber',
          align: 'center'
        },
        {
          title: '平台订单号',
          key: 'businessId',
          align: 'center'
        },
        {
          title: '支付时间',
          align: 'center',
          slot: 'timeEnd'
        },
        {
          title: '支付来源',
          align: 'center',
          slot: 'paySource'
        },
        {
          title: '交易金额（元）',
          slot: 'payFee',
          align: 'center'
        },
        {
          title: '交易状态',
          slot: 'status',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    returnPaySource (item) {
      switch (item) {
        case 0 : return '微信小程序支付'
        case 1 : return '微信支付'
        case 2 : return '支付宝支付'
      }
    },
    returnStatus (item) {
      switch (item) {
        case 0 : return '待支付'
        case 1 : return '交易成功'
      }
    },
    selectDate () {
      this.form.timeEndBegin = this.$moment(new Date(this.date[0])).format('YYYY-MM-DD')
      this.form.timeEndEnd = this.$moment(new Date(this.date[1])).format('YYYY-MM-DD')
    },
    checkRange () {
      if (this.form.payFeeBegin > this.form.payFeeEnd) {
        this.$Message.warning('输入的金额起始值需小于末尾值')
        this.form.payFeeBegin = null
        this.form.payFeeEnd = null
        return false
      }
    },
    // 查询订单
    search () {
      this.form.pageIndex = 1
      this.getPayList()
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getPayList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getPayList()
    },
    download () {
      this.$Message.warning('该功能暂未开放')
    },
    async getPayList () {
      let data = this.form
      if (this.form.timeEndBegin === 'Invalid date') {
        this.form.timeEndBegin = ''
        this.form.timeEndEnd = ''
      }
      let res = await doPayList(data)
      if (res.data.code === 0) {
        this.dataList = res.data.content.rows
        this.pageTotal = res.data.content.total
      } else {
        this.dataList = []
      }
    }
  },
  computed: {
    orderStatusOpts () {
      return orderStatus()
    },
    paySourceOpts () {
      return paySource()
    }
  },
  created () {
    this.getPayList()
  }
}
</script>
<style lang="less" scoped>
.tradeList {
  .wrap {
    margin-top: 10px;
    padding: 14px;
    background-color: #fff;
  }
  .rowMargin {
    margin-bottom: 20px;
  }
  .ivu-card-body {
    .ivu-col {
      span {
        margin-right: 6px;
      }
      .line {
        margin: 0 10px;
      }
    }
  }
  .ivu-page {
    margin-top: 14px;
    text-align: center;
  }
}
</style>
