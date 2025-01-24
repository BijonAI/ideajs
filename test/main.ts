import * as idea from '../src'

// 创建画布
const canvas = idea.field(800, 600)
document.body.appendChild(canvas.node())

const vector = idea.vector(0, 0, 30, 40)
  .draggable()

// 创建坐标系
const coord = idea.coordinate(800, 600)
  .origin(400, 300)  // 设置原点在中心
  .unit(50)          // 设置单位长度
  .grid(50)          // 设置网格大小
  .ticks(50)         // 设置刻度间隔
  .labels(50)        // 设置标签间隔
  .draggable()       // 启用拖拽功能

// 创建线段
const line = idea.line(100, 100, 200, 200)
  .effect('glow', { color: 'pink', strength: 5, spread: 0 })
  .draggable()

const dot = idea.dot(-500, 500)
// 创建一个简单的圆
// const circle = idea.parametric(
//   t => [Math.cos(t), Math.sin(t)],
//   [0, 2 * Math.PI]
// )
//   .samples(100)
//   .style({
//     color: 'red',
//     width: 2,
//     opacity: 1
//   })
//   .scale(50)

// 创建一个心形曲线
// const heart = idea.parametric(
//   t => [16 * Math.pow(Math.sin(t), 3) / 16,
//   (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16],
//   [0, 2 * Math.PI]
// )
//   .samples(200)
//   .style({
//     color: 'pink',
//     width: 2,
//     opacity: 1
//   })
//   .scale(50)

// 创建一个蝴蝶曲线
// const butterfly = idea.parametric(
//   t => [Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5)),
//   Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5))],
//   [0, 12 * Math.PI]
// )
//   .samples(1000)
//   .style({
//     color: 'purple',
//     width: 2,
//     opacity: 1
//   })
//   .scale(25)

//使用polygon.ts绘制多边形
const polygon = idea.polygon([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }]).draggable()

// 添加到坐标系
coord.add(vector)
coord.add(line)
coord.add(polygon)
// coord.add(heart)
// coord.add(butterfly)
// coord.add(vector)
// coord.add(line)

// 添加坐标系到画布
canvas.add(coord)

// 添加动画效果
// circle.animateDrawing(1000)
// setTimeout(() => heart.animateDrawing(1000), 1000)
// setTimeout(() => butterfly.animateDrawing(2000), 2000)