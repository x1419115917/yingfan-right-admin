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
/* 展示位置 */
export function showDot () {
  return [
    {
      value: '0',
      label: '首页banner'
    },
    {
      value: '1',
      label: '首页活动版块'
    },
    {
      value: '2',
      label: '首页主题精选'
    }
  ]
}