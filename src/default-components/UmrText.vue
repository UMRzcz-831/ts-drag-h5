<template>
  <textarea
    v-if="editMode == 'edit'"
    :value="propValue"
    class="text textarea"
    @input="handleInput"
    ref="v-text"
  ></textarea>
  <div v-else class="text disabled">
    <div v-for="(text, index) in propValue.split('\n')" :key="index">
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
@Component({
  props: {
    propValue: {
      type: String,
      required: true
    },
    element: {
      type: Object
    }
  },
  computed: {
    ...mapState(['editMode'])
  }
})
export default class UmrText extends Vue {
  handleInput(e: any) {
    this.$emit('input', this.$props.element, e.target.value)
  }
}
</script>

<style lang="scss" scoped>
.text {
  border: none;
  padding: 5px 10px;
  white-space: normal;
  word-break: break-all;
}
.textarea {
  overflow: hidden;
  resize: none;
}
.disabled {
  border: none;
}
</style>
