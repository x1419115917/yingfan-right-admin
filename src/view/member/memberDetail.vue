<template>
  <div>
    <Card title="会员详情">
    </Card>
    <Row class="margin-top-10 table-item">
      <div class="bank_table" style="position:relative;">
          <Table
            :columns="columnsList"
            :data="dataList"
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
          :columns="columnsList1"
          :data="dataList1"
          height="380"
          border
          ref="mainTable"
          :loading="tableLoading"
          no-data-text
        >
        </Table>
        <div class="no-data" v-if="dataList1.length < 1">
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
      <div class="bank_table" style="position:relative;" v-show="currentNav === 2">
        <Table
          :columns="columnsList3"
          :data="dataList3"
          height="380"
          border
          ref="mainTable"
          :loading="tableLoading"
          no-data-text
        >
        </Table>
        <div class="no-data" v-if="dataList3.length < 1">
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
import { listBonussPage, listScoresPage, listUserInvitesPage } from '@/api/base'
export default {
  name: 'member-detail',
  data () {
    return {
      value: '',
      imgShow1: '',
      imgUrl: '',
      navList: ['销售奖励', '应分奖励', '团队成员'],
      type: this.$route.query.type,
      memberId: this.$route.query.id,
      currentNav: 0,
      operationShow: false,
      columnsList: [
        {
          title: '绑定手机号',
          key: 'phone'
        },
        {
          title: '注册时间',
          key: 'createTime'
        },
        {
          title: '推荐人手机号',
          key: 'invitePhone'
        },
        {
          title: '累计奖励',
          key: 'bonus'
        },
        {
          title: '累计应分',
          key: 'score'
        }
      ],
      dataList: [],
      columnsList1: [
        {
          title: '序号',
          width: 120,
          key: 'id'
        },
        {
          title: '订单号',
          key: 'totalOrderId'
        },
        {
          title: '下单手机号',
          key: 'phone'
        },
        {
          title: '订单金额',
          key: 'payAmt'
        },
        {
          title: '销售奖励',
          key: 'bonus'
        },
        {
          title: '奖励状态',
          key: 'status1'
        }
      ],
      dataList1: [],
      columnsList2: [
        {
          title: '序号',
          width: 120,
          key: 'id'
        },
        {
          title: '订单号',
          key: 'totalOrderId'
        },
        {
          title: '下单手机号',
          key: 'phone'
        },
        {
          title: '订单金额',
          key: 'payAmt'
        },
        {
          title: '应分金额',
          key: 'score'
        },
        {
          title: '应分类型',
          key: 'businessType1'
        },
        {
          title: '奖励状态',
          key: 'status1'
        }
      ],
      dataList2: [],
      columnsList3: [
        {
          title: '序号',
          width: 120,
          key: 'beInviteUserId'
        },
        {
          title: '成员手机号',
          key: 'beInviteUserPhone'
        },
        {
          title: '会员等级',
          key: 'beInviteUserPhone'
        },
        {
          title: '注册时间',
          key: 'createTime'
        },
        {
          title: '升级时间',
          key: 'createTime'
        }
      ],
      dataList3: [
        {
          id: 2,
          phone: '13694240214',
          createTime: '2019-11-07 12:30:30'
        }
      ],
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
      switch (this.currentNav) {
        case 0:
          this.listBonussPage()
          break
        case 1:
          this.listScoresPage()
          break
        case 2:
          this.listUserInvitesPage()
          break
      }
    },
    async listBonussPage () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        userId: this.memberId,
        businessUserPhone: this.value,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await listBonussPage(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        console.log(res)
        this.total = +res.data.content.total
        this.dataList1 = res.data.content.rows
        this.dataList1.forEach(item => {
          item.status1 = item.status === 0 ? '冻结' : item.status === 1 ? '生效' : '失效'
        })
      }
    },
    async listUserInvitesPage () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        businessUserPhone: this.value,
        inviteUserId: this.memberId,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await listUserInvitesPage(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        this.total = +res.data.content.total
        this.dataList3 = res.data.content.rows
        // this.dataList2.forEach(item => {
        //   item.businessType1 = item.businessType === 1 ? '购物获得应分' : '下级购物返应分'
        //   item.status1 = item.status === 0 ? '冻结' : item.status === 1 ? '生效' : '失效'
        // })
      }
    },
    async listScoresPage () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        businessUserPhone: this.value,
        userId: this.memberId,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await listBonussPage(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        this.total = +res.data.content.total
        this.dataList2 = res.data.content.rows
        this.dataList2.forEach(item => {
          item.businessType1 = item.businessType === 1 ? '购物获得应分' : '下级购物返应分'
          item.status1 = item.status === 0 ? '冻结' : item.status === 1 ? '生效' : '失效'
        })
      }
    },
    changeNav (index) {
      this.currentNav = index
      this.pageNum = 1
      this.pageSize = 10
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
    this.dataList = []
    let memberObj = JSON.parse(sessionStorage.getItem('memberObj'))
    this.dataList = [{ ...memberObj }]
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
