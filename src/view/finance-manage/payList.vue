<!--财务管理-交易流水-->
<template>
  <div class="tradeList">
    <Card title="交易流水">
      <Row>
        <Col span="6">
          <span>交易流水号</span>
          <Input v-model="form.num" :style="{ width: inpWidth}" placeholder="请输入" clearable />
        </Col>
        <Col span="6">
          <span>订单状态</span>
          <Select v-model="form.orderStatus" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in orderStatusOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <div class="btn">
            <Button type="primary" style="margin-right: 5px" @click="search">查询</Button>
            <Button type="primary" @click="download">数据下载</Button>
          </div>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="dataList" stripe>
          <template slot-scope="{ row, index }" slot="payAmt"><span>¥{{ row.payAmt }}</span></template>
          <template slot-scope="{ row, index }" slot="orderStatus"><span>{{ returnOrderStatus(row.orderStatus) }}</span></template>
          <template slot-scope="{ row, index }" slot="action">
            <!--待发货-->
            <template v-if="row.orderStatus === 1">
              <Button type="primary" size="small" style="margin-right: 5px" @click="checkDetail(row, index)">详情</Button>
              <Button type="primary" size="small" style="margin-right: 5px" @click="deliverGood">发货</Button>
              <Button type="primary" size="small" @click="mark(index)">客服备注</Button>
            </template>
            <template v-else-if="row.orderStatus !== 1">
              <Button type="primary" size="small" style="margin-right: 5px" @click="checkDetail(row, index)">详情</Button>
              <Button type="primary" size="small" @click="mark(index)">客服备注</Button>
            </template>
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
import { orderStatus } from './financeManage'
export default {
  name: 'payList',
  components: {
  },
  data () {
    return {
      inpWidth: '162px',
      pageTotal: null,
      dataList: [], // 订单列表
      form: {
        num: null,
        orderStatus: null,
        pageIndex: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '交易流水号',
          key: 'totalOrderId',
          align: 'center'
        },
        {
          title: '订单号',
          align: 'center'
        },
        {
          title: '支付时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '交易金额（元）',
          align: 'center'
        },
        {
          title: '交易状态',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    // 查询订单
    search () {
    },
    changePageSize (value) {
    },
    pageChange (value) {
    },
    download () {}
  },
  computed: {
    orderStatusOpts () {
      return orderStatus()
    }
  },
  created () {
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
