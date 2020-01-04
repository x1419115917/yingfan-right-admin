<!--首页配置-banner列表详情-->
<template>
  <div class="bannerDetail">
    <div class="wrap">
      <Table max-height="400" :columns="activeMsg.plateType === 0 ? activeColumns : goodsColumns" border :data="dataList" stripe>
        <template slot-scope="{ row }" slot="name">{{ row.name }}</template>
        <template slot-scope="{ row }" slot="url">
          <div class="img">
            <img :src="row.url" />
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataList: [],
      activeColumns: [
        {
          title: '专题活动名称',
          align: 'center',
          slot: 'name'
        },
        {
          title: '图片',
          align: 'center',
          slot: 'url'
        }
      ],
      goodsColumns: [
        {
          title: '商品名称',
          align: 'center',
          slot: 'name'
        },
        {
          title: '图片',
          align: 'center',
          slot: 'url'
        }
      ]
    }
  },
  props: ['activeMsg'],
  methods: {
  },
  watch: {
    activeMsg () {
      this.dataList = this.activeMsg.details
    }
  },
  created () {
    this.dataList = this.activeMsg.details
  }
}
</script>
<style lang="less" scoped>
.bannerDetail {
  .wrap {
    .img {
      width: 100px;
      margin: 0 auto;
      height: auto;
      img {
        width: 100%;
        height: auto;
      }
    }
    background-color: #fff;
  }
}
</style>
