<!--订单管理-退货地址-->
<template>
  <div class="returnAddress">
    <Card title="退货地址">
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="dataList" stripe :loading="tableLoading">
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
      </Modal>
    </div>
  </div>
</template>
<script>
import { doOrderList } from '@/api/order'
import { orderStatus, type } from './orderList'
export default {
  name: 'returnAddress',
  components: {
  },
  data () {
    return {
      modal: false,
      activeIndex: 0,
      inpWidth: '162px',
      dataList: [], // 订单列表
      date: [], // 选择日期
      pageTotal: null,
      tableLoading: false,
      form: {
        FLAG: 1,
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        orderStatus: null, // 订单状态
        pageIndex: 1,
        pageSize: 10 // 每页查询数量
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '供应商名称',
          align: 'center',
          slot: 'payAmt'
        },
        {
          title: '退货地址',
          align: 'center',
          key: 'createTime'
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
    changePageSize (value) {
      this.form.pageSize = value
      this.getOrderList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getOrderList()
    },
    getOrderList () {
      // this.tableLoading = true
      // let data = this.form
      // let res = await doOrderList(data)
      // this.tableLoading = false
      // if (res.data.code === 0) {
      //   if (res.data.content.rows && res.data.content.rows.length > 0) {
      //     this.dataList = [...res.data.content.rows]
      //   } else {
      //     this.dataList = []
      //   }
      //   this.pageTotal = res.data.content.total
      // }
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.returnAddress {
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
