let id = 0
import store from '@/store'
// 主要用于 Vue 的 diff 算法，为每个元素创建一个独一无二的 ID
export default function generateID() {
  return id++
}
// 避免读取快照后，id为0
export function restoreId() {
  const canvasState = store.state.componentData
  let max = -1
  canvasState.forEach(item => {
    if (item.id > max) max = item.id
  })
  console.log(max)
  id = max + 1
}
