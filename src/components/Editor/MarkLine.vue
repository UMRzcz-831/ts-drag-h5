<template>
  <div class="markline">
    <div
      v-for="line in lines"
      :key="line"
      class="line"
      :class="line.includes('x') ? 'xline' : 'yline'"
      :ref="line"
      v-show="lineStatus[line] || false"
    ></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable prefer-const */

import { Component, Vue } from 'vue-property-decorator'
import eventBus from '@/utils/eventBus'

interface Condition {
  isNearly: boolean
  lineNode: HTMLElement
  line: string
  dragShift: number
  lineShift: number
}

@Component
export default class MarkLine extends Vue {
  //        xTop xCenter xBottom yLeft yCenter yRight
  lines = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'] // 分别对应三条横线和三条竖线
  diff = 3
  lineStatus = {
    xt: false,
    xc: false,
    xb: false,
    yl: false,
    yc: false,
    yr: false
  }
  editor: HTMLElement | null = null
  initLineStatus() {
    this.lines.forEach(item => {
      this.lineStatus[item] = false
    })
  }
  mounted() {
    // this.initLineStatus()
    this.editor = document.querySelector('#editor')
    // 监听元素移动和不移动的事件
    eventBus.$on(
      'move',
      (dragNode: Element, isDownward: boolean, isRightward: boolean) => {
        this.showLine(dragNode, isDownward, isRightward)
      }
    )

    eventBus.$on('unmove', () => {
      this.hideLine()
    })
  }
  hideLine() {
    Object.keys(this.lineStatus).forEach(line => {
      this.lineStatus[line] = false
    })
  }
  showLine(dragNode: Element, isDownward: boolean, isRightward: boolean) {
    const lines = this.$refs
    const components = document.querySelectorAll('.baseEl')
    this.hideLine()
    // console.log(lines)
    this.conditionJudge(components, dragNode, lines, isDownward, isRightward)
  }
  /**
   * 获取当前节点相对编辑器的位置
   */
  getNodePositionToEditor(node: Element) {
    let {
      top,
      bottom,
      left,
      right,
      width,
      height
    } = node.getBoundingClientRect()
    const editorRect = (this.editor as HTMLElement).getBoundingClientRect()
    left -= editorRect.left
    top -= editorRect.top
    right -= editorRect.left
    bottom -= editorRect.top
    return { top, bottom, left, right, width, height }
  }
  // 小于等于diff判定为接近
  isNearly(dragValue: number, targetValue: number) {
    return Math.abs(dragValue - targetValue) <= this.diff
  }
  conditionJudge(
    components: NodeListOf<Element>,
    dragNode: Element,
    lines: Record<string, Element | Vue | Vue[] | Element[]>,
    isDownward: boolean,
    isRightward: boolean
  ) {
    components.forEach(node => {
      if (node == dragNode) return
      const {
        top,
        height,
        bottom,
        left,
        width,
        right
      } = this.getNodePositionToEditor(node)

      const nodeHalfwidth = width / 2
      const nodeHalfHeight = height / 2
      const dragNodeRect = this.getNodePositionToEditor(dragNode)
      const dragNodeHalfwidth = dragNodeRect.width / 2
      const dragNodeHalfHeight = dragNodeRect.height / 2
      const conditions = {
        top: [
          {
            isNearly: this.isNearly(dragNodeRect.top, top),
            lineNode: lines.xt[0], // xt
            line: 'xt',
            dragShift: top,
            lineShift: top
          },
          {
            isNearly: this.isNearly(dragNodeRect.bottom, top),
            lineNode: lines.xt[0], // xt
            line: 'xt',
            dragShift: top - dragNodeRect.height,
            lineShift: top
          },
          {
            // 组件与拖拽节点的中间是否对齐
            isNearly: this.isNearly(
              dragNodeRect.top + dragNodeHalfHeight,
              top + nodeHalfHeight
            ),
            lineNode: lines.xc[0], // xc
            line: 'xc',
            dragShift: top + nodeHalfHeight - dragNodeHalfHeight,
            lineShift: top + nodeHalfHeight
          },
          {
            isNearly: this.isNearly(dragNodeRect.top, bottom),
            lineNode: lines.xb[0], // xb
            line: 'xb',
            dragShift: bottom,
            lineShift: bottom
          },
          {
            isNearly: this.isNearly(dragNodeRect.bottom, bottom),
            lineNode: lines.xb[0], // xb
            line: 'xb',
            dragShift: bottom - dragNodeRect.height,
            lineShift: bottom
          }
        ],
        left: [
          {
            isNearly: this.isNearly(dragNodeRect.left, left),
            lineNode: lines.yl[0], // yl
            line: 'yl',
            dragShift: left,
            lineShift: left
          },
          {
            isNearly: this.isNearly(dragNodeRect.right, left),
            lineNode: lines.yl[0], // yl
            line: 'yl',
            dragShift: left - dragNodeRect.width,
            lineShift: left
          },
          {
            // 组件与拖拽节点的中间是否对齐
            isNearly: this.isNearly(
              dragNodeRect.left + dragNodeHalfwidth,
              left + nodeHalfwidth
            ),
            lineNode: lines.yc[0], // yc
            line: 'yc',
            dragShift: left + nodeHalfwidth - dragNodeHalfwidth,
            lineShift: left + nodeHalfwidth
          },
          {
            isNearly: this.isNearly(dragNodeRect.left, right),
            lineNode: lines.yr[0], // yr
            line: 'yr',
            dragShift: right,
            lineShift: right
          },
          {
            isNearly: this.isNearly(dragNodeRect.right, right),
            lineNode: lines.yr[0], // yr
            line: 'yr',
            dragShift: right - dragNodeRect.width,
            lineShift: right
          }
        ]
      }
      const needToShow: Array<string> = []
      if (Object.keys(conditions)) {
        Object.keys(conditions).forEach(key => {
          // 遍历符合的条件并处理
          conditions[key].forEach((condition: Condition) => {
            if (!condition.isNearly) return
            // 修改当前组件位移
            //   console.log(condition, key)
            this.$store.commit('setShapePosStyle', {
              key,
              value: condition.dragShift
            })
            condition.lineNode.style[key] = `${condition.lineShift}px`
            needToShow.push(condition.line)
          })
        })
      }

      // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
      // 同一方向上的线只显示一条，例如多条横条只显示一条横线
      if (needToShow.length) {
        this.showBetterLine(needToShow, isDownward, isRightward)
      }
    })
  }

  showBetterLine(
    needToShow: Array<string>,
    isDownward: boolean,
    isRightward: boolean
  ) {
    if (isRightward) {
      if (needToShow.includes('yr')) {
        this.lineStatus.yr = true
      } else if (needToShow.includes('yc')) {
        this.lineStatus.yc = true
      } else if (needToShow.includes('yl')) {
        this.lineStatus.yl = true
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (needToShow.includes('yl')) {
        this.lineStatus.yl = true
      } else if (needToShow.includes('yc')) {
        this.lineStatus.yc = true
      } else if (needToShow.includes('yr')) {
        this.lineStatus.yr = true
      }
    }

    if (isDownward) {
      if (needToShow.includes('xb')) {
        this.lineStatus.xb = true
      } else if (needToShow.includes('xc')) {
        this.lineStatus.xc = true
      } else if (needToShow.includes('xt')) {
        this.lineStatus.xt = true
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (needToShow.includes('xt')) {
        this.lineStatus.xt = true
      } else if (needToShow.includes('xc')) {
        this.lineStatus.xc = true
      } else if (needToShow.includes('xb')) {
        this.lineStatus.xb = true
      }
    }

    // console.log({ ...this.lineStatus })
  }
}
</script>

<style lang="scss" scoped>
.markline {
  height: 100%;
}
.line {
  background: #59c7f9;
  position: absolute;
  z-index: 1000;
}
.xline {
  width: 100%;
  height: 1px;
}
.yline {
  width: 1px;
  height: 100%;
}
</style>
