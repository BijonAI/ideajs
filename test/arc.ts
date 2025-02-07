import * as idea from "../src";

// 创建画布
const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

const coord = idea.plane(1000, 800).grid(50).axes("#ff0000").ticks(50);
// const coord = idea.axes().ticks(50);

// 创建圆弧
// 创建圆弧
const arc = idea
  .arc(1, 1, 1)
  .setUnit(50)
  .from(0)
  .to(360)
  .info()
  // .transform({ origin: [50, 50] })
  // .transform({ scale: 0.5 })
  // .transform({ skew: [10, 20] })
  // .transform({ rotate: 180 })
  // .transform({ translate: [-50, -50] })
  .animation({
    duration: 5000,
    delay: 2000,
    easing: "ease-in-out",
    properties: {
      "stroke-width": { from: 1, to: 4 },
      "stroke-opacity": { from: 0.5, to: 1 },
      "fill-opacity": { from: 0.2, to: 0.6 },
      x1: { from: -3, to: 2 },
      y1: { from: -3, to: 2 },
      r: { from: 1, to: 1.5 },
      // startAngle: { from: 0, to: 180 },
      endAngle: { from: 0, to: 360 },
    },
    onStart: () => console.log("Animation started"),
    onEnd: () => console.log("Animation completed"),
  })
  
// 绘制向量
coord.add(arc);
canvas.add(coord);
