import { Command } from "./Command";

export class CommandManager {
  private _undoStack: Command[] = [];
  private _redoStack: Command[] = [];

  executeCommand(command: Command) {
    command.execute();
    this._undoStack.push(command);
    this._redoStack = [];
  }

  undo() {
    const command = this._undoStack.pop();

    if (command) {
      command.undo();
      this._redoStack.push(command);
    }
  }
  redo() {
    const command = this._redoStack.pop();

    if (command) {      
      command.execute();
      this._undoStack.push(command);
    }
  }
}
