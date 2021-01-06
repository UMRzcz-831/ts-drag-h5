export interface Command {
  name: string
  undo(): void
  redo(): void
  afterRedo(): void
  afterUndo(): void
}
