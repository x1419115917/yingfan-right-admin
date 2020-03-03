<!--首页配置-首页banner-->
<template>
  <div class="add">
      <Button style="margin-bottom:10px;" type="success" @click="add">新增</Button>
      <Table max-height="500" border :columns="columns" :data="form.plaDets">
        <template slot-scope="{ row,index }" slot="uploadImg">
        </template>
        <template slot-scope="{ row,index }" slot="isShow">
        </template>
        <template slot-scope="{ row,index }" slot="contentVoucher">
          <!--跳转类型为活动-->
          <template v-if="form.plateType === '0'">
            <Select v-model="form.plaDets[index].contentVoucher" placeholder="请选择活动" :style="{width: inpWidth}" clearable>
              <Option v-for="item in activeList" :value="item.contentVoucher" :key="item.contentVoucher">{{ item.activityName }}</Option>
            </Select>
          </template>
          <!--跳转类型为商品-->
          <template v-else-if="form.plateType === '1'">
            <Button type="success" ghost @click="addGoods(row,index)">添加商品</Button>
            <template v-if="form.plaDets[index].contentVoucher.images">
              <div class="goods">
                <div><img :src="form.plaDets[index].contentVoucher.images[0]" /></div>
                <p>{{ form.plaDets[index].contentVoucher.title }}</p>
              </div>
            </template>
          </template>
        </template>
        <template slot-scope="{ row,index }" slot="sortOrder">
        </template>
        <template slot-scope="{ row,index }" slot="operate">
          <Button type="primary" @click="edit">编辑</Button>
        </template>
      </Table>
      <Page
        :current="form.pageNum"
        :page-size="form.pageSize"
        :total="pageTotal"
        show-total
        show-elevator
        show-sizer
        @on-page-size-change="changePageSize"
        @on-change="pageChange"/>
    </Form>
    <!--选择商品-->
    <Modal v-model="modal1" class="hideFootModal" title="添加商品"  width="940" :mask-closable="false">
      <member-chosses @cancelModal="modal1 = false" :modal1="modal1" @chooseGoods="chooseGoods"></member-chosses>
    </Modal>
    <!--新增/编辑-->
    <Modal v-model="editModal" class="hideFootModal" title="新增">
      <Form ref="formValidate" :model="form" :rules="ruleValidate" :label-width="80">
        <FormItem label="图片" prop="name">
          <img style="width:100px; height: auto;" src="@/assets/images/noImg.png">
          <!--<img :src="form.plaDets[index].pictureUrl" v-show="form.plaDets[index].pictureUrl">-->
          <div class="btn-upload">
            <Button type="primary" class="upload-img">上传图片</Button>
            <input type="file" class="img-ipt"
              ref="filezm" @change="filezm($event,index)" accept="image/*" capture="camera">
          </div>
        </FormItem>
        <FormItem label="跳转类型" prop="name">
          <RadioGroup>
            <Radio label="0">活动</Radio>
            <Radio label="1">商品</Radio>
          </RadioGroup>.
        </FormItem>
        <FormItem label="状态" prop="name">
          <RadioGroup>
            <Radio label="0">显示</Radio>
            <Radio label="1">隐藏</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="权重" prop="name">
          <InputNumber :max="5" :min="1" placeholder="权重"></InputNumber><span style="margin-left: 10px;color: red;">请输入1~5之间数字，1为最高权重</span>
        </FormItem>
        <FormItem style="margin-top: 50px;">
          <Button type="primary" size="large" @click="edit">保存</Button>
          <Button size="large" style="margin-left: 15px;" @click="editModal = false">返回</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { doActiveList, doAddHomeBanner, doBannerDetail, doEditHomeBanner } from '@/api/home'
import { singleUpload } from '@/api/nature'
import memberChosses from '@/view/new-activities/memberChosses.vue'
import Bus from '@/assets/js/bus.js'
export default {
  name: 'addBanner',
  components: {
    memberChosses
  },
  data () {
    const validatorPlateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入首页活动入口标题，如每周上新'))
      } else if (value.length > 10) {
        callback(new Error('活动名称不超过10个字'))
      } else {
        callback()
      }
    }
    return {
      goodsIndex: '', // 保存选择商品的索引值
      modal1: false,
      editModal: false,
      bannerDetail: '',
      inpWidth: '200px',
      pageTotal: 50,
      form: {
        pageNum: 1,
        pageSize: 10
      },
      activeList: [], // 活动列表
      columns: [
        {
          title: '图片',
          align: 'center',
          slot: 'uploadImg'
        },
        {
          title: '跳转类型',
          align: 'center',
          slot: 'isShow'
        },
        {
          title: '跳转详情',
          align: 'center',
          slot: 'isShow'
        },
        {
          title: '状态',
          align: 'center',
          slot: 'isShow'
        },
        {
          title: '权重',
          align: 'center',
          slot: 'contentVoucher'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operate'
        }
      ],
      ruleValidate: {
        plateName: [
          { required: true, validator: validatorPlateName, trigger: ['change', 'blur'] }
        ],
        plateType: [
          { required: true, message: '请选择跳转类型', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    add () {
      this.editModal = true
    },
    edit () {},
    async filezm (e, index) {
      let file = e.target.files[0]
      let data = {
        file: file,
        tag: 1
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        // this.form.plaDets[index].pictureUrl = res.data.content
      }
    },
    // 添加商品
    addGoods (row, index) {
      this.goodsIndex = index
      this.modal1 = true
    },
    chooseGoods (obj) {
      this.form.plaDets[this.goodsIndex].contentVoucher = obj
      this.modal1 = false
    },
    changePageSize (value) {
      this.form.pageSize = value
    },
    pageChange (value) {
      this.form.pageIndex = value
    },
    async handleSubmit (name) {
      if (!this.form.plateName) {
        this.$Message.warning('请输入首页活动入口标题')
      } else {
        // 新增或编辑banner时，获取banner列表
        if (this.form.plateRegion === '0') {
          let banner = []
          this.form.plaDets.forEach((val) => {
            if (val.pictureUrl) {
              banner.push(val)
            }
          })
          this.form.plaDets = banner
        }
        // 选择跳转类型为商品时，筛选出商品id
        if (this.form.plateType === '1') {
          let arr = []
          this.form.plaDets.forEach((val) => {
            val.contentVoucher = val.contentVoucher.id
          })
        }
        if (this.editType === 1) { // 编辑
          let data = Object.assign(this.form, { FLAG: 1, id: this.activeMsg.id })
          let res = await doEditHomeBanner(data)
          if (res.data.code === 0) {
            this.$Message.success('操作成功!')
            this.$emit('close')
            this.$emit('updateList')
          }
        } else if (this.editType === 2) { // 新增
          let data = Object.assign(this.form, { FLAG: 1 })
          let res = await doAddHomeBanner(data)
          if (res.data.code === 0) {
            this.$Message.success('操作成功!')
            this.form = {
              plateRegion: '0',
              showMode: '6',
              plateName: '',
              plaDets: [{
                contentVoucher: '',
                pictureUrl: '',
                sortOrder: null
              }],
              isShow: '0'
            }
            this.$emit('close')
            this.$emit('updateList')
          }
        }
      }
    },
    async getActiveList () {
      let data = {
        FLAG: 1,
        pageSize: 300,
        pageIndex: 1,
        activityName: null
      }
      let res = await doActiveList(data)
      if (res.data.code === 0) {
        this.activeList = res.data.content.rows
        // 转换活动列表key值
        this.activeList = this.activeList.map(o => { return { contentVoucher: o.id.toString(), activityName: o.activityName } })
      }
    }
    // async getBannerDetail (obj) {
    //   let res = await doBannerDetail(obj)
    //   if (res.data.code === 0) {
    //     this.bannerDetail = res.data.content
    //     this.form.plateRegion = this.bannerDetail.plateRegion.toString()
    //     this.form.showMode = this.bannerDetail.showMode.toString()
    //     this.form.plateName = this.bannerDetail.plateName
    //     this.form.plateType = this.bannerDetail.plateType.toString()
    //     this.form.isShow = this.bannerDetail.isShow.toString()
    //     let plaDets = []
    //     if (this.form.plateType === '0') { // 跳转类型为活动时
    //       for (let i = 0; i < this.bannerDetail.plaDets.length; i++) {
    //         delete this.bannerDetail.plaDets[i].id
    //         delete this.bannerDetail.plaDets[i].homePageId
    //         delete this.bannerDetail.plaDets[i].spuResp
    //         this.bannerDetail.plaDets[i].isShow = this.bannerDetail.plaDets[i].isShow.toString()
    //         plaDets.push(this.bannerDetail.plaDets[i])
    //       }
    //     } else if (this.form.plateType === '1') { // 跳转类型商品时
    //       for (let i = 0; i < this.bannerDetail.plaDets.length; i++) {
    //         delete this.bannerDetail.plaDets[i].id
    //         delete this.bannerDetail.plaDets[i].homePageId
    //         this.bannerDetail.plaDets[i].contentVoucher = this.bannerDetail.plaDets[i].spuResp
    //         this.bannerDetail.plaDets[i].isShow = this.bannerDetail.plaDets[i].isShow.toString()
    //         plaDets.push(this.bannerDetail.plaDets[i])
    //       }
    //     }
    //     this.form.plaDets = plaDets
    //     if (this.form.plateRegion === '0') {
    //       let num = parseInt(this.form.plaDets.length)
    //       if (num < 5) {
    //         for (let i = 0; i < (5 - num); i++) {
    //           this.pushObj()
    //         }
    //       }
    //     }
    //   }
    // },
  },
  mounted () {
    // 清空信息
    // Bus.$on('clear', () => {
    //   this.form = {
    //     plateType: '0',
    //     plaDets: [{
    //       contentVoucher: '',
    //       pictureUrl: '',
    //       sortOrder: null
    //     }],
    //     isShow: '0'
    //   }
    // })
  },
  created () {
    this.getActiveList()
  }
}
</script>
<style lang="less" scoped>
.add {
  .ivu-page {
    margin-top: 14px;
    text-align: center;
  }
}
</style>
