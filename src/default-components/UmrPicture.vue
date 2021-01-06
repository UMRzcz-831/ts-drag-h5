<template>
  <div style="overflow:hidden">
    <img :src="propValue" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: {
    propValue: {
      type: String,
      required: true
    }
  }
})
export default class UmrPicture extends Vue {}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
