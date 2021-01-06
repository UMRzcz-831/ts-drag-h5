import { Editor } from '../Editor/Editor'
import { Command } from './Command'
import { AddCommand } from './CommonCommands'
 class CommandManger {
  redoStack: Array<any> = []
  undoStack: Array<any> = []
  editor: Editor
  commandList: Array<any> = []
  constructor(editor?: Editor) {
    if (!editor) {
      this.editor = new Editor()
    } else {
      this.editor = editor
    }
    this.resigterCommandClass(AddCommand)
  }
  execute(name: any, ...args: any[]) {
    const CommandClass = this.commandList[name]
    if (!CommandClass) throw new Error(`editor has not the ${name} command`)
    const command = new CommandClass(this.editor, ...args) // 创建 command 实例

    this.undoStack.push(command)
    this.redoStack = []
  }
  undo() {
    if (this.undoStack.length === 0) {
      console.log('undo stack is empty, can not undo')
      return
    }
    const command = this.undoStack.pop()
    this.redoStack.push(command)
    command.undo()
    command.afterUndo()
  }
  redo() {
    if (this.redoStack.length === 0) {
      console.log('redo stack is empty, can not redo')
      return
    }
    const command = this.redoStack.pop()
    this.undoStack.push(command)
    command.redo()
    command.afterRedo()
  }
  resigterCommandClass(commandClass: any) {
    const name = commandClass.name
    this.commandList[name] = commandClass
  }
}
export default CommandManger