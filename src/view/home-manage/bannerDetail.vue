<!--首页配置-banner列表详情-->
<template>
  <div class="bannerDetail">
    <div class="wrap">
      <Table max-height="400" :columns="columns" border :data="activeList" stripe>
        <template slot-scope="{ row }" slot="activityName">{{ row.activityName }}</template>
        <template slot-scope="{ row }" slot="pictureUrl">
          <div class="img">
            <img :src="row.pictureUrl" />
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
      activeList: [],
      detail: '',
      columns: [
        {
          title: '专题活动名称',
          align: 'center',
          slot: 'activityName'
        },
        {
          title: '图片',
          align: 'center',
          slot: 'pictureUrl'
        }
      ]
    }
  },
  props: ['activeMsg'],
  methods: {
  },
  watch: {
    activeMsg () {
      this.detail = this.activeMsg.activityDetails
      this.activeList = this.activeMsg.activityDetails
    }
  },
  created () {
    this.detail = this.activeMsg.activityDetails
    this.activeList = this.activeMsg.activityDetails
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
