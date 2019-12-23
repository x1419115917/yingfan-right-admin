<!--系统设置-积分奖励-->
<template>
  <div class="inFunReward">
  <Card>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="积分奖励" prop="value">
        <Input type="number" :style="{ width: inpWidth}" v-model="formValidate.value" placeholder="请输入积分比例"></Input>
        %<span class="tip">说明：该功能是设置推荐人最终获得被推荐人消费总积分的比例值，积分公式：返给购买者的积分X百分比。</span>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      </FormItem>
    </Form>
  </Card>
  </div>
</template>
<script>
import { doSetReward, doCheckIntegral } from '@/api/sys'
import Cookies from 'js-cookie'
export default {
  name: 'inFunReward',
  data () {
    return {
      inpWidth: '200px',
      formValidate: {
        FLAG: 1,
        value: '',
        type: 0,
        operatorId: ''
      },
      ruleValidate: {
        value: [
          { required: true, message: '请输入积分比例', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.commit()
        } else {
          this.$Message.error('请输入完整信息')
        }
      })
    },
    async commit () {
      this.formValidate.operatorId = Cookies.get('userId')
      let res = await doSetReward(this.formValidate)
      if (res.data.code === 0) {
        this.$Message.success('操作成功!')
      }
    },
    async getIntegral () {
      let res = await doCheckIntegral()
      if (res.data.code === 0) {
        this.formValidate.value = res.data.content.value
      }
    }
  },
  created () {
    this.getIntegral()
  }
}
</script>
<style lang="less" scoped>
.inFunReward {
  .tip {
    margin-left: 20px;
    color: #ed4014;
  }
}
</style>
