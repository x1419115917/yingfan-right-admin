<!--首页配置-banner列表-->
<template>
  <div class="bannerList">
    <Card title="首页展示列表">
      <Row>
          <Col span="6">
            <span>名称</span>
            <Input v-model="form.activityName" :style="{ width :inpWidth}" placeholder="请输入名称" clearable></Input>
          </Col>
          <Col span="5">
            <span>展示位置</span>
            <Select v-model="form.plateRegion" placeholder="请选择展示位置" :style="{width: inpWidth}" clearable>
              <Option v-for="item in showDotOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="6">
            <Button type="primary" style="margin-right: 5px" @click="search">查询</Button>
          </Col>
          <Col span="6" offset="1">
            <Button class="addBtn" icon="ios-add" type="success" @click="add" v-has="'sys:homePage:add'">新增</Button>
          </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="activeList" stripe>
        <template slot-scope="{ row, index }" slot="plateRegion">{{ returnPlateRegion(row.plateRegion) }}</template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="checkDetail(row)">详情</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)" v-has="'sys:homePage:edit'">编辑</Button>
          <Button type="error" size="small" @click="remove(row)" v-has="'sys:homePage:remove'">删除</Button>
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
        @on-change="pageChange" />
    </div>
    <Modal
      v-model="modal"
      title="提示"
      @on-ok="ok">
      <p>删除后无法恢复，确定删除？</p>
    </Modal>
    <Modal
    width='800'
      v-model="detailModal"
      title="活动详情">
      <banner-detail :activeMsg="activeMsg"></banner-detail>
  </Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import bannerDetail from './bannerDetail'
import { showDot } from './homeManage.js'
import { doActiveList, doBannerList, doRemoveHomeBanner } from '@/api/home'
export default {
  name: 'bannerList',
  components: {
    bannerDetail
  },
  data () {
    return {
      modal: false,
      detailModal: false,
      activeMsg: '', // 活动详情
      inpWidth: '200px',
      activeList: [],
      pageTotal: null,
      deleteIds: {
        FLAG: 1,
        ids: []
      },
      form: {
        FLAG: 1,
        activityName: '', // 专题名称
        plateRegion: '', // 展示位置
        pageIndex: 1,
        pageSize: 10 // 每页查询数量
      },
      columns: [
        {
          title: '序号',
          key: 'id',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          align: 'center',
          key: 'plateName'
        },
        {
          title: '展示位置',
          align: 'center',
          slot: 'plateRegion'
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
    returnPlateRegion (item) {
      switch (item) {
        case 0 : return '首页banner'
          break
        case 1 : return '首页活动版块'
          break
        case 2 : return '首页主题精选'
          break
      }
    },
    search () {
      this.getActiveList()
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getActiveList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getActiveList()
    },
    checkDetail (row) {
      this.detailModal = true
      this.activeMsg = row
    },
    edit () {},
    remove (row) {
      this.modal = true
      this.deleteIds.ids.length = 0
      this.deleteIds.ids.push(row.id)
    },
    async ok () {
      let res = await doRemoveHomeBanner(this.deleteIds)
      if (res.data.code === 0) {
        this.$Message.success('操作成功!')
        this.getActiveList()
      }
    },
    async getActiveList () {
      let res = await doBannerList(this.form)
      if (res.data.code === 0) {
        this.activeList = res.data.content.rows
        this.pageTotal = res.data.content.total
      }
    },
    add () {
      this.$router.push({ path: '/homeManage/addBanner' })
    }
  },
  computed: {
    showDotOpts () {
      return showDot()
    }
  },
  created () {
    this.getActiveList()
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
