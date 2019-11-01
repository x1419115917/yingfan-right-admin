<!--首页配置-banner列表-->
<template>
  <div class="bannerList">
    <Card title="首页banner列表">
      <Row>
          <Col span="6">
            <span>起止时间</span>
            <DatePicker type="datetimerange" placeholder="请选择时间" style="width: 300px" clearable></DatePicker>
          </Col>
          <Col span="6">
            <Button type="primary" style="margin-right: 5px" @click="search">查询</Button>
          </Col>
          <Col span="6" offset="6">
            <Button class="addBtn" icon="ios-add" type="success" @click="add" v-has="'sys:homePage:add'">新增</Button>
          </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="dataList" stripe>
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)" v-has="'sys:homePage:edit'">编辑</Button>
            <Button type="error" size="small" @click="remove(index)" v-has="'sys:homePage:remove'">删除</Button>
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
import has from '@/directive/module/has.js'
import { doBannerList } from '@/api/order'
export default {
  name: 'bannerList',
  components: {
  },
  data () {
    return {
      dataList: [],
      pageTotal: null,
      form: {
        FLAG: 1,
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        pageIndex: 1,
        pageSize: 10 // 每页查询数量
      },
      columns: [
        {
          title: '序号',
          key: 'totalOrderId',
          width: 60,
          align: 'center'
        },
        {
          title: '图片预览',
          align: 'center'
        },
        {
          title: '跳转链接',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '起止时间',
          align: 'center'
        },
        {
          title: '权重',
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
    search () {},
    changePageSize (value) {
    },
    pageChange (value) {
    },
    edit () {},
    remove () {},
    add () {
      this.$router.push({ path: '/homeManage/addBanner' })
    }
  },
  computed: {
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.bannerList {
  .wrap {
    margin-top: 10px;
    padding: 14px;
    background-color: #fff;
  }
  .addBtn {
    float: right;
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
