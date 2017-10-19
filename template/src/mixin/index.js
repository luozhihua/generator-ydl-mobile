import Vue from 'vue'
import storage from '../utils/local-storage'
import ajax from '../utils/ajax'
import router from 'router'
import math from '../utils/math'
import ddapi from '../mixin/ddapi'
import TWEEN from 'tween'

Object.assign(Vue.prototype, {

  $query: router.history.current.query,

  /**
   * 本地存储解决方案
   * @type {Storage}
   */
  $storage: storage,

  /**
   * 数据请求
   * this.$ajax.request(config).then(response=>{ console.log(response.data) })
   * this.$ajax.get(url[, config]).then(response=>{ console.log(response.data) })
   * this.$ajax.delete(url[, config]).then(response=>{ console.log(response.data) })
   * this.$ajax.head(url[, config]).then(response=>{ console.log(response.data) })
   * this.$ajax.options(url[, config]).then(response=>{ console.log(response.data) })
   * this.$ajax.post(url[, data[, config]]).then(response=>{ console.log(response.data) })
   * this.$ajax.put(url[, data[, config]]).then(response=>{ console.log(response.data) })
   * this.$ajax.patch(url[, data[, config]]).then(response=>{ console.log(response.data) })
   */
  $ajax: ajax,

  /**
   * 精确数学运算，只包含简单的加、减、乘、除运算方法
   */
  $math: math,

  /**
   * 屏幕缩放比，基于1x 750px
   * @type {*}
   */
  PIXEL_RATIO: window.PIXEL_RATIO || 1
})

export default function () {

  Vue.mixin(ddapi)

  Vue.mixin({

    /**
     * Vue全局方法
     * 在 views/**.vue 文件中
     *
     * 1. <template>内可以通过方法名直接调用，如下 back 方法可以这样调用：@click='back()
     * 2. 在 methods 内可以通过 this 关键词调用，如下 back 方法可以这样调用：this.back()
     */
    methods: {
      back: function (url) {
        let backUrl = url || this.$route.query.backurl || this.BACK_URL

        if (backUrl) {
          this.$page.replace(backUrl)
        } else {
          window.history.back()
        }
      },

      saomiao(e, datas, callback, error) {
        let url = 'http://www.yunmaiocr.com/SrvHTMLAPI';
        let result = new FormData();
        let file = e.target.files;

        e.preventDefault();

        result.append('action', 'namecard.scan');
        result.append('file', file[0]);
        result.append('username', '9411e870-7e25-4908-bf1a-ed5be3a799a6');
        result.append('password', 'JSrEtZIbYMtBDjPHFxPmZmObIHvKOe');
        result.append('ocrLang', '2');
        result.append('keyLang', '0');
        result.append('er', '1');
        result.append('format', '1');

        this.$ajax({
          url: url,
          data: result,
          method: 'POST',
          responseType: 'JSON',
          timeout: 30000,
          headers: {
            'Content-Type': 'multipart/form-data; charset=utf-8'
          }
        })
          .then(data => {
            if (data.status === 'OK') {
              if (callback) {
                callback(JSON.stringify(data))
              }
            } else {
              if (error) {
                error();
              }
              alert('返回数据为空');
            }
          })
          .catch((err) => {
            console.error(err)
            alert('图片上传超时');
            if (error) error();
          })
      },

      /**
       * 滚动到某个DOM节点位置
       * @param id
       */
      scrollTo(id) {
        let {scroller} = this.$refs
        let scrollTop = 0
        let container
        let offset

        if (typeof id === 'number') {
          scrollTop = id
        } else if (typeof id === 'string') {
          container = document.getElementById(id)
          offset = container.getBoundingClientRect()
          scrollTop = offset.top
        } else if (id && typeof id.getBoundingClientRect === 'function') {
          offset = id.getBoundingClientRect()
          scrollTop = offset.top
        }

        return new Promise(resolve=>{

          function animate(time) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
          }

          new TWEEN.Tween({scrollTop: 0})
            .to({scrollTop: scrollTop}, 250)
            .onUpdate(function () {
              scroller.scrollTop = this.scrollTop
            })
            .onComplete(function () {
              resolve()
            })
            .start()

          animate()
        })
      },

      /**
       * 获取moduleType以及busicessTypeCode所指定的模块下的 localStorage ID
       * @param {String} moduleType
       * @param {String} busicessTypeCode
       * @return {String}
       */
      getExtendFieldId (moduleType = '', busicessTypeCode = '') {
        let companyCode = this.getCorpId()
        let appId = this.getAppId()
        let idParts = ['extend-fields', companyCode, appId, moduleType, busicessTypeCode]

        return encodeURIComponent(btoa(idParts.join('::')))
      },

      /**
       * 获取moduleType所指定的模块下的已启用自定义字段
       * @param {String} moduleType
       * @param {String} busicessTypeCode
       * @return {Array}
       */
      getEnabledExtendFieldCodes (moduleType = '', busicessTypeCode = '') {
        let id = this.getExtendFieldId(moduleType, busicessTypeCode)
        let codes = this.$storage.getItem(id)

        return codes ? codes.split(',') : [];
      }
    }
  })
}
