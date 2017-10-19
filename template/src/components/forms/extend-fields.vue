<template>
  <div class="extend-fields">
    <!-- 列表 -->
    <div class="enabled-list">
      <div v-for="field in enabledFields" :key="field.columnCode">

        <!-- 文本：columnType===1 -->
        <div class="field-item" v-if="field.columnType===1">
          <mu-text-field fullWidth
                         @input="onInput"
                         :label="field.columnName"
                         :required="field.columnNotNull===1"
                         :disabled="field.disable===1"
                         v-validate="{enable: isEnableValidate(field), prop: field.columnCode}"
                         v-show="field.hidden!==1"
                         v-model="formData[field.columnCode]"/>
        </div>

        <!-- 单选：columnType===2 -->
        <div class="field-item" v-if="field.columnType===2">
          <mu-select-field style="width: 100%;"
                           @input="onInput"
                           :label="field.columnName"
                           :required="field.columnNotNull===1"
                           :disabled="field.disable===1"
                           v-validate="{enable: isEnableValidate(field), prop: field.columnCode}"
                           v-show="field.hidden!==1"
                           v-model="formData[field.columnCode]">
            <mu-menu-item
                        :title="options.value"
                        :value="options.key"
                        v-for="(options, index) in field.columnRule"
                        :key="options.key" />
          </mu-select-field>
        </div>

        <!-- 多选：columnType===3 -->
        <div class="field-item" v-if="field.columnType===3 && field.columnRule.length > 0">

          <!--<div v-for="(options, index) in field.columnRule" :key="options.key+index">-->
          <!--<mu-checkbox-->
                      <!--@change="onInput" @input="onInput"-->
                      <!--:name="group2"-->
                      <!--:label="options.value"-->
                      <!--:nativeValue="options.value"-->
                      <!--v-model="formData[field.columnCode]" />-->
          <!--</div>-->

          <div class="mu-text-field-label" style="margin: 1rem 0;font-size:1.4rem">{{field.columnName}}</div>
          <label class="" v-for="(options, index) in field.columnRule" :key="options.key">
            <input type="checkbox"
                   @change="onInput"
                   :name="field.columnCode"
                   :label="options.key"
                   :checked="isChecked(field, options)"
                   :key="options.key"
                   :value="options.key"
                   v-model="formData[field.columnCode]" />
            {{ options.value }}
          </label>
          <div style="height: 2rem"></div>
        </div>

        <!-- 文本域(多行)：columnType===4 -->
        <div class="field-item" v-if="field.columnType===4">
          <mu-text-field fullWidth multiLine
                         @input="onInput"
                         :label="field.columnName"
                         :rows="3"
                         :rowsMax="6"
                         :required="field.columnNotNull===1"
                         :disabled="field.disable===1"
                         v-validate="{enable: isEnableValidate(field), prop: field.columnCode}"
                         v-show="field.hidden!==1"
                         v-model="formData[field.columnCode]"/>
        </div>

        <!-- 整数：columnType===5 -->
        <div class="field-item" v-if="field.columnType===5">
          <mu-text-field fullWidth
                         @input="onInput"
                         :label="field.columnName"
                         :rows="3"
                         type="number"
                         :rowsMax="6"
                         :required="field.columnNotNull===1"
                         :disabled="field.disable===1"
                         v-validate="{enable: isEnableValidate(field), pattern: /^-?\d+$/, prop: field.columnCode}"
                         v-show="field.hidden!==1"
                         v-model="formData[field.columnCode]"/>
        </div>

        <!-- 实数：columnType===6 -->
        <div class="field-item" v-if="field.columnType===6">
          <mu-text-field fullWidth
                         @input="onInput"
                         :label="field.columnName"
                         :rows="3"
                         type="number"
                         :rowsMax="6"
                         :required="field.columnNotNull===1"
                         :disabled="field.disable===1"
                         v-validate="{enabble: isEnableValidate(field), pattern: /^-?\d+[\.\,\d]+$/, prop: field.columnCode}"
                         v-show="field.hidden!==1"
                         v-model="formData[field.columnCode]"/>
        </div>

        <!-- 日期：columnType===7 -->
        <div class="field-item" v-if="field.columnType===7">
          <mu-date-picker fullWidth
                          type="date"
                          :label="field.columnName"
                          hintText="请选择日期..."
                          errorText=""
                          @input="onInput"
                          :required="field.columnNotNull===1"
                          :disabled="field.disable===1"
                          v-validate="{enable: isEnableValidate(field), prop: field.columnCode}"
                          v-show="field.hidden!==1"
                          v-model="formData[field.columnCode]"/>
        </div>

        <!-- 日期：columnType===8 -->
        <div class="field-item" v-if="field.columnType===8">
          <mu-datetime-picker fullWidth
                          type="datetime"
                          :label="field.columnName"
                          hintText="请选择日期时间..."
                          errorText=""
                          @input="onInput"
                          :required="field.columnNotNull===1"
                          :disabled="field.disable===1"
                          v-validate="{enable: isEnableValidate(field), prop: field.columnCode}"
                          v-show="field.hidden!==1"
                          v-model="formData[field.columnCode]"/>
        </div>

      </div>
    </div>

    <!-- 添加更多按钮 -->
    <mu-flat-button :label="buttonText" @click="dialog=true" class="extend-fields-add">
      <i class="yd-icon yd-jiahao1"></i>
    </mu-flat-button>

    <!-- 弹框 -->
    <mu-dialog :open="dialog" @close="closeDialog" title="添加更多条目" dialogClass="extend-fields-dialog" scrollable>
      <mu-list>
        <mu-sub-header>已启用</mu-sub-header>

        <mu-list-item :title="field.columnName" v-for="field, index in enabledFields" :key="field.columnCode">
          <mu-switch label=""
                     :value="true"
                     @change="disable(field)"
                     slot="right"/>
        </mu-list-item>
      </mu-list>

      <mu-divider/>

      <mu-list>
        <mu-sub-header>未启用</mu-sub-header>

        <mu-list-item :title="field.columnName" v-for="field, index in availableFields" v-if="field.hidden !== 1" :key="field.columnCode">
          <mu-switch label=""
                     :value="false"
                     @change="enable(field)"
                     slot="right"/>
        </mu-list-item>
      </mu-list>

      <mu-flat-button primary label="确认" @click="dialog=false" slot="actions"/>
    </mu-dialog>
  </div>
</template>

<script>
  /**
   * Created by colin on 2017/7/19.
   */
  import Vue from 'vue'
  import moment from 'moment'
  import {find, filter, groupBy, keys, isString, isArray, isUndefined} from 'lodash'

  export default {
    NAME: 'ExtendFields',

    props: {
      moduleType: {type: String},
      busicessTypeCode: {type: String, default: 'default'},
      buttonText: {type: String, default: '添加更多条目'},
      fieldsUrl: {type: String},
      saveUrl: {type: String},
      defaults: {type: [Array], default() { return [] }}
    },

    data() {
      return {
        a: {b: 'a'},
        list: {a: []},
        dialog: false,
        validated: true,
        allFields: [],
        enabledFields: [],
        // availableFields: [],
        closeDialog: true,
        formData: this.value || {}
      }
    },

    computed: {
      availableFields() {
        return filter(this.allFields, (field) => {
          return !find(this.enabledFields, {
            columnCode: field.columnCode
          })
        })
      },

      values() {
        let defaultsList = isArray(this.defaults) ? [].concat(this.defaults) : []
        let defaults = {}

        defaultsList.forEach((field) => {
          let code = field.columnCode

          defaults[code] = field
        })

        return defaults
      }
    },

    created() {
      if (!this.moduleType) {
        this.validated = false
        throw new Error('调用 ExtendFields 组件时，缺少 moduleType="xxxx" 属性。')
      }

      this.enabledFields = this.getLocalFields()
      this.loadAllFields()
    },

    async mounted() {

    },

    watch: {
      formData: {
        handler() {
          this.onInput(false)
        },
        deep: true
      },

      defaults: {
        handler() {
          this.applyDefaultValues()
        },
        deep: true
      },

      allFields: {
        handler() {
          this.enabledFields = this.getLocalFields()
          this.applyDefaultValues()
        },
        deep: true
      }
    },

    methods: {
      getId() {
        // getExtendFieldId is defined in ../../mixin/index.js
        return this.getExtendFieldId(this.moduleType, this.businessTypeCode)
      },

      isEnableValidate(field) {
        return field.columnNotNull === 1 && field.disable !== 1 && field.hidden !== 1
      },

      async loadAllFields() {
        let ids = this.getLocalFieldIds()
        let {data} = await this.$ajax.get(this.fieldsUrl)

        data.forEach((field) => {
          let isEnabled = ids.indexOf(field.columnCode) !== -1

          // 多选字段格式化选项
          field.columnRule = field.columnRule.split(';').map((itm) => {
            itm = itm.split(':')

            return {
              key: itm[0],
              value: itm[1]
            }
          })

          if (isEnabled) {
            field.enabled = true

            // 初始化 formData 的多选项为数组，否则 v-model 无法实现多选
            if (field.columnType === 3) {

              if (!this.formData[field.columnCode]) {
                Vue.set(this.formData, field.columnCode, [])
              }
              //this.formData[field.columnCode] = this.formData[field.columnCode] || []
            }
          }
        })

        this.onInput()
        this.allFields = data
      },

      isChecked(field, options) {
        let {columnCode} = field
        let value = this.formData[columnCode]
        let result = (value && isArray(value) && value.indexOf(options.key) !== -1)

        return result
      },

      // 应用默认值
      applyDefaultValues() {
        this.enabledFields.forEach(enabled =>{
          let {columnType, columnCode, columnValue} = enabled
          let def = this.values[columnCode]

          if (def) {
            switch (columnType) {
              // 多选项
              case 3:
                columnValue = isString(def.columnValue) ?
                  def.columnValue.split(/[\,\;]/g) :
                  def.columnValue
                break;

              // 日期
              case 7:
                columnValue = moment(def.columnValue).format('YYYY-MM-DD')
                break

              // 日期+时间
              case 8:
                columnValue = moment(def.columnValue).format('YYYY-MM-DD hh:mm:ss')
                break

              default:
                columnValue = def.columnValue
            }
          }

          Vue.set(this.formData, columnCode, columnValue)
        })
      },

      getLocalFieldIds() {
        let id = this.getId()
        let ids = (this.$storage.getItem(id) || '').split(',')

        return ids
      },

      getLocalFields() {
        let id = this.getId()
        let ids = (this.$storage.getItem(id) || '').split(',')
        let fields = []

        this.allFields.forEach((field)=>{
          if (ids.indexOf(field.columnCode) !== -1) {
            fields.push(field)
          }
        })

        this.onInput()
        return fields
      },

      setLocalFields(fields) {
        let id = this.getId()
        let fieldIds = keys(groupBy(fields, 'columnCode')).join(',')

        this.$storage.setItem(id, fieldIds)
      },

      toggle(field) {
        if (!field.enabled && !this.isEnabled(field)) {
          this.enabled()
        } else {
          this.disable()
        }
      },

      enable(field) {
        field.enabled = true
        this.enabledFields = filter(this.allFields, (field) => {
          return field.enabled
        })
        this.setLocalFields(this.enabledFields)
      },

      disable(field) {
        field.enabled = false
        this.enabledFields = filter(this.enabledFields, (fieldItem) => {
          return fieldItem.columnCode !== field.columnCode
        })

        this.setLocalFields(this.enabledFields)
      },

      save() {
        return this.$ajax.post(this.saveUrl, this.formData)
      },

      isEnabled(field) {
        let found = find(this.enabledFields, {columnCode: field.columnCode})

        return (found > 0)
      },

      closeDialog() {
        this.dialog = false
      },

      clearFormData() {
        let data = this.formData

        Object.keys(data).forEach((key)=>{
          if (isUndefined(data[key]) && data[key] === null) {
            data[key] = ''
          }
        })
      },

      onInput() {
        let formData

        this.clearFormData()
        formData = Object.assign({}, this.formData)

        this.$emit('input', formData)
      }
    }
  }
</script>


<style lang="less" scoped="">
  .enabled-list {

  }

  .extend-fields {
    margin-bottom: 3rem;
  }
</style>

<style lang="less">
  @import url("../../styles/vars");

  .extend-fields {
    margin-bottom: 1.5rem;

    .extend-fields-add {
      display: block;
      width: 100%;
      color: #9B9B9B;

      .yd-icon {
        font-size: 1.5rem;
      }

      .mu-flat-button-label {
        font-size: 1.4rem;
        letter-spacing: 0;
        padding-left: .5rem;
      }
    }

    .field-item {
    }
  }

  .extend-fields-dialog {
    border-radius: .9rem !important;
    max-height: none !important;

    .mu-dialog-title {
      border-radius: .9rem .9rem 0 0;
      padding: .8rem;
      font-size: 1.6rem;
      font-weight: 500;
      color: #fff;
      background-color: @color-primary;
    }

    .mu-dialog-body {
      padding: 0;
      max-height: 90vh !important;

      .mu-sub-header {
        font-weight: 300;
        font-size: 1.1rem;
        color: #CDCDCD;
        background-color: #F5F5F5;
      }

      .mu-list {
        padding-bottom: 0;
        border-bottom: 0;
      }

      .mu-item {
        font-size: 1.425rem;
        color: #030303;
        letter-spacing: 0;
        border-bottom: 0.1rem solid #f1f1f1;
      }
    }
  }
</style>
