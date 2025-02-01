import * as idea from "../src";

// 创建画布
const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

// const coord = idea.plane().grid(25).axes().ticks(50);
const coord = idea.grid(25);

// 创建向量
const polygon = idea
  .polygon([
    {
      x: 100,
      y: 100,
    },
    {
      x: 200,
      y: 200,
    },
    { x: 200, y: 300 },
  ])
  // 先设置初始点位置
  .setPoints([
    { x: -100, y: -100 },
    { x: 0, y: 0 },
    { x: 200, y: 200 },
  ])
  .animation({
    duration: 5000,
    delay: 1000,
    properties: {
      // 样式属性动画
      fill: { from: "#FFFF00", to: "#00FF00" },
      stroke: { from: "#FF0000", to: "#00FF00" },
      opacity: { from: "1", to: "0.5" },

      // 顶点位置动画
      x1: { from: -100, to: 200 },
      y1: { from: -100, to: 300 },
      x2: { from: 0, to: 200 },
      y2: { from: 0, to: 200 },
      x3: { from: 200, to: 300 },
      y3: { from: 200, to: 300 },
    },
    onStart: () => {
      console.log("Animation started");
    },
    onEnd: () => {
      console.log("Animation completed");
    },
  })
  .draggable();

// 绘制向量
coord.add(polygon);
canvas.add(coord);
