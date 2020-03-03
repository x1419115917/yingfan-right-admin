<!--首页配置-banner列表-->
<template>
  <div class="bannerList">
    <Card title="首页配置">
      <Button
        v-for="(item,index) in btnArr"
        :key="index"
        size="large"
        :class="activeIndex === index ? 'btnActive' : ''"
        @click="selectPlate(index)">{{ item }}</Button>
    </Card>
    <div class="wrap">
      <template v-if="activeIndex === 0">
        <add-banner></add-banner>
      </template>
      <template v-else-if="activeIndex === 1">
        <new-recommend></new-recommend>
      </template>
      <template v-else-if="activeIndex === 2">
        <new-week></new-week>
      </template>
      <template v-else-if="activeIndex === 3">
        <vip-hot></vip-hot>
      </template>
      <template v-else-if="activeIndex === 4">
        <week-worth></week-worth>
      </template>
      <template v-else-if="activeIndex === 5">
        <theme-hot></theme-hot>
      </template>
    </div>
  </div>
</template>
<script>
import addBanner from './addBanner'
import newRecommend from './newRecommend'
import newWeek from './newWeek'
import vipHot from './vipHot'
import weekWorth from './weekWorth'
import themeHot from './themeHot'
export default {
  name: 'bannerList',
  components: {
    addBanner,
    newRecommend,
    newWeek,
    vipHot,
    weekWorth,
    themeHot
  },
  data () {
    return {
      btnArr: ['首页banner', '新人推荐', '每周上新', 'VIP最爱', '本周值得买', '极致推荐'],
      activeIndex: 0,
      btnType: 'primary'
    }
  },
  methods: {
    selectPlate (index) {
      this.activeIndex = index
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.bannerList {
  .btnActive {
    background: #2d8cf0;
    color: #fff;
  }
  .ivu-card-body {
    button {
      margin-right: 15px;
    }
  }
  .wrap {
    margin-top: 10px;
    padding: 14px;
    background-color: #fff;
  }
}
</style>
