<!--首页配置-新增/编辑banner-->
<template>
  <div class="add">
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
        <FormItem label="展示位置" prop="plateRegion">
          <RadioGroup v-model="form.plateRegion" @on-change="selectPlateRegion">
            <Radio label="0">首页banner</Radio>
            <Radio label="1">首页活动版块</Radio>
            <Radio label="2">首页主题精选</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="展示模式" prop="showMode">
            <RadioGroup v-model="form.showMode" @on-change="selectMode">
              <template v-if="form.plateRegion == '0'">
                <Radio label="6">轮播图模式</Radio>
              </template>
              <template v-if="form.plateRegion !== '0'">
                <Radio label="0">单图模式</Radio>
                <Radio label="1">一行两图模式</Radio>
                <Radio label="2">一行三图模式</Radio>
                <template v-if="form.plateRegion === '2'">
                  <Radio label="3">一行四图模式</Radio>
                </template>
                <template v-if="form.plateRegion !== '2'">
                  <Radio label="4">组合模式(3个)</Radio>
                  <Radio label="5">组合模式(4个)</Radio>
                </template>
              </template>
            </RadioGroup>
        </FormItem>
        <FormItem label="活动名称" prop="plateName">
          <Input v-model="form.plateName" :maxlength="maxlength" :style="{ width :inpWidth}" placeholder="请输入活动名称" clearable></Input>
        </FormItem>
        <FormItem label="跳转类型" prop="plateType">
          <RadioGroup v-model="form.plateType" @on-change="selectType">
            <Radio label="0">活动</Radio>
            <Radio label="1">商品</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="图片">
          <Table max-height="400" border :columns="columns" :data="form.plaDets">
            <template slot-scope="{ row,index }" slot="uploadImg">
              <div class="imgWrap">
                <img class="noImg" v-show="!form.plaDets[index].pictureUrl" src="@/assets/images/noImg.png">
                <img :src="form.plaDets[index].pictureUrl" class="img-box1" v-show="form.plaDets[index].pictureUrl">
                <div class="btn-upload">
                  <Button type="primary" class="upload-img">上传图片</Button>
                  <input type="file" class="img-ipt"
                    ref="filezm" @change="filezm($event,index)" accept="image/*" capture="camera">
                    <span v-if="form.plateRegion === '0'" class="tips-upload">750*450</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '0'" class="tips-upload">690*160</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '1'" class="tips-upload">340*400</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '4'" class="tips-upload">左边1张:340*470<br />右边2张:340*230</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '5'" class="tips-upload">340*196</span>
                    <span v-else-if="form.plateRegion === '2' && form.showMode === '0'" class="tips-upload">690*470</span>
                    <span v-else-if="form.plateRegion === '2' && form.showMode === '1'" class="tips-upload">340*160</span>
                    <span v-else-if="form.plateRegion === '2' && form.showMode === '2'" class="tips-upload">224*300</span>
                    <span v-else-if="form.plateRegion === '2' && form.showMode === '3'" class="tips-upload">165*165</span>
                </div>
              </div>
            </template>
            <template slot-scope="{ row,index }" slot="isShow">
              <RadioGroup v-model="form.plaDets[index].isShow">
                <Radio label="0">显示</Radio>
                <Radio label="1">隐藏</Radio>
              </RadioGroup>
            </template>
            <template slot-scope="{ row,index }" slot="contentVoucher">
              <!--跳转类型为活动-->
              <template v-if="form.plateType === '0'">
                <Select v-model="form.plaDets[index].contentVoucher" placeholder="请选择活动" :style="{width: inpWidth}" clearable>
                  <Option v-for="item in activeList" :value="item.contentVoucher" :key="item.contentVoucher">{{ item.activityName }}</Option>
                </Select>
              </template>
              <!--跳转类型为商品-->
              <template v-else-if="form.plateType === '1'">
                <Button type="success" ghost @click="addGoods(row,index)">添加商品</Button>
                <template v-if="form.plaDets[index].contentVoucher.images">
                  <div class="goods">
                    <div><img :src="form.plaDets[index].contentVoucher.images[0]" /></div>
                    <p>{{ form.plaDets[index].contentVoucher.title }}</p>
                  </div>
                </template>
              </template>
            </template>
            <template slot-scope="{ row,index }" slot="sortOrder">
              <InputNumber :max="5" :min="1" v-model="form.plaDets[index].sortOrder" placeholder="权重"></InputNumber>
              <div class="tips">请输入1~5之间数字</div>
              <div class="tips">1为最高权重</div>
            </template>
          </Table>
        </FormItem>
        <FormItem v-if="form.plateRegion != '0'" label="状态" prop="isShow">
          <RadioGroup v-model="form.isShow">
            <Radio label="0">显示</Radio>
            <Radio label="1">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem class="btnGroup">
          <Button size="large" type="primary" @click="handleSubmit('form')">保存</Button>
          <Button size="large" @click="returnBanner" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
    <Modal v-model="modal1" class="hideFootModal" title="添加商品"  width="940" :mask-closable="false">
      <member-chosses @cancelModal="modal1 = false" @chooseGoods="chooseGoods"></member-chosses>
    </Modal>
  </div>
</template>
<script>
import { doActiveList, doAddHomeBanner, doBannerDetail, doEditHomeBanner } from '@/api/home'
import { singleUpload } from '@/api/nature'
import memberChosses from '@/view/new-activities/memberChosses.vue'
import Bus from '@/assets/js/bus.js'
export default {
  name: 'addBanner',
  components: {
    memberChosses
  },
  data () {
    const validatorPlateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入活动名称'))
      } else if (value.length > 5) {
        callback(new Error('活动名称不超过5个字'))
      } else {
        callback()
      }
    }
    return {
      goodsIndex: '', // 保存选择商品的索引值
      modal1: false,
      maxlength: 5,
      bannerDetail: '',
      inpWidth: '200px',
      form: {
        plateRegion: '0', // 展示位置
        showMode: '6', // 展示模式
        plateName: '', // 活动名称
        plateType: '0', // 跳转类型0：专题活动；1：商品
        plaDets: [{ // 活动图片列表
          contentVoucher: '',
          pictureUrl: '',
          sortOrder: null
        }],
        isShow: '0' // 显示状态
      },
      activeList: [], // 活动列表
      columns: [], // 表格列
      activeColumns: [
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '选择活动',
          align: 'center',
          slot: 'contentVoucher'
        },
        {
          title: '权重',
          width: 150,
          align: 'center',
          slot: 'sortOrder'
        }
      ],
      activeColumns1: [
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '状态',
          align: 'center',
          width: 150,
          slot: 'isShow'
        },
        {
          title: '选择活动',
          align: 'center',
          slot: 'contentVoucher'
        },
        {
          title: '权重',
          width: 150,
          align: 'center',
          slot: 'sortOrder'
        }
      ],
      goodsColumns: [ // 选择商品表格列
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '选择商品',
          align: 'center',
          slot: 'contentVoucher'
        },
        {
          title: '权重',
          width: 150,
          align: 'center',
          slot: 'sortOrder'
        }
      ],
      goodsColumns1: [
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '状态',
          align: 'center',
          width: 150,
          slot: 'isShow'
        },
        {
          title: '选择商品',
          align: 'center',
          slot: 'contentVoucher'
        },
        {
          title: '权重',
          width: 150,
          align: 'center',
          slot: 'sortOrder'
        }
      ],
      ruleValidate: {
        plateName: [
          { required: true, validator: validatorPlateName, trigger: ['change', 'blur'] }
        ],
        plateRegion: [
          { required: true, message: '请选择展示位置', trigger: ['change', 'blur'] }
        ],
        showMode: [
          { required: true, message: '请选择展示模式', trigger: ['change', 'blur'] }
        ],
        plateType: [
          { required: true, message: '请选择跳转类型', trigger: ['change', 'blur'] }
        ],
        isShow: [
          { required: true, message: '请选择显示状态', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    // 选择跳转类型
    selectType () {
      // 清空商品id或者活动id
      this.form.plaDets.forEach((item) => {
        item.contentVoucher = ''
      })
      if (this.form.plateType === '1') { // 商品
        if (this.form.plateRegion === '0') {
          this.columns = this.goodsColumns1
        } else {
          this.columns = this.goodsColumns
        }
      } else if (this.form.plateType === '0') { // 活动
        if (this.form.plateRegion === '0') {
          this.columns = this.activeColumns1
        } else {
          this.columns = this.activeColumns
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
        this.form.plaDets[index].pictureUrl = res.data.content
      }
    },
    // 添加商品
    addGoods (row, index) {
      this.goodsIndex = index
      this.modal1 = true
    },
    chooseGoods (obj) {
      this.form.plaDets[this.goodsIndex].contentVoucher = obj
      this.modal1 = false
    },
    // 选择展示位置
    selectPlateRegion () {
      if (this.form.plateRegion === '0') { // 首页banner时，默认轮播图模式
        this.form.showMode = '6'
        this.columns = this.activeColumns1
      } else {
        this.form.showMode = '0'
        this.columns = this.activeColumns
      }
      this.selectMode(this.form.showMode)
      this.form.plateType = '0'// 选择展示位置后默认跳转类型为活动
    },
    selectMode (value) {
      this.form.plaDets.length = 0
      let count
      switch (value) {
        case '0': count = 1
          break
        case '1': count = 2
          break
        case '2': count = 3
          break
        case '3': count = 4
          break
        case '4': count = 3
          break
        case '5': count = 4
          break
        case '6': count = 5 // 轮播图模式
          break
      }
      for (let i = 0; i < count; i++) {
        this.pushObj()
      }
    },
    pushObj () {
      let obj
      if (this.form.showMode === '6') {
        obj = {
          contentVoucher: '',
          pictureUrl: '',
          sortOrder: null,
          isShow: '0'
        }
        delete this.form.isShow
      } else {
        obj = {
          contentVoucher: '',
          pictureUrl: '',
          sortOrder: null
        }
        this.form.isShow = '0'
      }
      this.form.plaDets.push(obj)
    },
    async handleSubmit (name) {
      if (!this.form.plateName) {
        this.$Message.warning('请输入活动名称')
      } else {
        // 新增或编辑banner时，获取banner列表
        if (this.form.plateRegion === '0') {
          let banner = []
          this.form.plaDets.forEach((val) => {
            if (val.pictureUrl) {
              banner.push(val)
            }
          })
          this.form.plaDets = banner
        }
        // 选择跳转类型为商品时，筛选出商品id
        if (this.form.plateType === '1') {
          let arr = []
          this.form.plaDets.forEach((val) => {
            val.contentVoucher = val.contentVoucher.id
          })
        }
        if (this.editType === 1) { // 编辑
          let data = Object.assign(this.form, { FLAG: 1, id: this.activeMsg.id })
          let res = await doEditHomeBanner(data)
          if (res.data.code === 0) {
            this.$Message.success('操作成功!')
            this.$emit('close')
            this.$emit('updateList')
          }
        } else if (this.editType === 2) { // 新增
          let data = Object.assign(this.form, { FLAG: 1 })
          let res = await doAddHomeBanner(data)
          if (res.data.code === 0) {
            this.$Message.success('操作成功!')
            this.form = {
              plateRegion: '0',
              showMode: '6',
              plateName: '',
              plaDets: [{
                contentVoucher: '',
                pictureUrl: '',
                sortOrder: null
              }],
              isShow: '0'
            }
            this.selectMode('6')
            this.$emit('close')
            this.$emit('updateList')
          }
        }
      }
    },
    returnBanner () {
      this.$emit('close')
    },
    async getBannerDetail (obj) {
      let res = await doBannerDetail(obj)
      if (res.data.code === 0) {
        this.bannerDetail = res.data.content
        this.form.plateRegion = this.bannerDetail.plateRegion.toString()
        this.form.showMode = this.bannerDetail.showMode.toString()
        this.form.plateName = this.bannerDetail.plateName
        this.form.plateType = this.bannerDetail.plateType.toString()
        this.form.isShow = this.bannerDetail.isShow.toString()
        let plaDets = []
        if (this.form.plateType === '0') { // 跳转类型为活动时
          for (let i = 0; i < this.bannerDetail.plaDets.length; i++) {
            delete this.bannerDetail.plaDets[i].id
            delete this.bannerDetail.plaDets[i].homePageId
            delete this.bannerDetail.plaDets[i].spuResp
            this.bannerDetail.plaDets[i].isShow = this.bannerDetail.plaDets[i].isShow.toString()
            plaDets.push(this.bannerDetail.plaDets[i])
          }
        } else if (this.form.plateType === '1') { // 跳转类型商品时
          for (let i = 0; i < this.bannerDetail.plaDets.length; i++) {
            delete this.bannerDetail.plaDets[i].id
            delete this.bannerDetail.plaDets[i].homePageId
            this.bannerDetail.plaDets[i].contentVoucher = this.bannerDetail.plaDets[i].spuResp
            this.bannerDetail.plaDets[i].isShow = this.bannerDetail.plaDets[i].isShow.toString()
            plaDets.push(this.bannerDetail.plaDets[i])
          }
        }
        this.form.plaDets = plaDets
        if (this.form.plateRegion === '0') {
          let num = parseInt(this.form.plaDets.length)
          if (num < 5) {
            for (let i = 0; i < (5 - num); i++) {
              this.pushObj()
            }
          }
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
    }
  },
  props: ['activeMsg', 'editType'],
  watch: {
    activeMsg () {
      if (this.activeMsg) {
        let obj = {
          FLAG: 1,
          id: this.activeMsg.id
        }
        this.getBannerDetail(obj)
      } else {
        this.form = {
          plateRegion: '0',
          showMode: '6',
          plateName: '',
          plateType: '0',
          plaDets: [{
            contentVoucher: '',
            pictureUrl: '',
            sortOrder: null
          }],
          isShow: '0'
        }
        this.selectMode('6')
      }
    }
  },
  mounted () {
    // 清空信息
    Bus.$on('clear', () => {
      this.form = {
        plateRegion: '0',
        showMode: '6',
        plateName: '',
        plateType: '0',
        plaDets: [{
          contentVoucher: '',
          pictureUrl: '',
          sortOrder: null
        }],
        isShow: '0'
      }
      this.selectMode('6')
    })
  },
  created () {
    this.getActiveList()
    this.selectMode('6')
    this.columns = this.activeColumns1
    if (this.activeMsg) {
      let obj = {
        FLAG: 1,
        id: this.activeMsg.id
      }
      this.getBannerDetail(obj)
    }
  }
}
</script>
<style lang="less" scoped>
.add {
  .ivu-form {
    .goods {
      float: right;
      width: 150px;
      div {
        width: 70px;
        height: 70px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        line-height: 18px;
      }
    }
    .btnGroup {
      text-align: right;
    }
    .ivu-form-item {
      .ivu-table-wrapper {
        overflow: visible;
        .imgWrap {
          padding-top: 15px;
          padding-bottom: 40px;
          .noImg {
            vertical-align: top;
            width: 80px;
            height: 80px;
          }
        }
      }
      .img-box1{
        vertical-align: top;
        width: 80px;
        height: 80px;
        display: inline-block;
        border: 1px solid #e6e6e6;
      }
      .tips {
        line-height: 20px;
        color: #999;
      }
      .btn-upload{
        display: inline-block;
        position: relative;
        .upload-img{
          margin-left: 8px;
          width: 80px;
          height: 32px;
        }
        .img-ipt{
          position: absolute;
          left: 8px;
          opacity: 0;
          width: 80px;
          height: 32px;
        }
        .tips-upload{
          font-size: 12px;
          color: #999;
          text-align: left;
          position: absolute;
          top: 40px;
          line-height: 16px;
          width: 211px;
          left: 8px;
        }
      }
      .img {
        margin-right: 6px;
      }
    }
    .ivu-radio-group-item {
      margin-right: 15px;
    }
  }
}
</style>
