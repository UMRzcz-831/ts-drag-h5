<template>
  <div
    class="contextMenu"
    v-show="menuShow"
    :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
  >
    <ul>
      <li @click="copyComponent">复制</li>
      <li @click="upwardComponent">上移</li>
      <li @click="downwardComponent">下移</li>
      <li @click="topComponent">置顶</li>
      <li @click="bottomComponent">置底</li>
      <li class="danger-btn" @click="deleteComponent">删除</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
@Component({
  computed: mapState(['menuShow', 'menuLeft', 'menuTop'])
})
export default class ContextMenu extends Vue {
  copyComponent() {
    this.$store.commit('copyComponent')
    this.$store.commit('recordSnapshot')
  }
  deleteComponent() {
    this.$store.commit('deleteComponent')
    this.$store.commit('recordSnapshot')
  }
  upwardComponent() {
    this.$store.commit('upComponent')
    this.$store.commit('recordSnapshot')
  }
  downwardComponent() {
    this.$store.commit('downComponent')
    this.$store.commit('recordSnapshot')
  }
  topComponent() {
    this.$store.commit('topComponent')
    this.$store.commit('recordSnapshot')
  }
  bottomComponent() {
    this.$store.commit('bottomComponent')
    this.$store.commit('recordSnapshot')
  }
}
</script>

<style lang="scss" scoped>
.contextMenu {
  position: absolute;
  z-index: 1000;
  ul {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    padding: 6px 0;
    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
        color: #1890ff;
      }
      &.danger-btn:hover {
        color: #f10215;
      }
    }
  }
}
</style>
