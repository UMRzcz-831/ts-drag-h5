<template>
  <div
    class="editor"
    id="editor"
    :class="{ edit: isEdit }"
    :style="{
      width: canvasStyle.width + 'px',
      height: canvasStyle.height + 'px'
    }"
  >
    <Shape
      v-for="(item, index) in componentData"
      :defaultStyle="item.style"
      :style="getShapeStyle(item.style, index)"
      :key="item.id"
      :active="item === curComponent"
      :element="item"
      :zIndex="index"
    >
      <component
        v-if="item.component != 'umr-text'"
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
      />
      <component
        v-else-if="item.component == 'umr-button'"
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
        :type="item.ButtonType"
      />
      <component
        v-else-if="item.component == 'umr-field'"
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
        :element="item"
        @input="handleInput"
      />
      <component
        v-else
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
        @input="handleInput"
        :element="item"
      />
    </Shape>
    <ContextMenu />
    <MarkLine />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Shape from './Shape'
import MarkLine from './MarkLine'
import ContextMenu from './ContextMenu'
import getStyle from '@/utils/style'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Shape,
    MarkLine,
    ContextMenu
  },
  computed: mapState(['canvasStyle', 'componentData', 'curComponent']),
  data() {
    return {}
  },
  methods: {
    getShapeStyle(style, index) {
      const result = { ...style }
      if (result.width) {
        result.width += 'px'
      }
      if (result.height) {
        result.height += 'px'
      }
      if (result.top) {
        result.top += 'px'
      }
      if (result.left) {
        result.left += 'px'
      }
      if (result.rotate) {
        result.transform = 'rotate(' + result.rotate + 'deg)'
      }
      // 按顺序添加 z-index 层级
      result.zIndex = index
      return result
    },
    getComponentStyle(style) {
      return getStyle(style, [
        'top',
        'left',
        'width',
        'height',
        'zIndex',
        'rotate'
      ])
    },
    handleInput(element, value) {
      element.propValue = value
      // 根据文本组件高度调整 shape 高度
      this.$store.commit('setShapeStyle', {
        height: this.getTextareaHeight(element, value)
      })
    },
    getTextareaHeight(element, text) {
      let { lineHeight } = element.style
      const { fontSize, height } = element.style
      if (lineHeight === '') {
        lineHeight = 1.5
      }

      const newHeight = text.split('\n').length * lineHeight * fontSize
      return height > newHeight ? height : newHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: 0 auto;
}
.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
