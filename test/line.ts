import * as idea from "../src";

// 创建画布
const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

// const coord = idea.plane().grid(25).axes().ticks(50);
const coord = idea.axes().grid(25).ticks(50);

// const coord = idea
//   .coordinate(1000, 800)
//   .origin(500, 400)
//   .unit(50)
//   .grid(50)
//   .labels(50)
//   .draggable();

// 创建线段
const line = idea
  .line(1, 1, 2, 2)
  // .from(50, 50)
  // .to(2, 2)
  .setUnit(50)
  // .stroke("#FF0000")
  // .style({
  //   pointSize: 10,
  //   pointColor: "#FFFF00",
  //   pointOpacity: 0.5,
  //   pointFill: "#FFFF00",
  //   pointStroke: "#FFFF00",
  //   pointStrokeWidth: 1,
  // })
  // .transform({ origin: [50, 50] })
  // .transform({ scale: 0.5 })
  // .transform({ skew: [10, 20] })
  // .transform({ rotate: 180 })
  // .transform({ translate: [-50, -50] })
  // .animation({
  //   duration: 5000,
  //   properties: {
  //     x1: { from: 800, to: 200 },
  //     y1: { from: 100, to: 200 },
  //     x2: { from: 100, to: 200 },
  //     y2: { from: 200, to: 300 },
  //   },
  //   easing: "power2.inOut",
  // })
  // // .tooltip("向量<br>from (100, 100) to (100, 200)", {
  // //     position: 'top',
  // //     className: 'tooltip',
  // //     style: {
  // //         'color': 'black',
  // //         'padding': '0.5em'
  // //     },
  // // })
  // .annotate("线段A")
  // // .trace("FF0000")
  .draggable();

// 绘制向量
coord.add(line);
canvas.add(coord);
