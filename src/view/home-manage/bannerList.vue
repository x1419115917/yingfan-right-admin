<!--首页配置-banner列表-->
<template>
  <div class="bannerList">
    <Card title="首页展示列表">
      <Row>
          <Col span="6">
            <span>专题名称</span>
            <Input v-model="form.plateName" :style="{ width :inpWidth}" placeholder="请输入专题名称" clearable></Input>
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
    <Modal
      v-model="modal"
      title="提示"
      @on-ok="ok">
      <p>删除后无法恢复，确定删除？</p>
  </Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import { showDot } from './homeManage.js'
import { doActiveList, doBannerList } from '@/api/home'
export default {
  name: 'bannerList',
  components: {
  },
  data () {
    return {
      modal: false,
      inpWidth: '200px',
      activeList: [],
      pageTotal: null,
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
          key: 'totalOrderId',
          width: 60,
          align: 'center'
        },
        {
          title: '专题名称',
          align: 'center',
          key: 'plateName'
        },
        {
          title: '图片预览',
          align: 'center'
        },
        {
          title: '展示位置',
          align: 'center',
          slot: 'plateRegion'
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
    returnPlateRegion (item) {
      switch (item) {
        case 0 : return '首页banner'
          break
        case 1 : return '首页活动版块'
          break
        case 2 : return '首页主题精选'
      }
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    search () {},
    changePageSize (value) {
    },
    pageChange (value) {
    },
    edit () {},
    remove () {
      this.modal = true
    },
    async getActiveList () {
      let form = {
        FLAG: 1,
        plateRegion: 0,
        pageIndex: 1,
        pageSize: 10
      }
      let res = await doBannerList(form)
      if (res.data.code === 0) {
        this.activeList = res.data.content.rows
      }
      // let res = await doActiveList(this.form)
      // if (res.data.code === 0) {
      //   this.activeList = res.data.content.rows
      // }
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
