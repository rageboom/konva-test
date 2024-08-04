import Konva from "konva";
import { ArrangeCommand } from "./ArrangeCommand";

export class SendBackwardCommand extends ArrangeCommand {
  constructor(target: Konva.Layer | Konva.Shape) {
    super(target);
  }

  undo(): void {
    this.target.setZIndex(this.originalIndex);
  }
  execute(): void {
    this.target.moveDown();
  }
}