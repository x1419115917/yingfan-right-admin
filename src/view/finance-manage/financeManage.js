/* 订单状态 */
export function orderStatus () {
  return [
    {
      value: '',
      label: '全部'
    },
    {
      value: 0,
      label: '待支付'
    },
    {
      value: 1,
      label: '交易成功'
    }
  ]
}
/* 支付来源 */
export function paySource () {
  return [
    {
      value: '',
      label: '全部'
    },
    {
      value: 0,
      label: '微信小程序支付'
    },
    {
      value: 1,
      label: '微信支付'
    },
    {
      value: 2,
      label: '支付宝支付'
    }
  ]
}
/* 提现状态 */
export function cashoutStatus () {
  return [
    {
      value: '',
      label: '全部'
    },
    {
      value: 0,
      label: '待审核'
    },
    {
      value: 1,
      label: '已放款'
    },
    {
      value: 2,
      label: '已拒绝'
    }
  ]
}
