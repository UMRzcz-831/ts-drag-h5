<template>
  <el-input
    v-model="myPropValue"
    :placeholder="Umrplaceholder"
    size="normal"
    clearable
    @change="handleInput"
    :show-password="pswdMode"
  ></el-input>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from 'vue-property-decorator'
// import { mapState } from 'vuex'
@Component({
  props: {
    propValue: {
      type: String
    },
    Umrplaceholder: {
      type: String
    },
    pswdMode: {
      type: Boolean,
      default: false
    },
    element: {
      type: Object
    }
  },
  computed: {}
})
export default class UmrField extends Vue {
  get myPropValue(){
    return this.$props.propValue
  }
  handleInput(e: any) {
    this.$emit('input', this.$props.element, e.target.value)
  }
}
</script>

<style lang="scss" scoped></style>
