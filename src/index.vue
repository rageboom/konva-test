<template>
  <div id="canvas"></div>
  <div>
    <button @click="selectEraserStrategy">삭제</button>
    <button @click="selectMaskingStrategy">그리기</button>
    <button @click="redo">다시 돌리기</button>
    <button @click="undo">되돌리기</button>
    <button @click="topLayerUp">상의 레이어</button>
    <button @click="bottomLayerUp">하의 레이어</button>
  </div>
</template>

<script lang="ts" setup>
import Konva from "konva";
import { onMounted, ref } from "vue";
import {
  LineStrategy,
  ShapeContext,
  EraserStrategy,
  MaskingStrategy,
} from "./ShapeStrategy";
import { CommandManager } from "./Command/CommandManager";
import { DrawCommand } from "./Command/Draw/DrawCommand";
import { MaskingCanvas } from "./MaskingCanvas";
import { BringToFrontCommand } from "./Command/Arrange/BringToFrontCommand";

const size = window.innerWidth;
const canvas = ref<MaskingCanvas>();
const currentLayer = ref<Konva.Layer>();
const shapeContext = ref(new ShapeContext(new LineStrategy()));
const commandManager = new CommandManager();

const createMaskPattern = (
  color: string,
  size: number
): Promise<HTMLImageElement> => {
  const canvasElement = document.createElement("canvas");
  const context = canvasElement.getContext("2d");
  const angle = (Math.PI / 180) * 45;
  const spacing = 8;

  canvasElement.width = size;
  canvasElement.height = size;

  if (context) {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    for (let i = -size; i < size; i += spacing) {
      context.beginPath();
      context.moveTo(i * Math.tan(angle), size);
      context.lineTo(i * Math.tan(angle) + size, 0);
      context.lineWidth = 2.5;
      context.strokeStyle = color;
      context.stroke();
    }
  }

  return new Promise((resolve) => {
    const imageElement = new Image();
    imageElement.src = canvasElement.toDataURL("image/png");
    imageElement.onload = () => resolve(imageElement);
  });
};

onMounted(async () => {
  const topPattern = await createMaskPattern("red", window.innerWidth);
  const bottomPattern = await createMaskPattern("blue", window.innerWidth);
  const instance = new MaskingCanvas(
    "canvas",
    window.innerWidth,
    window.innerHeight
  );
  const stage = instance.stage;

  instance
    .setImagePattern("topMask", topPattern)
    .setImagePattern("bottomMask", bottomPattern);

  canvas.value = instance;
  const topMaskLayer = instance.createLayer("topMask");
  const bottomMaskLayer = instance.createLayer("bottomMask");
  currentLayer.value = bottomMaskLayer;
  const topMaskRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fillPatternImage: instance.getImagePattern("topMask") as HTMLImageElement,
    globalCompositeOperation: "source-in",
    shadowForStrokeEnabled: false,
    listening: false,
  });
  const bottomMaskRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fillPatternImage: instance.getImagePattern(
      "bottomMask"
    ) as HTMLImageElement,
    globalCompositeOperation: "source-in",
    shadowForStrokeEnabled: false,
    listening: false,
  });

  let isDrawing = false;
  let currentShape: Konva.Shape | null = null;

  stage.on("mousedown", () => {
    isDrawing = true;
    const pos = stage.getPointerPosition();
    if (pos) {
      if (currentLayer.value) {
        currentShape = shapeContext.value.createShape(pos);
        currentLayer.value.add(currentShape);
        currentLayer.value?.batchDraw();
        currentShape.moveDown();
      }
    }
  });

  stage.on("mousemove", () => {
    if (!isDrawing || !currentShape) return;

    const pos = stage.getPointerPosition();
    if (pos && currentShape instanceof Konva.Line) {
      const newPoints = (currentShape as Konva.Line)
        .points()
        .concat([pos.x, pos.y]);
      (currentShape as Konva.Line).points(newPoints);
      currentLayer.value?.batchDraw();
    }
  });

  stage.on("mouseup", () => {
    if (!isDrawing || !currentShape) return;
    isDrawing = false;
    if (currentLayer.value) {
      commandManager.executeCommand(
        new DrawCommand<Konva.Shape>(currentLayer.value, currentShape)
      );
    }
    currentShape = null;
  });

  bottomMaskLayer.add(bottomMaskRect);
  topMaskLayer.add(topMaskRect);
  stage.add(bottomMaskLayer);
  stage.add(topMaskLayer);
});

const bottomLayerUp = () => {
  const layer = canvas.value?.getLayer("bottomMask");
  if (layer && currentLayer.value !== layer) {
    const command = new BringToFrontCommand(layer);
    command.execute();
    commandManager.executeCommand(command);
    currentLayer.value = layer;
  }
};
const topLayerUp = () => {
  const layer = canvas.value?.getLayer("topMask");
  if (layer && currentLayer.value !== layer) {
    const command = new BringToFrontCommand(layer);
    command.execute();
    commandManager.executeCommand(command);
    currentLayer.value = layer;
  }
};
const selectMaskingStrategy = () => {
  shapeContext.value.setStrategy(new MaskingStrategy());
};
const selectEraserStrategy = () => {
  shapeContext.value.setStrategy(new EraserStrategy());
};
const redo = () => {
  commandManager.redo();
};
const undo = () => {
  commandManager.undo();
};
</script>

<style lang="scss" scoped>

#canvas {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
