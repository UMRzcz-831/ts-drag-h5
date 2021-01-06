<template>
  <div class="attr-list">
    <el-form>
      <el-form-item
        v-for="(key, index) in styleKeys"
        :key="index"
        :label="map[key]"
      >
        <el-color-picker
          v-if="key == 'borderColor'"
          v-model="curComponent.style[key]"
        ></el-color-picker>
        <el-color-picker
          v-else-if="key == 'color'"
          v-model="curComponent.style[key]"
        ></el-color-picker>
        <el-color-picker
          v-else-if="key == 'backgroundColor'"
          v-model="curComponent.style[key]"
        ></el-color-picker>
        <el-select
          v-else-if="key == 'textAlign'"
          v-model="curComponent.style[key]"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-input type="number" v-else v-model="curComponent.style[key]" />
      </el-form-item>
      <el-form-item
        label="按钮类型"
        v-if="
          curComponent && $store.state.curComponent.component == 'umr-button'
        "
      >
        <el-select v-model="curComponent.ButtonType">
          <el-option
            v-for="item in ButtonTypeOptions"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="输入框提示"
        v-if="
          curComponent && $store.state.curComponent.component == 'umr-field'
        "
      >
        <el-input
          type="textarea"
          v-model="curComponent.Umrplaceholder"
          @change="handlePlaceholder"
        />
      </el-form-item>
      <el-form-item
        label="是否为密码框"
        v-if="
          curComponent && $store.state.curComponent.component == 'umr-field'
        "
      >
        <el-switch
          v-model="curComponent.pswdMode"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>
      <el-form-item
        label="内容"
        v-if="curComponent && !excludes.includes(curComponent.component)"
      >
        <el-input type="textarea" v-model="curComponent.propValue" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      excludes: ['umr-picture'], // 这些组件不显示内容
      options: [
        {
          label: '左对齐',
          value: 'left'
        },
        {
          label: '居中',
          value: 'center'
        },
        {
          label: '右对齐',
          value: 'right'
        }
      ],
      map: {
        left: 'x 坐标',
        top: 'y 坐标',
        height: '高',
        width: '宽',
        color: '颜色',
        backgroundColor: '背景色',
        borderWidth: '边框宽度',
        borderColor: '边框颜色',
        borderRadius: '边框半径',
        fontSize: '字体大小',
        fontWeight: '字体粗细',
        lineHeight: '行高',
        letterSpacing: '字间距',
        textAlign: '对齐方式',
        opacity: '透明度',
        rotate: '旋转角度'
      },
      ButtonTypeOptions: [
        {
          label: '圆角',
          value: 'plain'
        },
        {
          label: '圆形',
          value: 'round'
        },
        {
          label: '禁用',
          value: 'buttonDisabled'
        }
      ]
    }
  },
  computed: {
    styleKeys() {
      return this.$store.state.curComponent
        ? Object.keys(this.$store.state.curComponent.style)
        : []
    },
    curComponent() {
      return this.$store.state.curComponent
    }
  },
  methods: {
    handlePlaceholder() {
      console.log(this.curComponent)
      this.$store.commit('setCurComponentData', this.curComponent)
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-list {
  overflow: auto;
  padding: 20px;
  padding-top: 0;
  height: 100%;
}
</style>
