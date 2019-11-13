<!--订单管理-商城订单-->
<template>
  <div class="orderList">
    <Card title="订单列表">
      <Row>
        <Col span="6">
        <span>下单时间</span>
          <DatePicker
            type="daterange"
            v-model="date"
            @on-change="selectDate"
            placeholder="年/月/日" ></DatePicker>
        </Col>
        <Col span="6">
          <Select style="width: 100px; margin-right: 6px;" clearable>
            <Option v-for="item in typeOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input v-model="form.type" :style="{ width: inpWidth}" placeholder="请输入" />
        </Col>
        <Col span="6">
          <span>订单状态</span>
          <Select v-model="form.orderStatus" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in orderStatusOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <span>售后状态</span>
          <Select v-model="form.afterSale" :style="{ width: inpWidth}" disabled clearable>
            <Option v-for="item in afterSaleOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <div class="btn">
        <Button type="primary" style="margin-right: 5px" @click="search">查询</Button>
        <Button type="primary" @click="download">数据下载</Button>
      </div>
    </Card>
    <div class="wrap">
      <div class="state">
        <span
          @click="selectState(item.value,index)"
          :class="activeIndex === index ? 'btnActive' : ''"
          v-for="(item,index) in orderStatusOpts"
          :value="item.value" :key="item.value" class="stateBtn">{{ item.label }}</span>
      </div>
      <Table :columns="columns" border :data="dataList" stripe :loading="tableLoading">
        <template slot-scope="{ row, index }" slot="payAmt"><span>¥{{ row.payAmt }}</span></template>
        <template slot-scope="{ row, index }" slot="orderStatus"><span>{{ returnOrderStatus(row.orderStatus) }}</span></template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="checkDetail(row, index)">详情</Button>
          <!--待发货-->
          <template v-if="row.orderStatus === 1">
            <Button type="primary" size="small" style="margin-right: 5px" @click="checkDetail(row, index)">发货</Button>
          </template>
          <Button type="primary" size="small" @click="mark(index)">客服备注</Button>
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
      <Modal v-model="modal" width="800" class="hideFootModal orderDetailModal">
        <order-detail @updateList="getOrderList" @close="modal = false" :orderId="orderId"></order-detail>
      </Modal>
    </div>
  </div>
</template>
<script>
import { doOrderList } from '@/api/order'
import { orderStatus, afterSale, type } from './orderList'
import orderDetail from './orderDetail'
export default {
  name: 'orderList',
  components: {
    orderDetail
  },
  data () {
    return {
      modal: false,
      activeIndex: 0,
      inpWidth: '162px',
      dataList: [], // 订单列表
      date: [], // 选择日期
      pageTotal: null,
      orderId: null, // 订单id
      tableLoading: false,
      form: {
        FLAG: 1,
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        // type: null,          //查询类型
        orderStatus: null, // 订单状态
        pageIndex: 1,
        pageSize: 10 // 每页查询数量
      },
      columns: [
        {
          title: '订单号',
          key: 'totalOrderId',
          align: 'center'
        },
        {
          title: '订单金额',
          align: 'center',
          slot: 'payAmt'
        },
        {
          title: '下单时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '订单状态',
          align: 'center',
          slot: 'orderStatus'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ]
    }
  },
  methods: {
    returnOrderStatus (item) {
      switch (item) {
        case 0 : return '待付款'
        case 1 : return '待发货'
        case 2 : return '已发货'
        case 3 : return '交易完成'
        case 4 : return '交易关闭'
      }
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getOrderList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getOrderList()
    },
    // 选择订单状态
    selectState (value, index) {
      this.activeIndex = index
      this.form.orderStatus = value
      this.getOrderList()
    },
    selectDate () {
      this.form.startTime = new Date(this.date[0]).valueOf()
      this.form.endTime = new Date(this.date[1]).valueOf()
    },
    // 查询订单
    search () {
      this.getOrderList()
    },
    // 查询订单详情
    checkDetail (data, index) {
      this.orderId = data.id
      this.modal = true
    },
    // 添加备注
    mark () {
      this.$Message.warning('该功能暂未开放')
    },
    download () {
      this.$Message.warning('该功能暂未开放')
    },
    async getOrderList () {
      this.tableLoading = true
      let data = this.form
      let res = await doOrderList(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        if (res.data.content.rows && res.data.content.rows.length > 0) {
          this.dataList = [...res.data.content.rows]
        } else {
          this.dataList = [{ ...res.data.content }]
        }
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
    afterSaleOpts () {
      return afterSale()
    },
    typeOpts () {
      return type()
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.orderList {
  .btnActive {
    color: #6699CC
  }
  .wrap {
    margin-top: 10px;
    padding: 14px;
    background-color: #fff;
    .state {
      margin-bottom: 14px;
      span{
        display: inline-block;
        width: 112px;
        height: 51px;
        text-align: center;
        line-height: 51px;
        border: 1px solid #e6e6e6;
        cursor: pointer;
      }
      .btn-active{
        color: #6699CC;
      }
    }
  }
  .btn {
    margin-top: 16px;
    text-align: right;
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
