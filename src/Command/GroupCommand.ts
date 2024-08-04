import { Command } from "./Command";

export class GroupCommand extends Command {
  private _commands: Command[];

  constructor() {
    super();

    this._commands = [];
  }

  add(value: Command) {
    this._commands.push(value);
  }
  execute() {
    this._commands.forEach(command => {command.execute(); console.log('redo', command);});
  }

  undo() {
    this._commands.slice().reverse().forEach(command => {command.undo(); console.log('undo', command);});
  }
}