<!--订单管理-售后订单-->
<template>
  <div class="orderList">
  售后订单
  </div>
</template>
<script>
import { doOrderList } from '@/api/order'
import { orderStatus, afterSale, type } from './orderList'
import orderDetail from './orderDetail'
export default {
  name: 'orderList',
  components: {
    orderDetail
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.orderList {
}
</style>
