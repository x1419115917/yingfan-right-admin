/* 查询类型 */
export function type () {
  return [
    {
      value: '0',
      label: '订单号'
    },
    {
      value: '1',
      label: '合并订单号'
    },
    {
      value: '2',
      label: '商品名称'
    },
    {
      value: '3',
      label: '商品编码'
    },
    {
      value: '4',
      label: '商品条形码'
    },
    {
      value: '5',
      label: '下单人'
    },
    {
      value: '6',
      label: '收货人'
    }
  ]
}
/* 订单状态 */
export function orderStatus () {
  return [
    {
      value: '',
      label: '全部'
    },
    {
      value: 0,
      label: '待付款'
    },
    {
      value: 1,
      label: '待发货' // 已支付
    },
    {
      value: 2,
      label: '已发货'
    },
    // {
    //     value: 3,
    //     label: '已收货'
    // },
    {
      value: 4,
      label: '交易关闭'
    }
  ]
}
/* 售后状态 */
export function afterSale () {
  return [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '申请退款'
    },
    {
      value: '2',
      label: '拒绝退款'
    },
    {
      value: '3',
      label: '退款成功'
    },
    {
      value: '4',
      label: '退款关闭'
    }
  ]
}
