import Konva from "konva";
import { LayerConfig } from "konva/lib/Layer";

export class CanvasBase {
  private _stages: Konva.Stage;
  private _layers!: Map<string, Konva.Layer>;
  private _drag: boolean;

  constructor(
    canvas: string,
    width: number,
    height: number,
    options?: Konva.StageConfig
  ) {
    this._stages = new Konva.Stage({
      container: canvas,
      width,
      height,
      ...options,
    });
    this._drag = false;
    this._layers = new Map();
  }

  public createLayer(name: string, options?: LayerConfig) {
    const layer = new Konva.Layer(options);
    if (!this._layers.has(name)) {
      this._layers.set(name, layer);
      return layer;
    } else {
      throw `Layer [${name}] is already created.`;
    }
  }

  getLayer(name: string) {
    if (this._layers.has(name)) {
      return this._layers.get(name);
    } else {
      throw `There is no layer [${name}]`;
    }
  }

  get stage() {
    return this._stages;
  }

  get drag() {
    return this._drag;
  }
  set drag(value: boolean) {
    this._drag = value;
  }
}
