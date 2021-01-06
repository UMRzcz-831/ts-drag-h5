<template>
  <div
    class="baseEl"
    @click="selectCurComponent"
    @mousedown="handleMouseDown"
    @contextmenu="handleContextMenu"
  >
    <div
      class="position-point"
      v-for="(item, index) in active ? pointList : []"
      :key="index"
      @mousedown="handleMouseDownPoint(item)"
      :style="getPointStyle(item)"
    ></div>
    <slot ></slot>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import eventBus from '@/utils/eventBus'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Style } from '@/utils/style'
@Component
export default class Shape extends Vue {
  @Prop({ required: true })
  defaultStyle!: Record<string, any>
  @Prop({ default: false })
  active!: boolean
  @Prop({ required: true })
  element!: Record<string, any>
  @Prop()
  zIndex!: number

  pointList: any = ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb']
  directionKey: any = {
    // 光标显示样式
    t: 'n',
    b: 's',
    l: 'w',
    r: 'e'
  }
  getPointStyle(point: string) {
    const { width, height } = this.defaultStyle
    const hasT = /t/.test(point)
    const hasB = /b/.test(point)
    const hasL = /l/.test(point)
    const hasR = /r/.test(point)
    let newLeft = 0
    let newTop = 0

    // 四个角的点
    if (point.length === 2) {
      newLeft = hasL ? 0 : width
      newTop = hasT ? 0 : height
    } else {
      // 上下两点的点，宽度居中
      if (hasT || hasB) {
        newLeft = width / 2
        newTop = hasT ? 0 : height
      }

      // 左右两边的点，高度居中
      if (hasL || hasR) {
        newLeft = hasL ? 0 : width
        newTop = Math.floor(height / 2)
      }
    }

    const direction = this.directionKey
    const style: any = {
      marginLeft: hasR ? '-4px' : '-3px',
      marginTop: '-3px',
      left: `${newLeft}px`,
      top: `${newTop}px`,
      cursor:
        point
          .split('')
          .reverse()
          .map(m => direction[m])
          .join('') + '-resize'
    }

    return style
  }
  handleMouseDown(e: MouseEvent) {
    if (this.element.component != 'umr-text') {
      e.preventDefault()
    }
    e.stopPropagation()
    this.$store.commit('setCurComponent', {
      component: this.element,
      zIndex: this.zIndex
    })
    const pos = this.convertPosition({ ...this.defaultStyle })
    // console.log(pos.top,pos.left)
    const startY = e.clientY
    const startX = e.clientX
    const startTop = pos.top
    const startLeft = pos.left
    let hasMoved = false
    // 移动组件
    const move = (moveEvent: MouseEvent) => {
      hasMoved = true
      const curX = moveEvent.clientX
      const curY = moveEvent.clientY
      pos.top = curY - startY + startTop
      pos.left = curX - startX + startLeft
      this.$store.commit('setShapeStyle', pos)
      this.$nextTick(() => {
        // 其实就是vue实例调用目前挂再的move事件
        eventBus.$emit('move', this.$el, curY - startY > 0, curX - startX > 0)
      })
    }
    const up = () => {
      hasMoved && this.$store.commit('recordSnapshot')
      // 触发元素停止移动事件，用于隐藏标线
      eventBus.$emit('unmove')
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }
  selectCurComponent(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    this.$store.commit('hideContexeMenu')
  }
  handleContextMenu(e: MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    // 计算菜单相对于编辑器的位移
    let target = e.target as HTMLElement
    // console.log(target.className)
    let top = e.offsetY
    let left = e.offsetX
    while (!target.className.includes('editor')) {
      left += target.offsetLeft
      top += target.offsetTop
      target = target.parentNode as HTMLElement
    }

    this.$store.commit('showContexeMenu', { top, left })
  }
  handleMouseDownPoint(point: string) {
    const downEvent = window.event as MouseEvent
    downEvent.stopPropagation()
    downEvent.preventDefault()
    const pos = this.convertPosition({ ...this.defaultStyle })
    const startX = downEvent.clientX
    const startY = downEvent.clientY
    const startHeight = pos.height
    const startWidth = pos.width
    const startTop = pos.top
    const startLeft = pos.left
    // 是否保存快照
    let needSave = false
    // 移动坐标点
    const move = (moveEvent: MouseEvent) => {
      needSave = true
      const currX = moveEvent.clientX
      const currY = moveEvent.clientY
      // 计算开始位置和移动位置的坐标差
      const disY = currY - startY
      const disX = currX - startX
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      // 包含向上移动 -Y坐标,包含下移增加,只有水平移动则不变
      const newHeight = startHeight + (hasT ? -disY : hasB ? disY : 0)
      const newWidth = startWidth + (hasL ? -disX : hasR ? disX : 0)
      pos.height = newHeight > 0 ? newHeight : 0
      pos.width = newWidth > 0 ? newWidth : 0
      pos.left = startLeft + (hasL ? disX : 0)
      pos.top = startTop + (hasT ? disY : 0)
      this.$store.commit('setShapeStyle', pos)
      this.$nextTick(() => {
        // 其实就是vue实例调用目前挂再的move事件
        eventBus.$emit('move', this.$el, currY - startY > 0, currX - startX > 0)
      })
    }

    const up = () => {
      eventBus.$emit('unmove')
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      needSave && this.$store.commit('recordSnapshot')
    }

    document.addEventListener('mousemove', move)
    // 鼠标松开保存快照，并移除监听
    document.addEventListener('mouseup', up)
  }

  convertPosition(pos: Style) {
    // console.log(pos.left, pos.top)
    const height = Number(pos.height)
    const width = Number(pos.width)
    const top = Number(pos.top)
    const left = Number(pos.left)
    return { height, width, top, left }
  }
}
</script>

<style lang="scss" scoped>
.baseEl {
  position: absolute;
}
.active {
  border: 1px solid #70c0ff;
}
.position-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
