<!--应分管理-收益列表-->
<template>
  <div class="inComeList">
    <Card title="收益列表">
      <Row>
        <Col span="6">
          <span>手机号</span>
          <Input v-model="form.number" :style="{ width: inpWidth}" placeholder="请输入手机号" clearable />
        </Col>
        <Col span="6">
          <span>时间</span>
          <DatePicker
            type="daterange"
            v-model="date"
            @on-change="selectDate"
            placeholder="年/月/日" ></DatePicker>
        </Col>
        <Col span="12">
          <span>收益类型</span>
          <Select v-model="form.number" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in inComeTypeOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" style="margin: 0 10px" @click="search">查询</Button>
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
// import { doPayList } from '@/api/finance'
import { infunType, inComeType } from './infunManage.js'
export default {
  name: 'infunList',
  data () {
    return {
      inpWidth: '162px',
      pageTotal: null,
      dataList: [], // 订单列表
      date: [], // 选择日期
      form: {
        FLAG: 1,
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        number: null,
        pageIndex: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '绑定手机号',
          key: 'number',
          align: 'center'
        },
        {
          title: '收益类型',
          key: 'businessId',
          align: 'center'
        },
        {
          title: '获取时间',
          align: 'center',
          slot: 'timeEnd'
        },
        {
          title: '收益',
          slot: 'payFee',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    selectDate () {
      this.form.startTime = new Date(this.date[0]).valueOf()
      this.form.endTime = new Date(this.date[1]).valueOf()
    },
    // 查询
    search () {
    },
    changePageSize (value) {
      // this.form.pageSize = value
    },
    pageChange (value) {
      // this.form.pageIndex = value
    }
    // async getPayList () {
    //   let data = this.form
    //   let res = await doPayList(data)
    //   if (res.data.code === 0) {
    //     this.dataList = res.data.content.rows
    //     this.pageTotal = res.data.content.total
    //   } else {
    //     this.dataList = []
    //   }
    // }
  },
  computed: {
    infunTypeOpts () {
      return infunType()
    },
    inComeTypeOpts () {
      return inComeType()
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.inComeList {
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
