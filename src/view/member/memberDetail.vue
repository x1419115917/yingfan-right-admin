<template>
  <div>
    <Card title="会员详情">
    </Card>
    <Row class="margin-top-10 table-item">
      <div class="bank_table" style="position:relative;">
          <Table
            :columns="columnsList1"
            :data="dataList1"
            height="90"
            border
            ref="mainTable"
            no-data-text
          >
          </Table>
        </div>
    </Row>
    <Row class="role-top com_submenu">
      <div class="role-top-input">
        <div class="td-line">
          <span class="name">下单手机号</span>
          <Input
            placeholder="请输入下单手机号"
            class="w162"
            v-model="value"
          />
        </div>
        <div class="td-line btn">
          <Button @click="clearInputs" style="margin-right: 6px;">重置</Button>
          <Button type="primary" @click="searchFn">查询</Button>
        </div>
      </div>
    </Row>
    <Row class="nav">
      <span class="nav-item" :class="currentNav === index ? 'nav-active' : ''" v-for="(item, index) in navList" :key="index" @click="changeNav(index)">{{item}}</span>
    </Row>
    <Row>
      <div class="bank_table" style="position:relative;" v-show="currentNav === 0">
        <Table
          :columns="columnsList"
          :data="dataList"
          height="380"
          border
          ref="mainTable"
          :loading="tableLoading"
          no-data-text
        >
        </Table>
        <div class="no-data" v-if="dataList.length < 1">
          <!-- <div class="no-data-img"></div> -->
          <div class="no-tit">暂无数据</div>
        </div>
      </div>
      <div class="bank_table" style="position:relative;" v-show="currentNav === 1">
        <Table
          :columns="columnsList2"
          :data="dataList2"
          height="380"
          border
          ref="mainTable"
          :loading="tableLoading"
          no-data-text
        >
        </Table>
        <div class="no-data" v-if="dataList2.length < 1">
          <div class="no-tit">暂无数据</div>
        </div>
      </div>
      <div class="pages">
        <Page
          :current="pageNum"
          :page-size="pageSize"
          :total="total"
          show-total
          show-elevator
          show-sizer
          @on-page-size-change="changePageSize"
          @on-change="pageChange"
        />
      </div>
    </Row>
  </div>
</template>
<script>
import { activityList } from '@/api/thematic'
export default {
  name: 'member-detail',
  data () {
    return {
      value: '',
      imgShow1: '',
      imgUrl: '',
      navList: ['销售奖励', '积分奖励'],
      currentNav: 0,
      operationShow: false,
      columnsList1: [
        {
          title: '绑定手机号',
          key: 'bindPhone'
        },
        {
          title: '注册时间',
          key: 'createdTime'
        },
        {
          title: '推荐人手机号',
          key: 'recommendPhone'
        },
        {
          title: '累计奖励',
          key: 'reward'
        },
        {
          title: '累计积分',
          key: 'integral'
        },
        {
          title: '累计积分金额',
          key: 'integralPrice'
        }
      ],
      dataList1: [{
        bindPhone: '13694240321',
        createdTime: '2019-09-26 14:12:03',
        recommendPhone: '13423524512',
        reward: '￥100.00',
        integral: '44550',
        integralPrice: '￥32.00'
      }],
      columnsList: [
        {
          title: '序号',
          width: 120,
          key: 'id'
        },
        {
          title: '订单号',
          key: 'orderId'
        },
        {
          title: '下单手机号',
          key: 'orderPhone'
        },
        {
          title: '订单金额',
          key: 'orderPrice'
        },
        {
          title: '奖励比例',
          key: 'scale'
        },
        {
          title: '销售奖励',
          key: 'award'
        },
        {
          title: '奖励状态',
          key: 'status'
        }
      ],
      dataList: [],
      columnsList2: [
        {
          title: '序号',
          width: 120,
          key: 'id'
        },
        {
          title: '订单号',
          key: 'orderId'
        },
        {
          title: '下单手机号',
          key: 'orderPhone'
        },
        {
          title: '订单金额',
          key: 'orderPrice'
        },
        {
          title: '积分比例',
          key: 'scale'
        },
        {
          title: '积分金额',
          key: 'point'
        },
        {
          title: '积分类型',
          key: 'pointType'
        },
        {
          title: '奖励状态',
          key: 'status'
        }
      ],
      dataList2: [],
      addShow: false,
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      tableLoading: false
    }
  },
  methods: {
    async getPageList () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        activityName: this.value
      }
      let res = await activityList(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = [
          {
            id: 10,
            orderId: '5563420192060165620',
            orderPhone: '13694241201',
            orderPrice: '￥100.00',
            scale: '30%',
            award: '￥30.00',
            status: '已转'
          },
          {
            id: 8,
            orderId: '5563420192325165620',
            orderPhone: '13694246501',
            orderPrice: '￥200.00',
            scale: '30%',
            award: '￥60.00',
            status: '已转'
          }
        ]
        this.tableLoading = false
      } else {
        this.tableLoading = false
      }
    },
    changeNav (index) {
      this.currentNav = index
      this.getPageList()
    },
    searchFn () {
      this.getPageList()
    },
    changePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.getPageList()
    },
    updateDataList () {
      this.pageNum = 1
      this.pageSize = 10
      this.getPageList()
    },
    pageChange (value) {
      this.pageNum = value
      this.getPageList()
    },
    clearInputs () {
      this.pageNum = 1
      this.pageSize = 10
      this.value = ''
      this.getPageList()
    }
  },
  created () {
    this.getPageList()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.nav{
  background-color: #fff;
  padding-bottom: 6px;
  .nav-item{
    display: inline-block;
    cursor: pointer;
    width: 178px;
    height: 37px;
    text-align: center;
    line-height: 37px;
    border: 1px solid #e2e2e2;
  }
  .nav-active{
    background-color: #2d8cf0;
    color: #fff;
  }
}
.table-item{
  padding-bottom: 30px;
  background-color: #fff;
}
.role-top{
  width: 100%;
  position: relative;
  .set-con{
    margin-top: 15px;
  }
  .td-line{
    float: left;
    margin-right: 24px;
    margin-bottom: 10px;
    .name{
      display: inline-block;
      margin-right: 6px;
    }
  }
  .expand-box{
    position: absolute;
    right: 8px;
    top: 0px;
    font-size: 13px;
    cursor: pointer;
    &:hover{
      color: #ff0036;
      text-decoration: none;
    }
  }
  .role-top-left{
    float: left;
    width: 300px;
  }
  .role-top-right{
    float: right;
  }
  .btn{
    margin-right: 10px;
  }
  .ipt{
    margin-right: 10px;
  }
}

.no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .no-data-img {
      width: 404px;
      height: 253px;
      background-size: contain;
    }
    .no-tit {
      width: 404px;
      text-align: center;
      font-size: 14px;
    }
  }
.pages {
  position: relative;
  padding: 10px 0;
  text-align: center;
  background: #fff;
  .operation {
    position: absolute;
    left: 0px;
  }
}
.btn-item{
  margin-left: 6px;
}
.com_submenu{
  padding: 0;
  margin-bottom: 0;
  border: 0;
  padding-bottom: 20px;
}
.role-top .set-con{
  float: left;
  margin-top: 0;
}
.role-top-input{
  float: left;
  margin-left: 20px;
}
.brand-list-modal{
  /deep/ .ivu-modal, .ivu-modal{
    top: 22px;
  }
}
/deep/ .ivu-card-body,.ivu-card-body{
  display: none;
}
</style>
