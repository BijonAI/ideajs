/**
 * @file geometry.ts
 * @description 定义几何图形相关的接口，包括点、线、多边形、弧线等基本图形元素
 */

import { Renderable } from '../field';
import { CommonMethods, CommonStyle } from './common';

/**
 * 点样式接口，继承自CommonStyle
 */
export interface DotStyle extends CommonStyle {
  radius?: number;           // 点的半径
  strokeWidth?: number;      // 描边宽度
  strokeColor?: string;      // 描边颜色
  strokeOpacity?: number;    // 描边透明度
  strokeDasharray?: string;  // 描边虚线样式
  fillColor?: string;        // 填充颜色
  fillOpacity?: number;      // 填充透明度
}

/**
 * 线条样式接口，继承自CommonStyle
 */
export interface LineStyle extends CommonStyle {
  strokeWidth?: number;      // 线条宽度
  strokeColor?: string;      // 线条颜色
  strokeOpacity?: number;    // 线条透明度
  strokeDasharray?: string;  // 虚线样式
  lineCap?: 'butt' | 'round' | 'square';    // 线条端点样式
  lineJoin?: 'miter' | 'round' | 'bevel';   // 线条连接点样式
}

/**
 * 标记选项接口，定义线条端点的标记样式
 */
export interface MarkerOptions {
  start?: 'arrow' | 'dot' | 'square' | SVGElement;  // 起点标记
  end?: 'arrow' | 'dot' | 'square' | SVGElement;    // 终点标记
  size?: number;        // 标记大小
  color?: string;       // 标记颜色
}

/**
 * 渐变停止点接口
 */
export interface GradientStop {
  offset: number;       // 渐变位置（0-1）
  color: string;        // 渐变颜色
  opacity?: number;     // 渐变透明度
}

/**
 * 点对象接口，继承CommonMethods
 */
export interface Dot extends CommonMethods<Dot> {
  node(): SVGElement;                               // 获取SVG节点
  resize(radius: number): Dot;                      // 调整点大小
  stroke(color?: string): Dot;                      // 设置描边颜色
  fill(color?: string): Dot;                        // 设置填充颜色
  border(width: number): Dot;                       // 设置边框宽度
  style(options: DotStyle): Dot;                    // 设置样式
  focus(color: string): Dot;                        // 设置焦点状态
  select(color: string): Dot;                       // 设置选中状态
  onFocus(callback: () => void): Dot;              // 焦点事件回调
  onSelect(callback: () => void): Dot;             // 选中事件回调
  draggable(condition?: (x: number, y: number) => boolean): Dot;  // 设置可拖动
  onDrag(callback: (x: number, y: number) => void): Dot;         // 拖动事件回调
  connect(target: Renderable, options?: {           // 连接到目标对象
    elastic?: boolean,                              // 是否弹性连接
    distance?: number,                              // 连接距离
    strength?: number                               // 连接强度
  }): Dot;
}

/**
 * 线条对象接口，继承CommonMethods
 */
export interface Line extends CommonMethods<Line> {
  node(): SVGElement;                               // 获取SVG节点
  from(x1: number, y1: number): Line;               // 设置起点
  to(x2: number, y2: number): Line;                 // 设置终点
  stroke(color?: string): Line;                     // 设置线条颜色
  style(options: LineStyle): Line;                  // 设置样式
  length(): number;                                 // 获取线条长度
  angle(): number;                                  // 获取线条角度
  midpoint(): { x: number, y: number };            // 获取中点坐标
  parallel(distance: number): Line;                 // 创建平行线
  perpendicular(point: { x: number, y: number }): Line;  // 创建垂线
  extend(start?: number, end?: number): Line;       // 延长线条
  trim(start?: number, end?: number): Line;         // 裁剪线条
  dash(...pattern: number[]): Line;                 // 设置虚线样式
  marker(options?: MarkerOptions): Line;            // 设置端点标记
  gradient(stops: GradientStop[]): Line;            // 设置渐变
  measure(options?: {                               // 测量线条
    showLength?: boolean,                           // 显示长度
    showAngle?: boolean,                            // 显示角度
    unit?: string                                   // 单位
  }): Line;
  animateDrawing(duration?: number): Line;          // 绘制动画
  constrain(options: {                              // 约束条件
    minLength?: number,                             // 最小长度
    maxLength?: number,                             // 最大长度
    angle?: number,                                 // 固定角度
    parallel?: Line                                 // 平行于指定线
  }): Line;
  draggable(condition?: (x: number, y: number) => boolean): Line;  // 设置可拖动
  connect(target: Renderable, options?: {           // 连接到目标对象
    elastic?: boolean,                              // 是否弹性连接
    distance?: number,                              // 连接距离
    strength?: number                               // 连接强度
  }): Line;
}

/**
 * 多边形对象接口，继承CommonMethods
 */
export interface Polygon extends CommonMethods<Polygon> {
  node(): SVGElement;                               // 获取SVG节点
  points: { x: number, y: number }[];               // 顶点数组
  setPoints(points: { x: number, y: number }[]): Polygon;  // 设置所有顶点
  setPoint(index: number, point: { x: number, y: number }): Polygon;  // 设置单个顶点
  insertBefore(index: number, point: { x: number, y: number }): Polygon;  // 在指定位置前插入顶点
  insertAfter(index: number, point: { x: number, y: number }): Polygon;   // 在指定位置后插入顶点
  removePoint(index: number): Polygon;              // 移除顶点
  stroke(color?: string): Polygon;                  // 设置描边颜色
  fill(color?: string): Polygon;                    // 设置填充颜色
  style(options: PolygonStyle): Polygon;            // 设置样式
}

/**
 * 弧线对象接口，继承CommonMethods
 */
export interface Arc extends CommonMethods<Arc> {
  animateDrawing(arg0: number): import("..").Renderable;  // 绘制动画
  node(): SVGElement;                               // 获取SVG节点
  from(angle: number): Arc;                         // 设置起始角度
  to(angle: number): Arc;                           // 设置结束角度
  stroke(color?: string): Arc;                      // 设置描边颜色
  fill(color?: string): Arc;                        // 设置填充颜色
}

/**
 * 向量对象接口，继承CommonMethods
 */
export interface Vector extends CommonMethods<Vector> {
  node(): SVGElement;                               // 获取SVG节点
  from(x1: number, y1: number): Vector;             // 设置起点
  to(x2: number, y2: number): Vector;               // 设置终点
  stroke(color?: string): Vector;                   // 设置颜色
  scale(x: number, y?: number): Vector;             // 缩放向量
}

/**
 * 函数图像对象接口，继承CommonMethods
 */
export interface Function extends CommonMethods<Function> {
  node(): SVGElement;                               // 获取SVG节点
  stroke(color?: string): Function;                 // 设置颜色
  style(options: FunctionStyle): Function;          // 设置样式
  derivative(): Function;                           // 获取导数
  integral(from?: number): Function;                // 获取积分
}

/**
 * 函数图像样式接口，继承CommonStyle
 */
export interface FunctionStyle extends CommonStyle {
  color?: string;        // 曲线颜色
  width?: number;        // 曲线宽度
  opacity?: number;      // 透明度
  dashArray?: string;    // 虚线样式
  lineCap?: string;      // 线条端点样式
}

/**
 * 多边形样式接口，继承CommonStyle
 */
export interface PolygonStyle extends CommonStyle {
  strokeWidth?: number;      // 描边宽度
  strokeColor?: string;      // 描边颜色
  strokeOpacity?: number;    // 描边透明度
  strokeDasharray?: string;  // 描边虚线样式
  fillColor?: string;        // 填充颜色
  fillOpacity?: number;      // 填充透明度
  lineJoin?: 'miter' | 'round' | 'bevel';  // 顶点连接样式
}

/**
 * 参数曲线样式接口，继承CommonStyle
 */
export interface ParametricStyle extends CommonStyle {
  color?: string;        // 曲线颜色
  width?: number;        // 曲线宽度
  opacity?: number;      // 透明度
  dashArray?: string;    // 虚线样式
  lineCap?: 'butt' | 'round' | 'square';  // 线条端点样式
}

/**
 * 参数曲线对象接口，继承CommonMethods
 */
export interface Parametric extends CommonMethods<Parametric> {
  node(): SVGPathElement;                          // 获取SVG路径节点
  stroke(color?: string): Parametric;              // 设置颜色
  style(options: ParametricStyle): Parametric;     // 设置样式
  range(min: number, max: number): Parametric;     // 设置参数范围
  samples(n: number): Parametric;                  // 设置采样点数
  scale(x: number, y?: number): Parametric;        // 缩放曲线
  offset(x: number, y: number): Parametric;        // 平移曲线
  update(fn: (t: number) => [number, number], range?: [number, number]): Parametric;  // 更新参数方程
  animateDrawing(duration?: number): Parametric;   // 绘制动画
}