<template>
  <div class="content-member">
    <div class="nav-top">
      <span class="nav-top-item" @click="navSave(0)" :class="vsShowNav == 0 ? 'nav-top-item-active' : ''">活动基本信息</span>
      <span class="nav-top-item" @click="navSave(1)" :class="vsShowNav == 1 ? 'nav-top-item-active' : ''">添加活动商品</span>
      <span class="nav-top-item" v-show="false" @click="navSave(2)" :class="vsShowNav == 2 ? 'nav-top-item-active' : ''">添加模板</span>
    </div>
    <div class="member-con" v-show="vsShowNav == 0">
      <Row class="tb-line-item name">
        <Col class="active-name" :span="2"><span>*</span>升级活动名称：</Col>
        <Col :span="18"><Input v-model="activeName" placeholder="请输入活动名称" style="width: 600px" /></Col>
      </Row>
      <div class="tb-line tb-editor photo-tips-box">
        <Row class="tb-line-item name" style="margin: 0 auto 10px;">
          <span>*</span>页面展示：
          <span class="goto-brand">【建议：图片上传尺寸为：宽度800以下，高度1200以下&nbsp;单张图片小于500K】</span>
        </Row>
        <Row class="tb-line-item">
          <div class="editor">
            <v-editor @on-change="_getContext" :initContent='showDetail'></v-editor>
          </div>
        </Row>
      </div>
      <Row class="tb-line-item rules">
        <Col class="active-name" :span="2"><span>*</span>活动规则：</Col>
        <Col :span="18"><Input v-model="activeRule" type="textarea" :rows="8" placeholder="请输入活动规则" style="width: 600px" /></Col>
      </Row>
      <Row class="tb-line-item">
        <Col class="active-name" :span="2"></Col>
        <Col class="tips-mark" :span="18">如需要分段，请在该段话末尾输入符号 \ 表示</Col>
      </Row>
      <Row>
        <div class="tb-line btn btn-goods">
          <Button class="save-goods-info-btn" type="primary" @click="navSave(1)">下一步</Button>
        </div>
      </Row>
    </div>
    <div class="member-con" v-show="vsShowNav == 1">
      <div class="tb-line tb-editor member-goods">
        <Row class="member-goods-top">
          <Col class="member-goods-left" :span="4">
            活动商品
          </Col>
          <Col class="member-goods-right" :span="19">
            <Button type="success" ghost @click="openWriteModal">添加商品</Button>
          </Col>
        </Row>
        <Row class="member-goods-bottom">
          <Table border :columns="columns" :data="dataList" :laoding="tableLoading">
            <!-- status  style="height: 480px" -->
            <template slot-scope="{ row, index }" slot="status">
              <span>{{row.isShow == 1 ? '显示' : '隐藏'}}</span>
              <!-- <i-switch size="large" v-model="row.status" @on-change="changeSwitch($event,index)" true-value="1" false-value="0">
                  <span slot="open">启用</span>
                  <span slot="close">隐藏</span>
              </i-switch> -->
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index, row.id)">
                <i></i>
                <span>编辑</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)">
                <i></i>
                <span>删除</span>
              </Button>
            </template>
          </Table>
        </Row>
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
      </div>
      <Row>
        <div class="tb-line btn btn-goods">
          <Button class="save-goods-info-btn" type="primary" @click="submitSave">提交发布</Button>
        </div>
      </Row>
    </div>
    <Modal v-model="modal0" class="smsActiveModel" title="添加活动商品"  width="1220" :mask-closable="false">
      <active-write @cancelModalWrite="cancelModalWrite" :modal0="modal0" :operationShow="operationShow" @saveGoods="saveGoods" :editInfo="editInfo" :editId="editId"></active-write>
    </Modal>
  </div>
</template>
<script>
import editors from '@/components/editors/editor'
import { singleUpload } from '@/api/base'
import { saveVipActive, queryVipActive, vipList, detailSpuVipId } from '@/api/vip'
import { arrayTiff, arrayChecked, date2string } from '@/libs/util'
import activeWrite from './activeWrite.vue'
export default {
  name: 'member-upgrade',
  components: {
    'v-editor': editors,
    activeWrite
  },
  data () {
    return {
      vsShowNav: 0,
      activeName: '',
      operationShow: false,
      goodsInfo: {},
      goodsId: '',
      goodsTitle: '',
      activeRule: '',
      showDetail: '',
      editId: 0,
      editInfo: {},
      modalsel: '0',
      modal0: false,
      statuList: [
        {
          label: '显示',
          value: '1'
        },
        {
          label: '隐藏',
          value: '0'
        }
      ],
      modalLists: [
        {
          images: '',
          imgShow: false,
          goodsInfo: {
            title: '',
            imageUrl: '',
            salableStock: 0
          },
          goodsShow: false,
          VIPprice: '',
          stock: ''
        }
      ],
      modalList: [{ id: '0', value: '模板A' }],
      columns: [
        {
          title: '商品banner',
          key: 'images',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  'src': params.row.images ? params.row.images : ''
                },
                style: {
                  display: 'block',
                  width: '120px',
                  height: '60px',
                  borderRadius: '3px'
                }
              })
            ])
          }
        },
        {
          title: '商品ID',
          key: 'spuId',
          width: 100
        },
        {
          title: '商品名称',
          key: 'title'
        },
        {
          title: '起止时间',
          key: 'time'
          // sortable: true
        },
        {
          title: '权重',
          key: 'sort',
          width: 100
        },
        // {
        //   title: '权重',
        //   key: 'sort',
        //   width: 120,
        //   render: (h, params) => {
        //     var vm = this
        //     return h('InputNumber', {
        //       props: {
        //         value: vm.dataList[params.index].sort,
        //         min: 1
        //       },
        //       on: {
        //         'on-change' (e) {
        //           vm.dataList[params.index].sort = e
        //           // console.log('vm.dataList[params.index].sort', vm.dataList[params.index].sort)
        //         }
        //       }
        //     })
        //   }
        // },
        {
          title: '状态',
          slot: 'status',
          width: 120
        },
        {
          title: '操作',
          width: 200,
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      tableLoading: false
    }
  },
  computed: {
    selectedList: function () {
      let selList = []
      this.dataList.filter(item => {
        if (item.checkBox) {
          selList.push(item)
        }
      })
      return selList
    }
  },
  methods: {
    _getContext (ctx) {
      // console.log(ctx)
      this.showDetail = ctx.html
    },
    // 获取商品列表
    async getPageList () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await vipList(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        if (res.data.content && res.data.content.length > 0) {
          this.dataList = res.data.content
          this.total = +res.data.content.total
          this.dataList.forEach((item) => {
            item.time = `${item.startTime} - ${item.endTime}`
          })
        }
      }
    },
    // 获取页面设置
    async queryVipActive () {
      let data = {}
      let res = await queryVipActive(data)
      if (res.data.code === 0) {
        if (res.data && res.data.content) {
          let content = res.data.content
          this.activeName = content.activeName
          this.activeRule = content.activeRule
          this.showDetail = content.showDetail
        }
      }
    },
    // 获取活动设置
    async detailSpuVipId (id) {
      let res = await detailSpuVipId(id)
      if (res.data.code === 0) {
        this.operationShow = true
        this.modal0 = true
        this.editInfo = res.data.content
        this.editId = res.data.content.id
      }
    },
    // 保存页面设置
    async saveVipActive () {
      let data = {
        FLAG: 1,
        activeName: this.activeName,
        activeRule: this.activeRule,
        showDetail: this.showDetail,
        activeType: 1
      }
      let res = await saveVipActive(data)
      if (res.data.code === 0) {
        this.vsShowNav = 1
        // this.$Modal.success({
        //   title: '提示',
        //   content: '保存页面设置成功'
        // })
      }
    },
    changeSwitch (e, index) {
      // console.log('e---', e)
      this.dataList[index].statu = e
      // console.log('switch', this.dataList[index].statu)
    },
    navSave (val) {
      switch (val) {
        case 0:
          this.vsShowNav = 0
          break
        case 1:
          if (this.activeName === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写活动名称'
            })
            return
          }
          if (this.showDetail === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写页面内容'
            })
            return
          }
          // activeRule
          if (this.activeRule === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写活动规则'
            })
            return
          }
          this.saveVipActive()
          break
        case 2:
          this.vsShowNav = 2
          break
        case 3:
          break
      }
    },
    saveGoods (obj) {
      // console.log('obj123++++', obj)
      this.getPageList()
      this.cancelModalWrite()
    },
    // 上传图片
    async fileUploadGoods (e) {
      this.loadingBox = true
      let file = e.target.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(file.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        this.loadingBox = false
        this.$refs.filezm.value = ''
        return
      }
      let data = {
        file: file,
        tag: 2
      }
      let res = await singleUpload(data)
      this.loadingBox = false
      if (res.data.code === 0) {
        console.log(res)
        this.imgShow = true
        e.target.value = ''
        this.pictureUrl = res.data.content
      }
    },
    // 编辑
    edit (index, id) {
      // let title = this.dataList[index].title
      this.detailSpuVipId(id)
    },
    openWriteModal () {
      this.operationShow = false
      this.modal0 = true
    },
    cancelModalWrite () {
      this.modal0 = false
    },
    changePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.getPageList()
    },
    pageChange (value) {
      this.pageNum = value
      this.getPageList()
    },
    submitSave () {
      // this.changeGoods();
      this.$Modal.success({
        title: '提示',
        content: '保存成功'
      })
      this.vsShowNav = 0
    }
  },
  created () {
  },
  mounted () {
    this.queryVipActive()
    this.getPageList()
  }
}
</script>
<style lang="less" scoped>
.content-member{
  background-color: #fff;
  padding: 20px;
  min-height: 500px;
}
.member-goods{
  width: 100%;
  min-height: 500px;
  border: 1px solid #ebebeb;
  .member-goods-top{
    height: 50px;
    .member-goods-left{
      max-width: 300px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #f9f9f9;
    }
    .member-goods-right{
      line-height: 50px;
      margin-left: 30px;
    }
  }
}
.active-name{
  line-height: 32px;
  height: 32px;
  width: 110px;
  margin-bottom: 20px;
  font-size: 12px;
}
.nav-top{
  text-align: center;
  margin-bottom: 28px;
  .nav-top-item{
    display: inline-block;
    font-size: 16px;
    color: rgb(102, 153, 204);
    padding: 10px 60px;
    border: 1px solid #e6e6e6;
    cursor: pointer;
  }
  .nav-top-item-active{
    background: #2D8CF0;
    color: #fff;
    border-color: #2D8CF0;
  }
}
.tb-line-item{
  span{
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.rules{
  margin: 10px 0 0;
}
.tips-mark{
  font-size: 12px;
  color: #999;
}
.content .tb-line {
  .name{
    font-size: 14px;
    color: #333;
    line-height: 35px;
    span{
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }

}
.goto-brand{
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 35px;
  color: #CC3333;
}
.btn-goods{
  display: flex;
  padding: 30px 0;
}
.save-goods-info-btn{
  width: 360px;
  margin: 0 auto;
  font-size: 14px;
  letter-spacing: 8px;
}
.edit-sku-search{
  margin-bottom: 20px;
}
.goods-search-item{
  float: left;
  margin-right: 16px;
  margin-bottom: 6px;
  .name{
    margin-right: 6px;
  }
}
.search-ipt{
  margin-bottom: 8px;
  margin-right: 4px;
  float: left;
}
.pages{
  text-align: center;
  margin-top: 10px;
}
.hide{
  display: block;
}
.smsActiveModel /deep/ .ivu-modal-footer,.smsModel .ivu-modal-footer{
  padding: 0;
  display: none;
}
// .ivu-table-wrapper,.ivu-table{
//   overflow: auto;
// }
</style>
