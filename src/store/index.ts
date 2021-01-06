import Vue from 'vue'
import Vuex from 'vuex'
import { deepCopy, swap, toast } from '@/utils/utils'
import fileSaver from 'file-saver'
import generateID from '@/utils/generateID'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    editMode: 'edit',
    canvasStyle: {
      width: 375,
      height: 700
    },
    componentData: [] as Array<any>,
    snapshotData: [] as Array<any>, // 编辑器快照数据
    snapshotIndex: -1, // 快照索引
    curComponent: null as any, // 当前组件
    curComponentZIndex: null as any,
    menuTop: 0,
    menuLeft: 0,
    menuShow: false
  },
  mutations: {
    setEditMode(state, mode) {
      state.editMode = mode
    },
    setCanvasStyle(state, style) {
      state.canvasStyle = style
    },
    addComponent(state, component) {
      state.componentData.push(component)
    },
    /**
     * 撤销
     * @param state
     */
    undo(state) {
      // console.log('undo')
      if (state.snapshotIndex >= 0) {
        state.snapshotIndex--
        store.commit(
          'setComponentData',
          deepCopy(state.snapshotData[state.snapshotIndex])
        )
      }
    },
    /**
     * 重做
     * @param state
     */
    redo(state) {
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotIndex++
        store.commit(
          'setComponentData',
          deepCopy(state.snapshotData[state.snapshotIndex])
        )
      }
    },
    saveAsJson(state, filename) {
      const copyState = deepCopy(state)
      copyState.snapshotData = []
      copyState.snapshotIndex = -1
      copyState.curComponent = null
      copyState.curComponentZIndex = -1
      const data = JSON.stringify(copyState)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      fileSaver.saveAs(blob, `${filename}.json`)
    },
    restore(state, backup) {
      this.replaceState({ ...backup })
      // this.state = { ...backup }
    },
    // 设置组件属性
    setComponentData(state, componentData = []) {
      Vue.set(state, 'componentData', componentData)
    },
    setCurComponentData(state, curData) {
      Vue.set(state, 'curComponent', curData)
    },
    recordSnapshot(state) {
      // 添加新的快照
      state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData)
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(
          0,
          state.snapshotIndex + 1
        )
      }
    },
    showContexeMenu(state, { top, left }) {
      state.menuShow = true
      state.menuTop = top
      state.menuLeft = left
    },
    hideContexeMenu(state) {
      state.menuShow = false
    },
    upComponent({ componentData, curComponentZIndex }) {
      // 上移图层 zIndex，表示元素在数组中越往后
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, curComponentZIndex + 1)
      } else {
        toast('已经到顶了', 'error')
      }
    },
    downComponent({ componentData, curComponentZIndex }) {
      // 下移图层 zIndex，表示元素在数组中越往前
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, curComponentZIndex - 1)
      } else {
        toast('已经到底了', 'error')
      }
    },
    topComponent({ componentData, curComponentZIndex }) {
      // 置顶
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, componentData.length - 1)
      } else {
        toast('已经到顶了', 'error')
      }
    },

    bottomComponent({ componentData, curComponentZIndex }) {
      // 置底
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, 0)
      } else {
        toast('已经到底了', 'error')
      }
    },
    deleteComponent(state) {
      // console.log(state.componentData[state.curComponentZIndex])
      state.componentData.splice(state.curComponentZIndex, 1)
      toast('删除成功', 'success')
    },
    copyComponent(state) {
      // console.log(state.componentData[state.curComponentZIndex])
      const copy = deepCopy(state.curComponent)
      copy.id = generateID()
      copy.style.left += 20
      copy.style.top += 20
      state.componentData.push(copy)
      toast('复制成功', 'success')
    },
    /**
     * 当前选中组件
     * @param state
     * @param param1
     */
    setCurComponent(state, { component, zIndex }) {
      state.curComponent = component
      // console.log(zIndex)
      state.curComponentZIndex = zIndex
    },
    setShapeStyle({ curComponent }, { top, left, width, height }) {
      // 从state解构curComponent
      if (top) curComponent.style.top = top
      if (left) curComponent.style.left = left
      if (width) curComponent.style.width = width
      if (height) curComponent.style.height = height
    },
    setShapePosStyle({ curComponent }, { key, value }) {
      curComponent.style[key] = value
    }
  },
  actions: {},
  modules: {}
})

export default store
