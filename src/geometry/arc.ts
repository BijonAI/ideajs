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
  arc.setAttribute("x1", x.toString());
  arc.setAttribute("y1", (-y).toString());
  arc.setAttribute("r", radius.toString());
  arc.setAttribute("startAngle", "0");
  arc.setAttribute("endAngle", "0");

  // 初始化为0度弧，并存储初始值
  arc.setAttribute("d", describeArc(x, -y, radius, 0, 0));

  // 应用主题样式
  const theme = getTheme();
  arc.setAttribute("stroke", theme.colors.primary);
  arc.setAttribute("fill", "none");
  let unit = 1;
  // 返回对象，包含所有可用的操作方法
  const rtn = {
    node: () => arc,
    setUnit: (_unit: number) => {
      unit = _unit;
      x = x * unit;
      y = y * unit;
      radius = radius * unit;
      // 更新圆弧的位置和大小
      arc.setAttribute("x1", (x).toString());
      arc.setAttribute("y1", (-y).toString());
      arc.setAttribute("r", (radius).toString());
      arc.setAttribute("d", describeArc(x, -y, radius, 0, 0));
      return rtn;
    },
    info: () => {
      let infoData = {
        ...rtn,
        type: "arc",
        x: x / unit,
        y: y / unit,
        radius: radius / unit,
      };
      return infoData;
    },
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
      const pathData =
        targetArc.getAttribute("d") || arc.getAttribute("d") || "";
      gsap.to(arc, {
        duration: duration / 1000,
        attr: { d: pathData },
        ease: "power1.inOut",
      });
      return rtn;
    },
  };

  /**
   * 从path的d属性中解析当前的圆弧参数
   * @returns 解析出的参数对象
   */
  function parsePositionParams() {
    return {
      x: Number(arc.getAttribute("x1")),
      y: -Number(arc.getAttribute("y1")),
      radius: Number(arc.getAttribute("r")),
      startAngle: Number(arc.getAttribute("startAngle")),
      endAngle: Number(arc.getAttribute("endAngle")),
    };
  }

  /**
   * 设置圆弧起始角度
   * @param startAngle 起始角度（度）
   * @returns 圆弧对象
   */
  function from(startAngle: number) {
    const endAngle = Number(arc.dataset.endAngle || 0);
    arc.setAttribute("startAngle", startAngle.toString());
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
    arc.setAttribute("endAngle", endAngle.toString());
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
    // 获取当前参数
    const current = parsePositionParams();
    let currentX = current.x;
    let currentY = current.y;
    let currentRadius = current.radius;
    let currentStartAngle = current.startAngle;
    let currentEndAngle = current.endAngle;

    let newX = currentX;
    let newY = currentY;
    let newRadius = currentRadius;
    let newStartAngle = currentStartAngle;
    let newEndAngle = currentEndAngle;

    // origin直接修改圆心位置
    if (options.origin) {
      currentX = options.origin[0];
      currentY = options.origin[1];
      // 更新数据集
      arc.dataset.x = newX.toString();
      arc.dataset.y = newY.toString();
      // 直接更新路径
      arc.setAttribute(
        "d",
        describeArc(newX, newY, newRadius, newStartAngle, newEndAngle),
      );
      return rtn;
    }

    // 平移直接修改圆心坐标
    if (options.translate) {
      newX += options.translate[0];
      newY += options.translate[1];
    }

    // 缩放直接修改半径
    if (options.scale) {
      const scaleX = Array.isArray(options.scale)
        ? options.scale[0]
        : options.scale;
      newRadius *= scaleX;
    }

    // 旋转直接修改角度
    if (options.rotate) {
      newStartAngle = (newStartAngle + options.rotate) % 360;
      newEndAngle = (newEndAngle + options.rotate) % 360;
    }

    // skew保持使用SVG transform
    if (options.skew) {
      // transform += `skew(${options.skew[0]},${options.skew[1]}) `;
      // arc.setAttribute("transform", transform.trim());
    }
    arc.setAttribute(
      "d",
      describeArc(newX, newY, newRadius, newStartAngle, newEndAngle),
    );
    arc.setAttribute("x1", newX.toString());
    arc.setAttribute("y1", (-newY).toString());
    arc.setAttribute("r", newRadius.toString());
    arc.setAttribute("startAngle", newStartAngle.toString());
    arc.setAttribute("endAngle", newEndAngle.toString());

    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 圆弧对象
   */
  function animation(options: Animation) {
    const animations: string[] = [];
    // 获取当前实际值
    const current = parsePositionParams();
    let fromX = current.x;
    let fromY = current.y;
    let fromRadius = current.radius;
    let fromStartAngle = current.startAngle;
    let fromEndAngle = current.endAngle;

    let toX = current.x;
    let toY = current.y;
    let toRadius = current.radius;
    let toStartAngle = current.startAngle;
    let toEndAngle = current.endAngle;

    const delay = options.delay || 0;
    const duration = options.duration || 300;

    if (options.properties) {
      // 先设置初始位置
      if (options.properties["x1"]?.from !== undefined) {
        fromX = Number(options.properties["x1"].from*unit);
      }
      if (options.properties["y1"]?.from !== undefined) {
        fromY = Number(options.properties["y1"].from*unit);
      }
      if (options.properties["r"]?.from !== undefined) {
        fromRadius = Number(options.properties["r"].from*unit);
      }
      if (options.properties["startAngle"]?.from !== undefined) {
        fromStartAngle = Number(options.properties["startAngle"].from);
      }
      if (options.properties["endAngle"]?.from !== undefined) {
        fromEndAngle = Number(options.properties["endAngle"].from);
      }

      // 立即更新到初始位置
      arc.setAttribute(
        "d",
        describeArc(fromX, fromY, fromRadius, fromStartAngle, fromEndAngle),
      );

      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        if (prop === "x1") toX = Number(to)*unit;
        else if (prop === "y1") toY = Number(to)*unit;
        else if (prop === "r") toRadius = Number(to)*unit;
        else if (prop === "startAngle") toStartAngle = Number(to);
        else if (prop === "endAngle") toEndAngle = Number(to);
        else {
          const currentValue =
            from !== undefined
              ? from
              : arc.style.getPropertyValue(prop) ||
                arc.getAttribute(prop) ||
                "";
          arc.style.setProperty(prop, currentValue);
          animations.push(
            `${prop} ${duration}ms ${options.easing || "ease"} ${delay}ms`,
          );
          setTimeout(() => arc.style.setProperty(prop, to), delay);
        }
      });

      if (
        options.properties["x1"] ||
        options.properties["y1"] ||
        options.properties["r"] ||
        options.properties["startAngle"] ||
        options.properties["endAngle"]
      ) {
        const startTime = performance.now() + delay; // Add delay to start time

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
          const currentStartAngle =
            fromStartAngle + (toStartAngle - fromStartAngle) * progress;
          const currentEndAngle =
            fromEndAngle + (toEndAngle - fromEndAngle) * progress;

          arc.setAttribute(
            "d",
            describeArc(
              currentX,
              currentY,
              currentRadius,
              currentStartAngle,
              currentEndAngle,
            ),
          );

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      }
    }

    arc.style.transition = animations.join(", ");
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
 * 将角度转换为SVG坐标点
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  // 转换为弧度，注意在SVG中y轴向下为正
  const angleInRadians = (-angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * 生成圆弧SVG路径数据
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  // 计算角度差
  let angleDiff = (endAngle - startAngle) % 360;
  if (angleDiff === 0 && endAngle !== startAngle) {
    return [
      "M",
      x + radius,
      -y,
      "A",
      radius,
      radius,
      0,
      "1",
      "0",
      x - radius,
      -y,
      "A",
      radius,
      radius,
      0,
      "1",
      "0",
      x + radius,
      -y,
    ].join(" ");
  }

  // 获取起点和终点坐标
  const start = polarToCartesian(x, -y, radius, startAngle);
  const end = polarToCartesian(x, -y, radius, endAngle);

  // 确定是否使用大弧
  const largeArcFlag = angleDiff > 180 ? "1" : "0";

  // 使用0表示逆时针方向
  const sweepFlag = "0";

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
