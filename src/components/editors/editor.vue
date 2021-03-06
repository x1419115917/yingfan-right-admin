<template>
<div class="editor" :class="{error:err}">
  <!-- 图片上传组件辅助-->
  <div class="label" :style="{width:labelWidth+'px'}">
    <label :class="{required:required}">
      <slot name="label" class="12"></slot>
    </label>
  </div>
  <div class="editor-wrapper" :style="{margin:'0 0 0 0px'}">
    <Upload
      style="display: none;"
      class="uploader"
      :action="serverUrl"
      name="file"
      :data="params"
      :headers="header"
      :format="['jpg','jpeg','png','gif']"
      :max-size="2048"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-exceeded-size="handleMaxSize"
      :on-error="uploadError"
      :before-upload="beforeUpload">
    </Upload>
    <Spin fix v-show="quillUpdateImg">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>上传中...</div>
    </Spin>
    <!--富文本编辑器组件-->
    <Row style="position: relative;">
      <quill-editor class="editor"
        v-model="detailContent"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="_blur($event)"
        @change="onEditorChange($event)">
      </quill-editor>
      <p class="tips" v-if="tips.length>0">{{tips}}</p>
    </Row>
  </div>
</div>
</template>
<script>
import Cookies from 'js-cookie'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction
  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image'],
  // ['link', 'image', 'video'],
  ['clean'], // remove formatting button
  ['sourceEditor'] // 源码编辑
]

export default {
  name: 'editor',
  data () {
    return {
      tips: '',
      err: false,
      isInit: true,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      serverUrl: `${baseUrl}/base/oss/singleUpload`, // 这里写你要上传的图片服务器地址
      header: { token: Cookies.get('access_token') }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      detailContent: '', // 富文本内容
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('.uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              },
              shadeBox: null,
              // 添加工具方法
              'sourceEditor': function () {
                // alert('我新添加的工具方法');
                const container = this.container
                const firstChild = container.nextElementSibling.firstChild
                // 在第一次点击源码编辑的时候，会在整个工具条上加一个div，层级比工具条高，再次点击工具条任意位置，就会退出源码编辑。可以在下面cssText里面加个背景颜色看看效果。
                if (!this.shadeBox) {
                  let shadeBox = this.shadeBox = document.createElement('div')
                  shadeBox.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; cursor:pointer'
                  container.style.position = 'relative'
                  container.appendChild(shadeBox)
                  firstChild.innerText = firstChild.innerHTML
                  shadeBox.addEventListener('click', function () {
                    this.style.display = 'none'
                    firstChild.innerHTML = firstChild.innerText.trim()
                  }, false)
                } else {
                  this.shadeBox.style.display = 'block'
                  firstChild.innerText = firstChild.innerHTML
                }
              }
            }
          }
        }
      } // 富文本编辑器配置
    }
  },
  props: {
    params: {
      type: Object,
      default () {
        return {
          tag: 0
        }
      }
    },
    labelWidth: {
      type: Number,
      default () {
        return 100
      }
    },
    initContent: {
      type: String,
      default () {
        return ''
      }
    },
    required: {
      type: [Boolean, String],
      default () {
        return undefined
      }
    }
  },
  watch: {
    initContent: function (val, oval) {
      this.detailContent = val
    },
    isInit: function (val, oval) {
      if (val) {
        this.tips = ''
        this.err = false
      }
    }
  },
  created () {
    this.detailContent = this.initContent
  },
  mounted () {
    this.detailContent = this.initContent
    this.$nextTick(() => {
      this.$on('resetForm', function () {
        this.resetForm()
      })
    })
    // 样式随便改
    const sourceEditorButton = document.querySelector('.ql-sourceEditor')
    // sourceEditorButton.style.cssText = 'font-size:20px'
    // 加了iview的icon <Icon type="ios-create-outline" />
    // sourceEditorButton.classList.add('ios-create-outline')
    sourceEditorButton.style.cssText = 'font-size: 12px; width:45px; border:1px solid #87CEFA; border-radius:5px; color:#87CEFA'
    sourceEditorButton.innerText = 'HTML'
    // 鼠标放上去显示的提示文字
    sourceEditorButton.title = '源码编辑'
  },
  methods: {
    beforeUpload () {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    uploadSuccess (res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      console.log(res)
      // 如果上传成功
      if (res.code === 0 && res.info !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.content)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    handleMaxSize (file) {
      this.quillUpdateImg = false
      this.$Notice.warning({
        title: '提示',
        desc: '文件  ' + file.name + ' 不能大于2M.'
      })
    },
    // 富文本图片上传失败
    uploadError () {
      // loading动画消失
      this.$message.error('图片插入失败')
    },
    /* 当编辑器内容发生变化时触发 */
    onEditorChange ($event) {
      this.$emit('on-change', $event)
      this.isInit = false
      this.valiDate()
    },
    /* 设置编辑器的内容 */
    resetForm () {
      // this.detailContent = ''
      // this.$refs.myQuillEditor.quill.root.innerHTML = this.initContent
      this.detailContent = this.initContent
      this.isInit = true
    },
    /* 设置报错 */
    valiDate (msg = '请编辑内容') {
      this.isInit = false
      if (this.detailContent.length == 0) {
        if (!this.isInit) {
          this.tips = msg
          this.err = true
        }
        return false
      } else {
        this.tips = ''
        this.err = false
        return true
      }
    },
    _blur (e) {
      console.log(e)
      // let container = this.$refs.myQuillEditor
      // container.innerHTML = e.container.innerHTML
      this.valiDate()
    }
  }
}
</script>

<style  lang="less">
  .editor{
    position: relative;
    padding-bottom: 6px;
    .ql-container.ql-snow{
      .ql-editor{
        min-height: 300px;
      }
    }
    .label{
      float: left;
      text-align: right;
      padding-right: 12px;
      box-sizing: border-box;
      line-height: 40px;
      label{
        span{
          color: #606266;
          font-size: 14px;
        }
      }
    }
    .tips{
      bottom: 0;
    }

  }
  .editor.error{
    .ql-container.ql-snow,.ql-toolbar.ql-snow{
      border-color: #FF0000;
    }
  }
  .editor-wrapper{
    position: relative;
  }
  .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
      height: 100px;
      position: relative;
      border: 1px solid #eee;
  }
</style>
