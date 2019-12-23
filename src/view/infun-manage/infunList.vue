<!--应分管理-应分列表-->
<template>
  <div class="infunList">
    <!--<div class="overview">
      <Row :gutter="20">
        <Col :span="8">
          <Card>
            <Row>
              <Col :span="12">
                <div class="logo">
                  <img src="@/assets/images/noImg.png">
                </div>
              </Col>
              <Col :span="12">
                <div class="txt">
                  <h4>平台输出总应分</h4>
                  <p>{{overview.totalProduce}}</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col :span="8">
          <Card>
            <Row>
              <Col :span="12">
                <div class="logo">
                  <img src="@/assets/images/noImg.png">
                </div>
              </Col>
              <Col :span="12">
                <div class="txt">
                  <h4>总消耗应分</h4>
                  <p>{{overview.totalConsume}}</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col :span="8">
          <Card>
            <Row>
              <Col :span="12">
                <div class="logo">
                  <img src="@/assets/images/noImg.png">
                </div>
              </Col>
              <Col :span="12">
                <div class="txt">
                  <h4>今日产出总应分</h4>
                  <p>{{overview.todayProduce}}</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>-->
    <Card title="应分列表">
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
          <span>应分类型</span>
          <Select v-model="form.businessType" :style="{ width: inpWidth}" clearable>
            <Option v-for="item in infunTypeOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" style="margin: 0 10px" @click="search">查询</Button>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
        <Table :columns="columns" border :data="dataList" stripe>
          <template slot-scope="{ row, index }" slot="businessType">
            <span>{{ returnBusinessType(row.businessType) }}</span>
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
import { doInFunList, doMainScore } from '@/api/infun'
import { infunType } from './infunManage.js'
export default {
  name: 'infunList',
  data () {
    return {
      inpWidth: '162px',
      pageTotal: null,
      dataList: [], // 订单列表
      date: [], // 选择日期
      overview: {}, // 数据概览
      form: {
        FLAG: 1,
        businessType: '', // 应分类型
        businessUserPhone: '', // 手机号
        createTimeBegin: '', // 开始时间
        createTimeEnd: '', // 结束时间
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
          title: '应分类型',
          slot: 'businessType',
          align: 'center'
        },
        {
          title: '获取时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '应分',
          key: 'score',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    returnBusinessType (item) {
      switch (item) {
        case 1: return '购物应分'
        case 2: return '分享应分'
        case 3: return '消费抵扣'
        case 4: return '应分抵扣'
        case 5: return '退款'
      }
    },
    selectDate () {
      this.form.createTimeBegin = this.$moment(new Date(this.date[0])).format('YYYY-MM-DD')
      this.form.createTimeEnd = this.$moment(new Date(this.date[1])).format('YYYY-MM-DD')
    },
    // 查询
    search () {
      this.getInFunList()
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getInFunList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getInFunList()
    },
    async getInFunList () {
      let data = this.form
      if (this.form.createTimeBegin === 'Invalid date') {
        this.form.createTimeBegin = ''
        this.form.createTimeEnd = ''
      }
      let res = await doInFunList(data)
      if (res.data.code === 0) {
        this.dataList = res.data.content.rows
        this.pageTotal = res.data.content.total
      } else {
        this.dataList = []
      }
    },
    async getMainScore () {
      let res = await doMainScore()
      if (res.data.code === 0) {
        this.overview = res.data.content
      }
    }
  },
  computed: {
    infunTypeOpts () {
      return infunType()
    }
  },
  created () {
    this.getInFunList()
    this.getMainScore()
  }
}
</script>
<style lang="less" scoped>
.infunList {
  .overview {
    margin-bottom: 20px;
    .logo {
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .txt {
      p {
        font-size: 50px;
      }
    }
  }
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
