export type edit_State = 'edit' | 'read'
export interface Axis {
  width: number
  height: number
}
export class Editor {
  editMode: edit_State = 'edit'
  canvasStyle: Axis = {
    width: 1200,
    height: 800
  }
  componentData: Array<any> = []
  snapshotData: Array<any> = [] // 编辑器快照数据
  snapshotIndex: number = -1 // 快照索引
  curComponent: any = null // 当前组件
  curComponentZIndex: any = null
  menuTop: number = 0
  menuLeft: number = 0
  menuShow: boolean = false
  
}
