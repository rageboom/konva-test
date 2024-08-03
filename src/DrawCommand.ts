import Konva from "konva";
import { Command } from "./Command";

export class DrawCommand<T extends Konva.Shape> extends Command {
  private _layer: Konva.Layer;
  private _shape: T;

  constructor(layer: Konva.Layer, shape: T) {
    super();

    this._layer = layer;
    this._shape = shape;
  }

  execute() {
    this._layer.add(this._shape);
    this._layer.batchDraw();
  }

  undo() {
    this._shape.remove();
    this._layer.batchDraw();
  }
}
