/**
 * @file arc.ts
 * @description 圆弧绘制模块，提供创建和操作SVG圆弧的功能
 */

import { getTheme } from "../theme";
import { Arc } from "../interfaces/geometry";
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
 * 创建一个圆弧对象
 * @param x 圆心x坐标
 * @param y 圆心y坐标
 * @param radius 圆弧半径，默认50
 * @returns 圆弧对象，包含多种操作方法
 */
export function arc(x: number, y: number, radius: number = 50): Arc {
  // 创建SVG路径元素
  const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // 初始化为0度弧
  arc.setAttribute("d", describeArc(x, y, radius, 0, 0));

  // 应用主题样式
  const theme = getTheme();
  arc.setAttribute("stroke", theme.colors.primary);
  arc.setAttribute("fill", "none");

  // 返回对象，包含所有可用的操作方法
  const rtn = {
    node: () => arc,
    from,
    to,
    stroke,
    fill,
    transform,
    animation,
    event,
    attr,
    data,
    class_,
    tooltip,
    effect,
    // 缩放方法
    scale: (x: number, y: number = x) => {
      const currentD = arc.getAttribute("d") || "";
      const scaledD = currentD.replace(/[\d.-]+/g, (match) => {
        const num = parseFloat(match);
        return (num * x).toString();
      });
      arc.setAttribute("d", scaledD);
      return rtn;
    },
    // 偏移方法
    offset: (x: number, y: number) => {
      const transform = arc.getAttribute("transform") || "";
      arc.setAttribute("transform", transform + ` translate(${x},${y})`);
      return rtn;
    },
    // 以下方法为占位符，保持接口一致性
    samples: (n: number) => rtn,
    update: (newFn: (x: number) => number, newRange?: [number, number]) => rtn,
    range: (min: number, max: number) => rtn,
    domain: (min: number, max: number) => rtn,
    // 样式设置
    style: (options: any) => {
      if (options.color) arc.setAttribute("stroke", options.color);
      if (options.width)
        arc.setAttribute("stroke-width", options.width.toString());
      if (options.opacity)
        arc.setAttribute("opacity", options.opacity.toString());
      return rtn;
    },
    // 高亮显示
    highlight: (duration?: number) => {
      return rtn;
    },
    // 添加注释
    annotate: (
      text: string,
      position?: "top" | "bottom" | "left" | "right",
    ) => {
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
      arc.style.pointerEvents = "none";
      return rtn;
    },
    // 解锁交互
    unlock: () => {
      arc.style.pointerEvents = "all";
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
    // 连接其他圆弧
    connect: (
      target: Arc,
      options?: { elastic?: boolean; distance?: number; strength?: number },
    ) => {
      return rtn;
    },
    // 绘制动画
    animateDrawing: (duration: number = 1000) => {
      requestAnimationFrame(() => {
        const length = arc.getTotalLength?.() || 0;
        if (length === 0) return rtn;

        arc.style.strokeDasharray = length.toString();
        arc.style.strokeDashoffset = length.toString();

        arc.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration,
          easing: "ease-in-out",
          fill: "forwards",
        });
      });
      return rtn;
    },
    // 显示圆弧
    show: () => {
      arc.style.display = "";
      return rtn;
    },
    // 隐藏圆弧
    hide: () => {
      arc.style.display = "none";
      return rtn;
    },
    // 设置透明度
    opacity: (value: number) => {
      arc.style.opacity = value.toString();
      return rtn;
    },
    // 移除圆弧
    remove: () => {
      arc.remove();
    },
    // 形状变形
    morph: (target: Arc, duration: number = 1000) => {
      if (!target?.node()) return rtn;
      const targetArc = target.node();
      gsap.to(arc, {
        duration: duration / 1000,
        attr: { d: targetArc.getAttribute("d") },
        ease: "power1.inOut",
      });
      return rtn;
    },
  };

  /**
   * 设置圆弧起始角度
   * @param startAngle 起始角度（度）
   * @returns 圆弧对象
   */
  function from(startAngle: number) {
    const endAngle = Number(arc.dataset.endAngle || 0);
    arc.dataset.startAngle = startAngle.toString();
    arc.setAttribute("d", describeArc(x, y, radius, startAngle, endAngle));
    return rtn;
  }

  /**
   * 设置圆弧结束角度
   * @param endAngle 结束角度（度）
   * @returns 圆弧对象
   */
  function to(endAngle: number) {
    const startAngle = Number(arc.dataset.startAngle || 0);
    arc.dataset.endAngle = endAngle.toString();
    arc.setAttribute("d", describeArc(x, y, radius, startAngle, endAngle));
    return rtn;
  }

  /**
   * 设置描边颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 圆弧对象
   */
  function stroke(color?: string) {
    const theme = getTheme();
    arc.setAttribute("stroke", color || theme.colors.primary);
    return rtn;
  }

  /**
   * 设置填充颜色
   * @param color 可选的颜色值，未指定则使用次要主题色
   * @returns 圆弧对象
   */
  function fill(color?: string) {
    const theme = getTheme();
    arc.setAttribute("fill", color || theme.colors.secondary);
    return rtn;
  }

  /**
   * 应用变换
   * @param options 变换选项，包括平移、缩放、旋转和倾斜
   * @returns 圆弧对象
   */
  function transform(options: Transform) {
    let transform = "";
    if (options.translate) {
      transform += `translate(${options.translate[0]},${options.translate[1]}) `;
    }
    if (options.scale) {
      if (Array.isArray(options.scale)) {
        transform += `scale(${options.scale[0]},${options.scale[1]}) `;
      } else {
        transform += `scale(${options.scale}) `;
      }
    }
    if (options.rotate) {
      transform += `rotate(${options.rotate}) `;
    }
    if (options.skew) {
      transform += `skew(${options.skew[0]},${options.skew[1]}) `;
    }
    if (options.origin) {
      arc.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    arc.setAttribute("transform", transform.trim());
    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 圆弧对象
   */
  function animation(options: Animation) {
    const animations: string[] = [];
    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        arc.style.setProperty(prop, from);
        animations.push(
          `${prop} ${options.duration || 300}ms ${options.easing || "ease"}`,
        );
        setTimeout(() => arc.style.setProperty(prop, to), 0);
      });
    }
    arc.style.transition = animations.join(", ");
    options.onStart?.();
    if (options.onEnd) {
      setTimeout(
        options.onEnd,
        (options.duration || 300) + (options.delay || 0),
      );
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
    arc.addEventListener(type, handler);
    return {
      remove: () => arc.removeEventListener(type, handler),
      rtn,
    };
  }

  /**
   * 设置属性
   * @param name 属性名
   * @param value 属性值
   * @returns 圆弧对象
   */
  function attr(name: string, value: string) {
    arc.setAttribute(name, value);
    return rtn;
  }

  /**
   * 设置数据属性
   * @param key 数据键名
   * @param value 数据值
   * @returns 圆弧对象
   */
  function data(key: string, value: any) {
    arc.dataset[key] = value;
    return rtn;
  }

  /**
   * 添加CSS类
   * @param names 类名或类名数组
   * @returns 包含移除类名方法的对象
   */
  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      arc.classList.add(...names);
    } else {
      arc.classList.add(names);
    }
    return {
      remove: () =>
        arc.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn,
    };
  }

  /**
   * 添加工具提示
   * @param content 提示内容，可以是字符串或HTML元素
   * @param options 提示选项，包括位置、样式等
   * @returns 圆弧对象
   */
  function tooltip(
    content: string | HTMLElement,
    options: TooltipOptions = {},
  ) {
    const tip = document.createElement("div");
    if (typeof content === "string") {
      tip.textContent = content;
    } else {
      tip.appendChild(content);
    }
    if (options.className) tip.className = options.className;
    if (options.style) Object.assign(tip.style, options.style);

    arc.addEventListener("mouseenter", (e) => {
      document.body.appendChild(tip);
      const rect = arc.getBoundingClientRect();
      const [offsetX = 0, offsetY = 0] = options.offset || [0, 0];

      switch (options.position) {
        case "top":
          tip.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
          tip.style.top = `${rect.top - tip.offsetHeight + offsetY}px`;
          break;
        case "bottom":
          tip.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
          tip.style.top = `${rect.bottom + offsetY}px`;
          break;
        case "left":
          tip.style.left = `${rect.left - tip.offsetWidth + offsetX}px`;
          tip.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
          break;
        case "right":
          tip.style.left = `${rect.right + offsetX}px`;
          tip.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
          break;
        default:
          tip.style.left = `${e.pageX + offsetX}px`;
          tip.style.top = `${e.pageY + offsetY}px`;
      }
    });

    arc.addEventListener("mouseleave", () => {
      tip.remove();
    });

    return rtn;
  }

  /**
   * 添加视觉效果
   * @param type 效果类型：'glow'发光、'shadow'阴影、'blur'模糊
   * @param options 效果选项，包括颜色、强度等
   * @returns 圆弧对象
   */
  function effect(
    type: "glow" | "shadow" | "blur",
    options: EffectOptions = {},
  ) {
    const { color = "#000", strength = 5, spread = 0 } = options;
    switch (type) {
      case "glow":
        arc.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case "shadow":
        arc.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case "blur":
        arc.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  return rtn;
}

/**
 * 将极坐标转换为笛卡尔坐标
 * @param centerX 中心点x坐标
 * @param centerY 中心点y坐标
 * @param radius 半径
 * @param angleInDegrees 角度（度）
 * @returns 笛卡尔坐标点
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * 生成圆弧SVG路径数据
 * @param x 圆心x坐标
 * @param y 圆心y坐标
 * @param radius 半径
 * @param startAngle 起始角度（度）
 * @param endAngle 结束角度（度）
 * @returns SVG路径数据字符串
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const sweepFlag = "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    end.x,
    end.y,
  ].join(" ");
}
