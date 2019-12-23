<!--系统设置-邀请vip奖励-->
<template>
  <div class="vipReward">
    <Card>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="邀请VIP奖励" prop="value">
          <Input type="number" :style="{ width: inpWidth}" v-model="formValidate.value" placeholder="请输入奖励金额"></Input>
          元<span class="tip">说明：VIP会员邀请好友注册并成功升级VIP会员后获得红包奖励金额，可提现。</span>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import { doSetReward, doCheckVip } from '@/api/sys'
import Cookies from 'js-cookie'
export default {
  name: 'vipReward',
  data () {
    return {
      inpWidth: '200px',
      formValidate: {
        FLAG: 1,
        value: '',
        type: 1,
        operatorId: ''
      },
      ruleValidate: {
        value: [
          { required: true, message: '请输入奖励金额', trigger: 'blur' }
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
    async getVipReward () {
      let res = await doCheckVip()
      if (res.data.code === 0) {
        this.formValidate.value = res.data.content.value
      }
    }
  },
  created () {
    this.getVipReward()
  }
}
</script>
<style lang="less" scoped>
.vipReward {
  .tip {
    margin-left: 20px;
    color: #ed4014;
  }
}
</style>
