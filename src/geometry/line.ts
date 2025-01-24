import { getTheme } from "../theme";
import {
  Line,
  LineStyle,
  MarkerOptions,
  GradientStop,
} from "../interfaces/geometry";
import {
  Transform,
  Animation,
  TooltipOptions,
  EffectOptions,
  TeachingOptions,
  AnimationStep,
} from "../interfaces/common";
import { draggable } from "../utils/draggable";
import { gsap } from "gsap";

/**
 * 创建一条线段
 * @param x1 起始点的 x 坐标
 * @param y1 起始点的 y 坐标
 * @param x2 结束点的 x 坐标
 * @param y2 结束点的 y 坐标
 * @returns 线段对象，包含一系列方法
 */
export function line(x1: number, y1: number, x2: number, y2: number): Line {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // line.setAttribute("transform", `translate(${x1}, ${-y1})`);

  // 应用主题样式
  const theme = getTheme();

  // 创建线段元素
  const lineElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line",
  );
  lineElement.setAttribute("stroke", theme.colors.primary);
  lineElement.setAttribute("stroke-width", theme.sizes.function.toString());
  lineElement.setAttribute("x1", x1.toString());
  lineElement.setAttribute("y1", (-y1).toString());
  lineElement.setAttribute("x2", x2.toString());
  lineElement.setAttribute("y2", (-y2).toString());

  // 创建起点圆点
  const startPoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  startPoint.setAttribute("r", "4");
  startPoint.setAttribute("fill", theme.colors.primary);
  startPoint.setAttribute("cx", x1.toString());
  startPoint.setAttribute("cy", (-y1).toString());
  startPoint.style.cursor = "move";

  // 创建终点圆点
  const endPoint = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  endPoint.setAttribute("r", "4");
  endPoint.setAttribute("fill", theme.colors.primary);
  endPoint.setAttribute("cx", x2.toString());
  endPoint.setAttribute("cy", (-y2).toString());
  endPoint.style.cursor = "move";

  // 更新终点圆点位置
  // function updateEndPoint() {
  //   const x2 = Number(lineElement.getAttribute("x2"));
  //   const y2 = Number(lineElement.getAttribute("y2"));
  //   endPoint.setAttribute("cx", x2.toString());
  //   endPoint.setAttribute("cy", y2.toString());
  // }

  // 将元素添加到线段组中
  line.append(lineElement, startPoint, endPoint);

  let dragEnabled = false;
  // 添加起点拖拽功能
  let isDraggingStart = false;
  let isDraggingEnd = false;
  // updateEndPoint();

  // 返回线段对象
  const rtn = {
    node: () => line, // 返回当前线段的 SVG 元素
    from, // 设置起始点
    to, // 设置结束点
    stroke, // 设置线段颜色
    style, // 设置样式
    transform, // 设置变换
    animation, // 动画效果
    event, // 事件监听器
    attr, // 设置属性
    data, // 设置数据
    class_, // 设置类名
    tooltip, // 设置提示框
    effect, // 设置效果（如阴影、发光等）
    length, // 计算线段长度
    angle, // 计算线段角度
    midpoint, // 计算中点
    parallel, // 获取平行线
    perpendicular, // 获取垂直线
    extend, // 延长线段
    trim, // 修剪线段
    dash, // 设置虚线样式
    marker, // 设置线段的标记（如箭头）
    gradient, // 设置渐变
    measure, // 测量线段
    animateDrawing, // 绘制动画
    constrain, // 约束
    highlight, // 高亮
    annotate, // 添加注释
    pulse, // 脉冲效果
    trace, // 跟踪线条
    teachingMode, // 启用教学模式
    step, // 步骤动画
    lock, // 锁定线段
    unlock, // 解锁线段
    restrict, // 限制范围
    snap, // 吸附
    connect, // 连接线段
    show: () => {
      line.style.display = ""; // 显示线段
      return rtn;
    },
    hide: () => {
      line.style.display = "none"; // 隐藏线段
      return rtn;
    },
    opacity: (value: number) => {
      line.style.opacity = value.toString(); // 设置透明度
      return rtn;
    },
    remove: () => {
      line.remove(); // 移除线段
    },
    morph: (target: Line, duration: number = 1000) => {
      // 变形动画，将线段从当前位置变化到目标位置
      if (!target?.node()) return rtn;
      const targetLine = target.node();
      gsap.to(lineElement, {
        duration: duration / 1000, // 动画持续时间
        attr: {
          x1,
          y1: -y1,
          x2,
          y2: -y2,
        },
        ease: "power1.inOut", // 动画的缓动效果
      });
      return rtn;
    },
    scale: (x: number, y: number = x) => {
      // 对线段进行缩放
      lineElement.setAttribute(
        "d",
        `M ${x1 * x} ${-y1 * y} L ${x2 * x} ${-y2 * y}`,
      );
      return rtn;
    },
    draggable: enableDragging,
  };

  function from(x: number, y: number) {
    line.setAttribute("transform", `translate(${x}, ${y})`);
    return rtn;
  }

  function to(x: number, y: number) {
    lineElement.setAttribute("x2", x.toString());
    lineElement.setAttribute("y2", y.toString());
    // updateEndPoint();
    return rtn;
  }

  function stroke(color?: string) {
    const theme = getTheme();
    lineElement.setAttribute("stroke", color || theme.colors.primary);
    return rtn;
  }

  function style(options: {
    strokeWidth?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "miter" | "round" | "bevel";
    cursor?: string;
    filter?: string;
    visibility?: "visible" | "hidden";
    pointerEvents?: "none" | "all";
  }) {
    if (options.strokeWidth)
      lineElement.setAttribute("stroke-width", options.strokeWidth.toString());
    if (options.strokeColor)
      lineElement.setAttribute("stroke", options.strokeColor);
    if (options.strokeOpacity)
      lineElement.setAttribute(
        "stroke-opacity",
        options.strokeOpacity.toString(),
      );
    if (options.strokeDasharray)
      lineElement.setAttribute("stroke-dasharray", options.strokeDasharray);
    if (options.lineCap)
      lineElement.setAttribute("stroke-linecap", options.lineCap);
    if (options.lineJoin)
      lineElement.setAttribute("stroke-linejoin", options.lineJoin);
    if (options.cursor) lineElement.style.cursor = options.cursor;
    if (options.filter) lineElement.style.filter = options.filter;
    if (options.visibility) lineElement.style.visibility = options.visibility;
    if (options.pointerEvents)
      lineElement.style.pointerEvents = options.pointerEvents;
    return rtn;
  }

  function length() {
    const x = Number(lineElement.getAttribute("x2"));
    const y = Number(lineElement.getAttribute("y2"));
    return Math.sqrt(x * x + y * y);
  }

  function angle() {
    const x = Number(lineElement.getAttribute("x2"));
    const y = Number(lineElement.getAttribute("y2"));
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  function midpoint() {
    const x = Number(lineElement.getAttribute("x2"));
    const y = Number(lineElement.getAttribute("y2"));
    return {
      x: x / 2,
      y: y / 2,
    };
  }

  function parallel(distance: number) {
    const angle = Math.atan2(
      Number(lineElement.getAttribute("y2")),
      Number(lineElement.getAttribute("x2")),
    );
    const dx = distance * Math.sin(angle);
    const dy = distance * Math.cos(angle);
    return line(x1 + dx, -y1 - dy, x2 + dx, -y2 - dy);
  }

  function perpendicular(point: { x: number; y: number }) {
    const dx = Number(lineElement.getAttribute("x2"));
    const dy = Number(lineElement.getAttribute("y2"));
    const mag = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / mag;
    const ny = dx / mag;
    return line(point.x, point.y, point.x + nx, point.y + ny);
  }

  function extend(start: number = 0, end: number = 0) {
    const angle = Math.atan2(
      Number(lineElement.getAttribute("y2")),
      Number(lineElement.getAttribute("x2")),
    );
    const newX1 = x1 - start * Math.cos(angle);
    const newY1 = -y1 - start * Math.sin(angle);
    const newX2 = x2 + end * Math.cos(angle);
    const newY2 = -y2 + end * Math.sin(angle);
    lineElement.setAttribute("x1", newX1.toString());
    lineElement.setAttribute("y1", newY1.toString());
    lineElement.setAttribute("x2", newX2.toString());
    lineElement.setAttribute("y2", newY2.toString());
    return rtn;
  }

  function trim(start: number = 0, end: number = 0) {
    const len = Math.sqrt(
      Number(lineElement.getAttribute("x2")) *
        Number(lineElement.getAttribute("x2")) +
        Number(lineElement.getAttribute("y2")) *
          Number(lineElement.getAttribute("y2")),
    );
    const angle = Math.atan2(
      Number(lineElement.getAttribute("y2")),
      Number(lineElement.getAttribute("x2")),
    );
    const newX1 = x1 + start * Math.cos(angle);
    const newY1 = -y1 + start * Math.sin(angle);
    const newX2 = x1 + (len - end) * Math.cos(angle);
    const newY2 = -y1 + (len - end) * Math.sin(angle);
    lineElement.setAttribute("x1", newX1.toString());
    lineElement.setAttribute("y1", newY1.toString());
    lineElement.setAttribute("x2", newX2.toString());
    lineElement.setAttribute("y2", newY2.toString());
    return rtn;
  }

  function dash(...pattern: number[]) {
    lineElement.setAttribute("stroke-dasharray", pattern.join(","));
    return rtn;
  }

  function marker(
    options: {
      start?: "arrow" | "dot" | "square" | SVGElement;
      end?: "arrow" | "dot" | "square" | SVGElement;
      size?: number;
      color?: string;
    } = {},
  ) {
    const { size = 10, color = lineElement.getAttribute("stroke") } = options;
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    if (options.start) {
      const marker = createMarker("start", options.start, size, color);
      defs.appendChild(marker);
      lineElement.setAttribute("marker-start", `url(#${marker.id})`);
    }

    if (options.end) {
      const marker = createMarker("end", options.end, size, color);
      defs.appendChild(marker);
      lineElement.setAttribute("marker-end", `url(#${marker.id})`);
    }

    lineElement.ownerSVGElement?.appendChild(defs);
    return rtn;
  }

  function gradient(
    stops: Array<{
      offset: number;
      color: string;
      opacity?: number;
    }>,
  ) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient",
    );
    const id = "gradient-" + Math.random().toString(36).substr(2, 9);
    gradient.setAttribute("id", id);

    stops.forEach((stop) => {
      const stopEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop",
      );
      stopEl.setAttribute("offset", stop.offset * 100 + "%");
      stopEl.setAttribute("stop-color", stop.color);
      if (stop.opacity !== undefined) {
        stopEl.setAttribute("stop-opacity", stop.opacity.toString());
      }
      gradient.appendChild(stopEl);
    });

    defs.appendChild(gradient);
    lineElement.ownerSVGElement?.appendChild(defs);
    lineElement.setAttribute("stroke", `url(#${id})`);
    return rtn;
  }

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
      lineElement.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    lineElement.setAttribute("transform", transform.trim());
    return rtn;
  }

  function animation(options: Animation) {
    const animations: string[] = [];
    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        lineElement.style.setProperty(prop, from);
        animations.push(
          `${prop} ${options.duration || 300}ms ${options.easing || "ease"}`,
        );
        setTimeout(() => lineElement.style.setProperty(prop, to), 0);
      });
    }
    lineElement.style.transition = animations.join(", ");
    options.onStart?.();
    if (options.onEnd) {
      setTimeout(
        options.onEnd,
        (options.duration || 300) + (options.delay || 0),
      );
    }
    return rtn;
  }

  function event(type: string, handler: (e: Event) => void) {
    lineElement.addEventListener(type, handler);
    return {
      remove: () => lineElement.removeEventListener(type, handler),
      rtn,
    };
  }

  function attr(name: string, value: string) {
    lineElement.setAttribute(name, value);
    return rtn;
  }

  function data(key: string, value: any) {
    lineElement.dataset[key] = value;
    return rtn;
  }

  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      lineElement.classList.add(...names);
    } else {
      lineElement.classList.add(names);
    }
    return {
      remove: () =>
        lineElement.classList.remove(
          ...(Array.isArray(names) ? names : [names]),
        ),
      rtn,
    };
  }

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

    lineElement.addEventListener("mouseenter", (e) => {
      document.body.appendChild(tip);
      const rect = lineElement.getBoundingClientRect();
      const [offsetX = 0, offsetY = 0] = options.offset || [0, 0];

      // 根据 position 设置提示框位置
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

    lineElement.addEventListener("mouseleave", () => {
      tip.remove();
    });

    return rtn;
  }

  function effect(
    type: "glow" | "shadow" | "blur",
    options: EffectOptions = {},
  ) {
    const { color = "#000", strength = 5, spread = 0 } = options;
    switch (type) {
      case "glow":
        lineElement.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case "shadow":
        lineElement.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case "blur":
        lineElement.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  function measure(
    options: {
      showLength?: boolean;
      showAngle?: boolean;
      unit?: string;
    } = {},
  ) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    if (options.showLength) {
      const length = Math.sqrt(
        Math.pow(Number(lineElement.getAttribute("x2")), 2) +
          Math.pow(Number(lineElement.getAttribute("y2")), 2),
      );
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.textContent = `${length.toFixed(2)}${options.unit || ""}`;
      text.setAttribute(
        "x",
        (Number(lineElement.getAttribute("x2")) / 2).toString(),
      );
      text.setAttribute(
        "y",
        (Number(lineElement.getAttribute("y2")) / 2 - 10).toString(),
      );
      g.appendChild(text);
    }

    if (options.showAngle) {
      const angle =
        (Math.atan2(
          Number(lineElement.getAttribute("y2")),
          Number(lineElement.getAttribute("x2")),
        ) *
          180) /
        Math.PI;
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.textContent = `${angle.toFixed(1)}°`;
      text.setAttribute("x", (x1 - 20).toString());
      text.setAttribute("y", (-y1 - 10).toString());
      g.appendChild(text);
    }

    lineElement.parentNode?.appendChild(g);
    return rtn;
  }

  function animateDrawing(duration: number = 1000) {
    requestAnimationFrame(() => {
      const length = Math.sqrt(
        Math.pow(Number(lineElement.getAttribute("x2")), 2) +
          Math.pow(Number(lineElement.getAttribute("y2")), 2),
      );
      if (length === 0) return rtn;

      lineElement.style.strokeDasharray = length.toString();
      lineElement.style.strokeDashoffset = length.toString();

      lineElement.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration,
          easing: "ease-in-out",
          fill: "forwards",
        },
      );
    });

    return rtn;
  }

  function constrain(options: {
    minLength?: number;
    maxLength?: number;
    angle?: number;
    parallel?: Line;
  }) {
    // 实现约束逻辑
    return rtn;
  }

  function highlight(duration: number = 1000) {
    const originalStroke = lineElement.getAttribute("stroke");
    const originalWidth = lineElement.getAttribute("stroke-width");

    lineElement.setAttribute("stroke", getTheme().colors.primary);
    lineElement.setAttribute(
      "stroke-width",
      (parseFloat(originalWidth || "2") * 2).toString(),
    );

    setTimeout(() => {
      lineElement.setAttribute("stroke", originalStroke || "");
      lineElement.setAttribute("stroke-width", originalWidth || "");
    }, duration);

    return rtn;
  }

  function annotate(
    text: string,
    position: "top" | "bottom" | "left" | "right" = "top",
  ) {
    const annotation = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    annotation.textContent = text;

    const x = (x1 + x2) / 2;
    const y = (-y1 - y2) / 2;

    annotation.setAttribute("x", x.toString());
    annotation.setAttribute(
      "y",
      (position === "bottom" ? y + 20 : y - 10).toString(),
    );
    annotation.setAttribute("text-anchor", "middle");

    lineElement.parentNode?.appendChild(annotation);
    return rtn;
  }

  function pulse(count: number = 3) {
    let currentCount = 0;
    const animate = () => {
      if (currentCount >= count) return;

      const animation = lineElement.animate(
        [{ opacity: "1" }, { opacity: "0.3" }, { opacity: "1" }],
        {
          duration: 1000,
          easing: "ease-in-out",
        },
      );

      animation.onfinish = () => {
        currentCount++;
        if (currentCount < count) animate();
      };
    };

    animate();
    return rtn;
  }

  function trace(color: string = getTheme().colors.secondary) {
    const traceLine = lineElement.cloneNode() as SVGLineElement;
    traceLine.setAttribute("stroke", color);
    traceLine.setAttribute("stroke-opacity", "0.3");
    lineElement.parentNode?.insertBefore(traceLine, lineElement);
    return rtn;
  }

  function teachingMode(options?: TeachingOptions) {
    if (options?.annotations) {
      // 启用标注功能
    }
    return rtn;
  }

  function step(steps: AnimationStep[]) {
    let currentStep = 0;

    function playStep() {
      if (currentStep >= steps.length) return;

      const step = steps[currentStep];
      step.action();

      currentStep++;
      if (currentStep < steps.length) {
        setTimeout(playStep, step.duration);
      }
    }

    playStep();
    return rtn;
  }

  function lock() {
    lineElement.style.pointerEvents = "none";
    return rtn;
  }

  function unlock() {
    lineElement.style.pointerEvents = "all";
    return rtn;
  }

  function restrict(bounds: { x: [number, number]; y: [number, number] }) {
    // 实现坐标限制逻辑
    return rtn;
  }

  function snap(gridSize: number) {
    // 实现网格吸附逻辑
    return rtn;
  }

  function connect(
    target: Line,
    options?: {
      elastic?: boolean;
      distance?: number;
      strength?: number;
    },
  ) {
    // 实现连接逻辑
    return rtn;
  }

  function enableDragging() {
    if (dragEnabled) return rtn;
    dragEnabled = true;

    let startDragX = 0;
    let startDragY = 0;
    let startLineX = 0;
    let startLineY = 0;

    draggable(
      startPoint,
      (_x, _y) => true,
      (x, y) => {
        if (!isDraggingStart) {
          startDragX = x;
          startDragY = y;
          startLineX = Number(lineElement.getAttribute("x1"));
          startLineY = Number(lineElement.getAttribute("y1"));
          isDraggingStart = true;
        }

        const dx = x - startDragX + x1;
        const dy = y - startDragY - y1;

        // 更新线段起点位置
        const newX = startLineX + dx;
        const newY = startLineY + dy;

        lineElement.setAttribute("x1", newX.toString());
        lineElement.setAttribute("y1", newY.toString());
      },
    );

    // 添加终点拖拽功能
    let endDragX = 0;
    let endDragY = 0;
    let endLineX = 0;
    let endLineY = 0;

    draggable(
      endPoint,
      (_x, _y) => true,
      (x, y) => {
        if (!isDraggingEnd) {
          endDragX = x;
          endDragY = y;
          endLineX = Number(lineElement.getAttribute("x2"));
          endLineY = Number(lineElement.getAttribute("y2"));
          isDraggingEnd = true;
        }

        const dx = x - endDragX + x2;
        const dy = y - endDragY - y2;

        const newX = endLineX + dx;
        const newY = endLineY + dy;

        lineElement.setAttribute("x2", newX.toString());
        lineElement.setAttribute("y2", newY.toString());
      },
    );

    // 状态管理
    startPoint.addEventListener("mousedown", (e) => {
      isDraggingStart = true;
      e.preventDefault();
      document.body.style.userSelect = "none";
    });

    endPoint.addEventListener("mousedown", (e) => {
      isDraggingEnd = true;
      e.preventDefault();
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mouseup", () => {
      if (isDraggingStart) {
        isDraggingStart = false;
        startDragX = 0;
        startDragY = 0;
        startLineX = 0;
        startLineY = 0;
      }
      if (isDraggingEnd) {
        isDraggingEnd = false;
        endDragX = 0;
        endDragY = 0;
        endLineX = 0;
        endLineY = 0;
      }
      document.body.style.userSelect = "none";
    });

    return rtn;
  }

  return rtn;
}

function createMarker(
  type: "start" | "end",
  shape: "arrow" | "dot" | "square" | SVGElement,
  size: number,
  color: string,
) {
  const marker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "marker",
  );
  const id = `marker-${type}-${Math.random().toString(36).substr(2, 9)}`;
  marker.setAttribute("id", id);
  marker.setAttribute("markerWidth", size.toString());
  marker.setAttribute("markerHeight", size.toString());
  marker.setAttribute("refX", (size / 2).toString());
  marker.setAttribute("refY", (size / 2).toString());
  marker.setAttribute(
    "orient",
    type === "start" ? "auto-start-reverse" : "auto",
  );

  let markerShape: SVGElement;
  switch (shape) {
    case "arrow":
      markerShape = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      markerShape.setAttribute(
        "d",
        `M0,0 L${size},${size / 2} L0,${size} L${size / 3},${size / 2} Z`,
      );
      break;
    case "dot":
      markerShape = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      markerShape.setAttribute("cx", (size / 2).toString());
      markerShape.setAttribute("cy", (size / 2).toString());
      markerShape.setAttribute("r", (size / 3).toString());
      break;
    case "square":
      markerShape = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      markerShape.setAttribute("x", (size / 4).toString());
      markerShape.setAttribute("y", (size / 4).toString());
      markerShape.setAttribute("width", (size / 2).toString());
      markerShape.setAttribute("height", (size / 2).toString());
      break;
    default:
      if (shape instanceof SVGElement) {
        markerShape = shape;
      } else {
        markerShape = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        markerShape.setAttribute("d", `M0,0 L${size},${size / 2} L0,${size} Z`);
      }
  }

  markerShape.setAttribute("fill", color);
  marker.appendChild(markerShape);
  return marker;
}
