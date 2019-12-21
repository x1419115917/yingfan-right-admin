<!--系统设置-邀新奖励-->
<template>
  <div class="inviteNew">
    <Card>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="邀请VIP奖励" prop="value">
          <Input type="number" :style="{ width: inpWidth}" v-model="formValidate.value" placeholder="请输入奖励金额"></Input>
          元<span class="tip">该奖励是平台返还给VIP用户的奖励（如：VIP A邀请B成功购买指定商品升级为VIP,B支付后，邀请奖励到VIPA个人账户中，在累计余额体现）</span>
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
import { mapMutations } from 'vuex'
import Cookies from 'js-cookie'
export default {
  name: 'inviteNew',
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
    ...mapMutations([
      'closeTag'
    ]),
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
        this.closeTag({
          name: 'vipReward'
        })
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
.inviteNew {
  .tip {
    margin-left: 20px;
    color: #ed4014;
  }
}
</style>
