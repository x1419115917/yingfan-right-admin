<template>
  <div class="bankList">
    <Card title="银行列表">
      <Row>
        <Col span="24">
          <!--<span>银行名称</span>
          <Input v-model="formValidate.name" :style="{ width: inpWidth}" placeholder="请输入银行名称" clearable />
          <Button type="primary" style="margin: 0 10px">查询</Button>-->
          <Button type="success" @click="addBank">添加银行</Button>
        </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table
        :columns="columnsList"
        :data="dataList"
        border
        stripe
        :loading="tableLoading"
        no-data-text>
        <template slot-scope="{ row, index }" slot="logo">
          <div class="logo"><img :src="row.logo" /></div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" @click="deleteBank(row.id)">删除</Button>
        </template>
      </Table>
      <Page
        :current="pageNum"
        :page-size="pageSize"
        :total="pageTotal"
        show-total
        show-elevator
        show-sizer
        @on-page-size-change="changePageSize"
        @on-change="pageChange"/>
    </div>
    <Modal
      v-model="deleteModal"
      title="提示"
      @on-ok="handleDelete">
      <p>是否确认删除？</p>
    </Modal>
    <Modal v-model="modal1" class="hideFootModal" title="新增银行" width="640">
      <handle-bank @close="modal1 = false" @updateList="getPageList"></handle-bank>
    </Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import handleBank from './handleBank'
import Bus from '@/assets/js/bus.js'
import { doBankList, doDeleteBank } from '@/api/finance'
export default {
  name: 'bankList',
  components: {
    handleBank
  },
  data () {
    return {
      inpWidth: '162px',
      modal1: false,
      deleteModal: false,
      operationShow: false,
      dataList: [],
      deleteId: null,
      pageNum: 1,
      pageSize: 10,
      pageTotal: null,
      tableLoading: false,
      columnsList: [
        {
          title: '银行图标',
          slot: 'logo',
          align: 'center'
        },
        {
          title: '银行名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    addBank () {
      this.modal1 = true
      Bus.$emit('clear')
    },
    deleteBank (id) {
      this.deleteId = id
      this.deleteModal = true
    },
    async getPageList () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await doBankList(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        if (res.data.content.rows && res.data.content.rows.length > 0) {
          this.dataList = [...res.data.content.rows]
        } else {
          this.dataList = []
        }
        this.pageTotal = res.data.content.total
      }
    },
    async handleDelete () {
      let data = {
        ids: [this.deleteId],
        FLAG: 1
      }
      let res = await doDeleteBank(data)
      if (res.data.code === 0) {
        this.$Message.success('操作成功!')
        this.getPageList()
      }
    },
    changePageSize (value) {
      this.pageSize = value
      this.getPageList()
    },
    pageChange (value) {
      this.pageNum = value
      this.getPageList()
    }
  },
  created () {
    this.getPageList()
  }
}
</script>
<style lang="less" scoped>
.bankList {
  .wrap {
    margin-top: 10px;
    padding: 14px;
    background-color: #fff;
    .ivu-table {
      .logo {
        width: 60px;
        height: 6 0px;
        margin: 0 auto;
        img {
          width: 100%;
        }

      }
    }
  }
  .ivu-card {
    span {
      margin-right: 6px;
    }
  }
  .ivu-page {
    margin-top: 14px;
    text-align: center;
  }
}
</style>
