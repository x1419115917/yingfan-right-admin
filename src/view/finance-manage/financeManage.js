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
