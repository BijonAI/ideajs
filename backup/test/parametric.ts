import * as idea from "../src";

const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

const coord = idea.plane(1000, 800).grid(50).axes("#ff0000").ticks(50);
const parametric = idea
  .parametric(
    (t: number) => [2 * Math.cos(t), 2 * Math.sin(t)],
    [-Math.PI, Math.PI],
  )
  .setUnit(50)
  .draggable();

const scaleMatrix = [
  [2, 0, 0],
  [0, 0.5, 0],
  [0, 0, 1],
] as [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

const line = parametric.derivative(Math.PI / 2, 10).draggable();
coord.add(line);
const ellipse = parametric
  .matrix(scaleMatrix)
  .showRiemannRectangles(50)
  .draggable();
coord.add(ellipse);
coord.add(parametric);
canvas.add(coord);
