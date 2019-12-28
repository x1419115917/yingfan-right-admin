<!--财务管理-新增/编辑银行-->
<template>
  <div class="handleBank">
    <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
      <FormItem label="银行图标" prop="logo">
        <Row class="icon-upload">
          <Col span="4">
            <img v-show="!imgShow" class="active-imgurl" src="https://ec-platform-dev.oss-cn-shenzhen.aliyuncs.com/product/20191031/fd9b8888-a8c1-4ed4-80c5-166a4d45ea97/20191031183109.png" alt="">
            <img v-show="imgShow" class="active-imgurl" :src="form.logo" />
          </Col>
          <Col span="11">
            <Row class="group-upload">
              <Button type="primary" ghost>上传图片</Button>
              <input type="file" class="icon-ipt" @change="tableUploadImg($event)" accept="image/*">
            </Row>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="银行名称" prop="name">
        <Input v-model="form.name" placeholder="请输入银行名称"></Input>
      </FormItem>
      <FormItem style="text-align: right;">
        <Button type="primary" style="margin-right: 8px" @click="handleSubmit('form')">确定</Button>
        <Button @click="close">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { singleUpload } from '@/api/base'
import { doAddBank } from '@/api/finance'
import Bus from '@/assets/js/bus.js'
export default {
  name: 'handleBank',
  data () {
    return {
      imgShow: false,
      form: {
        FLAG: 1,
        name: '',
        logo: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入银行名称', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      if (!this.form.logo) {
        this.$Message.warning('银行图标不能为空!')
        return false
      } else if (!this.form.name) {
        this.$Message.warning('银行名称不能为空!')
        return false
      } else {
        this.addBank()
      }
    },
    async addBank () {
      let res = await doAddBank(this.form)
      if (res.data.code === 0) {
        this.$Message.success('操作成功!')
        this.imgShow = false
        this.form = {
          FLAG: 1,
          name: '',
          logo: ''
        }
        this.$emit('close')
        this.$emit('updateList')
      }
    },
    // 表格上传图片
    async tableUploadImg (e) {
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
        this.form.logo = res.data.content
        e.target.value = ''
      }
    },
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    // 清空信息
    Bus.$on('clear', () => {
      this.form = {
        FLAG: 1,
        name: '',
        logo: ''
      }
    })
  }
}
</script>
<style lang="less" scoped>
.handleBank {
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
