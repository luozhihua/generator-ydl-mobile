import {isArray} from 'lodash'

export default {
  /**
   * 精确加法运算
   * @param {Number} numbers 要相加的数字，参数个数不限
   * @return {*}
   */
  plus(... numbers) {
    let result = 0
    let plus = function plus(arg1, arg2) {
      let r1, r2, m;

      try {r1 = arg1.toString().split('.')[1].length} catch (e) {r1 = 0}
      try {r2 = arg2.toString().split('.')[1].length} catch (e) {r2 = 0}
      m = Math.pow(10, Math.max(r1, r2))

      return (arg1 * m + arg2 * m) / m
    }

    if (isArray(numbers)) {
      numbers.forEach((number) => {
        result = plus(result, number)
      })
    }

    return result
  },

  /**
   * 精确减法运算
   * @param {Number} numbers 要相减的数字，参数个数不限
   * @return {*}
   */
  subtract(... numbers) { return this.minus.apply(this, numbers) },
  minus(... numbers) {
    let result

    if (isArray(numbers)) {
      result = numbers[0]

      numbers.forEach((number, i) => {
        if (i > 0) {
          result = this.plus(result, -number)
        }
      })
    }

    return result
  },

  /**
   * 精确乘法运算
   * @param {Number} numbers 要相乘的数字，参数个数不限
   * @return {*}
   */
  multiply(... numbers) { return this.times.apply(this, numbers) },
  times(... numbers) {
    let result
    let times = function times(arg1, arg2) {
      let m = 0, s1 = arg1.toString(), s2 = arg2.toString();

      try {m += s1.split('.')[1].length} catch (e) {}
      try {m += s2.split('.')[1].length} catch (e) {}
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    }

    if (isArray(numbers)) {
      result = numbers[0]
      numbers.forEach((number, i) => {
        if (i > 0) {
          result = times(result, number)
        }
      })
    }

    return result
  },

  /**
   * 精确除法运算
   * @param {Number} numbers 要相除的数字，参数个数不限
   * @return {*}
   */
  divide(... numbers) {
    let result = 0
    let divide = function divide(arg1, arg2) {
      let t1 = 0, t2 = 0, r1, r2

      try {t1 = arg1.toString().split('.')[1].length} catch (e) {}
      try {t2 = arg2.toString().split('.')[1].length} catch (e) {}

      r1 = Number(arg1.toString().replace('.', ''))
      r2 = Number(arg2.toString().replace('.', ''))

      return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    if (isArray(numbers)) {
      result = numbers[0]
      numbers.forEach((number, i) => {
        if (i > 0) {
          result = divide(result, number)
        }
      })
    }

    return result
  }
}
