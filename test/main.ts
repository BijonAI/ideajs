import { field, coordinate, func, parametric } from '../src';

// 创建画布
const canvas = field(1600, 900);
const svg = canvas.node();
document.body.appendChild(svg);

// 设置背景色
canvas.background('#ffffff');

// 创建坐标系
const coord = coordinate(1600, 900)
  .unit(50)  // 先设置单位大小
  .grid(50)
  .ticks(50)
  .labels(50, 1);

// 创建正弦函数
const sinFunc = func(x => Math.sin(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .scale(50)
  .style({
    color: '#2196F3',
    width: 2,
    opacity: 1
  });

// 创建指数函数
const expFunc = func(x => Math.exp(x/2)/2, [-4, 4])  // 调整指数函数的范围和缩放
  .samples(500)
  .scale(50)
  .style({
    color: '#4CAF50',
    width: 2,
    opacity: 1
  });

// 创建正切函数
const tanFunc = func(x => Math.tan(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .scale(50)
  .style({
    color: '#f44336',  // 红色
    width: 2,
    opacity: 1
  });

// 创建参数方程曲线（圆）
const circle = parametric(
  t => Math.cos(t),
  t => Math.sin(t),
  [0, 2 * Math.PI]
)
  .samples(500)
  .scale(100)
  .style({
    color: '#9C27B0',
    width: 2,
    opacity: 1
  });

// 创建正态分布函数
const normalDistribution = func(
  x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI),
  [-4, 4]
)
  .samples(500)
  .scale(100)
  .style({
    color: '#FF9800',
    width: 2,
    opacity: 1
  });

// 添加所有函数到坐标系
coord.add(sinFunc);
coord.add(expFunc);
coord.add(tanFunc);
coord.add(circle);
coord.add(normalDistribution);

// 添加坐标系到画布
canvas.add(coord);