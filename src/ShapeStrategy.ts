import Konva from "konva";
export interface ShapeStrategy {
  createShape(pos: { x: number; y: number }): Konva.Shape;
}

export class LineStrategy implements ShapeStrategy {
  createShape(pos: { x: number; y: number }): Konva.Shape {
    return new Konva.Line({
      stroke: "black",
      strokeWidth: 5,
      points: [pos.x, pos.y],
      lineCap: "round",
      lineJoin: "round",
    });
  }
}
export class MaskingStrategy implements ShapeStrategy {
  createShape(pos: { x: number; y: number }): Konva.Shape {
    return new Konva.Line({
      stroke: "black",
      strokeWidth: 30,
      points: [pos.x, pos.y],
      lineCap: "round",
      lineJoin: "round",
    });
  }
}
export class EraserStrategy implements ShapeStrategy {
  createShape(pos: { x: number; y: number }): Konva.Shape {
    return new Konva.Line({
      stroke: "#ffffff",
      strokeWidth: 30,
      points: [pos.x, pos.y],
      lineCap: "round",
      lineJoin: "round",
      globalCompositeOperation: "destination-out",
    });
  }
}
export class CircleStrategy implements ShapeStrategy {
  createShape(pos: { x: number; y: number }): Konva.Shape {
    return new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: 30,
      fill: "red",
      stroke: "black",
      strokeWidth: 2,
    });
  }
}
export class RectStrategy implements ShapeStrategy {
  createShape(pos: { x: number; y: number }): Konva.Shape {
    return new Konva.Rect({
      x: pos.x,
      y: pos.y,
      width: 60,
      height: 40,
      fill: "blue",
      stroke: "black",
      strokeWidth: 2,
    });
  }
}

export class ShapeContext {
  private strategy: ShapeStrategy;

  constructor(strategy: ShapeStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ShapeStrategy) {
    this.strategy = strategy;
  }

  createShape(pos: { x: number; y: number }): Konva.Shape {
    return this.strategy.createShape(pos);
  }
}
