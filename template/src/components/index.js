import Vue from 'vue'

import Page from './page/page.vue'
import Icon from './icon'
import ProductSelector from './select/product.vue'
import ProductContract from './select/product-contract.vue'
import OrganizationSelector from './select/organization.vue'
import ButtonBase from './button/base.vue'
import ButtonGroup from './button/group.vue'
import Number from './number/number.vue'
import Panel from './panel/'
import Frame from './frame/'
import Echart from './echarts/'
import FilterList from './list/filter-list.vue'
import Filter from './filter'
import ExtendFields from './forms/extend-fields.vue'
import Tab from './tab/tab.vue'
import followRecord from './followRecord/followRecord.vue'
import sendBox from './followRecord/sendBox.vue'
import reply from './reply/reply.vue'
import bigImage from './bigImage/bigImage.vue'
import Wave from './wave/wave.vue'

/**
 * 安装组件
 * @param component
 */
[
  Page,
  Icon,
  ButtonBase,
  ButtonBase,
  ButtonGroup,
  Number,
  Panel,
  Frame,
  Echart,
  FilterList,
  ProductSelector,
  ProductContract,
  OrganizationSelector,
  Filter,
  ExtendFields,
  Tab,
  followRecord,
  sendBox,
  reply,
  bigImage,
  Wave
].forEach(function installComponent(component) {
  let names = []
  let comName = component.NAME
  let alias = component.ALIAS

  if (typeof comName === 'string') {
    names = names.concat(comName.split(/[\;\,\|，|。]/g))
  } else if (comName && comName.constructor === Array) {
    names = names.concat(comName)
  }

  if (typeof alias === 'string') {
    names = names.concat(alias.split(/\;\,\|，|。/))
  } else if (alias && alias.constructor === Array) {
    names = names.concat(alias)
  }

  names.forEach(nameStr => {
    Vue.component(nameStr, component)
  })
})
