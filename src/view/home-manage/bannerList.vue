<!--首页配置-banner列表-->
<template>
  <div class="bannerList">
    <Card title="首页展示列表">
      <Row>
          <Col span="6">
            <span>名称</span>
            <Input v-model="form.plateName" :style="{ width :inpWidth}" placeholder="请输入名称" clearable></Input>
          </Col>
          <Col span="8">
            <span>展示位置</span>
            <Select v-model="form.plateRegion" placeholder="请选择展示位置" :style="{width: inpWidth}" clearable>
              <Option v-for="item in showDotOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button style="margin-left:10px;" type="primary" @click="search">查询</Button>
          </Col>
          <Col span="6" offset="4">
            <Button class="addBtn" icon="ios-add" type="success" @click="operate('',2)" v-has="'sys:homePage:add'">新增</Button>
          </Col>
      </Row>
    </Card>
    <div class="wrap">
      <Table :columns="columns" border :data="activeList" stripe :loading="tableLoading">
        <template slot-scope="{ row, index }" slot="plateRegion">{{ returnPlateRegion(row.plateRegion) }}</template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="operate(row,0)">详情</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="operate(row,1)" v-has="'sys:homePage:edit'">编辑</Button>
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
      class="detailModal"
      :width='modalWid'
      v-model="detailModal"
      :title="modalTitle">
      <!--活动详情-->
      <template v-if="editType === 0">
        <banner-detail :activeMsg="activeMsg"></banner-detail>
      </template>
      <!--新增/编辑-->
      <template v-else-if="editType === 1 || editType === 2">
        <add-banner :activeMsg="activeMsg" :editType="editType" @updateList="getActiveList" @close="detailModal= false"></add-banner>
      </template>
  </Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import bannerDetail from './bannerDetail'
import addBanner from './addBanner'
import { showDot } from './homeManage.js'
import { doActiveList, doBannerList, doRemoveHomeBanner } from '@/api/home'
import Bus from '@/assets/js/bus.js'
export default {
  name: 'bannerList',
  components: {
    bannerDetail,
    addBanner
  },
  data () {
    return {
      modalTitle: '',
      editType: '',
      modalWid: '800',
      modal: false,
      detailModal: false,
      activeMsg: '', // 活动详情
      inpWidth: '200px',
      activeList: [],
      pageTotal: null,
      tableLoading: false,
      deleteIds: {
        FLAG: 1,
        ids: []
      },
      form: {
        FLAG: 1,
        plateName: '',
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
        case 1 : return '首页活动版块'
        case 2 : return '首页主题精选'
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
    operate (row, type) {
      switch (type) {
        case 0: this.modalTitle = '活动详情'
          this.modalWid = '800'
          this.activeMsg = row
          break
        case 1: this.modalTitle = '编辑'
          this.modalWid = '1000'
          this.activeMsg = row
          break
        case 2: this.modalTitle = '新增'
          this.modalWid = '1000'
          this.activeMsg = ''
          Bus.$emit('clear')
          break
      }
      this.modalWid = '1000'
      this.detailModal = true
      this.editType = type
    },
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
      this.tableLoading = true
      let res = await doBannerList(this.form)
      this.tableLoading = false
      if (res.data.code === 0) {
        this.activeList = res.data.content.rows
        this.pageTotal = res.data.content.total
      }
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
