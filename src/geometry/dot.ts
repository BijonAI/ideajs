/**
 * @file dot.ts
 * @description 点对象的实现，提供创建和操作SVG圆点的功能，支持拖拽、样式设置和事件处理
 */

import { draggable } from "../utils/draggable";
import { getTheme } from "../theme";
import {
  TeachingOptions,
  AnimationStep,
  Animation,
} from "../interfaces/common";
import { Dot } from "../interfaces/geometry";

/**
 * 创建一个点对象
 * @param x 点的x坐标
 * @param y 点的y坐标
 * @returns 点对象，包含多种操作方法
 */
export function dot(x: number, y: number) {
  // 创建SVG圆点元素
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());
  circle.setAttribute("r", "4");
  circle.setAttribute("stroke-width", "4");
  circle.style.cursor = "move";

  // 存储初始值到dataset
  circle.dataset.x = x.toString();
  circle.dataset.y = y.toString();
  circle.dataset.r = "4";

  // 拖拽事件回调数组
  const dragEvents: ((x: number, y: number) => void)[] = [];
  function onDrag(callback: (x: number, y: number) => void) {
    dragEvents.push(callback);
    return rtn;
  }

  /**
   * 从当前属性中获取点的参数
   * @returns 当前点的参数
   */
  function parsePositionParams() {
    return {
      x: Number(circle.getAttribute("cx")),
      y: -Number(circle.getAttribute("cy")),
      r: Number(circle.getAttribute("r")),
    };
  }

  /**
   * 应用变换
   * @param options 变换选项，包括平移、缩放、旋转和倾斜
   * @returns 点对象
   */
  function transform(options: {
    translate?: [number, number];
    scale?: number | [number, number];
    rotate?: number;
    skew?: [number, number];
    origin?: [number, number];
  }) {
    let currentPos = parsePositionParams();
    let currentR = currentPos.r;
    let currentX = currentPos.x;
    let currentY = currentPos.y;

    let newX = currentX;
    let newY = currentY;
    let newR = currentR;
    // origin直接修改点位置
    if (options.origin) {
      newX = options.origin[0];
      newY = options.origin[1];
      // 更新数据集和属性
      circle.dataset.x = newX.toString();
      circle.dataset.y = newY.toString();
      circle.setAttribute("cx", newX.toString());
      circle.setAttribute("cy", (-newY).toString());
      return rtn;
    }

    // 平移直接修改坐标
    if (options.translate) {
      newX += options.translate[0];
      newY += options.translate[1];
      circle.dataset.x = newX.toString();
      circle.dataset.y = (-newY).toString();
      circle.setAttribute("cx", newX.toString());
      circle.setAttribute("cy", (-newY).toString());
      return rtn;
    }

    // 缩放直接修改半径
    if (options.scale) {
      const scaleX = Array.isArray(options.scale)
        ? options.scale[0]
        : options.scale;
      newR *= scaleX;
      circle.dataset.r = newR.toString();
      circle.setAttribute("r", newR.toString());
      return rtn;
    }

    // 旋转，对于点来说只需要更新位置
    if (options.rotate) {
      return rtn;
    }

    // skew保持使用SVG transform
    if (options.skew) {
      // let transform = `skew(${options.skew[0]},${options.skew[1]})`;
      // circle.setAttribute("transform", transform);
    }

    return rtn;
  }

  // 返回对象，包含所有可用的操作方法
  const rtn = {
    node,
    resize,
    stroke,
    fill,
    border,
    focus,
    select,
    onFocus,
    onSelect,
    // 设置点可拖拽
    draggable(condition?: (x: number, y: number) => boolean) {
      draggable(circle, condition, () =>
        dragEvents.forEach((callback) =>
          callback(
            Number(circle.getAttribute("cx")) +
              Number(circle.transform.baseVal[0].matrix.e),
            Number(circle.getAttribute("cy")) +
              Number(circle.transform.baseVal[0].matrix.f),
          ),
        ),
      );
      document.body.style.userSelect = "none";
      return rtn;
    },
    onDrag,
    style,
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
      return rtn;
    },
    // 添加注释
    annotate: (
      text: string,
      position?: "top" | "bottom" | "left" | "right",
    ) => {
      const annotation = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      annotation.textContent = text;
      annotation.setAttribute("x", circle.getAttribute("cx") || "0");
      annotation.setAttribute(
        "y",
        (Number(circle.getAttribute("cy")) - 10).toString(),
      );
      annotation.setAttribute("text-anchor", "middle");
      circle.parentNode?.appendChild(annotation);
      return rtn;
    },
    // 脉冲动画
    pulse: (count?: number) => {
      return rtn;
    },
    // 轨迹跟踪
    trace: (color?: string) => {
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
      circle.style.pointerEvents = "none";
      return rtn;
    },
    // 解锁交互
    unlock: () => {
      circle.style.pointerEvents = "all";
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
    // 连接其他点
    connect: (
      target: Dot,
      options?: { elastic?: boolean; distance?: number; strength?: number },
    ) => {
      return rtn;
    },
    move,
  };

  /**
   * 获取SVG圆点元素
   */
  function node() {
    return circle;
  }

  /**
   * 移动点到新位置
   * @param x 新的x坐标
   * @param y 新的y坐标
   * @returns 点对象
   */
  function move(x: number, y: number) {
    circle.setAttribute("cx", x.toString());
    circle.setAttribute("cy", y.toString());
    return rtn;
  }

  /**
   * 调整点的大小
   * @param radius 新的半径
   * @returns 点对象
   */
  function resize(radius: number) {
    circle.setAttribute("r", radius.toString());
    return rtn;
  }

  /**
   * 设置描边颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 点对象
   */
  function stroke(color?: string) {
    const theme = getTheme();
    circle.setAttribute("stroke", color || theme.colors.marker.stroke);
    return rtn;
  }

  /**
   * 设置填充颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 点对象
   */
  function fill(color?: string) {
    const theme = getTheme();
    circle.setAttribute("fill", color || theme.colors.marker.fill);
    return rtn;
  }

  /**
   * 设置边框宽度
   * @param width 边框宽度
   * @returns 点对象
   */
  function border(width: number) {
    circle.setAttribute("stroke-width", width.toString());
    return rtn;
  }

  // 焦点事件回调数组
  const focusEvents: (() => void)[] = [];
  function onFocus(callback: () => void) {
    focusEvents.push(callback);
    return rtn;
  }

  /**
   * 设置焦点效果
   * @param color 焦点状态的颜色
   * @returns 点对象
   */
  function focus(color: string) {
    focusEvents.forEach((callback) => callback());
    const oldColor = circle.getAttribute("stroke") || "#000000"; // Provide default color if attribute is null
    circle.addEventListener("mouseover", () => {
      console.log("focus", color);
      circle.setAttribute("stroke", color);
    });
    circle.addEventListener("mouseout", () => {
      circle.setAttribute("stroke", oldColor);
    });
    return rtn;
  }

  // 选择事件回调数组
  const selectEvents: (() => void)[] = [];
  function onSelect(callback: () => void) {
    selectEvents.push(callback);
    return rtn;
  }

  /**
   * 设置选择效果
   * @param color 选中状态的颜色
   * @returns 点对象
   */
  function select(color: string) {
    selectEvents.forEach((callback) => callback());
    const oldColor = circle.getAttribute("stroke") || "#000000"; // Provide default color if attribute is null
    let isMouseOver = false;
    circle.addEventListener("mousedown", () => {
      isMouseOver = true;
    });
    circle.addEventListener("mouseout", () => {
      isMouseOver = false;
    });
    circle.addEventListener("click", () => {
      if (isMouseOver) {
        circle.setAttribute("stroke", color);
      }
    });
    document.addEventListener("click", () => {
      if (!isMouseOver) {
        circle.setAttribute("stroke", oldColor);
      }
    });
    return rtn;
  }

  /**
   * 设置点的样式
   * @param options 样式选项，包括半径、描边、填充等
   * @returns 点对象
   */
  function style(options: {
    radius?: number;
    strokeWidth?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    fillColor?: string;
    fillOpacity?: number;
    cursor?: string;
    filter?: string;
    visibility?: "visible" | "hidden";
    pointerEvents?: "none" | "all";
  }) {
    if (options.radius) circle.setAttribute("r", options.radius.toString());
    if (options.strokeWidth)
      circle.setAttribute("stroke-width", options.strokeWidth.toString());
    if (options.strokeColor) circle.setAttribute("stroke", options.strokeColor);
    if (options.strokeOpacity)
      circle.setAttribute("stroke-opacity", options.strokeOpacity.toString());
    if (options.strokeDasharray)
      circle.setAttribute("stroke-dasharray", options.strokeDasharray);
    if (options.fillColor) circle.setAttribute("fill", options.fillColor);
    if (options.fillOpacity)
      circle.setAttribute("fill-opacity", options.fillOpacity.toString());
    if (options.cursor) circle.style.cursor = options.cursor;
    if (options.filter) circle.style.filter = options.filter;
    if (options.visibility) circle.style.visibility = options.visibility;
    if (options.pointerEvents)
      circle.style.pointerEvents = options.pointerEvents;
    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 点对象
   */
  function animation(options: Animation) {
    const animations: string[] = [];
    // 获取当前实际值
    const current = parsePositionParams();
    let fromX = current.x;
    let fromY = current.y;
    let fromRadius = current.r;

    let toX = current.x;
    let toY = current.y;
    let toRadius = current.r;

    const delay = options.delay || 0;
    const duration = options.duration || 300;

    if (options.properties) {
      // 先设置初始位置
      if (options.properties["x1"]?.from !== undefined) {
        fromX = Number(options.properties["x1"].from);
      }
      if (options.properties["y1"]?.from !== undefined) {
        fromY = -Number(options.properties["y1"].from);
      }
      if (options.properties["r"]?.from !== undefined) {
        fromRadius = Number(options.properties["r"].from);
      }

      // 立即更新到初始位置
      circle.setAttribute("cx", fromX.toString());
      circle.setAttribute("cy", fromY.toString());
      circle.setAttribute("r", fromRadius.toString());

      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        if (prop === "x1") {
          toX = Number(to);
        } else if (prop === "y1") {
          toY = -Number(to);
        } else if (prop === "r") {
          toRadius = Number(to);
        } else {
          const currentValue =
            from !== undefined
              ? from
              : circle.style.getPropertyValue(prop) ||
                circle.getAttribute(prop) ||
                "";
          circle.style.setProperty(prop, currentValue);
          animations.push(
            `${prop} ${duration}ms ${options.easing || "ease"} ${delay}ms`,
          );
          setTimeout(() => circle.style.setProperty(prop, to), delay);
        }
      });

      if (
        options.properties["x1"] ||
        options.properties["y1"] ||
        options.properties["r"]
      ) {
        const startTime = performance.now() + delay;

        function animate(currentTime: number) {
          if (currentTime < startTime) {
            requestAnimationFrame(animate);
            return;
          }

          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const currentX = fromX + (toX - fromX) * progress;
          const currentY = fromY + (toY - fromY) * progress;
          const currentRadius = fromRadius + (toRadius - fromRadius) * progress;

          circle.setAttribute("cx", currentX.toString());
          circle.setAttribute("cy", currentY.toString());
          circle.setAttribute("r", currentRadius.toString());

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      }
    }

    circle.style.transition = animations.join(", ");
    options.onStart?.();
    if (options.onEnd) {
      setTimeout(options.onEnd, duration + delay);
    }
    return rtn;
  }

  /**
   * 添加事件监听器
   * @param type 事件类型
   * @param handler 事件处理函数
   * @returns 包含移除监听器方法的对象
   */
  function event(type: string, handler: (e: Event) => void) {
    circle.addEventListener(type, handler);
    return {
      remove: () => circle.removeEventListener(type, handler),
      rtn,
    };
  }

  /**
   * 设置属性
   * @param name 属性名
   * @param value 属性值
   * @returns 点对象
   */
  function attr(name: string, value: string) {
    circle.setAttribute(name, value);
    return rtn;
  }

  /**
   * 设置数据属性
   * @param key 数据键名
   * @param value 数据值
   * @returns 点对象
   */
  function data(key: string, value: any) {
    circle.dataset[key] = value;
    return rtn;
  }

  /**
   * 添加CSS类
   * @param names 类名或类名数组
   * @returns 包含移除类名方法的对象
   */
  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      circle.classList.add(...names);
    } else {
      circle.classList.add(names);
    }
    return {
      remove: () =>
        circle.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn,
    };
  }

  /**
   * 添加工具提示
   * @param content 提示内容，可以是字符串或HTML元素
   * @param options 提示选项，包括位置、偏移和样式
   * @returns 点对象
   */
  function tooltip(
    content: string | HTMLElement,
    options: {
      position?: "top" | "bottom" | "left" | "right";
      offset?: [number, number];
      className?: string;
      style?: Partial<CSSStyleDeclaration>;
    } = {},
  ) {
    const tip = document.createElement("div");
    if (typeof content === "string") {
      tip.textContent = content;
    } else {
      tip.appendChild(content);
    }
    if (options.className) tip.className = options.className;
    if (options.style) Object.assign(tip.style, options.style);

    circle.addEventListener("mouseenter", () => {
      document.body.appendChild(tip);
      const rect = circle.getBoundingClientRect();
      // Position tooltip based on options.position
      // ...
    });

    circle.addEventListener("mouseleave", () => {
      tip.remove();
    });

    return rtn;
  }

  /**
   * 添加视觉效果
   * @param type 效果类型：'glow'发光、'shadow'阴影、'blur'模糊
   * @param options 效果选项，包括颜色、强度等
   * @returns 点对象
   */
  function effect(
    type: "glow" | "shadow" | "blur",
    options: {
      color?: string;
      strength?: number;
      spread?: number;
    } = {},
  ) {
    const { color = "#000", strength = 5, spread = 0 } = options;
    switch (type) {
      case "glow":
        circle.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case "shadow":
        circle.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case "blur":
        circle.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  return rtn;
}
