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
        <FormItem label="图片">
          <Table max-height="400" border :columns="form.plateRegion === '0' ? imgColumns1 : imgColumns" :data="form.plaDets">
            <template slot-scope="{ row,index }" slot="uploadImg">
              <div class="imgWrap">
                <img class="noImg" v-show="!form.plaDets[index].pictureUrl" src="@/assets/images/noImg.png">
                <img :src="form.plaDets[index].pictureUrl" class="img-box1" v-show="form.plaDets[index].pictureUrl">
                <div class="btn-upload">
                  <Button type="primary" class="upload-img">上传图片</Button>
                  <input type="file" class="img-ipt"
                    ref="filezm" @change="filezm($event,index)" accept="image/*" capture="camera">
                    <span v-if="form.plateRegion === '0'" class="tips-upload">690*300</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '0'" class="tips-upload">690*160</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '1'" class="tips-upload">340*400</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '4'" class="tips-upload">左边1张:340*196<br />右边2张:340*196</span>
                    <span v-else-if="form.plateRegion === '1' && form.showMode === '5'" class="tips-upload">340*196</span>
                    <span v-else-if="form.plateRegion === '2' && form.showMode === '0'" class="tips-upload">690*160</span>
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
            <template slot-scope="{ row,index }" slot="activityId">
              <Select v-model="form.plaDets[index].activityId" placeholder="请选择活动" :style="{width: inpWidth}" clearable>
                <Option v-for="item in activeList" :value="item.id" :key="item.id">{{ item.activityName }}</Option>
              </Select>
            </template>
            <template slot-scope="{ row,index }" slot="sortOrder">
              <Input type="number" v-model="form.plaDets[index].sortOrder" :style="{width: inpWidth}" placeholder="请输入权重"></Input>
              <div class="tips">（请输入1~5之间数字，1为最高权重）</div>
            </template>
          </Table>
        </FormItem>
        <FormItem label="状态" prop="isShow">
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
  </div>
</template>
<script>
import { doActiveList, doAddHomeBanner, doBannerDetail, doEditHomeBanner } from '@/api/home'
import { singleUpload } from '@/api/nature'
import Bus from '@/assets/js/bus.js'
export default {
  name: 'addBanner',
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
      maxlength: 5,
      bannerDetail: '',
      inpWidth: '200px',
      form: {
        plateRegion: '0', // 展示位置
        showMode: '6', // 展示模式
        plateName: '', // 活动名称
        plaDets: [{ // 活动图片列表
          activityId: '',
          pictureUrl: '',
          sortOrder: ''
        }],
        isShow: '0' // 显示状态
      },
      activeList: [], // 活动列表
      imgColumns: [
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '选择活动',
          align: 'center',
          slot: 'activityId'
        },
        {
          title: '权重',
          align: 'center',
          slot: 'sortOrder'
        }
      ],
      imgColumns1: [
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          slot: 'isShow'
        },
        {
          title: '选择活动',
          align: 'center',
          slot: 'activityId'
        },
        {
          title: '权重',
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
        isShow: [
          { required: true, message: '请选择显示状态', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  // 编辑操作时接收的数据
  methods: {
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
    selectPlateRegion () {
      if (this.form.plateRegion === '0') { // 首页banner时，默认轮播图模式
        this.form.showMode = '6'
      } else {
        this.form.showMode = '0'
      }
      this.selectMode(this.form.showMode)
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
      let obj = {
        activityId: '',
        pictureUrl: '',
        sortOrder: ''
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
          this.form.plaDets.forEach((val, index) => {
            if (val.pictureUrl) {
              banner.push(val)
            }
          })
          this.form.plaDets = banner
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
                activityId: '',
                pictureUrl: '',
                sortOrder: ''
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
        this.form.plateName = this.bannerDetail.plateName
        this.form.showMode = this.bannerDetail.showMode.toString()
        this.form.plateRegion = this.bannerDetail.plateRegion.toString()
        this.form.isShow = this.bannerDetail.isShow.toString()
        let plaDets = []
        for (let i = 0; i < this.bannerDetail.plaDets.length; i++) {
          delete this.bannerDetail.plaDets[i].id
          this.bannerDetail.plaDets[i].isShow = this.bannerDetail.plaDets[i].isShow.toString()
          plaDets.push(this.bannerDetail.plaDets[i])
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
          plaDets: [{
            activityId: '',
            pictureUrl: '',
            sortOrder: ''
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
        plaDets: [{
          activityId: '',
          pictureUrl: '',
          sortOrder: ''
        }],
        isShow: '0'
      }
      this.selectMode('6')
    })
  },
  created () {
    this.getActiveList()
    this.selectMode('6')
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
