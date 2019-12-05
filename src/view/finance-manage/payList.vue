<!--财务管理-交易流水-->
<template>
  <div class="tradeList">
    <Card title="交易流水">
      <Row>
        <Col span="6">
          <span>订单号</span>
          <Input v-model="form.businessId" :style="{ width: inpWidth}" placeholder="请输入订单号" clearable />
        </Col>
        <Col span="18">
          <span>支付状态</span>
          <Select v-model="form.status" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in orderStatusOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" style="margin: 0 10px" @click="search">查询</Button>
          <Button type="primary" @click="download">数据下载</Button>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="dataList" stripe>
          <template slot-scope="{ row, index }" slot="transactionId">
            <span v-if="row.transactionId">{{ row.transactionId }}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row, index }" slot="timeEnd">
            {{ $moment(row.timeEnd).format("YYYY-MM-DD HH:mm:ss")}}
          </template>
          <template slot-scope="{ row, index }" slot="status"><span>{{ returnStatus(row.status) }}</span></template>
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
import { orderStatus } from './financeManage'
export default {
  name: 'payList',
  data () {
    return {
      inpWidth: '162px',
      pageTotal: null,
      dataList: [], // 订单列表
      form: {
        FLAG: 1,
        businessId: null,
        status: null,
        pageIndex: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '交易流水号',
          slot: 'transactionId',
          align: 'center'
        },
        {
          title: '订单号',
          key: 'businessId',
          align: 'center'
        },
        {
          title: '支付时间',
          align: 'center',
          slot: 'timeEnd'
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
    returnStatus (item) {
      switch (item) {
        case 0 : return '待支付'
        case 1 : return '交易成功'
      }
    },
    // 查询订单
    search () {
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
  .ivu-card-body {
    .ivu-col {
      span {
        margin-right: 6px;
      }
    }
  }
  .ivu-page {
    margin-top: 14px;
    text-align: center;
  }
}
</style>
