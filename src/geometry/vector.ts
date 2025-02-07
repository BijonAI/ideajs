/**
 * @file vector.ts
 * @description 向量对象的实现，提供创建和操作SVG向量的功能，包括箭头的绘制和变换
 */

import { getTheme } from "../theme";
import { Vector, VectorStyle } from "../interfaces/geometry";
import {
  Transform,
  Animation,
  TooltipOptions,
  EffectOptions,
  TeachingOptions,
  AnimationStep,
} from "../interfaces/common";
import gsap from "gsap";
import { draggable } from "../utils/draggable";

/**
 * 创建一个向量对象
 * @param x1 起点x坐标
 * @param y1 起点y坐标
 * @param x2 终点x坐标
 * @param y2 终点y坐标
 * @returns 向量对象，包含多种操作方法
 */
export function vector(x1: number, y1: number, x2: number, y2: number): Vector {
  // 创建SVG组元素作为向量容器
  const vector = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // vector.setAttribute("transform", `translate(${x1}, ${y1})`);

  // 应用主题样式
  const theme = getTheme();
  vector.setAttribute("stroke", theme.colors.primary);
  vector.setAttribute("stroke-width", theme.sizes.function.toString());

  // 创建线段元素
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", (-y1).toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", (-y2).toString());

  // 创建箭头元素
  const arrow = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  arrow.setAttribute("points", `-5,-4 0,0 5,-4 0,8`);
  arrow.setAttribute("stroke", "none");
  arrow.setAttribute("fill", theme.colors.primary);
  arrow.style.cursor = "move";
  arrow.style.pointerEvents = "all";

  // 创建起点圆点
  const startPoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  startPoint.setAttribute("r", "4");
  startPoint.setAttribute("opacity", "0"); // 设置为完全透明
  startPoint.setAttribute("cx", x1.toString());
  startPoint.setAttribute("cy", (-y1).toString());
  startPoint.style.cursor = "move";
  startPoint.style.pointerEvents = "all";

  vector.append(line, startPoint, arrow);
  vector.dataset.draggable = "false";

  vector.addEventListener("click", (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (vector.dataset.draggable !== "true") {
      vector.dataset.draggable = "true";
      startPoint.style.opacity = "1";
    }
  });

  // 点击其他地方时取消选中
  document.addEventListener("click", (e) => {
    const target = e.target as Element;
    if (!vector.contains(target)) {
      vector.dataset.draggable = "false";
      startPoint.style.opacity = "0";
    }
  });

  let unit = 1;

  // 更新箭头位置和方向
  function updateArrow() {
    const dx =
      Number(line.getAttribute("x2")) - Number(line.getAttribute("x1"));
    const dy =
      Number(line.getAttribute("y2")) - Number(line.getAttribute("y1")); // 注意y轴方向
    // 使用起点到终点的方向计算角度
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    arrow.setAttribute(
      "transform",
      `translate(${line.getAttribute("x2")},${line.getAttribute("y2")}) rotate(${angle - 90})`,
    );
  }

  // 将元素添加到向量组中
  vector.append(line, startPoint, arrow);
  updateArrow();

  // 添加拖拽功能
  let dragEnabled = false;
  let isDraggingEnd = false;
  let isDraggingStart = false;

  // 存储连接的向量
  let connectedVectors: {
    vector: Vector;
    elastic?: boolean;
    distance?: number;
    strength?: number;
  }[] = [];

  // 更新所有连接的向量
  function updateConnectedVectors() {
    const currentPos = parsePositionParams();
    connectedVectors.forEach(({ vector, elastic, distance, strength }) => {
      if (elastic) {
        // 弹性连接：向量会试图保持指定的距离
        const targetPos = {
          x1: Number(vector.node().querySelector('line')?.getAttribute('x1')),
          y1: -Number(vector.node().querySelector('line')?.getAttribute('y1')),
          x2: Number(vector.node().querySelector('line')?.getAttribute('x2')),
          y2: -Number(vector.node().querySelector('line')?.getAttribute('y2'))
        };

        // 计算当前距离
        const dx = targetPos.x1 - currentPos.x2;
        const dy = targetPos.y1 - currentPos.y2;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (distance && strength && currentDistance !== distance) {
          // 应用弹性力
          const factor = strength * (1 - distance / currentDistance);
          const moveX = dx * factor;
          const moveY = dy * factor;

          // 更新连接向量的位置
          vector.transform({
            translate: [moveX, moveY]
          });
        }
      } else {
        // 刚性连接：向量的起点直接跟随终点
        vector.from(currentPos.x2 / unit, currentPos.y2 / unit);
      }
    });
  }

  // 保存注释信息
  let annotations: {
    element: SVGTextElement;
    position: "top" | "bottom" | "left" | "right";
  }[] = [];
  let traceEnabled = false;
  let traceColor = "";
  let traceGroup: SVGGElement | null = null;

  // 返回对象，包含所有可用的操作方法
  const rtn = {
    node: () => vector,
    setUnit: (_unit: number) => {
      unit = _unit;
      x1 = x1*unit
      y1 = y1*unit
      x2 = x2*unit
      y2 = y2*unit
      // 更新向量的位置
      startPoint.setAttribute("cx", x1.toString());
      startPoint.setAttribute("cy", (-y1).toString());
      line.setAttribute("x1", (x1).toString());
      line.setAttribute("y1", (-y1).toString());
      line.setAttribute("x2", (x2).toString());
      line.setAttribute("y2", (-y2).toString());
      // 更新箭头
      updateArrow();
      return rtn;
    },
    from,
    to,
    stroke,
    fill,
    style,
    // 缩放向量
    scale: (x: number, y: number = x) => {
      x1 *= x;
      y1 *= y;
      vector.setAttribute("transform", `translate(${x1}, ${-y1})`);
      line.setAttribute("x2", (Number(line.getAttribute("x2")) * x).toString());
      line.setAttribute("y2", (Number(line.getAttribute("y2")) * y).toString());
      updateArrow();
      return rtn;
    },
    transform,
    animation,
    event,
    attr,
    data,
    class_,
    tooltip,
    effect,
    // 高亮显示
    highlight: (duration?: number) => {
      const originalStroke = line.getAttribute("stroke");
      const originalWidth = line.getAttribute("stroke-width");

      line.setAttribute("stroke", getTheme().colors.primary);
      line.setAttribute(
        "stroke-width",
        (parseFloat(originalWidth || "2") * 2).toString(),
      );

      if (duration) {
        setTimeout(() => {
          line.setAttribute("stroke", originalStroke || "");
          line.setAttribute("stroke-width", originalWidth || "");
        }, duration);
      }

      return rtn;
    },
    // 添加注释
    annotate: (
      text: string,
      position: "top" | "bottom" | "left" | "right" = "top",
    ) => {
      const annotation = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      annotation.textContent = text;

      // 设置文本样式
      annotation.setAttribute("font-size", "12");
      annotation.setAttribute("fill", getTheme().colors.text);
      annotation.setAttribute("paint-order", "stroke");
      annotation.setAttribute("stroke", "white");
      annotation.setAttribute("stroke-width", "1");
      annotation.setAttribute("text-anchor", "middle");
      annotation.setAttribute("dominant-baseline", "middle");

      // 保存注释信息
      annotations.push({ element: annotation, position });

      // 更新注释位置
      const updatePosition = () => {
        const x =
          (Number(line.getAttribute("x1")) + Number(line.getAttribute("x2"))) /
          2;
        const y =
          (Number(line.getAttribute("y1")) + Number(line.getAttribute("y2"))) /
          2;
        annotation.setAttribute("x", x.toString());
        annotation.setAttribute(
          "y",
          (position === "bottom" ? y + 20 : y - 10).toString(),
        );
      };

      // 初始化位置
      updatePosition();

      // 添加观察者
      const observer = new MutationObserver(updatePosition);
      observer.observe(line, {
        attributes: true,
        attributeFilter: ["x1", "y1", "x2", "y2"],
      });

      vector.appendChild(annotation);
      return rtn;
    },
    // 脉冲动画
    pulse: (count?: number) => {
      return rtn;
    },
    // 轨迹跟踪
    /**
     * 轨迹跟踪，通过添加一个透明的线条来实现
     * @param color 轨迹颜色，默认使用主题次要颜色
     * @returns 向量对象
     */
    trace: (color: string = getTheme().colors.secondary) => {
      // 创建轨迹组
      traceGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      vector.insertBefore(traceGroup, line);

      traceEnabled = true;
      traceColor = color;

      // 添加观察者来跟踪位置变化
      const observer = new MutationObserver(() => {
        if (traceEnabled && traceGroup) {
          const traceLine = line.cloneNode() as SVGLineElement;
          traceLine.setAttribute("stroke", traceColor);
          traceLine.setAttribute("stroke-opacity", "0.3");
          traceGroup.appendChild(traceLine);
        }
      });

      observer.observe(line, {
        attributes: true,
        attributeFilter: ["x1", "y1", "x2", "y2"],
      });

      return rtn;
    },
    // 清除轨迹
    clearTrace: () => {
      if (traceGroup) {
        traceGroup.innerHTML = "";
      }
      return rtn;
    },
    // 停止轨迹跟踪
    stopTrace: () => {
      traceEnabled = false;
      return rtn;
    },
    // 教学模式
    teachingMode: (options?: TeachingOptions) => {
      return rtn;
    },
    // 动画步骤
    step: (steps: AnimationStep[]) => {
      return rtn;
    },
    // 锁定交互
    lock: () => {
      vector.style.pointerEvents = "none";
      return rtn;
    },
    // 解锁交互
    unlock: () => {
      vector.style.pointerEvents = "all";
      return rtn;
    },
    // 限制范围
    restrict: (bounds: { x: [number, number]; y: [number, number] }) => {
      return rtn;
    },
    // 网格对齐
    snap: (gridSize: number) => {
      return rtn;
    },
    // 连接其他向量
    connect: (
      target: Vector,
      options?: { elastic?: boolean; distance?: number; strength?: number },
    ) => {
      // 添加到连接列表
      connectedVectors.push({
        vector: target,
        elastic: options?.elastic,
        distance: options?.distance,
        strength: options?.strength
      });

      // 初始化连接
      const currentPos = parsePositionParams();
      target.from(currentPos.x2 / unit, currentPos.y2 / unit);

      return rtn;
    },
    // 显示向量
    show: () => {
      vector.style.display = "";
      return rtn;
    },
    // 隐藏向量
    hide: () => {
      vector.style.display = "none";
      return rtn;
    },
    // 设置透明度
    opacity: (value: number) => {
      vector.style.opacity = value.toString();
      return rtn;
    },
    // 移除向量
    remove: () => {
      vector.remove();
    },
    // 形状变形动画
    morph: (target: Vector, duration: number = 1000) => {
      if (!target || !target.node()) return rtn;
      const targetVector = target.node();
      const transform = targetVector.getAttribute("transform");
      if (!transform) return rtn;
      gsap.to(vector, {
        duration: duration / 1000,
        attr: { transform },
        ease: "power1.inOut",
      });
      return rtn;
    },
    info: () => {
      // 添加长按事件处理
      let infoData = {
        ...rtn,
        type: "vector",
        x1: x1 / unit,
        y1: y1 / unit,
        x2: x2 / unit,
        y2: y2 / unit,
      };
      return infoData;
    },
    draggable: enableDragging,
  };

  /**
   * 设置向量的起点
   * @param x1 新的起点x坐标
   * @param y1 新的起点y坐标
   * @returns 向量对象
   */
  function from(_x1: number, _y1: number) {
    x1 = _x1*unit;
    y1 = _y1*unit;
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", (-y1).toString());
    startPoint.setAttribute("cx", x1.toString());
    startPoint.setAttribute("cy", (-y1).toString());
    updateArrow();
    return rtn;
  }

  /**
   * 设置向量的终点
   * @param x2 新的终点x坐标
   * @param y2 新的终点y坐标
   * @returns 向量对象
   */
  function to(_x2: number, _y2: number) {
    x2 = _x2*unit;
    y2 = _y2*unit;
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", (-y2).toString());
    updateArrow();
    return rtn;
  }

  /**
   * 设置向量的颜色
   * @param color 可选的颜色值
   * @returns 向量对象
   */
  function stroke(color?: string) {
    const theme = getTheme();
    line.setAttribute("stroke", color ? color : theme.colors.primary);
    arrow.setAttribute("stroke", color ? color : theme.colors.primary);
    return rtn;
  }

  function fill(color?: string) {
    const theme = getTheme();
    line.setAttribute("stroke", color ? color : theme.colors.primary);
    arrow.setAttribute("fill", color ? color : theme.colors.primary);
    return rtn;
  }

  function style(options: VectorStyle) {
    if (options.strokeWidth)
      line.setAttribute("stroke-width", options.strokeWidth.toString());
    if (options.strokeColor) line.setAttribute("stroke", options.strokeColor);
    if (options.strokeOpacity)
      line.setAttribute("stroke-opacity", options.strokeOpacity.toString());
    if (options.strokeDasharray)
      line.setAttribute("stroke-dasharray", options.strokeDasharray);
    if (options.lineCap) line.setAttribute("stroke-linecap", options.lineCap);
    if (options.lineJoin)
      line.setAttribute("stroke-linejoin", options.lineJoin);
    if (options.cursor) line.style.cursor = options.cursor;
    if (options.filter) line.style.filter = options.filter;
    if (options.visibility) line.style.visibility = options.visibility;
    if (options.pointerEvents) line.style.pointerEvents = options.pointerEvents;
    if (options.pointSize) {
      startPoint.setAttribute("r", options.pointSize.toString());
      arrow.setAttribute("r", options.pointSize.toString());
    }
    if (options.pointColor) {
      startPoint.setAttribute("fill", options.pointColor);
      arrow.setAttribute("fill", options.pointColor);
    }
    if (options.pointOpacity) {
      startPoint.setAttribute("fill-opacity", options.pointOpacity.toString());
      arrow.setAttribute("fill-opacity", options.pointOpacity.toString());
    }
    if (options.pointFill) {
      startPoint.setAttribute("fill", options.pointFill);
      arrow.setAttribute("fill", options.pointFill);
    }
    if (options.pointStroke) {
      startPoint.setAttribute("stroke", options.pointStroke);
      arrow.setAttribute("stroke", options.pointStroke);
    }
    if (options.pointStrokeWidth) {
      startPoint.setAttribute(
        "stroke-width",
        options.pointStrokeWidth.toString(),
      );
      arrow.setAttribute("stroke-width", options.pointStrokeWidth.toString());
    }
    return rtn;
  }

  function parsePositionParams() {
    const x1 = Number(line.getAttribute("x1"));
    const y1 = -Number(line.getAttribute("y1"));
    const x2 = Number(line.getAttribute("x2"));
    const y2 = -Number(line.getAttribute("y2"));
    return { x1, y1, x2, y2 };
  }
  /**
   * 应用变换
   * @param options 变换选项，包括平移、缩放、旋转和倾斜
   * @returns 向量对象
   */
  function transform(options: Transform) {
    const currentPos = parsePositionParams();
    let currentX1 = currentPos.x1;
    let currentY1 = currentPos.y1;
    let currentX2 = currentPos.x2;
    let currentY2 = currentPos.y2;

    let newX1 = currentX1;
    let newY1 = currentY1;
    let newX2 = currentX2;
    let newY2 = currentY2;

    if (options.translate) {
      newX1 += options.translate[0];
      newY1 += options.translate[1];
      newX2 += options.translate[0];
      newY2 += options.translate[1];
    }

    if (options.scale) {
      const originX = options.origin ? options.origin[0] : currentX1;
      const originY = options.origin ? options.origin[1] : currentY1;
      const scaleX = Array.isArray(options.scale)
        ? options.scale[0]
        : options.scale;
      const scaleY = Array.isArray(options.scale)
        ? options.scale[1]
        : options.scale;

      newX1 = originX + (currentX1 - originX) * scaleX;
      newY1 = originY + (currentY1 - originY) * scaleY;
      newX2 = originX + (currentX2 - originX) * scaleX;
      newY2 = originY + (currentY2 - originY) * scaleY;
    }

    if (options.rotate) {
      const originX = options.origin ? options.origin[0] : currentX1;
      const originY = options.origin ? options.origin[1] : currentY1;
      const angle = (options.rotate * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // 旋转起点
      const dx1 = currentX1 - originX;
      const dy1 = currentY1 - originY;
      newX1 = originX + dx1 * cos - dy1 * sin;
      newY1 = originY + dx1 * sin + dy1 * cos;

      // 旋转终点
      const dx2 = currentX2 - originX;
      const dy2 = currentY2 - originY;
      newX2 = originX + dx2 * cos - dy2 * sin;
      newY2 = originY + dx2 * sin + dy2 * cos;
    }

    if (options.skew) {
      const originX = options.origin ? options.origin[0] : currentX1;
      const originY = options.origin ? options.origin[1] : currentY1;
      const skewX = (options.skew[0] * Math.PI) / 180;
      const skewY = (options.skew[1] * Math.PI) / 180;

      // 倾斜起点
      const dx1 = currentX1 - originX;
      const dy1 = currentY1 - originY;
      newX1 = originX + dx1 + dy1 * Math.tan(skewX);
      newY1 = originY + dy1 + dx1 * Math.tan(skewY);

      // 倾斜终点
      const dx2 = currentX2 - originX;
      const dy2 = currentY2 - originY;
      newX2 = originX + dx2 + dy2 * Math.tan(skewX);
      newY2 = originY + dy2 + dx2 * Math.tan(skewY);
    }

    if (options.origin) {
      const [originX, originY] = options.origin;
      newX1 = originX;
      newY1 = originY;
    }

    if (options.skew) {
      const originX = options.origin ? options.origin[0] : currentX1;
      const originY = options.origin ? options.origin[1] : currentY1;
      const skewX = (options.skew[0] * Math.PI) / 180;
      const skewY = (options.skew[1] * Math.PI) / 180;

      // 倾斜起点
      const dx1 = currentX1 - originX;
      const dy1 = currentY1 - originY;
      newX1 = originX + dx1 + dy1 * Math.tan(skewX);
      newY1 = originY + dy1 + dx1 * Math.tan(skewY);

      // 倾斜终点
      const dx2 = currentX2 - originX;
      const dy2 = currentY2 - originY;
      newX2 = originX + dx2 + dy2 * Math.tan(skewX);
      newY2 = originY + dy2 + dx2 * Math.tan(skewY);
    }

    if (options.origin) {
      const [originX, originY] = options.origin;
      newX1 = originX;
      newY1 = originY;
    }

    // 更新向量位置
    x1 = newX1;
    y1 = newY1;
    x2 = newX2;
    y2 = newY2;

    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", (-y1).toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", (-y2).toString());
    startPoint.setAttribute("cx", x1.toString());
    startPoint.setAttribute("cy", (-y1).toString());
    updateArrow();

    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 向量对象
   */
  function animation(options: Animation) {
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
    const positionAnimations: { [key: string]: { from: number; to: number } } =
      {};
    const styleAnimations: { [key: string]: { from: string; to: string } } = {};

    if (options.properties) {
      // 获取当前位置值作为默认的from值
      const fromPos = parsePositionParams();
      const fromX1 = fromPos.x1;
      const fromY1 = fromPos.y1;
      const fromX2 = fromPos.x2;
      const fromY2 = fromPos.y2;

      // 先设置初始位置
      Object.entries(options.properties).forEach(([prop, { from }]) => {
        if (!styleProperties.has(prop) && from !== undefined) {
          const value = parseFloat(from);
          switch (prop) {
            case "x1":
              x1 = value * unit;
              startPoint.setAttribute("cx", x1.toString());
              line.setAttribute("x1", x1.toString());
              break;
            case "y1":
              y1 = value * unit;
              startPoint.setAttribute("cy", (-y1).toString());
              line.setAttribute("y1", (-y1).toString());
              break;
            case "x2":
              x2 = value * unit;
              break;
            case "y2":
              y2 = value * unit;
              break;
          }
        }
      });
      updateVectorPath();

      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        if (styleProperties.has(prop)) {
          // 对于样式属性，如果没有from值，使用当前样式值
          const currentValue =
            line.style.getPropertyValue(prop) || line.getAttribute(prop) || "";
          styleAnimations[prop] = {
            from: from !== undefined ? from : currentValue,
            to,
          };
          animations.push(
            `${prop} ${duration}ms ${options.easing || "ease"} ${delay}ms`,
          );
        } else {
          // 处理位置动画，如果没有from值，使用当前位置值
          let fromValue =
            from !== undefined
              ? parseFloat(from)
              : (() => {
                  switch (prop) {
                    case "x1":
                      return fromX1 * unit;
                    case "y1":
                      return fromY1 * unit;
                    case "x2":
                      return fromX2 * unit;
                    case "y2":
                      return fromY2 * unit;
                    default:
                      return 0;
                  }
                })();
          positionAnimations[prop] = { from: fromValue, to: parseFloat(to) };
        }
      });
    }

    // 处理样式过渡
    if (Object.keys(styleAnimations).length > 0) {
      Object.entries(styleAnimations).forEach(([prop, { from }]) => {
        line.style.setProperty(prop, from);
        startPoint.style.setProperty(prop, from);
        arrow.style.setProperty(prop, from);
      });

      line.style.transition = animations.join(", ");
      startPoint.style.transition = animations.join(", ");
      arrow.style.transition = animations.join(", ");

      setTimeout(() => {
        Object.entries(styleAnimations).forEach(([prop, { to }]) => {
          line.style.setProperty(prop, to);
          startPoint.style.setProperty(prop, to);
          arrow.style.setProperty(prop, to);
        });
      }, delay);
    }

    // 处理位置动画
    if (Object.keys(positionAnimations).length > 0) {
      const startTime = performance.now() + delay;

      function animate(currentTime: number) {
        if (currentTime < startTime) {
          requestAnimationFrame(animate);
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = options.easing ? easeInOut(progress) : progress;

        // 更新位置
        Object.entries(positionAnimations).forEach(([prop, { from, to }]) => {
          const value = from + (to - from) * easeProgress;
          switch (prop) {
            case "x1":
              x1 = value * unit;
              startPoint.setAttribute("cx", x1.toString());
              line.setAttribute("x1", x1.toString());
              break;
            case "y1":
              y1 = value * unit;
              startPoint.setAttribute("cy", (-y1).toString());
              line.setAttribute("y1", (-y1).toString());
              break;
            case "x2":
              x2 = value * unit;
              break;
            case "y2":
              y2 = value * unit;
              break;
          }
        });

        // 更新向量路径
        updateVectorPath();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }

    options.onStart?.();
    if (options.onEnd) {
      setTimeout(options.onEnd, duration + delay);
    }

    return rtn;
  }

  // 内置缓动函数
  function easeInOut(progress: number) {
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }

  // 更新向量路径的辅助函数
  function updateVectorPath() {
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", (-y1).toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", (-y2).toString());
    updateArrow();
  }

  /**
   * 添加事件监听器
   * @param type 事件类型
   * @param handler 事件处理函数
   * @returns 包含移除监听器方法的对象
   */
  function event(type: string, handler: (e: Event) => void) {
    vector.addEventListener(type, handler);
    return {
      remove: () => vector.removeEventListener(type, handler),
      rtn,
    };
  }

  /**
   * 设置属性
   * @param name 属性名
   * @param value 属性值
   * @returns 向量对象
   */
  function attr(name: string, value: string) {
    vector.setAttribute(name, value);
    return rtn;
  }

  /**
   * 设置数据属性
   * @param key 数据键名
   * @param value 数据值
   * @returns 向量对象
   */
  function data(key: string, value: any) {
    vector.dataset[key] = value;
    return rtn;
  }

  /**
   * 添加CSS类
   * @param names 类名或类名数组
   * @returns 包含移除类名方法的对象
   */
  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      vector.classList.add(...names);
    } else {
      vector.classList.add(names);
    }
    return {
      remove: () =>
        vector.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn,
    };
  }

  /**
   * 添加工具提示
   * @param content 提示内容，字符串或HTML元素
   * @param options 提示选项，位置、样式等
   * @returns 向量对象
   */
  function tooltip(
    content: string | HTMLElement,
    options: TooltipOptions = {},
  ) {
    const tip = document.createElement("div");

    // 设置内容
    if (typeof content === "string") {
      tip.innerHTML = content;
    } else {
      tip.appendChild(content);
    }

    // 基础样式
    tip.style.position = "fixed";
    tip.style.display = "none";
    tip.style.backgroundColor = theme.colors.background;
    tip.style.color = theme.colors.primary;
    tip.style.padding = "8px";
    tip.style.borderRadius = "4px";
    tip.style.border = `1px solid ${theme.colors.primary}`;
    tip.style.zIndex = "1000";
    tip.style.pointerEvents = "none";
    tip.style.fontSize = "14px";
    tip.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    tip.style.transition = "opacity 0.2s";

    // 应用自定义类名和样式
    if (options.className) tip.className = options.className;
    if (options.style) Object.assign(tip.style, options.style);

    // 将tip添加到body
    document.body.appendChild(tip);

    // 监听整个向量组的事件
    const showTip = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = vector.getBoundingClientRect();
      const [offsetX = 0, offsetY = 0] = options.offset || [0, 0];

      // 确保tip可见以获取其尺寸
      tip.style.visibility = "hidden";
      tip.style.display = "block";

      let left: number;
      let top: number;

      switch (options.position) {
        case "top":
          left = rect.left + (rect.width - tip.offsetWidth) / 2;
          top = rect.top - tip.offsetHeight - 8;
          break;
        case "bottom":
          left = rect.left + (rect.width - tip.offsetWidth) / 2;
          top = rect.bottom + 8;
          break;
        case "left":
          left = rect.left - tip.offsetWidth - 8;
          top = rect.top + (rect.height - tip.offsetHeight) / 2;
          break;
        case "right":
          left = rect.right + 8;
          top = rect.top + (rect.height - tip.offsetHeight) / 2;
          break;
        default:
          left = mouseEvent.pageX + offsetX;
          top = mouseEvent.pageY + offsetY;
      }

      // 应用位置并显示
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
      tip.style.visibility = "visible";
      tip.style.display = "block";
    };

    const hideTip = (e: Event) => {
      tip.style.display = "none";
    };

    // 给向量的所有元素添加事件监听
    [line, arrow].forEach((el) => {
      el.addEventListener("mouseenter", showTip);
      el.addEventListener("mouseleave", hideTip);
    });

    // 清理函数
    const cleanup = () => {
      [line, arrow].forEach((el) => {
        el.removeEventListener("mouseenter", showTip);
        el.removeEventListener("mouseleave", hideTip);
      });
      tip.remove();
    };

    // 保存清理函数以便后续可能的清理
    (vector as any)._tooltipCleanup = cleanup;

    return rtn;
  }

  /**
   * 添加视觉效果
   * @param type 效果类型：'glow'发光、'shadow'阴影、'blur'模糊
   * @param options 效果选项，包括颜色、强度等
   * @returns 向量对象
   */
  function effect(
    type: "glow" | "shadow" | "blur",
    options: EffectOptions = {},
  ) {
    const { color = "#000", strength = 5, spread = 0 } = options;
    switch (type) {
      case "glow":
        vector.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case "shadow":
        vector.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case "blur":
        vector.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  /**
   * 启用向量的拖拽功能
   * @returns 向量对象
   */
  function enableDragging() {
    if (dragEnabled) return rtn;

    dragEnabled = true;

    let startDragX = 0;
    let startDragY = 0;
    let startVectorX = 0;
    let startVectorY = 0;

    // 起点拖拽
    draggable(
      startPoint,
      () => vector.dataset.draggable === "true",
      (x, y) => {
        if (!isDraggingStart) {
          startDragX = x;
          startDragY = y;
          startVectorX = Number(line.getAttribute("x1"));
          startVectorY = Number(line.getAttribute("y1"));
          isDraggingStart = true;
        }

        const dx = x - startDragX + x1;
        const dy = y - startDragY - y1;

        // 更新起点位置
        const newX = startVectorX + dx;
        const newY = startVectorY + dy;

        line.setAttribute("x1", newX.toString());
        line.setAttribute("y1", newY.toString());
        updateArrow();
      },
    );

    // 箭头拖拽
    let endDragX = 0;
    let endDragY = 0;
    let endVectorX = 0;
    let endVectorY = 0;

    draggable(
      arrow,
      () => vector.dataset.draggable === "true",
      (x, y) => {
        if (!isDraggingEnd) {
          endDragX = x;
          endDragY = y;
          endVectorX = Number(line.getAttribute("x2"));
          endVectorY = Number(line.getAttribute("y2"));
          isDraggingEnd = true;
        }

        const dx = x - endDragX + x2;
        const dy = y - endDragY - y2;

        const newX = endVectorX + dx;
        const newY = endVectorY + dy;

        line.setAttribute("x2", newX.toString());
        line.setAttribute("y2", newY.toString());

        const dragEvent = new CustomEvent('vector-drag', {
          detail: { dx, dy }
        });
        vector.dispatchEvent(dragEvent);
        updateArrow();
      },
    );

    // 状态管理
    startPoint.addEventListener("mousedown", (e) => {
      isDraggingStart = true;
      e.preventDefault();
      document.body.style.userSelect = "none";
    });

    arrow.addEventListener("mousedown", (e) => {
      isDraggingEnd = true;
      e.preventDefault();
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mouseup", () => {
      if (isDraggingStart) {
        isDraggingStart = false;
        startDragX = 0;
        startDragY = 0;
        startVectorX = 0;
        startVectorY = 0;
      }
      if (isDraggingEnd) {
        isDraggingEnd = false;
        endDragX = 0;
        endDragY = 0;
        endVectorX = 0;
        endVectorY = 0;
      }
      document.body.style.userSelect = "";
    });

    return rtn;
  }

  return rtn;
}
