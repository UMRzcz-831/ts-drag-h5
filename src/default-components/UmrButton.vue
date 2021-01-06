<template>
  <button class="umr-button" :class="computedType">
    {{ propValue }}
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  props: {
    propValue: {
      type: String,
      required: true
    }
  }
})
export default class UmrButton extends Vue {
  @Prop({ default: 'plain' })
  type?: 'plain' | 'disabled' | 'round'
  get computedType() {
    return `is-${this.type}`
  }
}
</script>

<style lang="scss" scoped>
$main-color: rgb(243, 78, 12);

.umr-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  width: 100%;
  height: 100%;
  font-size: 14px;

  &:active {
    color: #3a8ee6;
    border-color: #3a8ee6;
    outline: 0;
  }

  &:hover {
    background-color: #ecf5ff;
    color: #3a8ee6;
  }

  &.is-plain {
    background-color: #fff;
    border-color: $main-color;
    color: $main-color;
    transition: all 0.3s;
    &:hover,
    &:focus {
      background-color: $main-color;
      border-color: $main-color;
      color: #ecf5ff;
    }
  }
  &.is-round {
    border-radius: 20px;
  }
}
</style>
