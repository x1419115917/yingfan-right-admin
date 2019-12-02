<style lang="less">
  // @import "./common.less";
</style>
<template>
  <div>
    <Card title="供应商列表">
      <Row class="role-top com_submenu">
        <Row>
          <div class="set-con">
            <Button class="btn" type="success" :loading="uploadLoading" @click="batchContact">联系</Button>
          </div>
          <div class="role-top-input">
            <div class="td-line">
              <span class="name">是否已联系：</span>
              <Select class="w162 max-height" v-model="isContact">
                  <Option v-for="item in contact" :value="item.label" :key="item.label">{{ item.value }}</Option>
              </Select>
            </div>
            <div class="td-line">
              <span class="name">供应商名称：</span>
              <!-- @on-enter="updateDataList" -->
              <Input
                placeholder="请输入供应商名称"
                class="w162"
                v-model="value"
              />
            </div>
            <div class="td-line btn">
              <Button @click="clearInputs" style="margin-right: 6px;">重置</Button>
              <Button type="primary" @click="searchFn">查询</Button>
            </div>
          </div>
        </Row>
      </Row>
    </Card>
    <Row class="margin-top-10">
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
            <template slot-scope="{ row, index }" slot="contact">
              <span :class="{'red-color': detailObj.isCommunicate === 0}">{{row.isCommunicate === 0 ? '未联系' : '已联系'}}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button class="btn-item preview-btn" type="text" size="small" @click="look(index)" v-has="'sys:supplier:edit'">
                <i></i>
                <span>查看</span>
              </Button>
              <Button v-show="row.isCommunicate === 0" class="btn-item del-btn" type="text" size="small" @click="contactFn(index)" v-has="'sys:supplier:remove'">
                <i></i>
                <span>联系</span>
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
    <Modal v-model="detailModal" class="vertical-center-modal" title="供应商详情"  width="660" :closable="false" @on-ok="detailModalFn">
			<supplier-detail :detailObj="detailObj"></supplier-detail>
		</Modal>
    <Modal
				width="20"
				v-model="delBatchModal"
				@on-ok=""
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除选中的数据？</p>
		</Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import { listOfflineSuppliersPage, getOfflineSupplier, communicatedOfflineSupplier } from '@/api/supplier'
import supplierDetail from './supplierDetail.vue'
export default {
  name: 'supplier',
  components: {
    supplierDetail
  },
  data () {
    return {
      value: '',
      imgShow1: '',
      imgUrl: '',
      modal1: false,
      detailModal: false,
      columns1: [],
      data1: [],
      detailObj: {},
      isContact: '',
      contact: [
        {
          label: 1,
          value: '是'
        },
        {
          label: 0,
          value: '否'
        }
      ],
      delBatchModal: false,
      checkedIds: [],
      checkedId: '',
      roleName: '',
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          width: 100,
          key: 'id'
        },
        {
          title: '供应商名称',
          width: 230,
          key: 'name'
        },
        {
          title: '联系人',
          key: 'contacts'
        },
        {
          title: '主要供应类目',
          key: 'mainSupplyCategory'
        },
        {
          title: '是否联系',
          slot: 'contact'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机',
          key: 'phone'
        },
        {
          title: '操作',
          width: 200,
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
      contractInfo: '',
      catgCheckList: [],
      delIndex: '',
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      loading: false, // 分割线
      uploadLoading: false,
      tableLoading: false
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     // 因为当钩子执行前，组件实例还没被创建
  //     // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
  //     vm.getPageList()
  //   })
  // },
  methods: {
    async getPageList () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        name: this.value,
        isCommunicate: this.isContact
      }
      let res = await listOfflineSuppliersPage(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.dataList = res.data.content.rows
        this.total = +res.data.content.total
      }
    },
    async getOfflineSupplier (id) {
      let data = {
        FLAG: 1,
        id: id
      }
      let res = await getOfflineSupplier(data)
      if (res.data.code === 0) {
        let data = res.data.content
        this.detailObj = data
        console.log(data)
      }
    },
    async communicatedOfflineSupplier (ids) {
      let data = {
        FLAG: 1,
        ids: ids
      }
      let res = await communicatedOfflineSupplier(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '供应商联系成功'
        })
        this.getPageList()
      }
    },
    detailModalFn () {
      this.detailModal = false
    },
    bactchDel () {
      this.delBatchModal = true
    },
    searchFn () {
      this.getPageList()
    },
    look (i) {
      let id = this.dataList[i].id
      this.detailModal = true
      this.getOfflineSupplier(id)
    },
    contactFn (i) {
      let id = this.dataList[i].id
      let ids = []
      ids.push(id)
      this.communicatedOfflineSupplier(ids)
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
      console.log(this.delIndex)
    },
    checkedPrentFn (arr) {
      arr.forEach((item, index) => {
        this.$set(item, 'checked', false)
        if (item.children) {
          this.checkedPrentFn(item.children)
        }
      })
    },
    // 取消
    cancelModal1 () {
      // this.formValidate = { companyId: '', appId: '', appName: '' }
      // this.parentDataId = ''
      this.modal1 = false
      this.menuIds = []
      this.checkedPrentFn(this.ztreesData)
    },
    selected (res) {
      this.selectedList = res
      console.log(res)
    },
    batchContact () {
      let ids = []
      this.selectedList.forEach(item => {
        ids.push(item.id)
      })
      if (ids.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择数据进行操作'
        })
        return
      }
      this.communicatedOfflineSupplier(ids)
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
      this.value = ''
      this.isContact = ''
      this.getPageList()
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  created () {
    this.getPageList()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.form-item{
  padding-left: 6px;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
  & > * {
    float: left;
  }
  .name{
    float: left;
    margin-right: 13px;
    span{
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .btn-upload{
    position: relative;
    .upload-img{
      margin-top: 10px;
      margin-left: 8px;
      width: 80px;
      height: 32px;
    }
    .img-ipt{
      position: absolute;
      left: 8px;
      top: 10px;
      opacity: 0;
      width: 80px;
      height: 32px;
    }
    .tips-upload{
      font-size: 12px;
      color: #999;
      position: absolute;
      top: 49px;
      width: 154px;
      left: 8px;
    }
  }
  .form-item-img{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #e6e6e6;
  }
  .img-box1{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #e6e6e6;
  }
}
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
.btn-item{
  margin-left: 6px;
}
.com_submenu{
  padding: 0;
  margin-bottom: 0;
  border: 0;
}
.role-top .set-con{
  float: left;
  margin-top: 0;
}
.role-top-input{
  float: right;
}
.brand-list-modal{
  /deep/ .ivu-modal, .ivu-modal{
    top: 22px;
  }
}
</style>
