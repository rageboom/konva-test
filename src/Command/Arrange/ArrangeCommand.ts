import Konva from "konva";
import { Command } from "../Command";

export class ArrangeCommand extends Command {
  private _target:  Konva.Layer | Konva.Shape;
  private _originalIndex: number;

  constructor(target: Konva.Layer | Konva.Shape) {
    super();

    this._target = target;
    this._originalIndex = target.getZIndex();
  }

  get target () {
    return this._target;
  }
  get originalIndex () {
    return this._originalIndex
  }
  set originalIndex (value: number) {
    this._originalIndex = value;
  }

  execute() {}

  undo() {}
}
