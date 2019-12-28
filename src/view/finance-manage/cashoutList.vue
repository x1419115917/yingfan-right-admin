<!--财务管理-提现列表-->
<template>
  <div class="cashoutList">
    <Card title="提现列表">
      <Row>
        <Col span="6">
          <span>手机号</span>
          <Input v-model="form.phone" :style="{ width: inpWidth}" placeholder="请输入手机号" clearable />
        </Col>
        <Col span="18">
          <span>提现状态</span>
          <Select v-model="form.statuss" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in cashoutStatusOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" style="margin: 0 10px" @click="search">查询</Button>
          <Button type="primary" @click="download">数据下载</Button>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="dataList" stripe>
          <template slot-scope="{ row, index }" slot="status"><span>{{ returnStatus(row.status) }}</span></template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="success" size="small" style="margin-right: 5px">同意</Button>
            <Button type="error" size="small" style="margin-right: 5px">拒绝</Button>
            <Button type="primary" size="small" @click="checkDetail">详情</Button>
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
      <Modal v-model="modal" width="800" class="hideFootModal">
        <cash-out-detail @close="modal = false"></cash-out-detail>
      </Modal>
  </div>
</template>
<script>
import { doCashoutList } from '@/api/finance'
import { cashoutStatus } from './financeManage'
import cashOutDetail from './cashoutDetail'
export default {
  name: 'cashoutList',
  components: {
    cashOutDetail
  },
  data () {
    return {
      modal: false,
      inpWidth: '162px',
      pageTotal: null,
      dataList: [], // 订单列表
      form: {
        FLAG: 1,
        phone: '',
        statuss: '',
        pageIndex: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '持卡人姓名',
          key: 'trueName',
          align: 'center'
        },
        {
          title: '银行名称',
          key: 'bankName',
          align: 'center'
        },
        {
          title: '银行卡号',
          key: 'number',
          align: 'center'
        },
        {
          title: '银行支行',
          key: 'branchAddress',
          align: 'center'
        },
        {
          title: '平台手机号',
          key: 'userPhone',
          align: 'center'
        },
        {
          title: '申请时间',
          key: 'handleTime',
          align: 'center'
        },
        {
          title: '可提现',
          key: 'beforeCash',
          align: 'center'
        },
        {
          title: '提现金额',
          key: 'cash',
          align: 'center'
        },
        {
          title: '提现后金额',
          key: 'afterCash',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'status',
          align: 'center'
        },
        {
          title: '操作',
          width: 200,
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    returnStatus (item) {
      switch (item) {
        case 0 : return '待审核'
        case 1 : return '已放款'
        case 2 : return '已拒绝'
      }
    },
    checkDetail () {
      // this.modal = true
    },
    // 查询订单
    search () {
      this.getList()
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getList()
    },
    download () {
      this.$Message.warning('该功能暂未开放')
    },
    async getList () {
      this.form.statuss = [this.form.statuss]
      let data = this.form
      let res = await doCashoutList(data)
      if (res.data.code === 0) {
        this.dataList = res.data.content.rows
        this.pageTotal = res.data.content.total
      } else {
        this.dataList = []
      }
    }
  },
  computed: {
    cashoutStatusOpts () {
      return cashoutStatus()
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.cashoutList {
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
