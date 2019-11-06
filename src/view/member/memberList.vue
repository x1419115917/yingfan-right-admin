<template>
  <div>
    <Card title="会员列表">
      <Row class="role-top com_submenu">
        <Row>
          <div class="role-top-input">
            <div class="td-line">
              <span class="name">绑定手机号</span>
              <Input
                placeholder="请输入绑定手机号"
                class="w162"
                v-model="value"
              />
            </div>
            <div class="td-line">
              <span class="name">推荐人手机号</span>
              <Input
                placeholder="请输入推荐人手机号"
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
      </Row>
    </Card>
    <Row class="margin-top-10">
      <div class="bank_table" style="position:relative;">
          <Table
            :columns="columnsList"
            :data="dataList"
            height="420"
            border
            ref="mainTable"
            stripe
            :loading="tableLoading"
            no-data-text
            @on-selection-change="selected"
          >
            <template slot-scope="{ row, index }" slot="action">
              <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)">
                <i></i>
                <span>详情</span>
              </Button>
            </template>
          </Table>
          <div class="no-data" v-if="dataList.length < 1">
            <!-- <div class="no-data-img"></div> -->
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
  name: 'memberList',
  data () {
    return {
      value: '',
      imgShow1: '',
      imgUrl: '',
      addLoading: false,
      operationShow: false,
      checkedIds: [],
      checkedId: '',
      columnsList: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '序号',
          width: 120,
          key: 'id'
        },
        {
          title: '绑定手机号',
          key: 'bindPhone'
        },
        {
          title: '注册时间',
          key: 'createdTime',
          width: 180
        },
        {
          title: '推荐人手机号',
          key: 'recommendPhone'
        },
        {
          title: '销售奖励',
          key: 'reward'
        },
        {
          title: '积分金额',
          key: 'integral'
        },
        {
          title: '操作',
          width: 160,
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      userIdCreate: '',
      dataDel: [],
      addShow: false,
      selectedList: [],
      delIndex: '',
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
            id: 5,
            bindPhone: '13694240213',
            createdTime: '2019-09-26 14:12:03',
            recommendPhone: '13423512456',
            reward: '￥100.00',
            integral: '￥32.00'
          }
        ]
        this.tableLoading = false
      } else {
        this.tableLoading = false
      }
    },
    addFn () {
      this.$router.push({ name: 'thematicPub' })
    },
    searchFn () {
      this.getPageList()
    },
    operationRole () {
      if (this.operationShow) {
        // this.brandUpdate()
      } else {
        // this.saveRole()
      }
    },
    edit (index) {
      this.operationShow = true
      this.checkedId = this.dataList[index].id
      this.$router.push({
        path: 'memberDetail',
        query: {
          id: this.dataList[index].id,
          type: 'detail'
        }
      })
    },
    selected (res) {
      this.selectedList = res
      console.log(res)
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
    },
    goBack () {
      this.$router.go(-1)
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
.form-item{
  padding-left: 6px;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
  & > * {
    float: left;
  }
  .name{
    float: left;
    margin-right: 13px;
    span{
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .btn-upload{
    position: relative;
    .upload-img{
      margin-top: 10px;
      margin-left: 8px;
      width: 80px;
      height: 32px;
    }
    .img-ipt{
      position: absolute;
      left: 8px;
      top: 10px;
      opacity: 0;
      width: 80px;
      height: 32px;
    }
    .tips-upload{
      font-size: 12px;
      color: #999;
      position: absolute;
      top: 49px;
      width: 154px;
      left: 8px;
    }
  }
  .form-item-img{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #e6e6e6;
  }
  .img-box1{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #e6e6e6;
  }
}
.set-top{
  padding: 10px;
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
    // border-color: #6699CC;
  }
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
      // background: url(../../assets/img/no-data.png) center no-repeat;
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
}
.role-top .set-con{
  float: left;
  margin-top: 0;
}
.role-top-input{
  float: right;
}
.brand-list-modal{
  /deep/ .ivu-modal, .ivu-modal{
    top: 22px;
  }
}
</style>
