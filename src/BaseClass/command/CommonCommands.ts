import { Editor } from '../Editor/Editor'
import { Command } from './Command'

export class AddCommand implements Command {
  name: string = 'AddCommand'
  constructor(editor: Editor, componentData: any) {
    editor.snapshotData.push(componentData)
  }
  undo(): void {
    throw new Error('Method not implemented.')
  }
  redo(): void {
    throw new Error('Method not implemented.')
  }
  afterRedo(): void {
    throw new Error('Method not implemented.')
  }
  afterUndo(): void {
    throw new Error('Method not implemented.')
  }
}
