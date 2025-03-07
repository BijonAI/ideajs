import * as idea from "../src";

// 创建画布
const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

const coord = idea.plane(1000, 800).grid(50).axes().ticks(50);

const equations = ["x^2 + y^2 = 1"];

equations.forEach((eq, i) => {
  const latex = idea
    .text(1, 2 + i * 1, 300, 80, eq, true)
    .setUnit(50)
    .style({
      fontSize: 20,
      textColor: "#2196f3",
      backgroundColor: "#f0f0f0",
      padding: 8,
      borderRadius: 4,
    })
    .draggable();

  coord.add(latex);
});

canvas.add(coord);

canvas.viewBox(0, 0, 1000, 800);
canvas.zoom(1);
