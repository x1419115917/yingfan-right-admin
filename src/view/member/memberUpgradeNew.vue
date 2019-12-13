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
        <Col :span="18"><Input v-model="activityName" placeholder="请输入活动名称" style="width: 380px" /></Col>
      </Row>
      <div class="tb-line tb-editor photo-tips-box">
        <Row class="tb-line-item name" style="margin: 0 auto 10px;">
          <span>*</span>页面展示：
          <span class="goto-brand">【建议：图片上传尺寸为：宽度800以下，高度1200以下&nbsp;单张图片小于500K】</span>
        </Row>
        <Row class="tb-line-item">
          <div class="editor">
            <v-editor @on-change="_getContext" :initContent='ctx'></v-editor>
          </div>
        </Row>
      </div>
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
            <Button type="success" ghost>添加商品</Button>
          </Col>
        </Row>
        <Row class="member-goods-bottom">
          <Table border :columns="columns" :data="dataList"></Table>
        </Row>
      </div>
      <Row>
        <div class="tb-line btn btn-goods">
          <Button class="save-goods-info-btn" type="primary" @click="submitSave">提交发布</Button>
        </div>
      </Row>
    </div>
    <Modal v-model="modal0" class="smsActiveModel" title="添加活动商品"  width="1200" :mask-closable="false">
      <member-active></member-active>
    </Modal>
    <Modal v-model="modal1" class="smsAddModel" title="添加商品"  width="940" :mask-closable="false">
      <member-chosses @cancelModal="cancelModal" :modal1="modal1"></member-chosses>
		</Modal>
  </div>
</template>
<script>
import editors from '@/components/editors/editor'
import { singleUpload } from '@/api/base'
import { arrayTiff, arrayChecked, date2string } from '@/libs/util'
import memberActive from './memberActive.vue'
import memberChosses from './memberChosses.vue'
export default {
  name: 'member-upgrade',
  components: {
    'v-editor': editors,
    memberActive,
    memberChosses
  },
  data () {
    return {
      vsShowNav: 1,
      activityName: '',
      ctx: '',
      modalsel: '0',
      modal0: false,
      modal1: false,
      modalLists: [
        {
          pictureUrl: '',
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
          key: 'pictureUrl',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  'src': params.row.pictureUrl ? params.row.pictureUrl : ''
                },
                style: {
                  display: 'block',
                  width: '80px',
                  height: '80px',
                  borderRadius: '3px'
                }
              })
            ])
          }
        },
        {
          title: '商品ID',
          key: 'id'
        },
        {
          title: '商品名称',
          key: 'goodsname'
        },
        {
          title: '起止时间',
          key: 'time',
          sortable: true
        },
        {
          title: '权重',
          key: 'sort',
          sortable: true
        },
        {
          title: '状态',
          key: 'statu'
        }
      ],
      dataList: []
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
      this.ctx = ctx.html
    },
    navSave (val) {
      switch (val) {
        case 0:
          this.vsShowNav = 0
          break
        case 1:
          if (this.activityName === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写活动名称'
            })
            return
          }
          if (this.ctx === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写页面内容'
            })
            return
          }
          this.vsShowNav = 1
          break
        case 2:
          this.vsShowNav = 2
          break
        case 3:
          break
      }
    },
    delsFn () {

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
    addGoodsSigle () {
      this.modal1 = true
    },
    cancelModal (istf) {
      this.modal1 = false
    },
    // 添加模板
    addModal () {

    },
    submitSave () {

    }
  },
  created () {
  },
  mounted () {

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
.smsAddModel /deep/ .ivu-modal-footer,.smsModel .ivu-modal-footer{
  padding: 0;
  display: none;
}
</style>
