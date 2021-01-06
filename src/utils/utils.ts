import { Message } from 'element-ui'
import { ElMessageOptions, MessageType } from 'element-ui/types/message'

export function deepCopy<T extends Array<T> | any>(target: T): T {
  if (typeof target == 'object') {
    if (Array.isArray(target)) {
      return target.map(item => deepCopy(item)) as T
    }

    const result = {} as T
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }

    return result
  }
  return target
}

export function swap(arr: Array<any>, i: number, j: number) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}


// MessageType = 'success' | 'warning' | 'info' | 'error'
export function toast(msg: string, type?: MessageType, duration?: number) {
  const data: ElMessageOptions = {
    message: msg
  }
  if (type) data.type = type
  if (duration) data.duration = duration
  Message(data)
}
