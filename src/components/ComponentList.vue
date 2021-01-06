
<template>
  <div @dragstart="handleDragStart" class="component-list">
    <el-tooltip
      v-for="(item, index) in componentList"
      :key="index"
      effect="dark"
      :content="item.label"
      placement="bottom"
    >
      <div class="listItem" draggable :data-index="index">
        <i :class="item.icon" class="iconfont" ></i>
        <!-- <span>{{ item.label }}</span> -->
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Vue } from 'vue-property-decorator'
import List from '@/default-components/component-list'
@Component
export default class ComponentList extends Vue {
  private componentList = List

  handleDragStart(e: any) {
    e.dataTransfer.setData('index', e.target.dataset.index)
  }
}
</script>

<style lang="scss" scoped>
.component-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;

  .listItem {
    width: 45%;
    outline:none;
    border: 1px solid #ddd;
    cursor: grab;
    font-size: 14px;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    padding: 4px 5px;
    border-radius: 4px;
    transition:  all .4s;
    box-shadow:2px 2px 2px #ddd;
    i {
      font-size: 18px;
    }
    &:active {
      color: rgb(243, 78, 12);
      border-color: rgb(243, 78, 12);
      outline: 0;
    }
    &:hover {
      background-color: mix(#fff, rgb(243, 78, 12), 90%);
      color: rgb(243, 78, 12);
    }
  }
}
</style>
