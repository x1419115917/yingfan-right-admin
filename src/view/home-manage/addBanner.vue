<!--首页配置-新增banner-->
<template>
  <div class="add">
    <Card title="新增">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="展示位置" prop="plateRegion">
            <RadioGroup v-model="formValidate.plateRegion">
                <Radio label="0">首页banner</Radio>
                <Radio label="1">首页活动版块</Radio>
                <Radio label="2">首页主题精选</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="展示模式" prop="showMode">
            <RadioGroup v-model="formValidate.showMode">
              <Radio label="0">单图模式</Radio>
              <template v-if="formValidate.plateRegion !== '0'">
                <Radio label="1">一行两图模式</Radio>
                <Radio label="2">一行三图模式</Radio>
                <Radio label="3">组合模式(3个)</Radio>
                <Radio label="4">组合模式(4个)</Radio>
              </template>
            </RadioGroup>
        </FormItem>
        <FormItem label="活动名称" prop="plateName">
            <Input v-model="formValidate.plateName" :style="{ width :inpWidth}" placeholder="请输入活动名称" clearable></Input>
        </FormItem>
        <FormItem
              v-for="(item, index) in formValidate.plaDets"
              :key="index"
              :label="'图片' + parseInt(index + 1)"
              :prop="'plaDets.' + index + '.value'"
              :rules="{required: true, message: '不能为空', trigger: 'blur'}">
          <Row>
            <Col span="5">
            </Col>
            <Col span="5">
              <span class="img">链接地址</span>
              <Input type="text" v-model="item.pictureUrl" :style="{ width :inpWidth}" placeholder="请输入链接地址"></Input>
            </Col>
            <Col span="5">
              <span class="img">权重</span>
              <Input type="text" v-model="item.sortOrder" :style="{ width :inpWidth}" placeholder="请输入权重"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="状态" prop="isShow">
          <RadioGroup v-model="formValidate.isShow">
              <Radio label="0">显示</Radio>
              <Radio label="1">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="returnBanner" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
    </Card>
  </div>
</template>
<script>
import { doBannerList } from '@/api/order'
import { singleUpload } from '@/api/nature'

export default {
  name: 'addBanner',
  components: {
  },
  data () {
    const validatorPlateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入活动名称'))
      } else {
        if (value.length > 5) {
          callback(new Error('活动名称不超过5个字'))
        }
        callback()
      }
    }
    return {
      inpWidth: '200px',
      formValidate: {
        plateRegion: '0', // 模块区域
        showMode: '0', // 展示模式
        plateName: '', // 活动名称
        plaDets: [{
          activityId: '',
          pictureUrl: '',
          sortOrder: ''
        }],
        isShow: '0' // 显示状态
      },
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
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    returnBanner () {
      this.$router.push({ path: '/homeManage/bannerList' })
      // this.$store.dispatch('delView', this.$route).then(() => {
      //   this.$router.replace({ path: '/homeManage/bannerList' })
      // })
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
    .ivu-form-item {
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
