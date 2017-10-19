import {isFunction} from 'lodash'
let backbuttonHandlers = []

export default class BackButtonControl {
  static handler (event) {
    let oneStep
    let result
    let length = backbuttonHandlers.length

    oneStep = BackButtonControl.pop()

    if (oneStep === false || length > 0) {
      event && event.preventDefault()

      result = false
    } else {
      result = oneStep
    }

    return result
  }

  static prevent (key, replacementAction) {
    let action = replacementAction || key

    if (!replacementAction) {
      action.actionKey = key
    }

    backbuttonHandlers.push(action)
  }

  static push (key, action) {
    BackButtonControl.prevent(key, action)
  }

  static cancelPrevent (key) {
    if (key) {

    } else {
      backbuttonHandlers.pop()
    }
  }

  static cancelAll() {
    backbuttonHandlers.length = 0
  }

  static remove (key) {
    BackButtonControl.cancelPrevent(key)
  }

  static pop () {
    let action = backbuttonHandlers.pop()
    let result

    if (isFunction(action)) {
      result = action()

      if (result === false) {
        backbuttonHandlers.push(action)
      }
    }

    return result
  }
}
