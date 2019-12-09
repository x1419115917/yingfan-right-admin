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
                      <div class="content" v-show="item.goodsShow">
                        <div class="con-left">图1内容：</div>
                        <div class="con-right">
                          <span class="add-goods" @click="addGoodsSigle">添加商品</span>
                        </div>
                      </div>
                      <div class="content" v-show="!item.goodsShow">
                        <div class="con-left">图1内容：</div>
                        <div class="con-right">
                          <div class="goods-img"><img src="https://ec-platform-dev.oss-cn-shenzhen.aliyuncs.com/product/20191129/ecbaea6c-72f9-4e23-ad42-1616b853f114/7df84c9e7327c55271b1b6fe6e67ba95.jpg" alt=""></div>
                          <div class="goods-info">
                            <div class="title">爱德华卡号爱德华卡号爱德华卡号爱德华卡号</div>
                            <div class="detail"><span class="price">￥10.00</span> <span class="salekc">可售库存564</span> </div>
                          </div>
                        </div>
                      </div>
                      <div class="write-con">

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
    <Modal v-model="modal1" class="smsModel" title="添加商品"  width="940" @on-cancel="cancelModal">
     <div class="edit-skubox">
        <Row class="edit-sku-search">
          <div class="goods-search-item">
            <span class="name">品牌</span>
            <Select class="w162" v-model="brandId" filterable>
                <Option v-for="item in brandArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="goods-search-item">
            <span class="name">类目分类</span>
            <Select class="w132" v-model="cid1" filterable style="margin-right:6px" @on-change="selClist1">
                <Option v-for="item in clist1" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select class="w132" v-model="cid2" filterable style="margin-right:6px" @on-change="selClist2">
                <Option v-for="item in clist2" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select class="w132" v-model="cid3" filterable @on-change="selClist3">
                <Option v-for="item in clist3" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="goods-search-item">
            <span class="name">商品标题</span>
            <Input class="w162" placeholder="商品标题" v-model="goodsTitle" />
          </div>
          <div class="goods-search-item">
            <Button type="warning" ghost class="sku-btn" style="margin-right: 8px;" @click="clearInputList">重置</Button>
            <Button type="info" ghost class="sku-btn" @click="searchPageList">查询</Button>
          </div>
        </Row>
        <Table ref="selection" class="table-height" @on-selection-change="selectedSku" :columns="columnsList" :data="dataList" border>
        </Table>
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
			<div slot="footer">
				<Button size="large" @click="cancelModal" type="warning" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="saveGoods" type="primary">保存</Button>
			</div>
		</Modal>
  </div>
</template>
<script>
import editors from '@/components/editors/editor'
import { singleUpload } from '@/api/base'
import { listGoodsPage } from '@/api/goods'
import { supplierList, categList } from '@/api/supplier'
import { listBrandsPage } from '@/api/nature'
import { arrayTiff, arrayChecked, date2string } from '@/libs/util'
export default {
  name: 'member-upgrade',
  components: {
    'v-editor': editors
  },
  data () {
    return {
      ctx: '',
      modalsel: '0',
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
      brandId: '',
      brandArr: [],
      goodsTitle: '',
      cid1: '',
      cid2: '',
      cid3: '',
      clist1: [],
      clist2: [],
      clist3: [],
      columnsList: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '选中',
          align: 'center',
          width: 60,
          key: 'checkBox', // disabled
          render: (h, params) => {
            return h('div', [
              h('Checkbox', {
                props: {
                  value: params.row.checkBox,
                  disabled: params.row.disabled
                },
                on: {
                  'on-change': (e) => {
                    // console.log(e)
                    this.dataList.forEach((items) => { // 先取消所有对象的勾选，checkBox设置为false
                      this.$set(items, 'checkBox', false)
                    })
                    this.dataList[params.index].checkBox = e // 再将勾选的对象的checkBox设置为true
                  }
                }
              })
            ])
          }
        },
        {
          title: '商品ID',
          width: 120,
          key: 'id'
        },
        {
          title: '商品标题',
          key: 'title'
        },
        {
          title: '品牌',
          key: 'brandName',
          width: 240
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
    async getPageList () {
      let data = {
        FLAG: 1,
        brandId: this.brandId,
        categoryId: this.cid3 ? +this.cid3 : '',
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        title: this.goodsTitle
      }
      let res = await listGoodsPage(data)
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.total = +res.data.content.total
        this.dataList.forEach((item) => {
          item.catg = (item.cid1 ? item.cid1.categoryName : '') + (item.cid2 ? ' > ' + item.cid2.categoryName : '') + (item.cid3 ? ' > ' + item.cid3.categoryName : '')
        })
        // this.dataList = arrayChecked(this.dataList, this.actNavs[this.navIndex].navDets)
      }
    },
    async getSupplierList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100
      }
      let res = await supplierList(data)
      if (res.data.code === 0) {
        this.supplierListArr = res.data.content.rows
      }
    },
    // 品牌数据
    async getlistBrandsPage () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 200
      }
      let res = await listBrandsPage(data)
      if (res.data.code === 0) {
        this.brandArr = res.data.content.rows
      }
    },
    // 获取分类
    async getcategList (parentId, i, val) {
      let data = {
        FLAG: 1,
        parentId: parentId
      }
      let res = await categList(data)
      if (res.data.code === 0) {
        let data = res.data.content
        if (data && data.length > 0) {
          let levelNo = data[0].level
          switch (levelNo) {
            case 1:
              this.clist1 = data
              this.clist2 = []
              this.clist3 = []
              break
            case 2:
              this.clist2 = data
              this.clist3 = []
              break
            case 3:
              this.clist3 = data
              break
          }
        }
      }
    },
    addGoodsSigle () {
      this.modal1 = true
      this.brandId = ''
      this.cid1 = ''
      this.cid2 = ''
      this.cid3 = ''
      this.clist2 = []
      this.clist3 = []
      this.goodsTitle = ''
      this.pageNum = 1
      this.pageSize = 10
      this.getPageList()
    },
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
    // 添加模板
    addModal () {

    },
    submitSave () {

    },
    // 保存
    saveGoods () {
      console.log('selectedList', this.selectedList)
    },
    cancelModal () {
      // console.log('取消')
      this.modal1 = false
    },
    selClist1 (id) {
      this.getcategList(id, '', 1)
      this.cid2 = ''
      this.cid3 = ''
    },
    selectedSku (res) {
      this.selectedListSpu = res
      // console.log(res)
      // console.log(this.dataList)
    },
    selClist2 (id) {
      if (id) {
        this.getcategList(id, '', 2)
        this.cid3 = ''
      }
    },
    selClist3 (id) {
      this.cid3 = id
      // this.listBrands(this.clist3[i].id)
      let selObj = this.clist3.filter(item => {
        return item.id === id
      })
      this.selObj = selObj[0]
    },
    clearInputList () {
      this.brandId = ''
      this.cid1 = ''
      this.cid2 = ''
      this.cid3 = ''
      this.clist2 = []
      this.clist3 = []
      this.goodsTitle = ''
      this.getPageList()
    },
    searchPageList () {
      this.getPageList()
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
    }
  },
  created () {
  },
  mounted () {
    this.getPageList()
    this.getcategList(0, '', 1)
    this.getlistBrandsPage()
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
  font-family: sans-

  ;
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
              margin-left: 3px;
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
</style>
