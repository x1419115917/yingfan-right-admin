<template>
  <div>
    <Card title="客服列表">
      <Row class="role-top com_submenu">
        <Row>
          <div class="set-con">
            <Button class="btn" type="success" @click="addFn" >添加QQ客服</Button>
          </div>
          <div class="role-top-input" v-show="false">
            <div class="td-line">
              <span class="name">QQ名称</span>
              <Input
                placeholder="请输入QQ"
                class="w162"
                v-model="value"
              />
            </div>
            <div class="td-line btn">
              <Button @click="clearInputs" style="margin-right: 6px;">重置</Button>
              <Button type="primary" @click="">查询</Button>
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
            <template slot-scope="{ row, index }" slot="status">
              <span>{{row.status === 0 ? '启用' : '禁用'}}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button class="btn-item preview-btn" type="text" size="small" @click="edit(index)" >
                <i></i>
                <span>编辑</span>
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
    <Modal v-model="modal1" class="smsModel brand-list-modal" :title="operationShow? '编辑QQ客服': '新增QQ客服'"  width="640" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
				<FormItem label="QQ号码:" prop="account">
					<Input v-model="formValidate.account" placeholder="请输入QQ号码"></Input>
				</FormItem>
        <FormItem label="昵称:" prop="nickname">
					<Input v-model="formValidate.nickname" placeholder="请输入昵称"></Input>
				</FormItem>
				<FormItem label="状态:" prop="status">
          <RadioGroup v-model="formValidate.status">
            <Radio label="1">
              <span>禁用</span>
            </Radio>
            <Radio label="0">
              <span>显示</span>
            </Radio>
          </RadioGroup>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="saveInfo" type="primary">确定</Button>
			</div>
		</Modal>
  </div>
</template>
<script>
import has from '@/directive/module/has.js'
import { listCustomer, saveCustomer, updateCustomer, detailCustomer } from '@/api/customer'
export default {
  name: 'customer',
  data () {
    return {
      value: '',
      modal1: false,
      operationShow: false,
      editId: '',
      formValidate: {
        account: '',
        nickname: '',
        status: '',
        type: 0
      },
      ruleValidate: {
        account: [
          { required: true, message: 'qq号码不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '客服QQ',
          key: 'account'
        },
        {
          title: '昵称',
          key: 'nickname'
        },
        {
          title: '状态',
          slot: 'status'
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
  methods: {
    async getPageList () {
      this.tableLoading = true
      let data = {
        FLAG: 1,
        pageIndex: this.pageNum,
        pageSize: this.pageSize
        // name: this.value
      }
      let res = await listCustomer(data)
      this.tableLoading = false
      if (res.data.code === 0) {
        this.total = +res.data.content.total
        this.dataList = res.data.content.rows
      }
    },
    addFn () {
      this.operationShow = false
      this.modal1 = true
      this.formValidate = {
        account: '',
        nickname: '',
        status: ''
      }
    },
    // 保存客服
    async saveCustomer () {
      let data = {
        FLAG: 1,
        id: this.editId,
        account: this.formValidate.account,
        nickname: this.formValidate.nickname,
        status: this.formValidate.status,
        type: this.formValidate.type
      }
      let res = await saveCustomer(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '保存成功'
        })
        this.modal1 = false
        this.getPageList()
      }
    },
    // 更新客服
    async updateCustomer () {
      let data = {
        FLAG: 1,
        id: this.editId,
        account: this.formValidate.account,
        nickname: this.formValidate.nickname,
        status: this.formValidate.status,
        type: this.formValidate.type
      }
      let res = await updateCustomer(data)
      if (res.data.code === 0) {
        this.$Modal.success({
          title: '提示',
          content: '更新成功'
        })
        this.modal1 = false
        this.getPageList()
      }
    },
    // 获取详情
    async detailCustomer () {
      let data = {
        FLAG: 1,
        id: this.editId
      }
      let res = await detailCustomer(data)
      if (res.data.code === 0) {
        let content = res.data.content
        this.formValidate = {
          account: content.account,
          nickname: content.nickname,
          status: content.status.toString(),
          type: content.type
        }
      }
    },
    saveInfo () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // 验证通过校验是否编辑
          if (this.operationShow) {
            this.updateCustomer()
          } else {
            this.saveCustomer()
          }
        }
      })
    },
    edit (index) {
      this.operationShow = true
      this.modal1 = true
      this.editId = this.dataList[index].id
      this.detailCustomer()
    },
    // 取消
    cancelModal1 () {
      this.modal1 = false
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
      this.value = ''
      this.getPageList()
    },
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
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
    top: 130px;
  }
}
</style>
