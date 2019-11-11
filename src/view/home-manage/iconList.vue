<template>
  <div>
    <Card title="首页图标配置">
      <Row class="role-top com_submenu">
        <Row>
          <div class="set-con">
            <Button class="btn" type="success" :loading="addLoading" @click="addFn">新增图标</Button>
          </div>
        </Row>
      </Row>
    </Card>
    <Row class="margin-top-10">
      <div class="bank_table" style="position:relative">
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
              <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)">
                <i></i>
                <span>编辑</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)">
                <i></i>
                <span>删除</span>
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
    <Modal v-model="modal1" class="smsModel" :title="operationShow? '编辑图标': '新增图标'"  width="660" @on-cancel="cancelModal1">
      <add-icons :activityList="activityList" :imageShow="imageShow" :iconsItem="iconsItem" :operationShow="operationShow" @submitModal="submitModal" @hideModal="hideModal"></add-icons>
		</Modal>
    <Modal
				width="20"
				v-model="delModal"
				@on-ok="iconsRemove"
				:closable="false"
				class-name="vertical-center-modal">
			<p>删除后无法恢复，确定删除？</p>
		</Modal>
  </div>
</template>
<script>
import { activityList } from '@/api/thematic'
import { iconsList, updateIcons, iconsDetail, iconsRemove } from '@/api/base'
import addIcons from './addIcon.vue'
export default {
  name: 'iconList',
  data () {
    return {
      imgShow1: '',
      imgUrl: '',
      modal1: false,
      iconsItem: {},
      addLoading: false,
      imageShow: false,
      operationShow: false,
      delModal: false,
      checkedIds: [],
      activityList: [],
      checkedId: '',
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          width: 120,
          key: 'id'
        },
        {
          title: '专题名称',
          key: 'activityName',
          width: 120
        },
        {
          title: '图片预览',
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
          title: '跳转链接',
          key: 'pictureUrl'
        },
        {
          title: '权限',
          key: 'sortOrder',
          width: 100
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
      dataDel: [],
      addShow: false,
      selectedList: [],
      delIndex: '',
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      tableLoading: false
    }
  },
  components: {
    addIcons
  },
  methods: {
    async getPageList () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
      }
      let res = await iconsList(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        console.log(res.data.content)
        this.total = +res.data.content.total
        this.dataList = res.data.content.rows
      }
    },
    async getActivityList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100
      }
      let res = await activityList(data)
      if (res.data.code === 0) {
        this.activityList = res.data.content.rows
        console.log(this.activityList)
      }
    },
    async iconsDetail (id) {
      let data = {
        FLAG: 1,
        id: id
      }
      let res = await iconsDetail(data)
      if (res.data.code === 0) {
        this.imageShow = true
        this.iconsItem = res.data.content
        this.iconsItem.FLAG = 1
        // console.log(this.iconsItem)
      }
    },
    addFn () {
      this.iconsItem = {
        FLAG: 1,
        id: '',
        activityId: '', // 选择活动
        sortOrder: '', // 权重
        pictureUrl: '' // 图片
      }
      this.operationShow = false
      this.imageShow = false
      this.modal1 = true
    },
    searchFn () {
      this.getPageList()
    },
    operationRole () {
      if (this.operationShow) {
        // this.brandUpdate()
      } else {
        // this.saveRole()
      }
    },
    async iconsRemove () {
      let ids = []
      ids.push(this.dataList[this.delIndex].id)
      let data = {
        FLAG: 1,
        ids: ids
      }
      let res = await iconsRemove(data)
      if (res.data.code === 0) {
        console.log(res)
        this.$Modal.success({
          title: '提示',
          content: '删除成功'
        })
        this.delIndex = ''
        this.getPageList()
      }
    },
    edit (index) {
      this.operationShow = true
      this.checkedId = this.dataList[index].id
      this.iconsDetail(this.dataList[index].id)
      this.modal1 = true
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
      console.log(this.delIndex)
    },
    // 取消
    cancelModal1 () {
      this.modal1 = false
      this.menuIds = []
    },
    submitModal (bool) {
      this.modal1 = false
      this.getPageList()
    },
    hideModal (bool) {
      this.modal1 = bool
      this.menuIds = []
    },
    selected (res) {
      this.selectedList = res
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
      this.getPageList()
    }
  },
  created () {
    this.getPageList()
    this.getActivityList()
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
.smsModel /deep/ .ivu-modal-footer,.smsModel .ivu-modal-footer{
  padding: 0;
  display: none;
}
</style>
