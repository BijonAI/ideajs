/**
 * @file parametric.ts
 * @description 参数方程曲线的实现，提供了丰富的曲线操作和动画功能
 */

// TODO: 增加微积分相关功能，如微分、积分、等
// TODO: 增加移动拉伸功能
// TODO: 增加微分图像功能
// TODO: 增加所有类的选中功能
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
import { draggable } from "../utils/draggable";

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
  setUnit(unit: number): Parametric;
  info(): Parametric;
  domain(min: number, max: number): Parametric;
  animate(options: Animation): Parametric;
  animation(options: Animation): Parametric;
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
  draggable(): Parametric;
  morph(target: any, duration: number): Parametric;
  riemannSum(n: number, method?: 'left' | 'right' | 'midpoint'): Parametric;
  showRiemannRectangles(n: number, method?: 'left' | 'right' | 'midpoint'): Parametric;
} {
  // 创建SVG路径元素
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("range", range.join(","));
  
  // 创建控制点元素（用于拖拽）
  const controlPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  controlPoint.setAttribute("r", "4");
  controlPoint.setAttribute("fill", "#1a73e8");
  controlPoint.style.cursor = "move";

  // 设置控制点的初始位置在曲线中间
  const midT = (range[0] + range[1]) / 2;
  const [midX, midY] = fn(midT);
  controlPoint.setAttribute("cx", midX.toString());
  controlPoint.setAttribute("cy", midY.toString());

  // 设置微分间隔
  let divisions = 100;
  path.setAttribute("divisions", divisions.toString());
  
  // 创建SVG组元素
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.appendChild(path);
  group.appendChild(controlPoint);

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
  let t0 = 0; // 参数偏移量，用于平移

  // 应用主题样式
  const theme = getTheme();
  path.setAttribute("stroke", theme.colors.primary);
  path.setAttribute("stroke-width", theme.sizes.function.toString());
  let isDragging = false; 


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
        const [x, y] = currentFn(t + t0);
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
    node: () => group,
    setUnit: (_unit: number) => {
      unit = _unit;
      currentFn = (t: number) => {
        const [x, y] = fn(t);
        return [x * unit, y * unit];
      };
      const midT = (range[0] + range[1])/ 2;
      const [midX, midY] = fn(midT);
      controlPoint.setAttribute("cx", (midX*unit).toString());
      controlPoint.setAttribute("cy", (-midY*unit).toString());
      generatePath();
      return rtn;
    },
    info: () => {
      // 添加长按事件处理
      let longPressTimer: number | null = null;
      let infoData = {
        type: "parametric",
        function: fn.toString(),
        range,
      };

      const handlePointerDown = () => {
        longPressTimer = window.setTimeout(() => {
          console.log("Parametric Info:", infoData);
        }, 500);
      };

      const handlePointerUp = () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      };

      const handlePointerLeave = () => {
        handlePointerUp();
      };

      group.addEventListener("pointerdown", handlePointerDown);
      group.addEventListener("pointerup", handlePointerUp);
      group.addEventListener("pointerleave", handlePointerLeave);
      console.log("Parametric Info:", infoData);
      return rtn;
    },
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
      let lastY: number | null = null;
      let lastX: number | null = null;
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
          .map((point: { trim: () => string }) => {
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
    animation: (options: Animation) => {
      const animations: string[] = [];
      const styleProperties = new Set([
        "fill",
        "stroke",
        "stroke-width",
        "opacity",
        "stroke-opacity",
        "fill-opacity",
      ]);

      const delay = options.delay || 0;
      const duration = options.duration || 300;

      // 分离样式属性和位置属性
      const styleAnimations: { [key: string]: { from: string; to: string } } = {};

      if (options.properties) {
        Object.entries(options.properties).forEach(([prop, { from, to }]) => {
          if (styleProperties.has(prop)) {
            const currentValue = path.style.getPropertyValue(prop) || path.getAttribute(prop) || "";
            styleAnimations[prop] = {
              from: from !== undefined ? from : currentValue,
              to,
            };
            // 移除延迟，让所有动画同步开始
            animations.push(`${prop} ${duration}ms ${options.easing || "ease"}`);
          }
        });
      }

      // 处理样式过渡
      if (Object.keys(styleAnimations).length > 0) {
        // 设置初始值
        Object.entries(styleAnimations).forEach(([prop, { from }]) => {
          path.style.setProperty(prop, from);
          controlPoint.style.setProperty(prop, from);
        });

        // 等待延迟后再开始所有动画
        setTimeout(() => {
          path.style.transition = animations.join(", ");
          controlPoint.style.transition = animations.join(", ");

          requestAnimationFrame(() => {
            Object.entries(styleAnimations).forEach(([prop, { to }]) => {
              path.style.setProperty(prop, to);
              controlPoint.style.setProperty(prop, to);
            });
          });
        }, delay);
      }

      // 处理参数方程动画
      if (options.properties && (options.properties.t || options.properties.range || options.properties.divisions)) {
        const startTime = performance.now() + delay;
        
        // 内置缓动函数
        function easeInOut(progress: number) {
          return progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        }

        let requestID: number | null = null;

        function animate(currentTime: number) {
          if (currentTime < startTime) {
            requestAnimationFrame(animate);
            return;
          }

          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = options.easing ? easeInOut(progress) : progress;

          // 更新参数范围
          if (options.properties?.range) {
            const { from: fromRange = range, to: toRange } = options.properties.range;
            const [fromStart, fromEnd] = Array.isArray(fromRange) ? fromRange : range;
            const [toStart, toEnd] = Array.isArray(toRange) ? toRange : range;
            
            const currentStart = fromStart + (toStart - fromStart) * easeProgress;
            const currentEnd = fromEnd + (toEnd - fromEnd) * easeProgress;
            range = [currentStart, currentEnd];
            tMin = currentStart; // 更新内部参数范围
            tMax = currentEnd;
            
            // 更新控制点位置
            let midT = (tMax+tMin)/2
            const [x, y] = fn(midT);
            controlPoint.setAttribute("cx", (x * unit).toString());
            controlPoint.setAttribute("cy", (-y * unit).toString());
          }

          // 更新divisions
          if (options.properties?.divisions) {
            const { from = divisions, to } = options.properties.divisions;
            const currentDivisions = Math.round(from + (to - from) * easeProgress);
            divisions = currentDivisions;

            samples = Math.min(currentDivisions * 2, 300);
            path.setAttribute("divisions", divisions.toString());

            if (!requestID) {
              requestID = requestAnimationFrame(() => {
                generatePath();
                // 更新控制点位置
                let midT = (tMax+tMin)/2
                const [x, y] = fn(midT);
                controlPoint.setAttribute("cx", (x * unit).toString());
                controlPoint.setAttribute("cy", (-y * unit).toString());
                requestID = null;
              });
            }
            const riemannGroup = group.querySelector('.riemann-rectangles');
            if (riemannGroup) {
              const method = riemannGroup.getAttribute('data-method') as 'left' | 'right' | 'midpoint';
              rtn.showRiemannRectangles(divisions, method);
            }
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            if (options.onEnd) {
              options.onEnd();
            }
          }
        }

        requestAnimationFrame(animate);
      }

      options.onStart?.();
      if (options.onEnd) {
        setTimeout(options.onEnd, duration + delay);
      }

      return rtn;
    },

    // 使曲线可拖拽
    draggable: () => {
      let startDragX = 0;
      let startDragY = 0;
      let startTMin = 0;
      let startTMax = 0;

      controlPoint.style.display = "block";

      // 记录拖拽开始时的偏移量和上一次的拖动距离
      controlPoint.addEventListener("mousedown", (e) => {
        isDragging = true;
        e.preventDefault();
        document.body.style.userSelect = "none";
      });

      draggable(controlPoint, (_x, _y) => true, (x: number, y: number) => {
        if (!isDragging) {
          startDragX = x;
          startDragY = y;
          startTMin = Number(path.getAttribute("range")?.split(" ")?.[0]) || 0;
          startTMax = Number(path.getAttribute("range")?.split(" ")?.[1]) || 0;
          console.log(startTMin, startTMax);
          isDragging = true;
        }
        
        // 更新整条曲线的偏移量
        const dx = x - startDragX + midX;
        const dy = y - startDragY - midY;
        console.log(dx, dy);
        path.setAttribute("transform", `translate(${dx}, ${dy})`);
        rtn.showRiemannRectangles(divisions);
      });
      
      window.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          startDragX = 0;
          startDragY = 0;
          startTMin = 0;
          startTMax = 0;
        }
        document.body.style.userSelect = "none";
      });

      return rtn;
    },

    riemannSum: (n: number, method: 'left' | 'right' | 'midpoint' = 'midpoint') => {
      const [a, b] = range;
      const dx = (b - a) / n;
      const rectangles: { x: number; y: number; width: number; height: number }[] = [];

      const transform = path.getAttribute("transform");
      const match = transform ? transform.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/) : null;
      const [dx_transform, dy_transform] = match ? [parseFloat(match[1]), parseFloat(match[2])] : [0, 0];

      for (let i = 0; i < n; i++) {
        let t;
        switch (method) {
          case "left":
            t = a + i * dx;
            break;
          case "right":
            t = a + (i + 1) * dx;
            break;
          default: // midpoint
            t = a + (i + 0.5) * dx;
            break;
        }
        const [x, y] = fn(t);
        const transformedY = (y - dy_transform/unit);
        rectangles.push({
          x: (x - dx/2 + dx_transform/unit) * unit,
          y: transformedY * unit,
          width: dx * unit,
          height: -transformedY * unit
        });
      }

      return { rectangles };
    },

    showRiemannRectangles: (n: number, method: 'left' | 'right' | 'midpoint' = 'midpoint') => {
      const { rectangles } = rtn.riemannSum(n, method);
      let riemannGroup = group.querySelector('.riemann-rectangles');
      if (!riemannGroup) {
        riemannGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        riemannGroup.classList.add('riemann-rectangles');
        group.appendChild(riemannGroup);
      }
      riemannGroup.setAttribute('data-method', method);
      
      // 清空现有矩形
      while (riemannGroup.firstChild) {
        riemannGroup.removeChild(riemannGroup.firstChild);
      }

      rectangles.forEach(rect => {
        const rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rectElement.setAttribute('x', rect.x.toString());
        rectElement.setAttribute('y', rect.height > 0 ? '0' : rect.height.toString());
        rectElement.setAttribute('width', rect.width.toString());
        rectElement.setAttribute('height', Math.abs(rect.height).toString());
        rectElement.setAttribute('fill', getTheme().colors.primary);
        rectElement.setAttribute('fill-opacity', '0.3');
        rectElement.setAttribute('stroke', getTheme().colors.primary);
        rectElement.setAttribute('stroke-width', '1');
        
        riemannGroup.appendChild(rectElement);
      });
      
      return rtn;
    },
  };

  // 初始化路径
  generatePath();
  return rtn as any;
}
