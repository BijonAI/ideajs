/**
 * @file parametric.ts
 * @description 参数方程曲线的实现，提供了丰富的曲线操作和动画功能
 */

import { getTheme } from "../theme";
import { Parametric, ParametricStyle } from "../interfaces/geometry";
import {
  Transform,
  Animation,
  TooltipOptions,
  EffectOptions,
  TeachingOptions,
  AnimationStep,
} from "../interfaces/common";
import { gsap } from "gsap";

/**
 * 创建参数方程曲线
 * @param fn 参数方程函数，接收参数t，返回[x,y]坐标
 * @param range 参数t的范围，默认为[0,1]
 * @returns 参数曲线对象，包含多种操作方法：
 *   - domain: 设置参数范围
 *   - animate: 设置动画效果
 *   - animateDrawing: 设置绘制动画
 *   - discontinuity: 设置不连续点
 *   - derivative: 计算导数曲线
 *   - integral: 计算积分曲线
 *   - intersection: 计算与其他曲线的交点
 *   - extrema: 计算极值点
 *   - asymptotes: 计算渐近线
 *   - highlight: 高亮显示
 *   - label: 添加标签
 *   - bind: 绑定点到曲线
 *   - update: 更新曲线函数
 */
export function parametric(
  fn: (t: number) => [number, number],
  range: [number, number] = [0, 1],
): Parametric & {
  domain(min: number, max: number): Parametric;
  animate(options: Animation): Parametric;
  animateDrawing(duration?: number): Parametric;
  discontinuity(points: number[]): Parametric;
  derivative(): Parametric;
  integral(from?: number): Parametric;
  intersection(other: Parametric): { x: number; y: number }[];
  extrema(): { x: number; y: number }[];
  asymptotes(): { horizontal?: number[]; vertical?: number[] };
  highlight(duration?: number): Parametric;
  label(text: string): Parametric;
  bind(
    node: ReturnType<typeof import("../geometry/dot").dot>,
    t: number,
  ): Parametric;
  update(
    newFn: (t: number) => [number, number],
    newRange?: [number, number],
  ): Parametric;
} {
  // 创建SVG路径元素
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");

  // 曲线变换参数
  let scaleX = 1; // X轴缩放比例
  let scaleY = 1; // Y轴缩放比例
  let offsetX = 0; // X轴偏移量
  let offsetY = 0; // Y轴偏移量
  let samples = 200; // 采样点数量
  let [tMin, tMax] = range; // 参数范围
  let currentFn = fn; // 当前参数方程函数
  let unit = 1; // 单位长度
  let discontinuityPoints: number[] = []; // 不连续点列表

  // 应用主题样式
  const theme = getTheme();
  path.setAttribute("stroke", theme.colors.primary);
  path.setAttribute("stroke-width", theme.sizes.function.toString());

  /**
   * 生成SVG路径数据
   * 根据当前参数和样式生成曲线的SVG路径
   */
  function generatePath() {
    const step = (tMax - tMin) / samples;
    const points: [number, number][] = [];
    let currentPath = "";

    // 遍历参数范围，计算每个点的位置
    for (let t = tMin; t <= tMax; t += step) {
      try {
        const [x, y] = currentFn(t);
        const scaledX = x * scaleX;
        const scaledY = -y * scaleY;

        // 处理有限值点
        if (isFinite(scaledX) && isFinite(scaledY)) {
          // 处理不连续点
          if (discontinuityPoints.some((p) => Math.abs(t - p) < step)) {
            if (points.length > 0) {
              currentPath += points.reduce(
                (acc, [x, y], i) =>
                  acc + `${i === 0 ? "M" : "L"} ${x + offsetX},${y + offsetY} `,
                "",
              );
              points.length = 0;
            }
          }
          points.push([scaledX, scaledY]);
        }
      } catch (e) {
        // 处理计算错误，可能是函数在某点未定义
        if (points.length > 0) {
          currentPath += points.reduce(
            (acc, [x, y], i) =>
              acc + `${i === 0 ? "M" : "L"} ${x + offsetX},${y + offsetY} `,
            "",
          );
          points.length = 0;
        }
        continue;
      }
    }

    // 处理剩余点
    if (points.length > 0) {
      currentPath += points.reduce(
        (acc, [x, y], i) =>
          acc + `${i === 0 ? "M" : "L"} ${x + offsetX},${y + offsetY} `,
        "",
      );
    }

    // 更新路径数据
    if (currentPath) {
      path.setAttribute("d", currentPath);
    }
  }

  // 返回对象，包含所有可用的操作方法
  const rtn = {
    // 基础操作
    node: () => path,
    stroke: (color?: string) => {
      path.setAttribute("stroke", color || theme.colors.primary);
      return rtn;
    },
    style: (options: ParametricStyle) => {
      if (options.color) path.setAttribute("stroke", options.color);
      if (options.width)
        path.setAttribute("stroke-width", options.width.toString());
      if (options.opacity)
        path.setAttribute("opacity", options.opacity.toString());
      if (options.dashArray)
        path.setAttribute("stroke-dasharray", options.dashArray);
      if (options.lineCap) path.setAttribute("stroke-linecap", options.lineCap);
      return rtn;
    },

    // 范围和采样设置
    range: (min: number, max: number) => {
      tMin = min;
      tMax = max;
      generatePath();
      return rtn;
    },
    domain: (min: number, max: number) => {
      tMin = min;
      tMax = max;
      generatePath();
      return rtn;
    },
    samples: (n: number) => {
      samples = n;
      generatePath();
      return rtn;
    },

    // 变换操作
    scale: (x: number, y: number = x) => {
      scaleX = x;
      scaleY = y;
      generatePath();
      return rtn;
    },
    offset: (x: number, y: number) => {
      offsetX = x;
      offsetY = y;
      generatePath();
      return rtn;
    },

    // 特殊点处理
    discontinuity: (points: number[]) => {
      discontinuityPoints = points;
      generatePath();
      return rtn;
    },

    // 数学运算
    derivative: () => {
      const h = (tMax - tMin) / 1000;
      return parametric(
        (t: number) => {
          const [x1, y1] = currentFn(t);
          const [x2, y2] = currentFn(t + h);
          return [(x2 - x1) / h, (y2 - y1) / h];
        },
        [tMin, tMax],
      )
        .scale(scaleX, scaleY)
        .offset(offsetX, offsetY)
        .samples(samples);
    },

    // 动画效果
    animate: (options: Animation) => {
      const animations: string[] = [];
      if (options.properties) {
        Object.entries(options.properties).forEach(([prop, { from, to }]) => {
          path.style.setProperty(prop, from);
          animations.push(
            `${prop} ${options.duration || 300}ms ${options.easing || "ease"}`,
          );
          setTimeout(() => path.style.setProperty(prop, to), 0);
        });
      }
      path.style.transition = animations.join(", ");
      options.onStart?.();
      if (options.onEnd) {
        setTimeout(
          options.onEnd,
          (options.duration || 300) + (options.delay || 0),
        );
      }
      return rtn;
    },

    animateDrawing: (duration: number = 1000) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length.toString();
      path.style.strokeDashoffset = length.toString();
      path.style.transition = `stroke-dashoffset ${duration}ms linear`;
      setTimeout(() => (path.style.strokeDashoffset = "0"), 0);
      return rtn;
    },

    // 积分计算
    integral: (from: number = tMin) => {
      const h = (tMax - tMin) / samples;
      let accumX = 0;
      let accumY = 0;

      return parametric(
        (t: number) => {
          if (t < from) return [0, 0];
          accumX = 0;
          accumY = 0;
          for (let i = from; i <= t; i += h) {
            const [x, y] = currentFn(i);
            accumX += x * h;
            accumY += y * h;
          }
          return [accumX, accumY];
        },
        [tMin, tMax],
      )
        .scale(scaleX, scaleY)
        .offset(offsetX, offsetY)
        .samples(samples);
    },

    // 交点计算
    intersection: (other: Parametric) => {
      const intersections: { x: number; y: number }[] = [];
      const threshold = 0.1 / unit;

      for (let t1 = tMin; t1 <= tMax; t1 += (tMax - tMin) / samples) {
        const [x1, y1] = currentFn(t1);
        const scaledX1 = x1 * scaleX * unit + offsetX;
        const scaledY1 = -y1 * scaleY * unit + offsetY;

        for (let t2 = tMin; t2 <= tMax; t2 += (tMax - tMin) / samples) {
          const otherPath = other.node();
          const otherD = otherPath.getAttribute("d");
          if (!otherD) continue;

          const points = otherD
            .split(/[ML]\s*/)
            .slice(1)
            .map((point) => {
              const [x, y] = point.trim().split(",").map(Number);
              return {
                x: (x - offsetX) / (scaleX * unit),
                y: -(y - offsetY) / (scaleY * unit),
              };
            });

          const x2 =
            points[Math.floor((t2 * points.length) / (tMax - tMin))].x *
              scaleX *
              unit +
            offsetX;
          const y2 =
            -points[Math.floor((t2 * points.length) / (tMax - tMin))].y *
              scaleY *
              unit +
            offsetY;

          if (
            Math.abs(scaledX1 - x2) < threshold &&
            Math.abs(scaledY1 - y2) < threshold
          ) {
            const found = intersections.some(
              (p) =>
                Math.abs(p.x - scaledX1) < threshold &&
                Math.abs(p.y - scaledY1) < threshold,
            );
            if (!found) {
              intersections.push({ x: scaledX1, y: scaledY1 });
            }
          }
        }
      }

      return intersections;
    },

    // 极值点计算
    extrema: () => {
      const h = (tMax - tMin) / 1000;
      const extremaPoints: { x: number; y: number }[] = [];

      for (let t = tMin + h; t <= tMax - h; t += h) {
        const [x0, y0] = currentFn(t - h);
        const [x1, y1] = currentFn(t);
        const [x2, y2] = currentFn(t + h);

        const dxPrev = (x1 - x0) / h;
        const dxNext = (x2 - x1) / h;
        const dyPrev = (y1 - y0) / h;
        const dyNext = (y2 - y1) / h;

        // 检测导数符号变化
        if (
          (dxPrev * dxNext <= 0 || dyPrev * dyNext <= 0) &&
          (Math.abs(dxPrev) > 1e-6 || Math.abs(dyPrev) > 1e-6)
        ) {
          const scaledX = x1 * scaleX * unit + offsetX;
          const scaledY = -y1 * scaleY * unit + offsetY;
          extremaPoints.push({ x: scaledX, y: scaledY });
        }
      }

      return extremaPoints;
    },

    // 渐近线计算
    asymptotes: () => {
      const asymptotes: { horizontal?: number[]; vertical?: number[] } = {
        horizontal: [],
        vertical: [],
      };

      const step = (tMax - tMin) / samples;
      let lastY = null;
      let lastX = null;
      const threshold = 1000;

      for (let t = tMin; t <= tMax; t += step) {
        try {
          const [x, y] = currentFn(t);

          if (lastY !== null && lastX !== null) {
            const dy = Math.abs(y - lastY);
            const dx = Math.abs(x - lastX);

            // 检测水平渐近线
            if (dy > threshold && !asymptotes.horizontal?.includes(lastY)) {
              asymptotes.horizontal?.push(lastY);
            }

            // 检测垂直渐近线
            if (dx > threshold && !asymptotes.vertical?.includes(lastX)) {
              asymptotes.vertical?.push(lastX);
            }
          }

          lastX = x;
          lastY = y;
        } catch (e) {
          // 函数不连续点可能是垂直渐近线
          if (lastX !== null && !asymptotes.vertical?.includes(lastX)) {
            asymptotes.vertical?.push(lastX);
          }
        }
      }

      return asymptotes;
    },

    // 高亮显示
    highlight: (duration: number = 1000) => {
      const originalColor = path.getAttribute("stroke");
      const originalWidth = path.getAttribute("stroke-width");
      const originalOpacity = path.getAttribute("opacity");

      path.setAttribute("stroke", theme.colors.secondary);
      path.setAttribute(
        "stroke-width",
        (parseFloat(originalWidth || "2") * 1.5).toString(),
      );
      path.setAttribute("opacity", "1");

      setTimeout(() => {
        path.setAttribute("stroke", originalColor || theme.colors.primary);
        path.setAttribute(
          "stroke-width",
          originalWidth || theme.sizes.function.toString(),
        );
        path.setAttribute("opacity", originalOpacity || "1");
      }, duration);

      return rtn;
    },

    // 添加标签
    label: (text: string) => {
      const textElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      const pathLength = path.getTotalLength();
      const point = path.getPointAtLength(pathLength / 2);

      textElement.setAttribute("x", point.x.toString());
      textElement.setAttribute("y", point.y.toString());
      textElement.setAttribute("fill", theme.colors.text);
      textElement.setAttribute("font-size", "12");
      textElement.setAttribute("text-anchor", "middle");
      textElement.setAttribute("dominant-baseline", "middle");
      textElement.textContent = text;

      const parent = path.parentNode;
      if (parent) {
        parent.appendChild(textElement);
      }

      return rtn;
    },

    // 绑定点到曲线
    bind: (
      node: ReturnType<typeof import("../geometry/dot").dot>,
      t: number,
    ) => {
      const [x, y] = currentFn(t);
      const scaledX = x * scaleX * unit + offsetX;
      const scaledY = -y * scaleY * unit + offsetY;
      node.node().setAttribute("cx", scaledX.toString());
      node.node().setAttribute("cy", scaledY.toString());
      return rtn;
    },

    // 更新曲线函数
    update: (
      newFn: (t: number) => [number, number],
      newRange?: [number, number],
    ) => {
      currentFn = newFn;
      if (newRange) {
        [tMin, tMax] = newRange;
      }
      generatePath();
      return rtn;
    },

    // 曲线变形动画
    morph: (target: any, duration: number = 1000) => {
      if (!target?.node()) return rtn;
      const targetPath = target.node();

      const currentD = path.getAttribute("d") || "";
      const targetD = targetPath.getAttribute("d") || "";

      if (currentD && targetD) {
        // 解析当前路径点
        const currentPoints = currentD
          .split(/[ML]\s*/)
          .slice(1)
          .map((point) => {
            const [x, y] = point.trim().split(",").map(Number);
            return { x: x / unit, y: y / unit };
          });

        // 解析目标路径点
        const targetPoints = targetD
          .split(/[ML]\s*/)
          .slice(1)
          .map((point) => {
            const [x, y] = point.trim().split(",").map(Number);
            return { x: x / unit, y: y / unit };
          });

        // 计算插值点
        const interpolatedPoints = currentPoints.map((currentPoint, i) => {
          const targetPoint =
            targetPoints[
              Math.floor((i * targetPoints.length) / currentPoints.length)
            ];
          return {
            x: currentPoint.x * unit,
            y: currentPoint.y * unit,
            targetX: (targetPoint?.x || currentPoint.x) * unit,
            targetY: (targetPoint?.y || currentPoint.y) * unit,
          };
        });

        // 使用GSAP执行动画
        gsap.to(interpolatedPoints, {
          duration: duration / 1000,
          x: "targetX",
          y: "targetY",
          ease: "power1.inOut",
          onUpdate: () => {
            const newD = interpolatedPoints.reduce((acc, point, i) => {
              return acc + `${i === 0 ? "M" : "L"} ${point.x},${point.y} `;
            }, "");
            path.setAttribute("d", newD);
          },
        });
      }

      return rtn;
    },
  };

  // 初始化路径
  generatePath();
  return rtn as any;
}
