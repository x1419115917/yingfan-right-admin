<!--应分管理-余额列表-->
<template>
  <div class="balanceList">
    <Card title="余额列表">
      <Row>
        <Col span="6">
          <span>手机号</span>
          <Input v-model="form.businessUserPhone" :style="{ width: inpWidth}" placeholder="请输入手机号" clearable />
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
          <Select v-model="form.businessType" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in inComeTypeOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" style="margin: 0 10px" @click="search">查询</Button>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
        <Table :columns="columns" border :data="dataList" stripe>
          <template slot-scope="{ row, index }" slot="businessType"><span>{{ returnBusinessType(row.businessType) }}</span></template>
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
import { doInFunBonussList } from '@/api/infun'
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
        businessUserPhone: '', // 手机号
        businessType: '',
        createTimeBegin: null, // 开始时间
        createTimeEnd: null, // 结束时间
        pageIndex: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '绑定手机号',
          key: 'phone',
          align: 'center'
        },
        {
          title: '收益类型',
          slot: 'businessType',
          align: 'center'
        },
        {
          title: '获取时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '收益',
          key: 'bonus',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    returnBusinessType (item) {
      switch (item) {
        case 1: return '分享收益'
        case 2: return '邀新收益'
        case 3: return '应分兑换收益'
        case 4: return '退款'
      }
    },
    selectDate () {
      this.form.createTimeBegin = this.$moment(new Date(this.date[0])).format('YYYY-MM-DD')
      this.form.createTimeEnd = this.$moment(new Date(this.date[1])).format('YYYY-MM-DD')
    },
    // 查询
    search () {
      this.getInFunBonussList()
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getInFunBonussList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getInFunBonussList()
    },
    async getInFunBonussList () {
      let data = this.form
      if (this.form.createTimeBegin === 'Invalid date') {
        this.form.createTimeBegin = null
        this.form.createTimeEnd = null
      }
      let res = await doInFunBonussList(data)
      if (res.data.code === 0) {
        this.dataList = res.data.content.rows
        this.pageTotal = res.data.content.total
      } else {
        this.dataList = []
      }
    }
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
    this.getInFunBonussList()
  }
}
</script>
<style lang="less" scoped>
.balanceList {
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
