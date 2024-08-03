import Konva from "konva";
import { CanvasBase } from "./CanvasBase";

export class MaskingCanvas extends CanvasBase {
  private _pattern: Map<string, HTMLImageElement> = new Map();
  constructor(
    canvasId: string,
    width: number,
    height: number,
    options?: Konva.StageConfig
  ) {
    super(canvasId, width, height, options);
  }

  setImagePattern(key: string, value: HTMLImageElement) {
    this._pattern.set(key, value);
    return this;
  }
  getImagePattern(key: string) {
    if (this._pattern.has(key)) {
      return this._pattern.get(key);
    }
    return null;
  }
}
