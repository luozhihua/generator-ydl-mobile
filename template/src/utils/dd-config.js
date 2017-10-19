import store from 'store'
import ajax from 'utils/ajax'

const APIS_LIST = [
  'runtime.info',
  'biz.contact.choose',
  'biz.contact.departmentsPicker',
  'biz.contact.complexPicker',
  'biz.contact.complexChoose',
  'device.notification.confirm',
  'device.notification.alert',
  'device.notification.toast',
  'device.notification.prompt',
  'device.geolocation.get',
  'biz.util.datepicker',
  'biz.ding.post',
  'biz.util.openLink',
  'biz.util.open',
  'biz.util.scan',
  'biz.contact',
  'biz.navigation.setLeft',
  'biz.navigation.setRight',
  'biz.navigation.setMenu',
  'biz.navigation.setTitle',
  'biz.navigation.setIcon',
  'biz.navigation.close',
  'biz.alipay.pay',
  'biz.chat.pickConversation',
  'biz.util.ut', // 数据埋点
  'biz.user.get',
  'biz.user.secretID',
  'biz.telephone.call', // 打电话
  'biz.telephone.showCallMenu',
  'ui.input', // UI控件
  'biz.map.view',
  'biz.map.search',
  'biz.map.locate',
  'device.geolocation.get',
  'biz.util.uploadImage',
  'biz.contact.complexPicker',
  'biz.chat.chooseConversationByCorpId',
  'biz.chat.pickConversation',
  'biz.chat.toConversation',
  'biz.chat.getConversationInfo',
  'biz.chat.chooseConversationByCorpId',
  'biz.chat.chooseConversation',
  'biz.chat.open',
  'biz.cspace.saveFile',
  'biz.cspace.preview',
  'biz.util.uploadAttachment',
  'biz.util.uploadImageFromCamera'
]
let signature
let getCorpId = () => { return store.getters.companyId }
let getAppId = () => { return store.getters.appId }
let signProgress
let configProgress

export default class DDSign {

  static ready() {
    return new Promise((resolve, reject) => {

      if (!navigator.userAgent.match(/DingTalk/)) {
        resolve()
        return
      }
    })
  }

  static sign(url, cache = true) {

    if (!signProgress) {
      signProgress = new Promise((resolve, reject) => {

        if (!navigator.userAgent.match(/DingTalk/)) {
          // alert(1)
          resolve()
          // } else if (cache && DDSign.signature && !this.isExpires(signatureTime)) {
          //     // alert(2)
          //   resolve(this.config(DDSign.signature))
        } else {
          let corpId = getCorpId()
          let appId = getAppId()
          let api = '/api/userCenter/getAuthInfo'
          let encodedUrl = encodeURIComponent(url || document.location.href)
          let signUrl = `${api}?corpId=${corpId}&appId=${appId}&url=${encodedUrl}`

          ajax.get(signUrl)
            .then((json) => {
              let data = json.data

              if (data && data.signature) {
                // 签名的时间戳
                signature = data
                DDSign.signature = data

                resolve(this.config(signature))
              } else {
                reject('签名服务没有返回正确的签名信息：\n' + JSON.stringify(json, 2, 2))
              }
            })
            .catch(error => {
              let data = error.data || {}

              if (data.appId && data.corpId) {
                DDSign.signature = data
                resolve(this.config(data))
              } else {
                reject('网络拥堵或者签名服务器繁忙：\n' + JSON.stringify(error, 2, 2))
              }
            })
        }

      })
    }

    return signProgress
  }

  static isExpires(timestamp) {
    let time = new Date().getTime()
    let isExpires

    if (timestamp) {
      isExpires = Math.abs(timestamp - time) > 1200000 // 大于30分
    }

    return isExpires
  }

  static getCorpId() {
    return getCorpId()
  }

  static getAppId() {
    return getAppId()
  }

  /**
   * 配置钉钉API
   */
  static config(data) {

    if (!configProgress) {
      configProgress = new Promise((resolve, reject) => {
        dd.config({
          agentId: data.appId, // 必填，微应用ID
          corpId: data.corpId, // 必填，企业ID
          timeStamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          type: 0, // 选填。0表示微应用的jsapi, 1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList: APIS_LIST
        })

        dd.ready(function () {
          resolve(data)
        })

        dd.error(function (error) {
          reject('钉钉签名失败：\n' + JSON.stringify(error, 2, 2))
        })

        setTimeout(function () {
          reject('钉钉签名超时，请在钉钉内使用此APP.')
        }, 15000)
      })
    }

    return configProgress
  }
}
