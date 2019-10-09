<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="数据字典管理">
      <Row class="dict-common-top">
        <div class="dict-left">
          <Button class="btn" icon="ios-add" type="success" :loading="uploadLoading" @click="add">添加</Button>
          <Button class="btn" icon="ios-trash" type="warning" :loading="uploadLoading" @click="batchRemove">批量删除</Button>
        </div>
        <div class="dict-right">
          <Input v-model="value1" placeholder="分类编码" style="width: 140px" />
          <Input v-model="value2" placeholder="分类名称" style="width: 140px" />
          <Button icon="ios-search" type="info" :loading="uploadLoading" @click="searchFn">查询</Button>
        </div>
      </Row>
      <Row>
        <div class="ivu-upload-list-file" v-if="file !== null">
          <Icon type="ios-stats"></Icon>
            {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
        </div>
      </Row>
      <Row>
        <transition name="fade">
          <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
            <div v-if="progressPercent == 100">
              <Icon type="ios-checkmark-circle"></Icon>
              <span>成功</span>
            </div>
          </Progress>
        </transition>
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
            :loading="loading"
            no-data-text
            @on-selection-change="selected"
          >
            <template slot-scope="{ row, index }" slot="action">
              <Button class="btn-item preview-btn" type="text" size="small" @click="show(index)">
                <i></i>
                <span>查看</span>
              </Button>
              <Button class="btn-item del-btn" type="text" size="small" @click="remove(index)">
                <i></i>
                <span>删除</span>
              </Button>
            </template>
          </Table>
          <div class="no-data" v-if="dataList.length < 1">
            <!-- <div class="no-data-img"></div> -->
            <div class="no-tit">没有找到匹配的记录</div>
          </div>
        </div>
        <div class="pages">
          <!-- <div class="operation" v-show="dataList.length > 0">
            <Button @click="batchStampData">批量标记有效</Button>&nbsp;&nbsp;
            <Button @click="batchDeleteData">批量删除</Button>
          </div>-->
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
  </div>
</template>
<script>
import excel from '@/libs/excel'
export default {
  name: 'upload-excel',
  data () {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      value: '',
      value1: '',
      value2: '',
      file: null,
      tableData: [],
      tableTitle: [],
      tableLoading: false,
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'ID'
        },
        {
          title: '分类名称',
          key: 'cagName'
        },
        {
          title: '分类描述',
          key: 'FLDefault'
        },
        {
          title: '分类编码',
          key: 'FLCode'
        },
        {
          title: '操作',
          width: 180,
          slot: 'action',
          align: 'center'
        }
      ],
      dataList: [],
      dataDel: [],
      loading: false,
      addShow: false,
      sendContractBut: false,
      contractInfo: '',
      delIndex: '',
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile () {
      this.initUpload()
    },
    add () {
      console.log(123)
    },
    batchRemove () {
      console.log(13)
    },
    searchFn () {

    },
    selected (res) {
      this.selectedList = res
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
      this.keyword2 = ''
      this.getPageList()
    },
    goBack () {
      this.$router.go(-1)
    },
    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {
        this.$Message.info('文件读取成功')
        const data = e.target.result
        const { header, results } = excel.read(data, 'array')
        const tableTitle = header.map(item => { return { title: item, key: item } })
        this.tableData = results
        this.tableTitle = tableTitle
        this.uploadLoading = false
        this.tableLoading = false
        this.showRemoveFile = true
      }
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
  .dict-common-top{
    overflow: hidden;
    .dict-left{
      float: left;
      .btn{
        margin-right: 10px;
      }
    }
    .dict-right{
      float: right;
      & > *{
        margin-left: 10px;
      }
    }
  }
  .pages {
    position: relative;
    text-align: center;
    padding: 10px 0;
    background: #fff;
    .operation {
      position: absolute;
      left: 0px;
    }
  }
  .no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .no-data-img {
      // background: url(../../assets/img/no-data.png) center no-repeat;
      // width: 404px;
      // height: 253px;
      // background-size: contain;
    }
    .no-tit {
      width: 404px;
      text-align: center;
      font-size: 14px;
    }
  }
</style>
