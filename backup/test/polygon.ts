import * as idea from "../src";

// 创建画布
const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

const coord = idea.plane(1000, 800).grid(25).axes().ticks(50);
// const coord = idea.grid(25);

// 创建向量
const polygon = idea
  .polygon([
    {
      x: 1,
      y: 1,
    },
    {
      x: 2,
      y: 2,
    },
    { x: 2, y: 3 },
  ])
  .setUnit(50)
  .animation({
    duration: 5000,
    delay: 1000,
    properties: {
      // 样式属性动画
      fill: { from: "#FFFF00", to: "#00FF00" },
      stroke: { from: "#FF0000", to: "#00FF00" },
      opacity: { from: "1", to: "0.5" },

      // 顶点位置动画
      x1: { from: -1, to: 2 },
      y1: { from: -1, to: 3 },
      x2: { from: 0, to: 2 },
      y2: { from: 0, to: 2 },
      x3: { from: 2, to: 3 },
      y3: { from: 2, to: 3 },
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
