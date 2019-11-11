<style lang="less">
  // @import "./common.less";
</style>
<template>
  <div>
    <Card :title="type == 'edit' ? '编辑商品信息' : '发布商品'">
      <Row class="role-top">
      </Row>
    </Card>
    <Row class="margin-top-10" style="background:#fff;padding:30px;">
      <div class="nav-top">
        <span class="nav-top-item" @click="changeNav(0)" :class="vsShowNav == 0 ? 'nav-top-item-active' : ''">选择供应商</span>
        <span class="nav-top-item" @click="changeNav(1)" :class="vsShowNav == 1 ? 'nav-top-item-active' : ''">编辑商品共有信息</span>
        <span class="nav-top-item" @click="changeNav(2)" :class="vsShowNav == 2 ? 'nav-top-item-active' : ''">编辑商品属性信息</span>
      </div>
      <div class="bank_table bank_content" style="position: relative;" v-show="vsShowNav == 0">
        <Row style="margin-top: 35px;">
          <div class="tb-line">
            <span class="name">供应商：</span>
            <Select class="w422" v-model="supplierId" filterable allow-create @on-change="selClistBrand">
                  <Option v-for="item in supplierListArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn">
            <Button class="save-goods-info-btn" type="success" @click="navSave(1)">下一步，编辑商品共有信息</Button>
          </div>
        </Row>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 1">
        <Row style="width: 738px;margin: 40px auto 0;">
          <Row class="sub-left-item name"><span>*</span>商品类目：<span v-show="type !== 'edit'" class="goto-brand" @click="goPage(1)">没有相关类目？去创建类目</span></Row>
          <Row style="margin-top: 30px;">
            <Row style="margin-bottom: 35px;" v-show="type !== 'edit'">
              <Col span="7">
                <Select v-model="cur1" filterable allow-create @on-change="selClist1">
                  <Option v-for="item in clist1" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span="1" style="width: 15px;height: 10px;">
              </Col>
              <Col span="7">
                <Select v-model="cur2" filterable allow-create @on-change="selClist2">
                  <Option v-for="item in clist2" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Col>
              <Col span="1" style="width: 15px;height: 10px;">
              </Col>
              <Col span="7">
                <Select v-model="cur3" filterable allow-create @on-change="selClist3">
                  <Option v-for="(item, index) in clist3" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
              </Col>
            </Row>
            <Row style="margin-bottom: 35px;" v-show="type === 'edit'">
              <Col span="7">
                <span class="selname">{{cname1}}</span>
              </Col>
              <Col span="1" style="width: 15px;height: 10px;">
              </Col>
              <Col span="7">
                <span class="selname">{{cname2}}</span>
              </Col>
              <Col span="1" style="width: 15px;height: 10px;">
              </Col>
              <Col span="7">
                <span class="selname">{{cname3}}</span>
              </Col>
            </Row>
          </Row>
        </Row>
        <Row class="">
          <div class="tb-title">
            <h5 class="name title-h5">商品基本信息</h5>
          </div>
          <div class="tb-line">
            <span class="name"><span>*</span>商品标题：</span>
            <Input class="w687" v-model="goodsTitle" placeholder="请输入商品标题" />
          </div>
          <div class="tb-line">
            <span class="name">商品副标题：</span>
            <Input class="w687" v-model="subTitle" placeholder="输入商品副标题"  />
          </div>
          <div class="tb-line">
            <span class="name"><span>*</span>品牌：</span>
            <Select class="w687" v-model="brandsId" filterable>
                <Option v-for="(item, index) in BrandsList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="tb-line">
            <span class="name"><span></span>是否新款：</span>
            <Select v-model="newGoods" style="width: 286px" filterable>
                <Option v-for="item in newGoodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="name"><span></span>是否爆款：</span>
            <Select style="width: 286px" v-model="explosiveGoods" filterable>
                <Option v-for="item in explosiveGoodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="tb-line photo-con photo-tips-box">
            <span class="name"><span>*</span>商品图片：</span>
            <ul class="photo-list">
              <li class="photo-item" v-for="(item,index) in goodsImgList" :key="index">
                <input type="file" class="img-ipt"
                      ref="filezm1"
                      @change="filezmFn($event, index)"
                      accept="image/*"
                      capture="camera">
                <span class="bg-glay-add"><Icon class="icon-add" size="50" type="md-add" /></span>
                <Spin fix class="loading-box" v-show="item.loading">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>上传中</div>
                </Spin>
                <img :src="item.imgUrl" class="img-box1"
                    id="ad21" v-show="item.imgShow">
                <span v-show="item.imgShow" class="del-file" @click="delFile(index)">删除</span>
              </li>
            </ul>
            <span class="photo-tips">【建议：图片上传尺寸为：800*800&nbsp;&nbsp; 宽高比例：1:1 &nbsp;&nbsp; 小于500K】</span>
          </div>
          <div class="tb-line tb-editor photo-tips-box">
            <span class="name"><span>*</span>商品详情页：</span>
            <div class="editor">
              <v-editor @on-change="_getContext" :initContent='ctx'></v-editor>
            </div>
            <span class="photo-tips">【建议：图片上传尺寸为：宽度800以下，高度1200以下 &nbsp;&nbsp; 单张图片小于500K】</span>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn btn-goods">
            <Button class="save-goods-info-btn" type="success" @click="navSave(2)">下一步，编辑商品属性信息</Button>
          </div>
        </Row>
      </div>
      <div class="bank_table bank_content" style="position:relative;" v-show="vsShowNav == 2">
        <Row class="">
          <div class="tb-title">
            <h5 class="name">商品属性信息<span class="sub-name">（错误填写商品属性，可能会引起商品描述不正确，影响您的正常销售，请认真准确填写！）</span></h5>
          </div>
          <div class="tb-line tb-line2">
            <span class="name"><span>*</span>基本属性：</span>
            <!-- <Button class="add-attr-btn" type="success" @click="addFn">添加属性</Button> -->
            <div class="base-attr" v-show="baseSpec && baseSpec.length > 0">
              <div v-for="(item,index) in baseSpec" :key="index">
                <div class="name-left w687" v-show="item.operateType == 2">
                  <div class="tb-top-item">
                    <span class="top-name">{{item.specName}}：</span>
                    <div class="spce-right">
                      <CheckboxGroup v-model="item.checkspeVals" class="check-box">
                        <Checkbox class="check-item" :label="val" v-for="(val, inx1) in item.specVals" :key="inx1+'item'">
                            <span class="brand-name">{{val}}</span>
                        </Checkbox>
                      </CheckboxGroup>
                      <div class="edit-item" v-show="false">
                        <Icon v-show="!item.showEdit" @click="editFn(index)" type="ios-create-outline" size="22" />
                        <div class="edit-ipt" v-show="item.showEdit">
                          <Input class="edit-modal-ipt" v-model="item.editVal" placeholder="请输入" style="width: 100px" />
                          <Button class="edit-btn" @click="saveFn(index, item.operateType)" type="info">保存</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="name-left w687" v-show="item.operateType == 1">
                  <div class="tb-top-item">
                    <span class="top-name">{{item.specName}}：</span>
                    <div class="spce-right" style="float:left;">
                      <Select class="check-box" style="width: 300px;margin-right: 6px;height: 35px; float: left;" v-model="item.checkVals" filterable allow-create @on-change="selClistBrand">
                        <Option v-for="(vale,ind) in item.specVals" :value="vale" :key="ind">{{ vale }}</Option>
                      </Select>
                      <div class="edit-item" v-show="false">
                        <Icon v-show="!item.showEdit" @click="editFn(index)" type="ios-create-outline" size="22" />
                        <div class="edit-ipt" style="float: left;" v-show="item.showEdit">
                          <Input class="edit-modal-ipt" v-model="item.editVal" placeholder="请输入" style="width: 100px" />
                          <Button class="edit-btn" @click="saveFn(index, item.operateType)" type="info">保存</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="name-left w687" v-show="item.operateType == 3">
                  <div class="tb-top-item">
                    <span class="top-name">{{item.specName}}：</span>
                    <div class="spce-right">
                      <span class="check-box to-ipt-show" v-show="!item.showEdit">{{item.specVals[0]}}</span>
                      <div class="edit-item">
                        <Icon v-show="!item.showEdit && false" @click="editFn(index)" type="ios-create-outline" size="22" />
                        <div class="edit-ipt" style="float: left;" v-show="item.showEdit">
                          <Input class="edit-modal-ipt" v-model="item.specVals[0]" placeholder="请输入" style="width: 300px" />
                          <Button class="edit-btn" @click="saveFn(index, item.operateType)" type="info">保存</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             <div class="base-attr expand-attr" v-show="expandSpec && expandSpec.length > 0">
              <div v-for="(item,index) in expandSpec" :key="index">
                <div class="name-left w687" v-show="item.operateType == 3">
                  <div class="tb-top-item">
                    <span class="top-name">{{item.specName}}：</span>
                    <div class="spce-right">
                      <div class="content-box-vals" v-for="(values,idx) in item.specVals" :value="values" :key="idx">
                        <!-- <span class="check-box to-ipt-show toname-ipt">{{values}}</span> @on-change="iptChange($event,index,idx)" -->
                        <Input class="check-box to-ipt-show toname-ipt" type="text" :value="values" @on-focus="iptFocus($event,index,idx)" @on-blur="iptChange($event,index,idx)"></Input>
                      </div>
                      <div class="edit-item">
                        <Icon v-show="!item.showEdit" @click="editExpandFn(index)" type="ios-create-outline" size="22" />
                        <div class="edit-ipt" style="float: left;" v-show="item.showEdit">
                          <Input class="edit-modal-ipt" v-model="item.editVal" placeholder="请输入" style="width: 100px" />
                          <Button class="edit-btn" @click="saveExpandFn(index, item.editVal)" type="info">保存</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tb-line tb-line3">
              <h5 class="goods-info-title text-left">商品价格 <span class="title-span-tips">&nbsp;&nbsp;&nbsp;【sku图片尺寸：180*180，宽高比例：1：1，小于200k】</span></h5>
              <Row style="margin-bottom: 30px;">
                <Col span="2" class="goods-info-left text-right">批量填充：</Col>
                <Col span="22" class="goods-info-content text-left">
                  <Input class="w80 goods-info-ipt" v-model="goodsObj.supply" placeholder="输入供货价"  />
                  <Input class="w80 goods-info-ipt" v-model="goodsObj.stock" placeholder="可售卖库存"  />
                  <Input class="w80 goods-info-ipt" v-model="goodsObj.retail" placeholder="输入零售价"  />
                  <Input class="w80 goods-info-ipt" v-model="goodsObj.wholesale" placeholder="最低批发量"  />
                  <Input class="w80 goods-info-ipt" v-model="goodsObj.trade" placeholder="输入批发价"  />
                  <span class="goods-info-ipt">
                    佣金比例: <Input class="w80" v-model="goodsObj.brokerage" placeholder=""  /> %
                  </span>
                  <span class="goods-info-ipt">
                    积分返还:
                    <Select class="w80" v-model="goodsObj.integral" filterable>
                      <Option v-for="item in integralList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </span>
                  <Button class="goods-info-ipt" type="warning" ghost @click="clearGoodsObj">重置</Button>
                  <Button class="goods-info-ipt" type="primary" ghost @click="saveGoodsObj">确定</Button>
                </Col>
              </Row>
              <Row>
                  <Table :columns="columnsList" :data="dataList" border>
                    <template slot-scope="{ row, index }" slot="images">
                      <div class="uploadbox">
                        <input type="file" class="upload-img"
                              ref="filezm6"
                              @change="tableUploadImg($event, index)"
                              accept="image/*"
                              capture="camera">
                        <span class="bg-glay-add add-image">+图片</span>
                        <!-- v-show="row.imgShow" -->
                        <img :src="row.imageUrl" class="img-table"
                            id="ad21" v-show="row.imageShow">
                      </div>

                    </template>
                  </Table>
              </Row>
          </div>
        </Row>
        <Row>
          <div class="tb-line btn btn-goods">
            <Button class="save-goods-info-btn" type="success" @click="navSave(3)">保&nbsp;&nbsp;存</Button>
          </div>
        </Row>
      </div>
    </Row>
    <Modal v-model="modal1" class="smsModel" :title="operationShow? '编辑属性': '新增属性'"  width="660" @on-cancel="cancelModal1">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="属性类型:" prop="status">
					<RadioGroup v-model="formValidate.status" @on-change="radioChange">
            <Radio label="1">基本属性</Radio>
            <Radio label="0">规格属性</Radio>
          </RadioGroup>
				</FormItem>
        <FormItem label="属性值性质:" prop="natures" :class="formValidate.status==0 ? 'boxNone' : ''">
          <RadioGroup v-model="formValidate.natures">
            <Radio label="1">下拉框</Radio>
            <Radio label="2">复选框</Radio>
            <Radio label="3">文本框</Radio>
          </RadioGroup>
				</FormItem>
				<FormItem label="属性名称:" prop="name">
					<Input v-model="formValidate.name" placeholder="请输入属性名称"></Input>
				</FormItem>
        <FormItem label="属性值:" class="check-attr">
          <div class="attr-list">
            <div class="attr-item" v-for="(item,index) in attrListArr" :key="index">
              <Input class="attr-ipt" v-model="item.attrItem" placeholder="请输入属性值"></Input>
              <Icon class="attr-close" size="20" type="md-close-circle" @click="removeAttr(index)" />
            </div>
            <span class="add-attr" size="large" type="primary" @click="addAttr">增加属性值</span>
          </div>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button size="large" @click="cancelModal1" class="cancel" style="margin-right: 10px">取消</Button>
				<Button size="large" @click="operationRole" type="primary">确定</Button>
			</div>
		</Modal>
    <Modal
				width="20"
				v-model="delModal"
				@on-ok=""
				:closable="false"
				class-name="vertical-center-modal">
			<p>确定删除？</p>
		</Modal>
  </div>
</template>
<script>
import { menuTree, saveRole, roleDetail, roleUpdate, roleremove, batchRemove } from '@/api/sys'
import { listBrandsPage, singleUpload, specList, saveSpec } from '@/api/nature'
import { supplierList, categList } from '@/api/supplier'
import { saveGoods, goodsDetail, updateGoods } from '@/api/goods'
import { scrollTop } from '@/libs/util'
// import editor from '@/components/editor'
import editors from '@/components/editors/editor'
import Cookies from 'js-cookie'
export default {
  name: 'goodsPub',
  data () {
    return {
      vsShowNav: 0,
      quillUpdateImg: false,
      params: { tag: 0 },
      brandsId: '',
      brandsIds: '',
      speaval: '',
      brandsIdsList: [],
      supplierListArr: [],
      specListArr: [],
      supplierId: '',
      ctx: '',
      BrandsList: [], // 品牌列表
      goodsImgList: [
        {
          imgUrl: '',
          loading: false,
          imgShow: false
        },
        {
          imgUrl: '',
          loading: false,
          imgShow: false
        },
        {
          imgUrl: '',
          loading: false,
          imgShow: false
        },
        {
          imgUrl: '',
          loading: false,
          imgShow: false
        },
        {
          imgUrl: '',
          loading: false,
          imgShow: false
        }
      ], // 商品图片列表
      attrListArr: [],
      treeData1: [],
      ztreesData: [],
      formValidate: {
        status: '',
        natures: '',
        name: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        natures: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      clist1: [],
      clist2: [],
      clist3: [],
      cur1: '',
      cur2: '',
      cur3: '',
      cname1: '',
      cname2: '',
      cname3: '',
      checkSelId: '',
      goodsTitle: '',
      subTitle: '',
      selObj: {},
      crowcd: [],
      crowcdListArr: [],
      isEditCrowcd: false,
      imgUrl: '',
      img1: '',
      imgShow1: false,
      brandListcheck: [],
      newGoods: '',
      newGoodsList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      explosiveGoods: '',
      explosiveGoodsList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      brandListArr: [],
      title: '新增供应商',
      type: '',
      goodsId: '',
      value: '',
      value3: '',
      modal1: false,
      operationShow: false,
      delModal: false,
      checkedIds: [],
      checkedId: '',
      roleName: '',
      goodsObj: {
        supply: '',
        stock: '',
        retail: '',
        wholesale: '',
        trade: '',
        brokerage: '',
        integral: ''
      },
      integralList: [
        {
          label: '30%',
          value: '30'
        },
        {
          label: '60%',
          value: '60'
        },
        {
          label: '100%',
          value: '100'
        }
      ],
      columnsListOriginal: [
        {
          title: '图片',
          // key: 'images',
          width: 80,
          slot: 'images'
        },
        {
          title: '商家编码',
          key: 'code',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].code
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].code = event.target.value
                }
              }
            })
          }
        },
        {
          title: '商品条形码',
          key: 'tcode',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].tcode
              },
              on: {
                'on-change' (event) {
                  // 值改变时
                  // 将渲染后的值重新赋值给单元格值
                  vm.dataList[params.index].tcode = event.target.value
                  // console.log(event.target.value)
                }
              }
            })
          }
        },
        {
          title: '供货价(元)',
          key: 'supply',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].supply
              },
              on: {
                'on-change' (event) {
                  console.log(event.target.value)
                  vm.dataList[params.index].supply = event.target.value
                }
              }
            })
          }
        },
        {
          title: '可售卖库存',
          key: 'stock',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].stock
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].stock = event.target.value
                }
              }
            })
          }
        },
        {
          title: '零售价(元)',
          key: 'retail',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].retail
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].retail = event.target.value
                }
              }
            })
          }
        },
        {
          title: '最低批发量',
          key: 'wholesale',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].wholesale
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].wholesale = event.target.value
                }
              }
            })
          }
        },
        // {
        //   title: '积分兑换',
        //   key: 'exchangePoints',
        //   render: (h, params) => {
        //     var vm = this
        //     return h('Input', {
        //       props: {
        //         value: vm.dataList[params.index].exchangePoints
        //       },
        //       on: {
        //         'on-change' (event) {
        //           vm.dataList[params.index].exchangePoints = event.target.value
        //         }
        //       }
        //     })
        //   }
        // },
        {
          title: '批发价(元)',
          key: 'trade',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].trade
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].trade = event.target.value
                }
              }
            })
          }
        },
        {
          title: '佣金比例(%)',
          key: 'brokerage',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].brokerage
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].brokerage = event.target.value
                }
              }
            })
          }
        },
        {
          title: '积分返还(%)',
          key: 'integral',
          render: (h, params) => {
            var vm = this
            return h('Input', {
              props: {
                value: vm.dataList[params.index].integral
              },
              on: {
                'on-change' (event) {
                  vm.dataList[params.index].integral = event.target.value
                }
              }
            })
          }
        }
      ],
      columnsList: [],
      dataList: [
        {
          imageUrl: '',
          imageShow: false,
          code: '',
          tcode: '',
          supply: '',
          stock: '',
          retail: '',
          wholesale: '',
          trade: '',
          brokerage: '',
          integral: ''
        }
      ],
      userIdCreate: '',
      skusList: [],
      roleSign: '',
      dataDel: [],
      addShow: false,
      sendContractBut: false,
      validateType: false,
      selectedList: [],
      contractInfo: '',
      expandSpec: [],
      expandSpec1: [],
      expandSpec2: [],
      baseSpec: [],
      delIndex: '',
      pageNum: 1,
      pageSize: 10,
      delIndex: '',
      total: 0,
      loading: false, // 分割线
      uploadLoading: false,
      tableLoading: false
    }
  },
  components: {
    'v-editor': editors
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 因为当钩子执行前，组件实例还没被创建
      if (vm.$route.query.type === 'edit') {
        vm.vsShowNav = 0
        vm.goodsTitle = ''
        vm.subTitle = ''
        vm.goodsImgList = [
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          }
        ]
        vm.type = vm.$route.query.type,
        vm.goodsId = vm.$route.query.id,
        console.log('vm.$route', vm.$route)
        vm.goodsDetail(vm.$route.query.id)
      }
      if (vm.$route.query.type !== 'edit') {
        vm.vsShowNav = 0
        vm.type = ''
        vm.goodsId = ''
        vm.brandsId = ''
        vm.supplierId = ''
        vm.goodsTitle = ''
        vm.subTitle = ''
        vm.clist2 = []
        vm.clist3 = []
        // vm.columnsList = [...vm.columnsListOriginal]
        vm.expandSpec = []
        vm.expandSpec1 = []
        vm.expandSpec2 = []
        vm.cur1 = ''
        vm.cur2 = ''
        vm.cur3 = ''
        vm.ctx = ''
        vm.newGoods = ''
        vm.explosiveGoods = ''
        vm.goodsImgList = [
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          },
          {
            imgUrl: '',
            loading: false,
            imgShow: false
          }
        ]
        sessionStorage.removeItem('BrandLists')
        sessionStorage.removeItem('specListArr')
        console.log('vm.ctx', vm.ctx)
      }
    })
  },
  computed: {
    columnsListUpdata: function () {
      let columnsList = [...this.columnsListOriginal]
      console.log('cloumb654', this.columnsListOriginal)
      let expandSpec = this.expandSpec
      expandSpec.forEach((item, index) => {
        columnsList.splice(index, 0, {
          title: item.specName,
          key: `guige${index}`,
          width: 100
        })
      })
      console.log('columnsList-edit', columnsList)
      return columnsList
    },
    Descates: function () {
      let arr1 = this.expandSpec1
      let arr2 = this.expandSpec2
      let result = []
      let i = 0, j = 0
      if (arr1.length > 0 && arr2.length > 0) {
        for (i = 0; i < arr1.length; i++) {
          let item1 = arr1[i]
          for (j = 0; j < arr2.length; j++) {
            let item2 = arr2[j]
            // result.push([item1, item2]);
            result.push(
              {
                guige0: item1,
                guige1: item2,
                imageUrl: '',
                imageShow: false,
                code: '',
                tcode: '',
                stock: '',
                retail: '',
                wholesale: '',
                trade: '',
                brokerage: '',
                integral: ''
              }
            )
          }
        }
        return result
      } else if (arr1.length > 0 && arr2.length === 0) {
        for (i = 0; i < arr1.length; i++) {
          let item1 = arr1[i]
          result.push(
            {
              guige0: item1,
              imageUrl: '',
              imageShow: false,
              code: '',
              tcode: '',
              stock: '',
              retail: '',
              wholesale: '',
              trade: '',
              brokerage: '',
              integral: ''
            }
          )
        }
        return result
      } else {
        return result
      }
    }
  },
  methods: {
    async getSupplierList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100
      }
      let res = await supplierList(data)
      if (res.data.code === 0) {
        // console.log(res.data.content)
        this.supplierListArr = res.data.content.rows
      }
    },
    expandSpecFor (arr, skusList) {
      if (arr && arr.length == 2) {
        this.expandSpec1 = [...arr[0].specVals]
        this.expandSpec2 = [...arr[1].specVals]
        this.dataList = this.Descates
      } else if (arr && arr.length == 1) {
        this.expandSpec1 = [...arr[0].specVals]
        this.expandSpec2 = []
        this.dataList = this.Descates
      }
      skusList.forEach((item, index) => {
        this.dataList[index].skuId = skusList[index].skuId
        this.dataList[index].imageUrl = skusList[index].imageList[0]
        this.dataList[index].imageShow = true
        this.dataList[index].code = skusList[index].merchantCode
        this.dataList[index].tcode = skusList[index].barcode
        this.dataList[index].supply = skusList[index].supplyPrice
        this.dataList[index].stock = skusList[index].stockNum
        this.dataList[index].retail = skusList[index].retailPrice
        this.dataList[index].wholesale = skusList[index].minWholesaleVolume
        this.dataList[index].trade = skusList[index].tradePrice
        this.dataList[index].brokerage = skusList[index].commissionRate
        this.dataList[index].integral = skusList[index].pointRate
        // this.dataList[index].exchangePoints = skusList[index].exchangePoints
      })
      this.columnsList = [...this.columnsListUpdata]
    },
    specArrFor (arr) {
      this.baseSpec = []
      this.expandSpec = []
      arr.forEach(item => {
        if (item.specType === 0) {
          this.expandSpec.push(item)
        } else {
          this.baseSpec.push(item)
        }
      })
      if (this.expandSpec && this.expandSpec.length == 2) {
        this.expandSpec1 = [...this.expandSpec[0].specVals]
        this.expandSpec2 = [...this.expandSpec[1].specVals]
        this.dataList = this.Descates
      } else if (this.expandSpec && this.expandSpec.length == 1) {
        this.expandSpec1 = [...this.expandSpec[0].specVals]
        this.expandSpec2 = []
        this.dataList = this.Descates
      }
      this.columnsList = [...this.columnsListUpdata]
    },
    expandSpecForEach (arr) {
      if (arr && arr.length == 2) {
        this.expandSpec1 = [...this.expandSpec[0].specVals]
        this.expandSpec2 = [...this.expandSpec[1].specVals]
        this.dataList = this.Descates
      } else if (arr && arr.length == 1) {
        this.expandSpec1 = [...this.expandSpec[0].specVals]
        this.expandSpec2 = []
        this.dataList = this.Descates
      }
      this.columnsList = [...this.columnsListUpdata]
    },
    clearGoodsObj () {
      this.goodsObj = {
        supply: '',
        stock: '',
        retail: '',
        wholesale: '',
        trade: '',
        brokerage: '',
        integral: ''
      }
    },
    // 批量填入
    saveGoodsObj () {
      console.log(this.goodsObj)
      let newDataList = []
      newDataList = [...this.dataList]
      this.dataList = []
      newDataList.forEach(item => {
        item.stock = this.goodsObj.stock
        item.supply = this.goodsObj.supply
        item.retail = this.goodsObj.retail
        item.wholesale = this.goodsObj.wholesale
        item.trade = this.goodsObj.trade
        item.brokerage = this.goodsObj.brokerage
        item.integral = this.goodsObj.integral
      })
      this.dataList = newDataList
      console.log('this.dataList+-+-', this.dataList)
    },
    // 保存添加商品
    async saveGood () {
      let specTemplate = []
      let attrTemplate = []
      let imgList = []
      let skus = []
      let cheval = ''
      // 判断基本属性是否选中
      let checkedSpecVal = this.baseSpec.filter((item, index) => {
        if (item.operateType == 2) {
          if (item.checkspeVals && item.checkspeVals.length > 0) {
            cheval = '1'
          }
        } else if (item.operateType == 1) {
          if (item.checkVals && item.checkVals.length > 0) {
            cheval = '1'
          }
        } else if (item.operateType == 3) {
          if (item.specVals && item.specVals.length > 0) {
            cheval = '1'
          }
        }
        return cheval
      })
      if (cheval === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择基本属性'
        })
        return
      }
      this.baseSpec.forEach((item, index) => {
        if (item.operateType == 2) {
          if (item.checkspeVals && item.checkspeVals.length > 0) {
            attrTemplate.push({
              attrName: item.specName,
              attrType: item.operateType,
              attrValues: item.specVals,
              datas: item.checkspeVals
            })
          }
        } else if (item.operateType == 1) {
          if (item.checkVals && item.checkVals.length > 0) {
            attrTemplate.push({
              attrName: item.specName,
              attrType: item.operateType,
              attrValues: item.specVals,
              datas: [ item.checkVals ]
            })
          }
        } else if (item.operateType == 3) {
          if (item.specVals && item.specVals.length > 0) {
            attrTemplate.push({
              attrName: item.specName,
              attrType: item.specType,
              attrValues: item.specVals,
              datas: item.specVals
            })
          }
        }
      })
      // 循环商品图片
      this.goodsImgList.forEach(item => {
        if (item.imgUrl != '') {
          imgList.push(item.imgUrl)
        }
      })
      this.validateTable() // 校验table
      if (!this.validateType) {
        // 遍历table
        this.dataList.forEach((item, index) => {
          let skuSpecs = []
          if (this.expandSpec && this.expandSpec.length === 1) {
            skuSpecs = [{
              specName: this.expandSpec[0].specName,
              specValue: item.guige0
            }]
          } else if (this.expandSpec && this.expandSpec.length === 2) {
            skuSpecs = [
              {
                specName: this.expandSpec[0].specName,
                specValue: item.guige0
              },
              {
                specName: this.expandSpec[1].specName,
                specValue: item.guige1
              }
            ]
          }
          skus.push({
            barcode: item.tcode,
            chooseSpec: '',
            exchangePoints: '0',
            commissionRate: item.brokerage,
            imageList: imgList,
            merchantCode: item.code,
            minWholesaleVolume: item.wholesale,
            pointRate: item.integral,
            retailPrice: item.retail,
            skuId: '',
            skuSpecs: skuSpecs,
            stockNum: item.stock,
            supplyPrice: item.supply,
            tradePrice: item.trade
          })
        })
        let data = {
          FLAG: 1,
          attrTemplate: attrTemplate,
          brandId: this.brandsId,
          cid1: this.cur1,
          cid2: this.cur2,
          cid3: this.cur3,
          description: this.ctx,
          enableWholesale: 0,
          imageList: imgList,
          isNew: this.newGoods,
          isSellWell: this.explosiveGoods,
          minWholesaleVolume: '',
          mixedBatch: '',
          skus: skus,
          specTemplate: this.expandSpec,
          spuId: '',
          subTitle: this.subtitle,
          supplierId: this.supplierId,
          title: this.goodsTitle
        }
        let res = await saveGoods(data)
        if (res.data.code == 0) {
          console.log(res)
          if (res.data.code === 0) {
            this.$Modal.success({
              title: '提示',
              content: '发布成功'
            })
            this.$router.push({ name: 'goodsList' })
          }
        }
      }
    },
    validateTable () {
      this.validateType = false
      this.dataList.forEach((item, index) => {
        if (item.imageUrl == '') {
          this.$Modal.warning({
            title: '提示',
            content: '请上传图片'
          })
          this.validateType = true
        }
        // this.validateStr(item.imageUrl)
        this.validateStr(item.code, '')
        this.validateStr(item.tcode, '')
        this.validateStr(item.stock, 'number')
        this.validateStr(item.retail, 'number')
        this.validateStr(item.supply, 'number')
        this.validateStr(item.wholesale, 'number')
        this.validateStr(item.trade, 'number')
        this.validateStr(item.brokerage, 'number', 'range')
        this.validateStr(item.integral, 'number', 'range')
        // this.validateType = false
      })
    },
    // 更新商品
    async updateGoods () {
      let specTemplate = []
      let attrTemplate = []
      let imgList = []
      let skus = []
      let cheval = ''
      // 判断基本属性是否选中
      let checkedSpecVal = this.baseSpec.filter((item, index) => {
        if (item.operateType == 2) {
          if (item.checkspeVals && item.checkspeVals.length > 0) {
            cheval = '1'
          }
        } else if (item.operateType == 1) {
          if (item.checkVals && item.checkVals.length > 0) {
            cheval = '1'
          }
        } else if (item.operateType == 3) {
          if (item.specVals && item.specVals.length > 0) {
            cheval = '1'
          }
        }
        return cheval
      })
      if (cheval === '') {
        this.$Modal.warning({
          title: '提示',
          content: '请选择基本属性'
        })
        return
      }
      this.baseSpec.forEach((item, index) => {
        if (item.operateType == 2) {
          if (item.checkspeVals && item.checkspeVals.length > 0) {
            attrTemplate.push({
              attrName: item.specName,
              attrType: item.operateType,
              attrValues: item.specVals,
              datas: item.checkspeVals
            })
          }
        } else if (item.operateType == 1) {
          if (item.checkVals && item.checkVals.length > 0) {
            attrTemplate.push({
              attrName: item.specName,
              attrType: item.operateType,
              attrValues: item.specVals,
              datas: [ item.checkVals ]
            })
          }
        } else if (item.operateType == 3) {
          if (item.specVals && item.specVals.length > 0) {
            attrTemplate.push({
              attrName: item.specName,
              attrType: item.specType,
              attrValues: item.specVals,
              datas: item.specVals
            })
          }
        }
      })
      // 循环商品图片
      this.goodsImgList.forEach(item => {
        if (item.imgUrl != '') {
          imgList.push(item.imgUrl)
        }
      })
      // 遍历table
      this.dataList.forEach((item, index) => {
        let skuSpecs = []
        if (this.expandSpec && this.expandSpec.length === 1) {
          skuSpecs = [{
            specName: this.expandSpec[0].specName,
            specValue: item.guige0
          }]
        } else if (this.expandSpec && this.expandSpec.length === 2) {
          skuSpecs = [
            {
              specName: this.expandSpec[0].specName,
              specValue: item.guige0
            },
            {
              specName: this.expandSpec[1].specName,
              specValue: item.guige1
            }
          ]
        }
        skus.push({
          skuId: item.skuId || '',
          barcode: item.tcode,
          chooseSpec: '',
          exchangePoints: '0',
          commissionRate: item.brokerage,
          imageList: imgList,
          merchantCode: item.code,
          minWholesaleVolume: item.wholesale,
          pointRate: item.integral,
          retailPrice: item.retail,
          skuSpecs: skuSpecs,
          stockNum: item.stock,
          supplyPrice: item.supply,
          tradePrice: item.trade
        })
      })
      this.validateTable()
      if (!this.validateType) {
        let data = {
          FLAG: 1,
          attrTemplate: attrTemplate,
          brandId: this.brandsId,
          cid1: this.cur1,
          cid2: this.cur2,
          cid3: this.cur3,
          description: this.ctx,
          enableWholesale: 0,
          imageList: imgList,
          isNew: this.newGoods,
          isSellWell: this.explosiveGoods,
          minWholesaleVolume: '',
          mixedBatch: '',
          skus: skus,
          specTemplate: this.expandSpec,
          spuId: this.goodsId,
          subTitle: this.subtitle,
          supplierId: this.supplierId,
          title: this.goodsTitle
        }
        let res = await updateGoods(data)
        if (res.data.code == 0) {
          console.log(res)
          if (res.data.code === 0) {
            this.$Modal.success({
              title: '提示',
              content: '更新商品信息成功'
            })
            this.$router.push({ name: 'goodsList' })
          }
        }
      }
    },
    // 去空格
    strTrim (str) {
      return parseInt(str.replace(/^\s+/, '').replace(/\s+$/, ''))
    },
    // 校验
    validateStr (str, type, scope) {
      let reg = /^\d+(\.\d{1,2})?$/
      if (str == '') {
        this.$Modal.warning({
          title: '提示',
          content: '请填写完整信息'
        })
        this.validateType = true
        console.log('validateType', this.validateType)
      } else if (type === 'number') {
        if (!reg.test(str)) {
          this.$Modal.warning({
            title: '提示',
            content: '请输入数字格式'
          })
          this.validateType = true
          return
        }
        if (scope && scope === 'range') {
          if (!/^([1-9]\d{0,1}|100|NA)$/.test(str)) {
            this.$Modal.warning({
              title: '提示',
              content: '(%)只能输入1-100的正整数'
            })
            this.validateType = true
          }
        }
      }
    },
    // 添加属性
    radioChange () {
      if (this.formValidate.status == 0) {
        this.formValidate.natures = '3'
      }
    },
    removeAttr (index) {
      this.attrListArr.splice(index, 1)
    },
    addAttr () {
      this.attrListArr.push({ attrItem: '' })
    },
    async getSpecList () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 100,
        specName: '',
        categoryId: this.cur3
      }
      this.specListArr = []
      let res = await specList(data)
      if (res.data.code === 0) {
        this.specListArr = res.data.content.rows
        this.specListArr.forEach(item => {
          item.showEdit = false
          item.editVal = ''
          item.checkVals = ''
          item.checkspeVals = []
        })
        this.specArrFor(this.specListArr)
      }
    },
    // 表格上传图片
    async tableUploadImg (e, index) {
      console.log(e)
      let files = e.target.files[0]
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(files.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        e.target.value = ''
        return
      }
      let data = {
        file: files,
        tag: 0
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        // console.log(res)
        this.dataList[index].imageShow = true
        this.dataList[index].imageUrl = res.data.content
        e.target.value = ''
      }
    },
    delFile (val) {
      this.goodsImgList[val].imgShow = false
      this.goodsImgList[val].loading = false
      this.goodsImgList[val].imgUrl = ''
      switch (val) {
        case 0:
          this.$refs.filezm1.value = ''
          break
        case 1:
          this.$refs.filezm2.value = ''
          break
        case 2:
          this.$refs.filezm3.value = ''
          break
        case 3:
          this.$refs.filezm4.value = ''
          break
        case 4:
          this.$refs.filezm5.value = ''
          break
      }
    },
    // 上传图片
    async filezmFn (e, val) {
      let data = {}
      let files = e.target.files[0]
      // console.log(this.$refs.filezm1.files[0])
      this.goodsImgList[val].loading = true
      if (!/\/(?:jpg|jpeg|png|gif)/i.test(files.type)) {
        this.$Message.warning('请选择jpg|jpeg|png|gif格式图片上传')
        e.target.value = ''
        return
      }
      data = {
        file: files,
        tag: 0
      }
      let res = await singleUpload(data)
      if (res.data.code === 0) {
        console.log(res)
        this.goodsImgList[val].imgShow = true
        this.goodsImgList[val].loading = false
        this.goodsImgList[val].imgUrl = res.data.content
        e.target.files[0].value = ''
      }
      console.log(this.goodsImgList)
    },
    _getContext (ctx) {
      // console.log(ctx)
      this.ctx = ctx.html
    },
    selClist1 (id) {
      this.getcategList(id, '', 1)
      this.cur2 = ''
      this.cur3 = ''
      this.brandListcheck = []
      this.brandListArr = []
    },
    selClist2 (id) {
      if (id) {
        this.getcategList(id, '', 2)
        this.cur3 = ''
        this.brandListcheck = []
        this.brandListArr = []
      }
    },
    selClist3 (id) {
      this.checkSelId = id
      // this.listBrands(this.clist3[i].id)
      let selObj = this.clist3.filter(item => {
        return item.id === id
      })
      this.selObj = selObj[0]
      let specListArrs = []
      this.getSpecList()
    },
    async goodsDetail (id) {
      let res = await goodsDetail(id)
      if (res.data.code === 0) {
        let spuInfo = res.data.content.spu
        let skuInfo = res.data.content.sku
        this.skusList = skuInfo.skus
        // console.log('res.data12', res.data)
        this.supplierId = spuInfo.supplierId
        let imageList = JSON.parse(spuInfo.images)
        this.goodsTitle = spuInfo.title
        this.subTitle = spuInfo.subTitle
        this.brandsId = spuInfo.brandId
        this.ctx = spuInfo.description
        imageList.forEach((item, index) => {
          this.goodsImgList[index].imgUrl = imageList[index]
          this.goodsImgList[index].loading = false
          this.goodsImgList[index].imgShow = true
        })
        this.cur1 = spuInfo.cid1
        this.cur2 = spuInfo.cid2
        this.cur3 = spuInfo.cid3
        this.cname1 = spuInfo.cname1
        this.cname2 = spuInfo.cname2
        this.cname3 = spuInfo.cname3
        this.newGoods = spuInfo.isNew.toString()
        this.explosiveGoods = spuInfo.isSellWell.toString()
        skuInfo.attrTemplate.forEach(item => {
          if (item.attrType == 2) {
            item.checkspeVals = item.datas
            item.editVal = ''
          } else if (item.attrType == 1) {
            item.checkVals = item.datas[0]
            item.editVal = ''
          } else if (item.attrType == 3) {
            item.checkVals = item.attrValues
            item.editVal = ''
          }
          item.specName = item.attrName
          item.specVals = item.attrValues
          item.operateType = item.attrType
          item.showEdit = false
        })
        skuInfo.specTemplate.forEach(item => {
          item.operateType = 3
          item.showEdit = false
          item.editVal = ''
        })
        // return;
        this.baseSpec = skuInfo.attrTemplate
        this.expandSpec = skuInfo.specTemplate
        this.expandSpecFor(this.expandSpec, this.skusList)
        console.log('this.expandSpec-edit', this.expandSpec)
        // console.log('ctx-edit',this.ctx)
      }
    },
    async getcategList (parentId, i, val) {
      let data = {
        FLAG: 1,
        parentId: parentId
      }
      let res = await categList(data)
      if (res.data.code === 0) {
        let data = res.data.content
        if (data && data.length > 0) {
          let levelNo = data[0].level
          switch (levelNo) {
            case 1:
              this.clist1 = data
              this.clist2 = []
              this.clist3 = []
              break
            case 2:
              this.clist2 = data
              this.clist3 = []
              break
            case 3:
              this.clist3 = data
              break
          }
        }
      }
    },
    editExpandFn (index) {
      let obj = this.expandSpec[index]
      obj.showEdit = !obj.showEdit
      this.$set(this.expandSpec, index, obj)
    },
    saveExpandFn (index, value) {
      console.log('this.expandSpec-edit-edit1', this.expandSpec)
      let val = value.replace(/(^\s*)|(\s*$)/g, '')
      if (val === '') {
        this.expandSpec[index].showEdit = false
        this.expandSpec[index].editVal = ''
        return
      }
      let obj = this.expandSpec[index]
      obj.showEdit = false
      obj.specVals.push(val)
      this.$set(this.expandSpec, index, obj)
      console.log('index3210', index)
      console.log('this.expandSpec-edit-edit2', this.expandSpec)
      if (this.type !== 'edit') {
        this.expandSpecForEach(this.expandSpec)
      } else {
        this.expandSpecFor(this.expandSpec, this.skusList)
      }
    },
    iptFocus (e, index, idx) {
      let obj = this.expandSpec[index]
      this.speaval = obj.specVals[idx]
      this.baseSpec = this.baseSpec
    },
    iptChange (e, index, idx) {
      let obj = this.expandSpec[index]
      let spval = obj.specVals[idx]
      obj.showEdit = false
      if (e.target.value === '') {
        obj.specVals[idx] = this.speaval
        e.target.value = this.speaval
      } else {
        obj.specVals[idx] = e.target.value
      }
      this.$set(this.expandSpec, index, obj)
      this.speaval = ''
      if (this.type !== 'edit') {
        this.expandSpecForEach(this.expandSpec)
      } else {
        this.expandSpecFor(this.expandSpec, this.skusList)
      }
    },
    editFn (index) {
      let obj = this.baseSpec[index]
      obj.showEdit = !obj.showEdit
      this.$set(this.baseSpec, index, obj)
      // console.log('this.baseSpec[index].showEdit',this.baseSpec[index].showEdit);
    },
    saveFn (i, type) {
      let val = this.baseSpec[i].editVal.replace(/(^\s*)|(\s*$)/g, '')
      if (val === '') {
        this.baseSpec[i].showEdit = false
        this.baseSpec[i].editVal = ''
        return
      }
      switch (type) {
        case 1:
          this.baseSpec[i].specVals.push(this.baseSpec[i].editVal)
          this.baseSpec[i].showEdit = false
          this.baseSpec[i].editVal = ''
          break
        case 2:
          this.baseSpec[i].specVals.push(this.baseSpec[i].editVal)
          this.baseSpec[i].showEdit = false
          this.baseSpec[i].editVal = ''
          break
        case 3:
          this.baseSpec[i].showEdit = false
          break
      }
    },
    async getlistBrandsPage () {
      let data = {
        FLAG: 1,
        pageIndex: 1,
        pageSize: 200
      }
      let res = await listBrandsPage(data)
      if (res.data.code === 0) {
        sessionStorage.setItem('BrandLists', JSON.stringify(res.data.content.rows))
        this.BrandsList = JSON.parse(sessionStorage.getItem('BrandLists'))
      }
    },
    selClistBrand (id) {
      console.log(id)
    },
    changeNav (val) {
      let imageUrl = this.goodsImgList.filter(item => {
        return item.imgUrl != ''
      })
      switch (val) {
        case 0:
          this.vsShowNav = 0
          break
        case 1:
          if (this.supplierId != '') {
            this.vsShowNav = 1
          } else {
            this.$Modal.warning({
              title: '提示',
              content: '请选择供应商'
            })
          }
          break
        case 2:
          if (this.cur3 == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择商品分类'
            })
            return
          }
          if (this.goodsTitle == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品标题'
            })
            return
          }
          if (this.brandsId === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择品牌'
            })
            return
          }
          if (imageUrl && imageUrl.length === 0) {
            this.$Modal.warning({
              title: '提示',
              content: '请上传商品图片'
            })
            return
          }
          if (this.ctx === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品详情'
            })
            return
          }
          this.vsShowNav = 2
          break
      }
    },
    navSave (val) {
      let imageUrl = this.goodsImgList.filter(item => {
        return item.imgUrl != ''
      })
      switch (val) {
        case 1:
          if (this.supplierId != '') {
            this.vsShowNav = 1
          } else {
            this.$Modal.warning({
              title: '提示',
              content: '请选择供应商'
            })
          }
          break
        case 2:
          if (this.cur3 == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择商品分类'
            })
            return
          }
          if (this.goodsTitle == '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品标题'
            })
            return
          }
          if (this.brandsId === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请选择品牌'
            })
            return
          }
          if (imageUrl && imageUrl.length === 0) {
            this.$Modal.warning({
              title: '提示',
              content: '请上传商品图片'
            })
            return
          }
          if (this.ctx === '') {
            this.$Modal.warning({
              title: '提示',
              content: '请填写商品详情'
            })
            return
          }
          this.vsShowNav = 2
          break
        case 3:
          if (this.type !== 'edit') {
            this.saveGood()
            console.log('保存')
          } else {
            this.updateGoods()
          }
          break
      }
    },
    async roleDetail (id) {
      let res = await roleDetail(id)
      if (res.data.code === 0) {
        this.formValidate = {
          roleName: res.data.content.roleName,
          roleDesc: res.data.content.remark,
          roleSign: res.data.content.roleSign,
          power: ''
        }
        this.menuIds = res.data.content.menuIds
        if (this.menuIds && this.menuIds.length > 0) {
          this.forIds(this.menuIds)
        }
      }
    },
    forIds (arr) {
      let zTreeData = [...this.ztreesData]
      for (let i = 0; i < arr.length; i++) {
        this.parentFn(zTreeData, arr[i])
      }
      this.ztreesData = [...zTreeData]
    },
    parentFn (arr, roleId) {
      arr.forEach((item, index) => {
        if (item.id == roleId) {
          this.$set(item, 'checked', true)
        } else {
          if (item.children) {
            this.parentFn(item.children, roleId)
          }
        }
      })
    },
    async roleUpdate () {
      let menuIds = this.checkedIds
      if (menuIds && menuIds.length === 0) {
        this.$Modal.warning({
          title: '提示',
          content: '请选择菜单权限'
        })
        return
      }
      let data = {
        FLAG: 1,
        menuIds: menuIds,
        roleId: this.checkedId,
        remark: this.formValidate.roleDesc,
        roleName: this.formValidate.roleName,
        roleSign: this.formValidate.roleSign
      }
      let res = await roleUpdate(data)
      if (res.data.code === 0) {
        console.log(res)
        this.modal1 = false
        this.$Modal.success({
          title: '提示',
          content: '编辑成功'
        })
        this.checkedId = ''
        this.checkedIds = []
        this.formValidate = {
          roleName: '',
          roleDesc: '',
          roleSign: '',
          power: ''
        }
        this.getPageList()
      }
    },
    addFn () {
      this.modal1 = true
      this.operationShow = false
      this.formValidate = {
        roleName: '',
        roleDesc: '',
        roleSign: '',
        power: ''
      }
    },
    operationRole () {
      if (this.operationShow) {
        // this.roleUpdate()
      } else {
        this.saveSepcs()
      }
    },
    //  添加属性
    saveSepcs () {
      let itemVal = []
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          itemVal = this.attrListArr.filter((item, index) => {
            return item.attrItem != ''
          })
          if (itemVal && itemVal.length === 0) {
            this.$Modal.warning({
              title: '提示',
              content: '请添加属性值'
            })
            return
          }
          this.addSpec()
        }
      })
    },
    async addSpec () {
      let specVals = []
      // console.log('this.selObj',this.selObj)
      this.attrListArr.forEach((item, index) => {
        if (item.attrItem != '') {
          specVals.push(item.attrItem)
        }
      })
      if (this.formValidate.status == 0) {
        let obj = {
          checkVals: '',
          checkspeVals: [],
          editVal: '',
          operateType: this.formValidate.natures,
          showEdit: false,
          sort: 1,
          specName: this.formValidate.name,
          specType: this.formValidate.status,
          specVals: specVals
        }
        this.expandSpec.push(obj)
      } else {
        let obj = {
          checkVals: '',
          checkspeVals: [],
          editVal: '',
          operateType: this.formValidate.natures,
          showEdit: false,
          sort: 1,
          specName: this.formValidate.name,
          specType: this.formValidate.status,
          specVals: specVals
        }
        this.baseSpec.push(obj)
      }
      this.modal1 = false
      this.formValidate = {
        natures: '',
        status: '',
        name: ''
      }
      this.attrListArr = []
      // let data = {
      //   specName: this.formValidate.name,
      //   specType: this.formValidate.status,
      //   operateType: this.formValidate.natures,
      //   specVals: specVals
      // }
    },
    edit (i) {
      this.modal1 = true
      this.operationShow = true
      this.checkedId = this.dataList[i].roleId
      this.roleDetail(this.dataList[i].roleId)
    },
    remove (i) {
      this.delModal = true
      this.delIndex = i
      console.log(this.delIndex)
    },
    // 取消
    cancelModal1 () {
      this.modal1 = false
      this.menuIds = []
      this.attrListArr = []
      this.formValidate = {
        name: '',
        status: '',
        natures: ''
      }
    },
    selected (res) {
      this.selectedList = res
      console.log(res)
    },
    changePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.getPageList()
    },
    updateDataList () {
      this.pageNum = 1
      this.pageSize = 10
      this.getPageList()
    },
    pageChange (value) {
      this.pageNum = value
      this.getPageList()
    },
    clearInputs () {
      this.pageNum = 1
      this.pageSize = 10
      this.keyword2 = ''
      this.getPageList()
    },
    goPage (val) {
      switch (val) {
        case 1:
          this.$router.push({ name: 'categoryManger' })
          this.modal1 = false
          break
      }
    }
  },
  created () {
    // this.getcategList(0, '', 1)
  },
  mounted () {
    // window.addEventListener('scroll', this.scrollToTop)
    let brand = JSON.parse(sessionStorage.getItem('BrandLists')) || []
    this.getcategList(0, '', 1)
    this.getSupplierList()
    if (brand && brand.length === 0) {
      this.getlistBrandsPage()
    } else {
      this.BrandsList = brand
    }
  },
  destroyed () {
    sessionStorage.removeItem('BrandLists')
    sessionStorage.removeItem('specListArr')
  }
}
</script>
<style lang="less" scoped>
.sub-left-item{
  display: inline-block;
  margin-right: 10px;
}
.tb-top-item{
  overflow: hidden;
  .top-name{
    float: left;
    line-height: 32px;
  }
  .check-box{
    max-width: 560px;
    margin-left: 10px;
    .check-item{
      float: left;
    }
    .brand-name{
      font-size: 12px;
    }
    .check-item{
      margin-left: 0;
    }
  }
}
.spce-right{
  float: left;
  width: 600px;
}
.check-box[data-v-5c127369] {
    max-width: 560px;
    margin-left: 10px;
}
.check-item{
  float: left;
}
.photo-con{
  width: 800px;
  margin: 0 auto;
  overflow: hidden;
  .name{
    float: left;
  }
}
.photo-list{
  float: left;
  .photo-item{
    display: inline-block;
    position: relative;
    width: 122px;
    height: 142px;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    cursor: pointer;
    margin-right: 15px;
    &:last-child{
      margin-right: 0;
    }
    .img-box1{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 140px;
      z-index: 2;
      background-color: #f20;
    }
    .del-file{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 120px;
      height: 26px;
      line-height: 26px;
      background: rgba(0,0,0,.4);
      color: #fff;
      cursor: pointer;
      z-index: 4;
    }
    .bg-glay-add{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 140px;
      z-index: 1;
      background-color: #f9f9f9;
      .icon-add{
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        color: #ccc;
      }
    }
    .img-ipt{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 140px;
      opacity: 0;
      z-index: 3;
    }
  }
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.nav-top{
  text-align: center;
  .nav-top-item{
    display: inline-block;
    font-size: 16px;
    color: rgb(102, 153, 204);
    padding: 10px 34px;
    border: 1px solid #e6e6e6;
    cursor: pointer;
  }
  .nav-top-item-active{
    background: #19be6b;
    color: #fff;
    border-color: #19be6b;
  }
}
.goto-brand{
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 35px;
  color: #6699CC;
  cursor: pointer;
}
.check-item{
  margin-left: 20px;
  &:first-child{
    margin-left: 0;
  }
}
.brand-name{
  font-size: 14px;
}
.sub-left-item{
  font-style: normal;
  font-size: 16px;
  color: rgba(51, 51, 51, 0.8);
}
.list-group{
  height: 200px;
  overflow: auto;
  li{
    list-style: none;
    background-color: inherit;
    border: 1px solid #e7eaec;
    display: block;
    margin-bottom: -1px;
    padding: 10px 15px;
    position: relative;
    border-bottom: 0;
    &:last-child{
      border-bottom: 1px solid #e7eaec;
    }
  }
}
.bank_table_footer{
  margin: 0 auto;
  margin-top: 15px;
  text-align: center
}
.deloy-right{
  margin-top: 15px;
}
.role-top{
  overflow: hidden;
  width: 100%;
  .role-top-left{
    float: left;
    width: 300px;
  }
  .role-top-right{
    float: right;
  }
  .btn{
    margin-right: 10px;
  }
  .ipt{
    margin-right: 10px;
  }
}
.sub-name{
  color: red;
  font-size: 12px;
  font-weight: 400;
}
.bank_content{
  min-height: 350px;
  margin-top: 16px;
  padding-bottom: 30px;
  .tb-line{
    text-align: center;
    margin-bottom: 25px;
    /deep/ .ivu-select-item{
      text-align: left;
    }
    .name{
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 10px;
      span{
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
      }
    }
  }
  .tb-line2{
    position: relative;
    ::before{
      clear: both;
    }
    .add-attr-btn{
      position: absolute;
      left: 15px;
      top: 17px;
    }
    width: 100%;
    margin: 0 auto 25px;
    text-align: center;
    overflow: hidden;
    .name{
      float: left;
    }
    .base-attr{
      float: left;
      text-align: left;
      padding: 10px;
      min-height: 50px;
      line-height: 30px;
      background-color: #f9f9f9;
      width: 86%;
    }
    .expand-attr{
      margin-left: 110px;
      margin-top: 10px;
    }
    .name-left{
      margin-bottom: 10px;
      width: 95%;
      .content-box-vals{
        float: left;
      }
      .to-ipt-show{
        height: 32px;
        float: left;
        line-height: 1.8;
        padding: 4px 7px 4px 0;
        font-size: 12px;
        border: 1px solid #f9f9f9;
        border-radius: 4px;
        color: #515a6e;
        //
        background-image: none;
        position: relative;
        cursor: text;
      }
      .toname-ipt{
        background-color: #fff;
        width: 80px;
        text-align: center;
        height: auto;
        padding: 0;
        /deep/ .ivu-input{
          text-align: center;
        }
      }
      .edit-ipt{
        float: left;
        .edit-btn{
          height: 30px;
        }
        .edit-modal-ipt{
          margin-right: 6px;
          height: 32px;
        }
      }
    }
  }
  .tb-title{
    h5{
      width: 100%;
      margin: 0 auto;
      font-size: 14px;
      margin-bottom: 26px;
    }
    .title-h5{
      width: 780px;
    }
  }
  .tb-line.btn{
    margin-top: 200px;
  }
  .btn.btn-goods{
    margin-top: 50px;
  }
}
.add-attr{
  // display: inline-block;
  float: left;
  background-color: #78b5f6;
  border-radius: 4px;
  width: 90px;
  height: 34px;
  line-height: 34px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.check-attr{
  ::before{
    clear: both;
    overflow: hidden;
  }
  .attr-list{
    float: left;
  }
}
.check-attr /deep/ .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}
.attr-list{
  list-style: none;
  margin-right: 6px;
  &::before{
    clear: both;
  }
  .attr-item{
    position: relative;
    margin-right: 4px;
    float: left;
    margin-bottom: 6px;
    .attr-close{
      position: absolute;
      right: -6px;
      top: -10px;
      cursor: pointer;
    }
    .attr-ipt{
      width: 100px;
      height: 34px;
    }
  }
}
.no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .no-data-img {
      // background: url(../../assets/img/no-data.png) center no-repeat;
      width: 404px;
      height: 253px;
      background-size: contain;
    }
    .no-tit {
      width: 404px;
      text-align: center;
      font-size: 14px;
    }
  }
.pages {
  position: relative;
  padding: 10px 0;
  text-align: center;
  background: #fff;
  .operation {
    position: absolute;
    left: 0px;
  }
}
.btn-item{
  margin-left: 6px;
}
.title{
    margin:15px 0 15px;
}
.title span:first-child{
    font-size: 18px;
    font-weight: bold;
}
.title span:last-child{
    font-size: 14px;
    color: #6699CC;
    margin-left: 10px;
}
.ul-title{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: relative;
    display: block;
    padding: 10px 15px;
    margin-bottom: -1px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
}
.catgimg{
    width: 50px;
    height: 45px;
    margin-top: 110px;
}
.ul-content li:hover{
    background: #f9f9f9;
    cursor: pointer;
}
.form-search{
    overflow: hidden;
    margin-left: 15px;
}
.form-search div{
    float: left;
    margin-right: 10px;
    line-height: 34px;
}
.blue-con{
    font-size: 14px;
    color: #6699CC;
    cursor: pointer;
}
.bot-row{
    margin: 15px;
}
.bot-row div{
    float: left;
    margin: 15px;
}
.tb-editor{
  width: 800px;
  margin: 0 auto 25px;
  .name{
    float: left;
  }
  .editor{
    float: left;
    text-align: left;
    width: 680px;
  }
}
.uploader{
  opacity: 0;
  position: absolute;
}
.goto-brand{
  font-size: 14px;
  color: #6699CC;
  margin-left: 10px;
  cursor: pointer;
}
.boxNone{
  display: none;
}
.edit-item{
  float: left;
  margin-left: 10px;
}
.goods-info-title{
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  color: #666666;
  margin: 6px 10px 20px 0px;
  padding-left: 0px;
}
.goods-info-content{
  .goods-info-ipt{
    display: inline-block;
    margin-right: 10px;
    &:last-child{
      margin-right: 0;
    }
  }
}
.uploadbox{
  position: relative;
  width: 44px;
  height: 44px;
  .add-image{
    color: #2d8cf0;
    cursor: pointer;
    line-height: 44px;
  }
  .upload-img{
    opacity: 0;
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: pointer;
  }
  .img-table{
    width: 30px;
    height: 30px;
    z-index: 1;
    position: absolute;
    left: 0;
    top: 5px;
  }
}
.sub-left-item span{
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
    color: #ed4014;
}
.save-goods-info-btn{
  width: 360px;
  font-size: 14px;
}
.photo-tips-box{
  .photo-tips{
    font-size: 12px;
    color: #999;
  }
}
.title-span-tips{
  font-size: 12px;
  color: #999;
  font-weight: 400;
}
.selname{
  display: inline-block;
  width: 212px;
  height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
  text-align: center;
  border: 1px solid #e6e6e6;
}
.goods-info-left{
  font-size: 14px;
  color: #666666;
  line-height: 32px;
  height: 32px;
}
.text-left{
  text-align: left;
}
.text-right{
  text-align: right;
}
.text-center{
  text-align:  center;
}
.w80{
  width: 80px;
}
.w100{
  width: 100px;
}
/deep/ .ivu-card-body,.ivu-card-body{
  display: none;
}
</style>
