<template>
  <div @click="show">
    <slot></slot>
  </div>
</template>

<script>
  import {isFunction} from 'lodash'
  import Backbutton from '../../utils/backbutton'

  class Organization {
    constructor() {
      console.error('OrganizationSelector is coming soon!')
    }
  }

  export default {

    NAME: 'OrganizationSelector',

    ALIAS: 'OrgSelector',

    props: {
      autoOpen: {type: Boolean, default: false},
      type: {type: String},
      options: { type: Object },
      multipe: {type: Boolean, default: false},
      max: {type: Number, default: 0},
      searchable: {type: Boolean, default: false},
      autoComplete: {type: Boolean, default: true},
      cascadeDepartment: {type: Boolean, default: false},
      cascadeEmployee: {type: Boolean, default: true},
      selectedDepartments: {type: Array },
      requiredDepartments: {type: Array },
      disabledDepartments: {type: Array },
      selectedUsers: {type: Array },
      requiredUsers: {type: Array },
      disabledUsers: {type: Array },
      formatter: {type: Function}
    },

    mounted() {
      if (this.autoOpen) {
        this.show()
      }
    },

    beforeDestroy() {
      if (this.$selector && this.$selector.destroy) {
        this.$selector.destroy()
      }
    },

    methods: {
      show() {
        let type = this.type
        let attributes = {
          searchable: this.searchable,
          autoComplete: this.autoComplete,
          mode: type,
          multiple: this.multipe,
          max: this.max,
          selectedDepartments: this.selectedDepartments,
          requiredDepartments: this.requiredDepartments,
          disabledDepartments: this.disabledDepartments,
          selectedUsers: this.selectedUsers,
          requiredUsers: this.requiredUsers,
          disabledUsers: this.disabledUsers,
          cascadeDepartment: this.cascadeDepartment,
          cascadeEmployee: this.cascadeEmployee,
          primaryColor: '#3B7CEC'
        }

        type = type === 'all' ? 'both' : type
        type = type.match(/^department/) ? 'organization' : type

        this.$selector = new Organization({
          ...this.options,
          ...attributes
        })

        // 如果显示则阻止页面后退键
        Backbutton.prevent(() => {
          this.$selector.destroy()
        })
        this.$store.commit('hideNav')

        this.$selector.on({
          open: () => {
            this.$emit('open')
          },

          close: () => {
          },

          success: (results) => {
            if (isFunction(this.formatter)) {
              results = this.formatter(results)
            }
            this.$emit('input', results)
          }
        })
      }
    }
  }
</script>
