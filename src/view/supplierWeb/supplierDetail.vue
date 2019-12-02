<template>
  <div>
        <Row class="wrap">
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">供应商名称： </Col>
                <Col span="17" >{{detailObj.name}}</Col>
            </Row>
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">联系人： </Col>
                <Col span="17" >{{detailObj.contacts}}</Col>
            </Row>
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">手机号码： </Col>
                <Col span="17" >{{detailObj.phone}}</Col>
            </Row>
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">主要供应类目： </Col>
                <Col span="17" >{{detailObj.mainSupplyCategory}}</Col>
            </Row>
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">邮箱： </Col>
                <Col span="17" >{{detailObj.email}}</Col>
            </Row>
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">公司地址： </Col>
                <Col span="17" >{{detailObj.companyAddress}}</Col>
            </Row>
            <Row :gutter="16" class="detail-item">
                <Col span="5" class="detail-label">是否已联系： </Col>
                <Col span="17" :class="{'red-color': detailObj.isCommunicate === 0}" >{{detailObj.isCommunicate === 0 ? '未联系' : '已联系'}}</Col>
            </Row>
        </Row>
  </div>
</template>
<script>
import { editSupplier } from '@/api/supplier'
export default {
  name: 'supplierDetail',
  props: {
    detailObj: {
      type: Object,
      required: {}
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
    .detail-item{
        margin: 15px 0px;
        font-size: 14px;
        .detail-label{
            text-align: right;
        }
        &:first-chile{
            margin-top: 0px;
        }
        .red-color{
            color: #ff0036;
        }
    }
</style>
