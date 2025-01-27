/**
 * @file range.ts
 * @description 提供生成数字范围的工具函数
 */

/**
 * 创建一个数字范围对象
 * @param start 起始数字（包含）
 * @param end 结束数字（包含）
 * @returns 包含范围信息和实现方法的对象
 *          - start: 起始数字
 *          - end: 结束数字
 *          - realize: 生成实际的数字数组的方法
 */
export function range(start: number, end: number) {
  return {
    start,
    end,
    realize: () => Array.from({ length: end - start + 1 }, (_, i) => start + i),
  };
}
