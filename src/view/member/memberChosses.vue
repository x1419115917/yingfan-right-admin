<template>
  <div class="member-chosses">
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
        <Table ref="selection" max-height ="450" class="table-height" :columns="columnsList" :data="dataList" border>
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
    <div class="footer">
      <Button size="large" @click="cancelModal" type="warning" class="cancel" style="margin-right: 10px">取消</Button>
      <Button size="large" @click="saveGoods" type="primary">保存</Button>
    </div>
  </div>
</template>
<script>
import { listGoodsPage } from '@/api/goods'
import { supplierList, categList } from '@/api/supplier'
import { listBrandsPage } from '@/api/nature'
export default {
  name: 'memberChosses',
  components: {
  },
  props: {
    activityList: {
      type: Array,
      default: function () {
        return []
      }
    },
    operationShow: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    modal1: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
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
  watch: {
    modal1: {
      immediate: true, // 深度拷贝
      handler (val) {
        if (val) {
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
        }
      }
    }
  },
  computed: {
    selectedList: function () {
      let selList = []
      // this.dataList.filter(item => {
      //   if (item.checkBox) {
      //     selList.push(item)
      //   }
      // })
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
    // 保存
    saveGoods () {
      let selcheck = []
      selcheck = this.dataList.filter(item => {
        return item.checkBox
      })
      if (selcheck.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择活动商品'
        })
        return
      }
      this.$emit('chooseGoods', selcheck[0])
      // console.log('selectedList', this.selectedList)
    },
    cancelModal () {
      // console.log('取消')
      this.$emit('cancelModal')
    },
    selClist1 (id) {
      this.getcategList(id, '', 1)
      this.cid2 = ''
      this.cid3 = ''
    },
    selectedSku (res) {
      this.selectedListSpu = res
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
.footer{
  text-align: right;
  padding: 20px 0 10px;
}
.hide{
  display: block;
}
</style>
