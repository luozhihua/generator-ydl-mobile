import moment from 'moment'

export default {
  formatDatetime(datetime, formatter = 'YYYY-MM-DD hh:mm:ss') {
    if (datetime == null) {
      return ''
    }
    return moment(datetime).format(formatter)
  },

  formatDate(datetime, formatter = 'YYYY-MM-DD') {
    if (datetime == null) {
      return ''
    }
    return moment(datetime).format(formatter)
  },

  formatTime(datetime, formatter = 'hh:mm:ss') {
    if (datetime == null) {
      return ''
    }
    return moment(datetime).format(formatter)
  }
}
