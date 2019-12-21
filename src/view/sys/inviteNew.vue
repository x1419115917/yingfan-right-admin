<!--系统设置-邀新奖励-->
<template>
  <div class="inviteNew">
    <Card>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="邀新奖励" prop="value">
          <Input type="number" :style="{ width: inpWidth}" v-model="formValidate.value" placeholder="请输入奖励金额"></Input>
          元<span class="tip"></span>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import { doSetReward, doCheckNewbie } from '@/api/sys'
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
        type: 2,
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
          name: 'inviteNew'
        })
      }
    },
    async getNewbie () {
      let res = await doCheckNewbie()
      if (res.data.code === 0) {
        this.formValidate.value = res.data.content.value
      }
    }
  },
  created () {
    this.getNewbie()
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
