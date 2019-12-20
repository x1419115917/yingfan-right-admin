<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.com_submenu,
.step-two-item {
  padding: 18px 0 18px 22px;
  border: 1px solid #e3eaf2;
  background-color: #fff;
  margin-bottom: 16px;
  /* 设置下拉框placeholder的样式*/
  /* 设置输入框placeholder的样式*/
}
.btn-item{
  padding: 4px 8px!important;
  border: 1px solid #dcdee2!important;
  margin-left: 6px;
}
</style>
