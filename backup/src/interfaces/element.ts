/**
 * @file element.ts
 * @description 定义几何元素的位置信息接口
 */

/**
 * 基础元素接口
 * 所有几何元素都应该实现这个接口
 */
export interface BaseElement {
  type: string;        // 元素类型
  unit: number;        // 单位比例
}

/**
 * 点元素位置信息
 */
export interface DotElement extends BaseElement {
  type: 'dot';
  x: number;          // x 坐标
  y: number;          // y 坐标
}

/**
 * 线段元素位置信息
 */
export interface LineElement extends BaseElement {
  type: 'line';
  x1: number;         // 起点 x 坐标
  y1: number;         // 起点 y 坐标
  x2: number;         // 终点 x 坐标
  y2: number;         // 终点 y 坐标
}

/**
 * 圆弧元素位置信息
 */
export interface ArcElement extends BaseElement {
  type: 'arc';
  x: number;          // 圆心 x 坐标
  y: number;          // 圆心 y 坐标
  radius: number;     // 半径
  startAngle: number; // 起始角度
  endAngle: number;   // 结束角度
}

/**
 * 向量元素位置信息
 */
export interface VectorElement extends BaseElement {
  type: 'vector';
  x: number;          // 起点 x 坐标
  y: number;          // 起点 y 坐标
  dx: number;         // x 方向分量
  dy: number;         // y 方向分量
}

/**
 * 多边形元素位置信息
 */
export interface PolygonElement extends BaseElement {
  type: 'polygon';
  points: [number, number][]; // 顶点坐标数组 [x, y][]
}

/**
 * 参数曲线元素位置信息
 */
export interface ParametricElement extends BaseElement {
  type: 'parametric';
  function: string;   // 参数方程字符串表示
  range: [number, number]; // 参数范围 [tMin, tMax]
}