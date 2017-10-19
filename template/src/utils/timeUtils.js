import moment from 'moment'

let now = new Date(); // 当前日期
let nowDayOfWeek = now.getDay() - 1; // 今天本周的第几天
let nowDay = now.getDate(); // 当前日
let nowMonth = now.getMonth(); // 当前月
let nowYear = now.getYear(); // 当前年
let lastMonthDate
let lastMonth

nowYear += (nowYear < 2000) ? 1900 : 0

lastMonthDate = new Date(); // 上月日期
lastMonthDate.setDate(1)
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
lastMonth = lastMonthDate.getMonth()

// 格式化日期：yyyy-MM-dd
function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

// 获得某月的天数
function getMonthDays(myMonth) {
  let monthStartDate = new Date(nowYear, myMonth, 1)
  let monthEndDate = new Date(nowYear, myMonth + 1, 1)
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)

  return days
}

// 获得本季度的开始月份
function getQuarterStartMonth() {
  let quarterStartMonth = 0

  if (nowMonth < 3) {
    quarterStartMonth = 0
  }
  if (nowMonth > 2 && nowMonth < 6) {
    quarterStartMonth = 3
  }
  if (nowMonth > 5 && nowMonth < 9) {
    quarterStartMonth = 6
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9
  }
  return quarterStartMonth
}

// 获得本周的开始日期
function getWeekStartDate() {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)

  return formatDate(weekStartDate)
}

// 获得本周的结束日期
function getWeekEndDate() {
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek) + 1)

  return formatDate(weekEndDate)
}

// 获得上周的开始日期
function getLastWeekStartDate() {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)

  return formatDate(weekStartDate)
}

// 获得上周的结束日期
function getLastWeekEndDate() {
  let weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1 + 1)

  return formatDate(weekEndDate)
}

// 获得本月的开始日期
function getMonthStartDate() {
  let monthStartDate = new Date(nowYear, nowMonth, 1)

  return formatDate(monthStartDate)
}

// 获得本月的结束日期
function getMonthEndDate() {
  let monthEndDate = new Date(nowYear, nowMonth + 1, 1)

  return formatDate(monthEndDate)
}

// 获得上月开始时间
function getLastMonthStartDate() {
  let lastMonthStartDate = new Date(nowYear, lastMonth, 1)

  return formatDate(lastMonthStartDate)
}

// 获得上月结束时间
function getLastMonthEndDate() {
  let lastMonthEndDate = new Date(nowYear, lastMonth + 1, 1)

  return formatDate(lastMonthEndDate)
}

// 获得本季度的开始日期
function getQuarterStartDate() {
  let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1)

  return formatDate(quarterStartDate)
}

// 或的本季度的结束日期
function getQuarterEndDate() {
  let quarterEndMonth = getQuarterStartMonth() + 2
  let quarterStartDate = new Date(nowYear, quarterEndMonth + 1, 1)

  return formatDate(quarterStartDate)
}

function getTypeDate(type) {
  let dates = [null, null]

  if (type === 1) {
    dates[0] = getWeekStartDate()
    dates[1] = getWeekEndDate()
  }

  if (type === 2) {
    dates[0] = getLastWeekStartDate()
    dates[1] = getLastWeekEndDate()
  }

  if (type === 3) {
    dates[0] = getMonthStartDate()
    dates[1] = getMonthEndDate()
  }

  if (type === 4) {
    dates[0] = getQuarterStartDate()
    dates[1] = getQuarterEndDate()
  }
  if (type === 5) {
    dates[0] = getLastMonthStartDate()
    dates[1] = getLastMonthEndDate()
  }
  return dates
}

// js获取某天是第几周
/**
 * 判断年份是否为闰年
 */
// function isLeapYear(year) {
//   return (year % 400 === 0) || (year % 4 === 0 && year % 100 != 0)
//
// }

/**
 * 获取某一年份的某一月份的天数
 * @param year
 * @param month
 * @returns
 */
// function getMonthDays(year, month) {
//   return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28)
// }

/**
 * 获取某年的某天是第几周 周日算是第一周的第一天，一周从周日到周六
 * @param y
 * @param m
 * @param d
 * @returns
 */
function getWeekNumber(y, m, d) {
  let now = new Date(y, m - 1, d),
    year = now.getFullYear(),
    month = now.getMonth(),
    days = now.getDate()

  // 那一天是那一年中的第多少天
  for (let i = 0; i < month; i++) {
    days += getMonthDays(year, i)
  }
  // 那一年第一天是星期几
  let yearFirstDay = new Date(year, 0, 1).getDay()
  let week = null

  if (yearFirstDay === 0) {
    week = Math.ceil(days / 7)
  } else {
    days -= (6 - yearFirstDay + 1)
    week = Math.ceil(days / 7) + 1
  }
  return week
}

/**
 * 获取当天是当年的第几周
 * @returns
 */
function getNowWeekNumber() {
  return getWeekNumber(nowYear, nowMonth + 1, nowDay)
}

/**
 * 获取某年的某天是第几周
 * @param yyyy-mm-dd
 * @returns
 */
function getWeekNumberByDataStr(dateStr) {
  if (dateStr === null || dateStr === '') {
    return 0
  }
  if (dateStr.length > 10) {
    dateStr = dateStr.substring(0, 10)
  }
  let y = dateStr.substring(0, 4)
  let m = dateStr.substring(5, 7)
  let d = dateStr.substring(8, 10)

  return getWeekNumber(y, m, d)
}

export {
  getTypeDate,
  formatDate,
  getNowWeekNumber,
  getWeekNumberByDataStr
}
