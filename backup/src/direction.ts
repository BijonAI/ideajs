/**
 * @file direction.ts
 * @description 定义方向相关的工具函数，提供基本的方向常量和类型
 */

/**
 * 创建一个表示左方向的唯一Symbol
 * @returns {Symbol} 代表左方向的Symbol
 */
export function left() {
  return Symbol("left");
}

/**
 * 创建一个表示右方向的唯一Symbol
 * @returns {Symbol} 代表右方向的Symbol
 */
export function right() {
  return Symbol("right");
}

/**
 * 创建一个表示上方向的唯一Symbol
 * @returns {Symbol} 代表上方向的Symbol
 */
export function up() {
  return Symbol("up");
}

/**
 * 创建一个表示下方向的唯一Symbol
 * @returns {Symbol} 代表下方向的Symbol
 */
export function down() {
  return Symbol("down");
}

/**
 * Direction类型定义，表示四个基本方向的联合类型
 */
export type Direction =
  | ReturnType<typeof left>
  | ReturnType<typeof right>
  | ReturnType<typeof up>
  | ReturnType<typeof down>;
