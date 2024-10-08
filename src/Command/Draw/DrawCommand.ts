import Konva from "konva";
import { Command } from "../Command";

export class DrawCommand<T extends Konva.Shape> extends Command {
  private _layer: Konva.Layer;
  private _shape: T;

  constructor(layer: Konva.Layer, shape: T) {
    super();

    this._layer = layer;
    this._shape = shape;
  }

  undo() {
    this._shape.remove();
    console.log(this._layer.getChildren());
    this._layer.batchDraw();
  }

  execute() {
    this._layer.add(this._shape);
    console.log(this._layer.getChildren());
    this._layer.batchDraw();
  }
}
