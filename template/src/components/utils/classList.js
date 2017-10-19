/**
 * Adapted from dominus v6.0.1
 * https://github.com/bevacqua/dominus/blob/master/src/classes.js
 */
let trim = /^\s+|\s+$/g
let whitespace = /\s+/g

function isElementObject (o) {
  return o &&
    typeof o === 'object' &&
    typeof o.nodeName === 'string' &&
    o.nodeType === 1
}

function isElement (o) {
  let elementObjects = typeof window.HTMLElement === 'object'

  return elementObjects ? o instanceof window.HTMLElement : isElementObject(o)
}

function interpret (input) {
  return typeof input === 'string' ? input.replace(trim, '').split(whitespace) : input
}

function classes (el) {
  if (isElement(el)) {
    return el.className.replace(trim, '').split(whitespace)
  }

  return []
}

function set (el, input) {
  if (isElement(el)) {
    el.className = interpret(input).join(' ')
  }
}

function remove (el, input) {
  let current = classes(el)
  let values = interpret(input)

  values.forEach(function (value) {
    let i = current.indexOf(value)

    if (i !== -1) {
      current.splice(i, 1)
    }
  })

  set(el, current)

  return current
}

function add (el, input) {
  let current = remove(el, input)
  let values = interpret(input)

  current.push.apply(current, values)
  set(el, current)

  return current
}

function contains (el, input) {
  let current = classes(el)
  let values = interpret(input)

  return values.every(function (value) {
    return current.indexOf(value) !== -1
  })
}

export default {
  add,
  remove,
  contains,
  has: contains,
  set,
  get: classes
}
