<!--首页配置-新增banner-->
<template>
  <div class="add">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="选择活动" prop="activityId">
        <Select v-model="formValidate.activityId" placeholder="请选择活动" @on-change="selActive">
            <Option v-for="(item,index) in activityList" :key="index" :value="item.id">{{item.activityName}}</Option>
        </Select>
        <div class="ivu-form-item-error-tip" v-show="isActive">请选择活动</div>
      </FormItem>
      <FormItem label="icon图标">
        <Row class="icon-upload">
          <Col span="4">
            <img v-show="!imgShow" class="active-imgurl" src="https://ec-platform-dev.oss-cn-shenzhen.aliyuncs.com/product/20191031/fd9b8888-a8c1-4ed4-80c5-166a4d45ea97/20191031183109.png" alt="">
            <img v-show="imgShow" class="active-imgurl" :src="formValidate.pictureUrl" />
          </Col>
          <Col span="11">
            <Row class="group-upload">
              <Button type="primary" ghost>上传图片</Button>
              <input type="file" class="icon-ipt" @change="tableUploadImg($event)" accept="image/*">
            </Row>
            <Row class="tips">
              （图片尺寸为281*264.jpg、gif,小于500K）
            </Row>
          </Col>
        </Row>
        <div class="ivu-form-item-error-tip" v-show="isUpload">请上传icon图标</div>
      </FormItem>
      <FormItem label="显示权重" prop="sortOrder">
          <Input v-model="formValidate.sortOrder" @on-change="changeIpt" style="width: 200px" placeholder="请输入权重" type="number" clearable></Input>
          <span class="tips">（1~5之间数字，1为最高权重）</span>
          <div class="ivu-form-item-error-tip" v-show="isSort">请输入权重</div>
      </FormItem>
      <FormItem style="text-align: right;">
        <Button @click="hideModal" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { saveIcons, singleUpload, updateIcons } from '@/api/base'
export default {
  name: 'addIcons',
  components: {
  },
  props: {
    iconsItem: {
      type: Object,
      default: function () {
        return {}
      }
    },
    imageShow: {
      type: Boolean,
      default: function () {
        return false
      }
    },
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
    }
  },
  watch: {
    iconsItem: {
      immediate: true,
      handler (val) {
        this.formValidate = val
      }
    },
    imageShow: {
      immediate: true,
      handler (val) {
        this.imgShow = val
      }
    }
  },
  data () {
    return {
      imgShow: false,
      isUpload: false,
      isActive: false,
      isSort: false,
      modal1: false,
      formValidate: {
        FLAG: 1,
        id: '',
        activityId: '', // 选择活动
        sortOrder: '', // 权重
        pictureUrl: '' // 图片
      },
      ruleValidate: {
        // activityId: [
        //   { required: true, message: '不能为空', trigger: ['change', 'blur']  }
        // ],
        // sortOrder: [
        //   { required: true, message: '不能为空', trigger: ['change', 'blur'] }
        // ],
      }
    }
  },
  methods: {
    handleSubmit () {
      if (this.formValidate.activityId === '') {
        this.isActive = true
        return
      }
      this.isActive = false
      if (this.formValidate.pictureUrl === '') {
        this.isUpload = true
        return
      }
      this.isUpload = false
      if (this.formValidate.sortOrder === '') {
        this.isSort = true
        return
      }
      this.isSort = false
      // console.log('通过',this.operationShow)
      if (this.operationShow) {
        this.updateIcons()
        return
      }
      this.saveIcons()
    },
    selActive (id) {
      this.isActive = false
    },
    changeIpt () {
      this.isSort = false
    },
    async saveIcons () {
      let data = this.formValidate
      let res = await saveIcons(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.initData()
        this.$Modal.success({
          title: '提示',
          content: '发布成功'
        })
        this.$emit('submitModal', this.modal1)
      }
    },
    async updateIcons () {
      let data = this.formValidate
      let res = await updateIcons(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.initData()
        this.$Modal.success({
          title: '提示',
          content: '更新成功'
        })
        this.$emit('submitModal', this.modal1)
      }
    },
    // 表格上传图片
    async tableUploadImg (e) {
      console.log(e)
      let files = e.target.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(files.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        e.target.value = ''
        return
      }
      let data = {
        file: files,
        tag: 2
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        this.imgShow = true
        this.isUpload = false
        this.formValidate.pictureUrl = res.data.content
        e.target.value = ''
      }
    },
    initData () {
      this.formValidate = {
        FLAG: 1,
        id: '',
        activityId: '', // 选择活动
        sortOrder: '', // 权重
        pictureUrl: '' // 图片
      }
      this.isUpload = false
      this.isActive = false
      this.isSort = false
    },
    hideModal () {
      this.initData()
      this.$emit('hideModal', this.modal1)
    }
  },
  computed: {
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.add {
  .ivu-form {
    .ivu-radio-group-item {
      margin-right: 15px;
    }
  }
}
.active-imgurl{
  display: inline-block;
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  width: 70px;
  height: 60px;
  margin-top: 4px;
}
.group-upload{
  position: relative;
  .icon-ipt{
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 32px;
    opacity: 0;
  }
}
.tips{
  font-size: 12px;
  color: #999;
}
/deep/ .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}
</style>
