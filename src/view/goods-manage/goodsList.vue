<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="商品列表">
      <Row class="role-top com_submenu">
        <Row>
          <div class="role-top-input">
            <div class="td-line">
              <span class="name">商品标题</span>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入商品标题"
                class="w162"
                v-model="title"
              />
            </div>
            <!-- <div class="td-line">
              <Select v-model="model1" style="width:100px;margin-right:6px">
                  <Option v-for="item in goodsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <!-- @on-enter="updateDataList" -->
              <!-- <Input
                placeholder="请输入"
                class="w162"
                v-model="value"
                style="margin-right:10px;"
              />
            </div> -->
            <div class="td-line">
              <span class="name">品牌</span>
              <Select class="w162 max-height" v-model="brandId" filterable>
                  <Option v-for="item in brandArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="td-line">
              <span class="name">供应商</span>
              <Select class="w162 max-height" v-model="supplierId" filterable>
                  <Option v-for="item in supplierList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">剩余库存</span>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入"
                class="w80"
                type="number"
                v-model="minStockNum"
              />
              <span style="margin:0 5px;">至</span>
              <Input
                placeholder="请输入"
                class="w80"
                type="number"
                v-model="maxStockNum"
              />
            </div>
            <!-- <div class="td-line" v-show="isExpand == 1">
              <span class="name">是否新品</span>
              <Select class="w162" v-model="isNew">
                  <Option value="">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
              </Select>
            </div>
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">是否爆款</span>
              <Select class="w162" v-model="isBurst">
                  <Option value="">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
              </Select>
            </div> -->
            <div class="td-line" v-show="isExpand == 1">
              <span class="name">上架日期</span>
              <!-- @on-enter="updateDataList" -->
              <DatePicker v-model="beginTime" type="datetime" placeholder="开始日期" style="width: 158px"></DatePicker>
              <span style="margin:0 5px;">-</span>
              <DatePicker v-model="endTime" type="datetime" placeholder="结束日期" placement="bottom-end" style="width: 158px"></DatePicker>
            </div>
            <div class="td-line" v-show="isExpand == 1">
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
            <!-- <div class="td-line" v-show="isExpand == 1">
              <span class="name">商品状态</span>
              <Select class="w162" v-model="isupperShelf">
                  <Option value="">全部</Option>
                  <Option value="1">已上架</Option>
                  <Option value="0">已下架</Option>
              </Select>
            </div> -->
            <div class="expand-box" @click="expandFn(1)" v-show="isExpand == 0">展开 <Icon type="ios-arrow-down" /></div>
            <div class="expand-box" @click="expandFn(0)" v-show="isExpand == 1">收起 <Icon type="ios-arrow-up" /></div>
            <div class="td-line btn">
              <Button type="primary" @click="searchFn">查询</Button>
              <Button @click="clearInputs" class="btn-clear">重置</Button>
            </div>
            <!-- <Button  type="primary" icon="ios-search" :loading="uploadLoading" @click="searchFn">搜索</Button> -->
          </div>
        </Row>
        <Row>
          <div class="set-con">
            <span style="margin-right: 10px">设置：</span>
            <Button class="btn" type="primary" :loading="uploadLoading" @click="gunderFn(1)">上架</Button>
            <Button class="btn" type="primary" ghost :loading="uploadLoading" @click="gunderFn(0)">下架</Button>
            <!-- <Button class="btn" type="info" :loading="uploadLoading" @click="addFn">设置新品</Button>
            <Button class="btn" type="info" ghost :loading="uploadLoading" @click="addFn">取消新品</Button>
            <Button class="btn" type="warning" :loading="uploadLoading" @click="addFn">设置爆款</Button>
            <Button class="btn" type="warning" ghost :loading="uploadLoading" @click="addFn">取消爆款</Button> -->
          </div>
        </Row>
        <!-- <div class="role-top-left">
          <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="addFn">添加</Button>
          <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="bactchDel">批量删除</Button>
        </div> -->
      </Row>
    </Card>
    <Row class="margin-top-10">
      <Row>
        <div class="set-con set-top" style="background:#fff;">
          <!-- <span @click="upperShelfFn(1)" class="btn" :class="isupperShelf == '' ? 'btn-active' : isupperShelf == 1 ? '' : ''">已上架(50)</span> -->
          <span @click="upperShelfFn(1)" class="btn" :class="isupperShelf == 1 ? 'btn-active' : ''">已上架</span>
          <span @click="upperShelfFn(0)" class="btn" :class="isupperShelf == 0 ? 'btn-active' : ''">待上架</span>
        </div>
      </Row>
      <!-- <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table> -->
      <div class="bank_table" style="position:relative;">
          <Table
            :columns="columnsList"
            :data="dataList"
            height="450"
            border
            ref="mainTable"
            stripe
            :loading="tableLoading"
            no-data-text
            @on-selection-change="selected"
          >
            <template slot-scope="{ row, index }" slot="action">
              <Button class="btn-item preview-btn" type="text" size="small" @click="editGoods(index)">
                <i></i>
                <span>编辑商品</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="grounding(row)" v-show="row.saleable == 0">
                <i></i>
                <span>上架</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="undercarriage(row)" v-show="row.saleable == 1">
                <i></i>
                <span>下架</span>
              </Button>
              <Button class="btn-item preview-btn" type="text" size="small" @click="editSkus(index)">
                <i></i>
                <span>编辑SKU</span>
              </Button>
            </template>
          </Table>
          <div class="no-data" v-if="dataList.length < 1">
            <!-- <div class="no-data-img"></div> -->
            <div class="no-tit">暂无数据</div>
          </div>
        </div>
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
    </Row>
    <Modal v-model="modal1" class="smsModel" title="基本信息"  width="980" @on-cancel="cancelModal1">
     <div class="edit-skubox">
        <Row class="edit-sku-search">
          <Input placeholder="可售卖库存" class="sku-ipt" type="number" v-model="buyStock" />
          <Button type="warning" ghost class="sku-btn" @click="saveSkusBatch">批量填充</Button>
        </Row>
        <Table class="table-height" max-height="600" @on-selection-change="selectedSku" :columns="columns1" :data="data1" border>
          <!-- saleable -->
          <template slot-scope="{ row, index }" slot="saleable">
            <span>{{row.saleable == 1 ? '上架' : '下架'}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="stockNum">
            <div class="stock-box">
              <div class="stock-save" v-show="row.editShow">
                <Input style="width: 80px;" placeholder="可售卖库存" class="sku-ipt" type="number" v-model="row.stockNum" @on-change="changStockNum($event, index)" />
                <Button type="warning" ghost class="sku-btn" @click="saveSkusFn(index)">保存</Button>
              </div>
              <div class="stock-show" v-show="!row.editShow">
                <span class="txt">{{row.stockNum}}</span>
                <Icon @click="editSkusFn(index)" type="ios-create-outline" size="21" />
              </div>
            </div>
          </template>
        </Table>
     </div>
			<div slot="footer">
				<Button size="large" @click="skuLower(1)" type="warning" class="cancel" style="margin-right: 10px">上架</Button>
				<Button size="large" @click="skuUpper(0)" type="primary">下架</Button>
			</div>
		</Modal>
    <!-- <Modal
				width="20"
				v-model="upperLower"
				@on-ok="upperLowerFn"
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定对选中数据上架？</p>
		</Modal> -->
  </div>
</template>
<script>
import { listGoodsPage, saleableFn, skuSpecList, saveSkuStock } from '@/api/goods'
import { listBrandsPage } from '@/api/nature'
import { supplierList, categList } from '@/api/supplier'
export default {
  name: 'goods-list',
  data () {
    return {
      value: '',
      modal1: false,
      upperLower: false,
      tips: '确定对选中数据上架？',
      buyStock: '', // 可售卖库存
      spuSkuEnums: 'SPU',
      skuList: [],
      specTemplates: [],
      columnsOriginal1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '图片',
          key: 'imageUrl',
          render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  'src': params.row.imageList[0]
                },
                style: {
                  display: 'block',
                  width: '30px',
                  height: '30px',
                  borderRadius: '3px'
                }
              })
            ])
          }
        },
        {
          title: '状态',
          slot: 'saleable'
        },
        {
          title: '供货价',
          key: 'supplyPrice'
        },
        {
          title: '零售价',
          key: 'retailPrice'
        },
        {
          title: '批发价',
          key: 'tradePrice'
        },
        {
          title: '可售卖库存',
          key: 'stockNum',
          slot: 'stockNum',
          width: 200
        },
        {
          title: '已售',
          key: 'soldNum'
        }
      ],
      columns1: [],
      data1: [],
      model1: '商品ID',
      goodsType: [
        {
          value: '商品ID',
          label: '商品ID'
        },
        {
          value: 'skuID',
          label: 'skuID'
        },
        {
          value: '商家编码',
          label: '商家编码'
        },
        {
          value: '商品条形码',
          label: '商品条形码'
        }
      ],
      title: '',
      brandId: '',
      brandArr: [],
      supplierId: '',
      supplierList: [],
      isBurst: '',
      isNew: '',
      minStockNum: '',
      maxStockNum: '',
      beginTime: '',
      endTime: '',
      cid1: '',
      cid2: '',
      cid3: '',
      clist1: [],
      clist2: [],
      clist3: [],
      operationShow: false,
      delBatchModal: false,
      checkedIds: [],
      checkedId: '',
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品图片',
          key: 'goodsImg',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  'src': params.row.images[0]
                },
                style: {
                  display: 'block',
                  width: '30px',
                  height: '30px',
                  borderRadius: '3px'
                }
              })
            ])
          }
        },
        {
          title: '商品ID',
          width: 100,
          key: 'id'
        },
        {
          title: '商品标题',
          width: 300,
          key: 'title'
        },
        {
          title: '品牌',
          key: 'brandName'
        },
        {
          title: '类目',
          key: 'catg'
        },
        {
          title: '供应商',
          key: 'supplierName'
        },
        {
          title: '操作',
          width: 230,
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      userIdCreate: '',
      roleSign: '',
      dataDel: [],
      addShow: false,
      sendContractBut: false,
      selectedList: [],
      selectedListSku: [],
      contractInfo: '',
      delIndex: '',
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      isExpand: 0,
      isupperShelf: 1,
      loading: false, // 分割线
      uploadLoading: false,
      tableLoading: false
    }
  },
  computed: {
    columnsListUpdata: function () {
      let columns1 = [...this.columnsOriginal1]
      let specTemplates = this.specTemplates
      specTemplates.forEach((item, index) => {
        item.editShow = false
        columns1.splice(index + 1, 0, {
          title: item.specName,
          key: `guige${index}`,
          width: 100
        })
      })
      return columns1
    },
    skuListUpdata: function () {
      // let data1 = this.data1
      let skuList = this.skuList
      skuList.forEach((item, index) => {
        if (item.skuSpecs) {
          if (item.skuSpecs.length === 1) {
            item.guige0 = item.skuSpecs[0].specValue
          } else if (item.skuSpecs.length === 2) {
            item.guige0 = item.skuSpecs[0].specValue
            item.guige1 = item.skuSpecs[1].specValue
          }
        }
      })
      return skuList
    }
  },
  methods: {
    async getPageList () {
      // console.log(new Date(this.beginTime))
      // return;
      this.tableLoading = true
      let data = {
        FLAG: 1,
        beginTime: this.beginTime != '' ? this.$dateString(this.beginTime) : '',
        brandId: this.brandId,
        endTime: this.endTime != '' ? this.$dateString(this.endTime) : '',
        // maxRetailPrice: this.maxRetailPrice,
        maxStockNum: this.maxStockNum ? parseInt(this.maxStockNum) : '',
        // maxSupplyPrice: this.maxSupplyPrice,
        minStockNum: this.minStockNum ? parseInt(this.minStockNum) : '',
        categoryId: this.cid3 ? +this.cid3 : '',
        // minSupplyPrice: this.minSupplyPrice,
        supplierId: this.supplierId,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        saleable: this.isupperShelf,
        title: this.title
      }
      let res = await listGoodsPage(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        // console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.total = +res.data.content.total
        this.dataList.forEach((item) => {
          item.catg = (item.cid1 ? item.cid1.categoryName : '') + (item.cid2 ? ' > ' + item.cid2.categoryName : '') + (item.cid3 ? ' > ' + item.cid3.categoryName : '')
        })
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
    // 供应商数据
    async getSupplierList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100
      }
      let res = await supplierList(data)
      if (res.data.code === 0) {
        // console.log(res.data.content)
        this.supplierList = res.data.content.rows
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
    selClist1 (id) {
      this.getcategList(id, '', 1)
      this.cid2 = ''
      this.cid3 = ''
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
    async look (i) {

    },
    // 更新库存
    async saveSkuStock (skuStockDtos) {
      let data = {
        FLAG: 1,
        skuStockDtos: skuStockDtos
      }
      let res = await saveSkuStock(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '更新库存成功'
        })
      }
    },
    // 编辑商品
    editGoods (index) {
      this.$router.push({
        path: 'goodsPub',
        query: {
          id: this.dataList[index].id,
          type: 'edit'
        }
      })
    },
    // 上下架
    async saleableFn (ids, saleableStatus, type) {
      this.spuSkuEnums = type
      let data = {
        FLAG: 1,
        ids: ids,
        saleable: saleableStatus,
        spuSkuEnums: this.spuSkuEnums
      }
      let res = await saleableFn(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '更新成功'
        })
        this.getPageList()
      }
    },
    skuLower (i) {
      let ids = []
      let saleableStatus = i
      this.selectedListSku.forEach(item => {
        ids.push(item.skuId)
      })
      if (ids.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择数据再进行操作'
        })
        return
      }
      this.saleableFn(ids, saleableStatus, 'SKU')
    },
    skuUpper (i) {
      let ids = []
      let saleableStatus = i
      this.selectedListSku.forEach(item => {
        ids.push(item.skuId)
      })
      if (ids.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择数据再进行操作'
        })
        return
      }
      this.saleableFn(ids, saleableStatus, 'SKU')
    },
    gunderFn (i) {
      let ids = []
      let saleableStatus = i
      this.selectedList.forEach(item => {
        ids.push(item.id)
      })
      if (ids && ids.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择商品再进行操作'
        })
        return
      }
      this.saleableFn(ids, saleableStatus, 'SPU')
    },
    grounding (row) {
      let ids = []
      let saleableStatus = ''
      ids.push(row.id)
      saleableStatus = row.saleable == 1 ? 0 : 1
      this.saleableFn(ids, saleableStatus, 'SPU')
    },
    undercarriage (row) {
      let ids = []
      let saleableStatus = ''
      ids.push(row.id)
      saleableStatus = row.saleable == 1 ? 0 : 1
      this.saleableFn(ids, saleableStatus, 'SPU')
    },
    expandFn (val) {
      this.isExpand = val
    },
    upperShelfFn (val) {
      this.isupperShelf = +val
      this.pageNum = 1
      this.pageSize = 10
      this.getPageList()
    },
    searchFn () {
      this.getPageList()
    },
    operationRole () {
      if (this.operationShow) {
        //
      } else {
        //
      }
    },
    // cku信息
    async skuSpecList (id) {
      let res = await skuSpecList(id)
      if (res.data.code === 0) {
        console.log(res)
        this.skuList = res.data.content.skus
        this.specTemplates = res.data.content.specTemplate
        this.columns1 = this.columnsListUpdata
        this.data1 = this.skuListUpdata
      }
    },
    editSkus (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].id
      this.skuSpecList(this.dataList[i].id)
    },
    // 编辑库存
    editSkusFn (index) {
      let obj = this.data1[index]
      obj.editShow = !obj.editShow
      this.$set(this.data1, index, obj)
      // this.data1[i].editShow = !this.data1[i].editShow
    },
    changStockNum (e, index) {
      this.data1[index].stockNum = e.target.value
      console.log(e)
    },
    // 保存库存
    saveSkusFn (index) {
      let skuStockDtos = []
      console.log(this.data1[index].stockNum)
      skuStockDtos = [
        {
          num: parseInt(this.data1[index].stockNum),
          skuId: this.data1[index].skuId
        }
      ]
      let obj = this.data1[index]
      obj.editShow = !obj.editShow
      this.$set(this.data1, index, obj)
      this.saveSkuStock(skuStockDtos)
    },
    // 批量操作
    saveSkusBatch () {
      console.log(this.buyStock)
      let skuStockDtos = []
      this.data1.forEach(item => {
        item.stockNum = this.buyStock
        skuStockDtos.push({
          num: this.buyStock,
          skuId: item.skuId
        })
      })
      this.saveSkuStock(skuStockDtos)
    },
    // 取消
    cancelModal1 () {
      this.modal1 = false
      this.menuIds = []
    },
    selected (res) {
      this.selectedList = res
      console.log(res)
    },
    selectedSku (res) {
      this.selectedListSku = res
      console.log(res)
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
    },
    clearInputs () {
      this.pageNum = 1
      this.pageSize = 10
      this.title = ''
      this.beginTime = ''
      this.brandId = ''
      this.beginTime = ''
      this.maxStockNum = ''
      this.minStockNum = ''
      this.supplierId = ''
      this.isupperShelf = 1
      this.cid1 = ''
      this.cid2 = ''
      this.cid3 = ''
      this.clist2 = []
      this.clist3 = []
      this.getPageList()
    },
    goBack () {
      this.$router.go(-1)
    } // 分割线
  },
  created () {
    this.getPageList()
    this.getlistBrandsPage()
    this.getSupplierList()
    this.getcategList(0, '', 1)
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>

.set-top{
  padding: 10px;
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
    // border-color: #6699CC;
  }
}
.role-top{
  width: 100%;
  position: relative;
  .set-con{
    margin-top: 15px;
  }
  .td-line{
    float: left;
    margin-right: 24px;
    margin-bottom: 10px;
    .name{
      display: inline-block;
      margin-right: 6px;
    }
  }
  .expand-box{
    position: absolute;
    right: 8px;
    top: 0px;
    font-size: 13px;
    cursor: pointer;
    &:hover{
      color: #ff0036;
      text-decoration: none;
    }
  }
  .role-top-left{
    float: left;
    width: 300px;
  }
  .role-top-right{
    float: right;
  }
  .btn{
    margin-right: 10px;
    .btn-clear{
      margin-left: 8px;
    }
  }
  .ipt{
    margin-right: 10px;
  }
}

.no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .no-data-img {
      // background: url(../../assets/img/no-data.png) center no-repeat;
      width: 404px;
      height: 253px;
      background-size: contain;
    }
    .no-tit {
      width: 404px;
      text-align: center;
      font-size: 14px;
    }
  }
.pages {
  position: relative;
  padding: 10px 0;
  text-align: center;
  background: #fff;
  .operation {
    position: absolute;
    left: 0px;
  }
}
.edit-sku-search{
  margin-bottom: 10px;
  .sku-ipt{
    width: 150px;
    margin-right: 10px;
  }
}
.max-height /deep/ .ivu-select-dropdown,.max-height .ivu-select-dropdown{
  max-height: 142px;
}
.stock-box{
  .stock-save{
    .sku-btn{
      margin-left: 6px;
    }
  }
  .stock-show{
    .txt{
      display: inline-block;
      margin-right: 6px;
    }
  }
}

.btn-item{
  margin-left: 5px;
}
</style>
