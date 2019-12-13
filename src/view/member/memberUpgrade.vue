<template>
  <div class="content-member">
    <div class="member-con">
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
      <div class="tb-line tb-editor photo-tips-box">
        <Row class="tb-line-item name" style="margin: 0 auto 10px;">
          <span>*</span>添加模板：
          <span class="goto-brand"></span>
        </Row>
        <Row class="tb-line-item">
          <div class="content-box">
            <Row class="content-item2">
              <Col class="table-left" span="4">模板图片</Col>
              <Col class="table-right" span="20">
                <Row>
                  <Select v-model="modalsel" style="width:300px">
                      <Option v-for="(item,index) in modalList" :value="item.id" :key="index">{{ item.value }}</Option>
                  </Select>
                  <Button type="success" ghost style="margin-left:6px;" @click="addModal">添加模板</Button>
                </Row>
                <Row>
                  <span class="title-span-tips">(图片规格：模板A宽度为1126，高度自适应JPG，JPEG，GIF，小于500k)</span>
                </Row>
                <Row style="margin-bottom: 15px">
                  <Row class="modal-item" v-for="(item, index) in modalLists" :key="index">
                    <Col span="10" class="modal-left">
                      <div class="modal-text">
                        <span class="num">1</span>
                        <span class="txt">模板A</span>
                        <span class="btn">上传图片</span>
                        <span class="del" @click="delsFn">删除</span>
                      </div>
                      <input type="file" class="img-ipt"
                        ref="filezm"
                        @change="fileUploadGoods($event,1)"
                        accept="image/*"
                        capture="camera">
                      <img v-show="false" src="" alt="">
                    </Col>
                    <Col span="14" class="modal-right">
                      <div class="content" v-show="!item.goodsShow">
                        <div class="con-left">图1内容：</div>
                        <div class="con-right">
                          <span class="add-goods" @click="addGoodsSigle">添加商品</span>
                        </div>
                      </div>
                      <div class="content" v-show="item.goodsShow">
                        <div class="con-left">图1内容：</div>
                        <div class="con-right">
                          <div class="goods-img"><img src="https://ec-platform-dev.oss-cn-shenzhen.aliyuncs.com/product/20191129/ecbaea6c-72f9-4e23-ad42-1616b853f114/7df84c9e7327c55271b1b6fe6e67ba95.jpg" alt=""></div>
                          <div class="goods-info">
                            <div class="title">爱德华卡号爱德华卡号爱德华卡号爱德华卡号</div>
                            <div class="detail"><span class="salekc">活动价：</span><span class="price">￥10.00</span>  </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
          </div>
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
      <member-chosses @cancelModal="cancelModal" :modal1="modal1" @saveGoods="saveGoods"></member-chosses>
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
      modalList: [{ id: '0', value: '模板A' }]

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
    saveGoods (obj) {
      this.modal1 = false
      console.log('obj', obj)
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
  .member-con{
    // max-width: 1000px;
    // min-width: 800px;
    // margin: 0 auto;
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
.modal-item{
  width: 100%;
  height: 150px;
  .modal-left{
    height: 150px;
    line-height: 20px;
    background-color: #f9f9f9;
    border: 1px solid #bababa;
    position: relative;
    .modal-text{
      .num{
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background-color: #cacaca;
        color: #fff;
        font-size: 18px;
        border-radius: 50%;
        text-align: center;
      }
      .txt{
        display: inline-block;
        color: #169BD5;
        margin-left: 10px;
      }
      .btn{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 90px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background-color: #ececec;
        color: #333;
        font-size: 12px;
        transform: translate(-50%,-50%);
        font-family: sans-serif;
      }
      .del{
        position: absolute;
        right: -32px;
        color: #f20;
        cursor: pointer;
        top: 0px;
        z-index: 2;
      }
    }
    .img-ipt{
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
  }
  .modal-right{
    position: relative;
    height: 125px;
    .content{
      margin: 30px 0 0 30px;
      line-height: 30px;
      .con-left{
        float: left;
      }
      .con-right{
        float: left;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .goods-img{
          width: 30px;
          height: 30px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .goods-info{
          line-height: 20px;
          margin-left: 6px;
          & > .title{
            max-width: 450px;
            color: #2D8cF0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .detail span{
            display: inline-block;
            &.price{
              font-weight: bold;
            }
            &.salekc{
              margin-right: 3px;
              color: #666;
            }
          }
        }
        .add-goods{
          display: inline-block;
          width: 90px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          background-color: #ececec;
          color: #333;
          font-size: 12px;
          font-family: sans-serif;
          cursor: pointer;
        }
      }
    }
  }
}
.content-box{
  border-bottom: 1px solid #b9b8b8;
  margin-bottom: 20px;
  .content-item{
    height: 70px;
    border: 1px solid #b9b8b8;
    box-sizing: border-box;
    border-bottom: 0px;
    .table-left{
      height: 100%;
      text-align: center;
      background-color: rgba(244, 244, 244, 1);
    }
    .table-right{
      height: 100%;
      border-left: 1px solid #b9b8b8;
      padding-left: 10px;
    }
  }
  .content-item1{
    height: 110px;
    .table-left{
      padding: 40px 10px 0px;
    }
  }
  .content-item2{
    border: 1px solid #b9b8b8;
    box-sizing: border-box;
    border-bottom: 0px;
    min-height: 70px;
    .table-left{
      line-height: 70px;
      height: 100%;
      text-align: center;
      background-color: rgba(244, 244, 244, 1);
    }
    .table-right{
      line-height: 70px;
      height: 100%;
      border-left: 1px solid #b9b8b8;
      padding-left: 10px;
    }
  }
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
