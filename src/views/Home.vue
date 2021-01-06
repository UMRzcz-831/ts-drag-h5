<template>
  <div class="home">
    <header>
      <el-tooltip effect="dark" content="撤消" placement="bottom">
        <el-button
          @click="undo"
          class="iconfont icon-corner-up-left"
        ></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="重做" placement="bottom">
        <el-button
          @click="redo"
          class="iconfont icon-corner-up-right"
        ></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="插入图片" placement="bottom">
        <label for="input" class="insert iconfont icon-image"></label>
      </el-tooltip>
      <input type="file" @change="handleFileChange" id="input" hidden />
      <el-tooltip effect="dark" content="预览" placement="bottom">
        <el-button
          @click="preview"
          style="margin-left: 10px"
          class="iconfont icon-cast"
        ></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="保存" placement="bottom">
        <el-button @click="save" class="iconfont icon-check-circle"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="读取存档" placement="bottom">
        <!-- <el-button @click="readBackup" class="iconfont icon-loader"></el-button> -->
        <label for="backup" class="insert iconfont icon-loader"></label>
      </el-tooltip>
      <input type="file" @change="readBackup" id="backup" hidden />
      <el-tooltip effect="dark" content="清空画布" placement="bottom">
        <el-button @click="clearCanvas" class="iconfont icon-x"></el-button>
      </el-tooltip>
      <div class="canvas-config">
        <span>画布大小</span>
        <el-input
          class="input"
          v-model="canvasStyle.width"
          placeholder="宽度"
        ></el-input>
        <span>*</span>
        <el-input
          class="input"
          v-model="canvasStyle.height"
          placeholder="高度"
        ></el-input>
      </div>
    </header>
    <main>
      <!-- left -->
      <section class="left">
        <ComponentList />
        <!-- 组件列表 -->
      </section>
      <!-- 中间的画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @click="deselectCurComponent"
        >
          <Canvas />
        </div>
      </section>
      <section class="right">
        <el-tabs v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <AttrList v-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation">
            <div v-if="curComponent" class="div-animation">
              <el-button @click="isShowAnimation = true">添加动画</el-button>
              <el-button @click="previewAnimate">预览动画</el-button>
              <div>
                <el-tag
                  v-for="(tag, index) in curComponent.animations"
                  :key="index"
                  closable
                  @close="removeAnimation(index)"
                >
                  {{ tag.label }}
                </el-tag>
              </div>
            </div>
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="事件" name="events">
            <div v-if="curComponent" class="div-events">
              <el-button @click="isShowEvent = true">添加事件</el-button>
              <div>
                <el-tag
                  v-for="event in Object.keys(curComponent.events)"
                  :key="event"
                  closable
                  @close="removeEvent(event)"
                >
                  {{ event }}
                </el-tag>
              </div>
            </div>
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
    <Preview v-model="isShowPreview" @change="handlePreviewChange" />
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import { deepCopy } from '@/utils/utils'
import eventBus from '@/utils/eventBus'
import animationClassData from '@/utils/animationClassData'
import generateID from '@/utils/generateID'
import Canvas from '@/components/Editor/Canvas'
import Preview from '@/components/Editor/Preview'
import AttrList from '@/components/AttrList'
import ComponentList from '@/components/ComponentList'
import List from '@/default-components/component-list'
export default {
  name: 'Home',
  components: { Canvas, ComponentList, AttrList, Preview },
  computed: mapState(['componentData', 'canvasStyle', 'curComponent']),
  data() {
    return {
      input: '',
      isShowPreview: false,
      isShowAnimation: false,
      activeName: 'attr',
      animationClassData,
      animationActiveName: '进入',
      showAnimatePanel: false,
      reSelectAnimateIndex: undefined
    }
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file.type.includes('image')) {
        this.$message('只能上传图片')
        return
      }
      const reader = new FileReader()
      reader.onload = res => {
        const fileResult = res.target.result
        const img = new Image()
        img.onload = () => {
          this.$store.commit('addComponent', {
            id: generateID(),
            component: 'umr-picture',
            label: '图片',
            icon: '',
            propValue: fileResult,
            animations: [],
            events: [],
            style: {
              top: 0,
              left: 0,
              width: img.width,
              height: img.height,
              rotate: ''
            }
          })
        }
        // base64
        img.src = fileResult
      }
      // new FileReader().readAsDataURL(file)返回的base64文件
      //  URL.createObjectURL(file)返回blob
      reader.readAsDataURL(file)
    },
    preview() {
      this.isShowPreview = true
      this.$store.commit('setEditMode', 'read')
    },
    save() {
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.$store.commit('saveAsJson', value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存'
          })
        })
    },
    readBackup(e) {
      const file = e.target.files[0]
      if (!file.type.includes('json')) {
        this.$message('只支持json')
        return
      }
      const reader = new FileReader()
      reader.onload = res => {
        const fileResult = res.target.result
        const backup = JSON.parse(fileResult)
        this.$store.commit('restore',backup)
        console.log(backup)
      }
      reader.readAsText(file)
    },
    clearCanvas() {
      this.$store.commit('setComponentData', [])
    },
    undo() {
      this.$store.commit('undo')
    },
    redo() {
      this.$store.commit('redo')
    },
    handleDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      // 获取组件信息
      const component = deepCopy(List[e.dataTransfer.getData('index')])
      component.style.top = e.offsetY
      component.style.left = e.offsetX
      component.id = generateID()
      // 注册进画布
      this.$store.commit('addComponent', component)
      this.$store.commit('recordSnapshot')
    },
    handleDragOver(e) {
      e.preventDefault()
      // console.log(e.dataTransfer)
      // console.log(e.offsetX,e.offsetY)
      e.dataTransfer.dropEffect = 'copy'
    },
    deselectCurComponent() {
      this.$store.commit('setCurComponent', { component: null, zIndex: null })
      this.$store.commit('hideContexeMenu')
    },
    previewAnimate() {
      eventBus.$emit('runAnimation')
    },
    handlePreviewChange() {
      this.$store.commit('setEditMode', 'edit')
    }
  }
}
</script>
<style lang="scss">
.home {
  height: 100vh;
  background: #fff;
  header {
    height: 64px;
    line-height: 64px;
    background: #fff;
    box-shadow: 0px 4px 4px #ddd;
    box-sizing: border-box;
    text-align: left;
    padding-left: 20px;
  }
  main {
    height: calc(100% - 64px);
    position: relative;
    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;
      padding-top: 16px;
    }
    .right {
      position: absolute;
      height: 100%;
      width: 260px;
      right: 0;
      top: 0;
    }
    .center {
      margin-left: 200px;
      margin-right: 262px;
      background: rgba(0, 0, 0, 0.1);
      height: 100%;
      overflow: auto;
      padding: 20px;
      .content {
        height: 100%;
        overflow: auto;
        display: inherit;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .insert {
    /* element-ui的预设 */
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
    padding: 9px 15px;
    font-size: 16px;
    border-radius: 3px;
    margin-left: 10px;
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
  .canvas-config {
    display: inline-block;
    margin-left: 20px;
    font-size: 14px;
    color: #606266;
    .input {
      width: 90px;
      margin-left: 10px;
      outline: none;
      padding: 0 5px;
      /* border: 1px solid #ddd; */
      color: #606266;
    }
    span {
      margin-left: 10px;
    }
  }
}
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background: white;
  border-left: 1px solid #e8e8e8;
}
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar-thumb {
  border-width: 1px;
  border-style: solid;
  border-color: #fff;
  border-radius: 6px;
  background: #c9c9c9;
}
::-webkit-scrollbar-thumb {
  border-width: 2px;
  border-style: solid;
  border-color: #fff;
  border-radius: 6px;
  background-color: #c6c6c6;
}
</style>
