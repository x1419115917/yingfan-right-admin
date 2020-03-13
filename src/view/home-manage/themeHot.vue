<!--首页配置-极致推荐-->
<template>
  <div class="add">
      <Form ref="titleform" :model="titleform" :rules="titleFormValidate" inline :label-width="120">
        <FormItem label="首页活动入口标题" prop="plateName">
          <Input :maxlength="maxlength" style="width: 300px;" v-model="titleform.plateName" placeholder="请输入首页活动入口标题，如vip最爱"></Input>
        </FormItem>
        <FormItem label="状态" prop="isShow">
          <RadioGroup v-model="titleform.isShow">
            <Radio label="0">显示</Radio>
            <Radio label="1">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveTitleMsg">保存</Button>
        </FormItem>
      </Form>
      <Button style="margin-bottom:10px;" type="success" @click="operate(0)">新增</Button>
      <Table max-height="500" border :columns="columns" :data="tableData">
        <template slot-scope="{ row,index }" slot="pictureUrl">
          <img style="width: 100px;height:auto;margin-top: 10px;" :src="row.pictureUrl">
        </template>
        <template slot-scope="{ row,index }" slot="plateType"><span>{{ row.plateType === 0 ? '活动' : '商品' }}</span></template>
        <template slot-scope="{ row,index }" slot="contentVoucher">
          <!--跳转类型为活动-->
          <template v-if="row.plateType === 0">
              <p>{{ returnActivity(row.contentVoucher)}}</p>
              {{ row.beginTime+' 到 '+row.endTime }}
          </template>
          <!--跳转类型为商品-->
          <template v-else-if="row.plateType === 1">
            <template v-if="row.spuResp.images">
              <div class="goods">
                <div><img style="width: 100px;height:auto;margin-top: 10px;" :src="row.spuResp.images[0]" /></div>
                <p>{{ row.spuResp.title }}</p>
              </div>
            </template>
          </template>
        </template>
        <template slot-scope="{ row,index }" slot="isShow">
          <span>{{ row.isShow === 0 ? '显示' : '隐藏' }}</span>
        </template>
        <template slot-scope="{ row,index }" slot="operate">
          <Button type="primary" @click="operate(1,row.id)">编辑</Button>
        </template>
      </Table>
      <Page
        :current="form.pageNum"
        :page-size="form.pageSize"
        :total="pageTotal"
        show-total
        show-elevator
        show-sizer
        @on-page-size-change="changePageSize"
        @on-change="pageChange"/>
    </Form>
    <!--选择商品-->
    <Modal v-model="modal1" class="hideFootModal" title="添加商品"  width="940" :mask-closable="false">
      <member-chosses @cancelModal="modal1 = false" :modal1="modal1" @chooseGoods="chooseGoods"></member-chosses>
    </Modal>
    <!--新增/编辑-->
    <Modal v-model="editModal" width="600" class="hideFootModal" :title="modalTitle">
      <Form ref="formValidate" :model="detailForm" :rules="ruleValidate" :label-width="80">
        <FormItem label="图片" prop="pictureUrl">
          <div class="imgWrap">
            <img v-show="!detailForm.pictureUrl" src="@/assets/images/noImg.png">
            <img :src="detailForm.pictureUrl" v-show="detailForm.pictureUrl">
          </div>
          <div class="btn-upload">
            <Button type="primary" class="upload-img">上传图片</Button>
            <input type="file" class="img-ipt"
              ref="filezm" @change="filezm($event)" accept="image/*" capture="camera">
          </div>
        </FormItem>
        <FormItem label="跳转类型" prop="plateType">
          <RadioGroup v-model="detailForm.plateType">
            <Radio label="0">活动</Radio>
            <Radio label="1">商品</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="跳转详情" prop="contentVoucher">
          <!--跳转类型为活动-->
          <template v-if="detailForm.plateType === '0'">
            <Select v-model="detailForm.contentVoucher" placeholder="请选择活动" :style="{width: inpWidth}" clearable>
              <Option v-for="item in activeList" :value="item.contentVoucher" :key="item.contentVoucher">{{ item.activityName }}</Option>
            </Select>
          </template>
          <!--跳转类型为商品-->
          <template v-else-if="detailForm.plateType === '1'">
            <Button type="success" ghost @click="modal1 = true">添加商品</Button>
            <template v-if="selectedGoods">
              <div class="goods">
                <div><img :src="selectedGoods.images[0]" /></div>
                <p>{{ selectedGoods.title }}</p>
              </div>
            </template>
          </template>
        </FormItem>
        <FormItem label="状态" prop="isShow">
          <RadioGroup v-model="detailForm.isShow">
            <Radio label="0">显示</Radio>
            <Radio label="1">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="权重" prop="sortOrder">
          <InputNumber :max="5" :min="1" v-model="detailForm.sortOrder" placeholder="权重"></InputNumber><span style="margin-left: 10px;color: red;">请输入1~5之间数字，1为最高权重</span>
        </FormItem>
        <FormItem style="margin-top: 50px;">
          <Button type="primary" size="large" @click="handleSubmit">保存</Button>
          <Button size="large" style="margin-left: 15px;" @click="editModal = false">返回</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { doPlateList, doAddPlate, doCheckPlate, doEditPlate, doActiveList, doEditTitleMsg, doCheckTitleMsg } from '@/api/home'
import { singleUpload } from '@/api/nature'
import memberChosses from '@/view/new-activities/memberChosses.vue'
export default {
  name: 'addBanner',
  components: {
    memberChosses
  },
  data () {
    return {
      modal1: false,
      editModal: false,
      modalTitle: '',
      editType: '',
      inpWidth: '200px',
      maxlength: 10,
      pageTotal: null,
      detailId: null, // 详情id
      selectedGoods: null, // 选择的商品
      titleform: {
        plateName: '',
        FLAG: 1,
        showMode: 5,
        isShow: '0'
      },
      form: {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 10,
        showMode: 5
      },
      detailForm: {
        showMode: 5, // 极致推荐
        FLAG: 1,
        contentVoucher: '',
        isShow: '0',
        pictureUrl: '',
        plateType: '0',
        sortOrder: 1
      },
      tableData: [],
      activeList: [], // 活动列表
      columns: [
        {
          title: '图片',
          align: 'center',
          slot: 'pictureUrl'
        },
        {
          title: '跳转类型',
          align: 'center',
          width: 100,
          slot: 'plateType'
        },
        {
          title: '跳转详情',
          align: 'center',
          slot: 'contentVoucher'
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          slot: 'isShow'
        },
        {
          title: '权重',
          width: 100,
          align: 'center',
          key: 'sortOrder'
        },
        {
          title: '操作',
          width: 100,
          align: 'center',
          slot: 'operate'
        }
      ],
      titleFormValidate: {
        plateName: [
          { required: true, trigger: ['change', 'blur'], message: '请输入首页活动入口标题' }
        ],
        isShow: [
          { required: true, trigger: ['change', 'blur'], message: '请选择状态' }
        ]
      },
      ruleValidate: {
        pictureUrl: [
          { required: true, trigger: ['change', 'blur'], message: '请上传图片' }
        ],
        plateType: [
          { required: true, trigger: ['change', 'blur'], message: '请选择跳转类型' }
        ],
        contentVoucher: [
          { required: true, trigger: ['change', 'blur'], message: '请选择跳转详情' }
        ],
        isShow: [
          { required: true, trigger: ['change', 'blur'], message: '请选择状态' }
        ],
        sortOrder: [
          { required: true, trigger: ['change', 'blur'], message: '请选择权重' }
        ]
      }
    }
  },
  methods: {
    operate (item, id) {
      switch (item) {
        case 0: this.modalTitle = '新增'
          this.clear()
          break
        case 1: this.modalTitle = '编辑'
          this.checkDetail(id)
          break
      }
      this.editType = item
      this.editModal = true
    },
    returnActivity (id) {
      for (let i = 0; i < this.activeList.length; i++) {
        if (this.activeList[i].contentVoucher === id) {
          return this.activeList[i].activityName
        }
      }
    },
    async filezm (e, index) {
      let file = e.target.files[0]
      let data = {
        file: file,
        tag: 1
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        this.detailForm.pictureUrl = res.data.content
      }
    },
    chooseGoods (obj) {
      this.selectedGoods = obj
      this.detailForm.contentVoucher = obj.id
      this.modal1 = false
    },
    changePageSize (value) {
      this.form.pageSize = value
      this.getPlateList()
    },
    pageChange (value) {
      this.form.pageIndex = value
      this.getPlateList()
    },
    clear () {
      this.detailForm = {
        showMode: 5,
        FLAG: 1,
        contentVoucher: '',
        isShow: '0',
        pictureUrl: '',
        plateType: '0',
        sortOrder: 1
      }
    },
    async handleSubmit () {
      if (!this.detailForm.pictureUrl) {
        this.$Message.warning('图片不能为空!')
        return
      } else if (!this.detailForm.contentVoucher) {
        this.$Message.warning('跳转详情不能为空!')
        return
      } else if (parseInt(this.detailForm.sortOrder) >= 6) {
        this.$Message.warning('权重不能大于5!')
        return
      }
      // 选择跳转类型为商品时，筛选出商品id
      if (this.detailForm.plateType === '1') {
        if (this.selectedGoods) { this.detailForm.contentVoucher = this.selectedGoods.id }
      }
      if (this.editType === 1) { // 编辑
        let res = await doEditPlate(Object.assign(this.detailForm, { id: this.detailId }))
        if (res.data.code === 0) {
          this.$Message.success('操作成功!')
          this.editModal = false
          this.getPlateList()
        }
      } else if (this.editType === 0) { // 新增
        let res = await doAddPlate(this.detailForm)
        if (res.data.code === 0) {
          this.$Message.success('操作成功!')
          this.editModal = false
          this.getPlateList()
        }
      }
    },
    async checkDetail (id) {
      this.detailId = id
      let res = await doCheckPlate({ id: id, FLAG: 1 })
      if (res.data.code === 0) {
        this.detailForm = {
          showMode: 5, // 极致推荐
          FLAG: 1,
          contentVoucher: res.data.content.contentVoucher,
          isShow: res.data.content.isShow.toString(),
          pictureUrl: res.data.content.pictureUrl,
          plateType: res.data.content.plateType.toString(),
          sortOrder: res.data.content.sortOrder
        }
        if (res.data.content.spuResp) {
          this.selectedGoods = res.data.content.spuResp
        }
      }
    },
    async getActiveList () {
      let data = {
        FLAG: 1,
        pageSize: 300,
        pageIndex: 1,
        activityName: null
      }
      let res = await doActiveList(data)
      if (res.data.code === 0) {
        this.activeList = res.data.content.rows
        // 转换活动列表key值
        this.activeList = this.activeList.map(o => { return { contentVoucher: o.id.toString(), activityName: o.activityName } })
      }
    },
    async saveTitleMsg () {
      let res = await doEditTitleMsg(this.titleform)
      if (res.data.code === 0) {
        this.$Message.success('操作成功!')
      }
    },
    async getCheckTitleMsg () {
      let res = await doCheckTitleMsg({ showMode: 5, FLAG: 1 })
      if (res.data.code === 0) {
        this.titleform.plateName = res.data.content.plateName
        this.titleform.isShow = res.data.content.isShow.toString()
      }
    },
    async getPlateList () {
      let res = await doPlateList(this.form)
      if (res.data.code === 0) {
        this.tableData = res.data.content.rows
        this.pageTotal = res.data.content.total
      } else {
        this.tableData = []
      }
    }
  },
  created () {
    this.getActiveList()
    this.getPlateList()
    this.getCheckTitleMsg()
  }
}
</script>
<style lang="less" scoped>
.add {
  .ivu-page {
    margin-top: 14px;
    text-align: center;
  }
}
</style>
