/**
 * @file polygon.ts
 * @description 多边形对象的实现，提供创建和操作SVG多边形的功能，支持点的添加、删除、变形等操作
 */

import {
  Transform,
  Animation,
  TooltipOptions,
  EffectOptions,
  TeachingOptions,
  AnimationStep,
} from "../interfaces/common";
import { Polygon } from "../interfaces/geometry";
import { getTheme } from "../theme";
import { gsap } from "gsap";
import { draggable } from "../utils/draggable";

/**
 * 创建一个多边形对象
 * @param points 多边形的顶点数组，每个点包含x和y坐标
 * @returns 多边形对象，包含多种操作方法
 */
export function polygon(points: { x: number; y: number }[]): Polygon {
  // 创建SVG组元素作为容器
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // 创建SVG路径元素
  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  const d = pointsToPath(points);
  polygon.setAttribute("d", d);

  // 应用主题样式
  const theme = getTheme();
  polygon.setAttribute("stroke-width", theme.sizes.function.toString());
  polygon.setAttribute("stroke", theme.colors.primary);
  polygon.setAttribute("fill", theme.colors.background);
  polygon.setAttribute("fill-opacity", "0.1");
  polygon.style.pointerEvents = "stroke"; // 只在边框上响应事件

  // Store vertex style
  let vertexStyle = {
    size: 8, // 增大点的大小
    color: theme.colors.primary,
    opacity: 1,
    fill: theme.colors.primary,
    stroke: theme.colors.background, // 使用背景色作为描边
    strokeWidth: 2, // 增加描边宽度
  };

  // 创建顶点控制点和保存初始位置
  const vertices = points.map((point, index) => {
    const vertex = createVertex(point.x, point.y, index);
    return vertex;
  });

  // 将多边形和顶点控制点添加到组中
  group.appendChild(polygon);
  vertices.forEach((vertex) => group.appendChild(vertex));

  let dragEnabled = false;

  // 更新顶点位置的函数
  // function updateVertexPosition(index: number) {
  //   const vertex = vertices[index];
  //   vertex.setAttribute("cx", (points[index].x).toString());
  //   vertex.setAttribute("cy", (-points[index].y).toString());
  // }

  // 更新多边形路径的函数
  function updatePolygonPath() {
    const d = pointsToPath(points);
    polygon.setAttribute("d", d);
  }

  // 返回对象，包含所有可用的操作方法
  const rtn = {
    node: () => group,
    points,
    setPoints,
    setPoint,
    insertBefore,
    insertAfter,
    removePoint: remove,
    stroke,
    fill,
    style,
    animate,
    morph,
    rotate,
    scale,
    translate,
    center,
    area,
    perimeter,
    contains,
    intersects,
    smooth,
    simplify,
    regular,
    clone,
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
      polygon.style.pointerEvents = "none";
      return rtn;
    },
    // 解锁交互
    unlock: () => {
      polygon.style.pointerEvents = "all";
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
    // 连接其他多边形
    connect: (
      target: Polygon,
      options?: { elastic?: boolean; distance?: number; strength?: number },
    ) => {
      return rtn;
    },
    // 显示多边形
    show: () => {
      polygon.style.display = "";
      return rtn;
    },
    // 隐藏多边形
    hide: () => {
      polygon.style.display = "none";
      return rtn;
    },
    // 设置透明度
    opacity: (value: number) => {
      polygon.style.opacity = value.toString();
      return rtn;
    },
    // 移除多边形
    remove: () => {
      group.remove();
    },
    draggable: enableDragging,
  };

  /**
   * 将点数组转换为SVG路径数据
   * @param points 点数组
   * @returns SVG路径数据字符串
   */
  function pointsToPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return "";
    return (
      `M ${points[0].x} ${-points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x} ${-p.y}`)
        .join(" ") +
      " Z"
    );
  }

  /**
   * 设置多边形的所有顶点
   * @param points 新的顶点数组
   * @returns 多边形对象
   */
  function setPoints(points_: { x: number; y: number }[]) {
    // Update the stored points array
    points.length = 0;
    points_.forEach((p) => points.push({ x: p.x, y: p.y }));

    polygon.setAttribute("d", pointsToPath(points));

    points.forEach((point, index) => {
      if (vertices[index]) {
        vertices[index].setAttribute("cx", point.x.toString());
        vertices[index].setAttribute("cy", (-point.y).toString());
      }
    });

    return rtn;
  }

  /**
   * 设置指定位置的顶点
   * @param index 顶点索引
   * @param point 新的顶点坐标
   * @returns 多边形对象
   */
  function setPoint(index: number, point: { x: number; y: number }) {
    // Update the stored points array
    points[index] = { x: point.x, y: point.y };

    // Update the polygon path
    polygon.setAttribute("d", pointsToPath(points));

    // Update the vertex circle
    vertices[index].setAttribute("cx", point.x.toString());
    vertices[index].setAttribute("cy", (-point.y).toString());

    return rtn;
  }

  /**
   * 在指定位置之前插入新顶点
   * @param index 插入位置
   * @param point 新顶点坐标
   * @returns 多边形对象
   */
  function insertBefore(index: number, point: { x: number; y: number }) {
    // Insert the point into points array
    points.splice(index, 0, { x: point.x, y: point.y });

    // Update the polygon path
    polygon.setAttribute("d", pointsToPath(points));

    // Create and insert new vertex circle
    const vertex = createVertex(point.x, point.y, index);
    vertices.splice(index, 0, vertex);
    group.appendChild(vertex);

    // Update all vertex positions
    updateVertexPositions();

    return rtn;
  }

  /**
   * 在指定位置之后插入新顶点
   * @param index 插入位置
   * @param point 新顶点坐标
   * @returns 多边形对象
   */
  function insertAfter(index: number, point: { x: number; y: number }) {
    points.splice(index + 1, 0, { x: point.x, y: point.y });

    polygon.setAttribute("d", pointsToPath(points));

    const vertex = createVertex(point.x, point.y, index + 1);
    vertices.splice(index + 1, 0, vertex);
    group.appendChild(vertex);

    updateVertexPositions();

    return rtn;
  }

  /**
   * 移除指定位置的顶点
   * @param index 要移除的顶点索引
   * @returns 多边形对象
   */
  function remove(index: number) {
    points.splice(index, 1);
    polygon.setAttribute("d", pointsToPath(points));
    const vertex = vertices[index];
    if (vertex && vertex.parentNode) {
      vertex.parentNode.removeChild(vertex);
    }
    vertices.splice(index, 1);
    updateVertexPositions();
    return rtn;
  }

  /**
   * 更新所有顶点的位置
   */
  function updateVertexPositions() {
    vertices.forEach((vertex, i) => {
      if (points[i]) {
        vertex.setAttribute("cx", points[i].x.toString());
        vertex.setAttribute("cy", (-points[i].y).toString());
      }
    });
  }

  /**
   * 创建一个新的顶点控制点
   * @param x x坐标
   * @param y y坐标
   * @param index 顶点索引
   * @returns 顶点控制点元素
   */
  function createVertex(x: number, y: number, index: number) {
    const vertex = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    vertex.setAttribute("cx", x.toString());
    vertex.setAttribute("cy", (-y).toString());
    vertex.style.cursor = "move";
    vertex.style.pointerEvents = "all";

    // Apply current vertex style
    applyVertexStyle(vertex);

    // 添加数据属性用于动画更新
    vertex.setAttribute("data-vertex", index.toString());

    return vertex;
  }

  /**
   * 应用顶点样式到指定的顶点元素
   * @param vertex 顶点元素
   */
  function applyVertexStyle(vertex: SVGCircleElement) {
    vertex.setAttribute("r", vertexStyle.size.toString());
    vertex.setAttribute("fill", vertexStyle.fill);
    vertex.setAttribute("fill-opacity", vertexStyle.opacity.toString());
    vertex.setAttribute("stroke", vertexStyle.stroke);
    vertex.setAttribute("stroke-width", vertexStyle.strokeWidth.toString());
  }

  /**
   * 设置描边颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 多边形对象
   */
  function stroke(color?: string) {
    const theme = getTheme();
    const finalColor = color ? color : theme.colors.primary;
    polygon.setAttribute("stroke", finalColor);
    // 修改所有端点的颜色
    vertices.forEach((point) => point.setAttribute("strokes", finalColor));
    return rtn;
  }

  /**
   * 设置填充颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 多边形对象
   */
  function fill(color?: string) {
    const theme = getTheme();
    polygon.setAttribute("fill", color || theme.colors.secondary);
    vertices.forEach((point) =>
      point.setAttribute("fill", color ? color : theme.colors.secondary),
    );
    return rtn;
  }

  /**
   * 设置多边形的样式
   * @param options 样式选项，包括描边、填充等
   * @returns 多边形对象
   */
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
    pointSize?: number;
    pointColor?: string;
    pointOpacity?: number;
    pointFill?: string;
    pointStroke?: string;
    pointStrokeWidth?: number;
  }) {
    // 线条样式
    if (options.strokeWidth !== undefined)
      polygon.setAttribute("stroke-width", options.strokeWidth.toString());
    if (options.strokeColor !== undefined)
      polygon.setAttribute("stroke", options.strokeColor);
    if (options.strokeOpacity !== undefined)
      polygon.setAttribute("stroke-opacity", options.strokeOpacity.toString());
    if (options.strokeDasharray !== undefined)
      polygon.setAttribute("stroke-dasharray", options.strokeDasharray);
    if (options.lineCap !== undefined)
      polygon.setAttribute("stroke-linecap", options.lineCap);
    if (options.lineJoin !== undefined)
      polygon.setAttribute("stroke-linejoin", options.lineJoin);

    // 通用样式
    if (options.cursor !== undefined) {
      polygon.style.cursor = options.cursor;
      vertices.forEach((point) => (point.style.cursor = options.cursor!));
    }
    if (options.filter !== undefined) {
      polygon.setAttribute("filter", options.filter);
      vertices.forEach((point) =>
        point.setAttribute("filter", options.filter!),
      );
    }
    if (options.visibility !== undefined) {
      polygon.style.visibility = options.visibility;
      vertices.forEach(
        (point) => (point.style.visibility = options.visibility!),
      );
    }
    if (options.pointerEvents !== undefined) {
      polygon.style.pointerEvents = options.pointerEvents;
      vertices.forEach(
        (point) => (point.style.pointerEvents = options.pointerEvents!),
      );
    }

    // Update vertex style
    if (options.pointSize !== undefined) {
      vertexStyle.size = options.pointSize;
    }
    if (options.pointColor !== undefined) {
      vertexStyle.color = options.pointColor;
    }
    if (options.pointOpacity !== undefined) {
      vertexStyle.opacity = options.pointOpacity;
    }
    if (options.pointFill !== undefined) {
      vertexStyle.fill = options.pointFill;
    }
    if (options.pointStroke !== undefined) {
      vertexStyle.stroke = options.pointStroke;
    }
    if (options.pointStrokeWidth !== undefined) {
      vertexStyle.strokeWidth = options.pointStrokeWidth;
    }

    // Apply style to all vertices
    vertices.forEach((vertex) => {
      applyVertexStyle(vertex);
    });

    return rtn;
  }

  /**
   * 创建绘制动画
   * @param duration 动画持续时间（毫秒）
   * @param easing 缓动函数名称
   * @returns 多边形对象
   */
  function animate(duration: number, easing?: string) {
    const length = polygon.getTotalLength();
    polygon.style.strokeDasharray = length.toString();
    polygon.style.strokeDashoffset = length.toString();
    polygon.style.transition = `stroke-dashoffset ${duration}ms ${easing || "linear"}`;
    setTimeout(() => (polygon.style.strokeDashoffset = "0"), 0);
    return rtn;
  }

  /**
   * 形状变形动画
   * @param target 目标多边形
   * @param duration 动画持续时间（毫秒）
   * @returns 多边形对象
   */
  function morph(target: Polygon, duration: number = 1000) {
    if (!target?.node()) return rtn;
    const targetPath = target.node();
    const pathData = targetPath.getAttribute("d") || "";
    gsap.to(polygon, {
      duration: duration / 1000,
      attr: { d: pathData },
      ease: "power1.inOut",
    });
    return rtn;
  }

  /**
   * 旋转多边形
   * @param angle 旋转角度
   * @returns 多边形对象
   */
  function rotate(angle: number) {
    // Implementation for rotating
    return rtn;
  }

  /**
   * 缩放多边形
   * @param factor 缩放因子
   * @returns 多边形对象
   */
  function scale(factor: number) {
    // Implementation for scaling
    return rtn;
  }

  /**
   * 平移多边形
   * @param dx x方向偏移量
   * @param dy y方向偏移量
   * @returns 多边形对象
   */
  function translate(dx: number, dy: number) {
    // Implementation for translating
    return rtn;
  }

  /**
   * 获取多边形的中心点
   * @returns 多边形对象
   */
  function center() {
    // Implementation for finding the center
    return rtn;
  }

  /**
   * 计算多边形面积
   * @returns 多边形对象
   */
  function area() {
    // Implementation for calculating area
    return rtn;
  }

  /**
   * 计算多边形周长
   * @returns 多边形对象
   */
  function perimeter() {
    // Implementation for calculating perimeter
    return rtn;
  }

  /**
   * 检查点是否在多边形内部
   * @param point 要检查的点
   * @returns 多边形对象
   */
  function contains(point: { x: number; y: number }) {
    // Implementation for checking if a point is inside the polygon
    return rtn;
  }

  /**
   * 检查是否与另一个多边形相交
   * @param polygon 要检查的多边形
   * @returns 多边形对象
   */
  function intersects(polygon: { x: number; y: number }[]) {
    // Implementation for checking intersection
    return rtn;
  }

  /**
   * 平滑多边形的边角
   * @returns 多边形对象
   */
  function smooth() {
    // Implementation for smoothing
    return rtn;
  }

  /**
   * 简化多边形（减少顶点）
   * @returns 多边形对象
   */
  function simplify() {
    // Implementation for simplifying
    return rtn;
  }

  /**
   * 转换为正多边形
   * @returns 多边形对象
   */
  function regular() {
    // Implementation for creating a regular polygon
    return rtn;
  }

  /**
   * 克隆多边形
   * @returns 多边形对象
   */
  function clone() {
    // Implementation for cloning
    return rtn;
  }

  /**
   * 变换多边形
   * @param options 变换选项，包括平移、缩放、旋转和倾斜
   * @returns 多边形对象
   */
  function transform(options: Transform) {
    // 对每个顶点应用变换
    points.forEach((point, index) => {
      let newX = point.x;
      let newY = point.y;

      // 平移变换
      if (options.translate) {
        newX += options.translate[0];
        newY += options.translate[1];
      }

      // 缩放变换
      if (options.scale) {
        const scaleX = Array.isArray(options.scale)
          ? options.scale[0]
          : options.scale;
        const scaleY = Array.isArray(options.scale)
          ? options.scale[1]
          : options.scale;
        const originX = points[0].x;
        const originY = points[0].y;

        newX = originX + (point.x - originX) * scaleX;
        newY = originY + (point.y - originY) * scaleY;
      }

      // 旋转变换
      if (options.rotate) {
        const angle = (options.rotate * Math.PI) / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const originX = points[0].x;
        const originY = points[0].y;

        const dx = point.x - originX;
        const dy = point.y - originY;
        newX = originX + dx * cos - dy * sin;
        newY = originY + dx * sin + dy * cos;
      }

      // 倾斜变换
      if (options.skew) {
        const skewX = (options.skew[0] * Math.PI) / 180;
        const skewY = (options.skew[1] * Math.PI) / 180;
        const originX = points[0].x;
        const originY = points[0].y;

        const dx = point.x - originX;
        const dy = point.y - originY;
        newX = originX + dx + dy * Math.tan(skewX);
        newY = originY + dy + dx * Math.tan(skewY);
      }

      // 更新顶点位置
      points[index] = { x: newX, y: newY };
    });

    // 如果指定了origin，直接设置第一个顶点的位置
    if (options.origin) {
      points[0] = { x: options.origin[0], y: options.origin[1] };
    }

    points.forEach((point, index) => {
      if (vertices[index]) {
        vertices[index].setAttribute("cx", point.x.toString());
        vertices[index].setAttribute("cy", (-point.y).toString());
      }
    });

    // 更新多边形路径
    updatePolygonPath();

    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 多边形对象
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

    const vertexAnimations: { [key: string]: { from: number; to: number } } =
      {};
    const styleAnimations: { [key: string]: { from: string; to: string } } = {};

    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        if (styleProperties.has(prop)) {
          styleAnimations[prop] = { from, to };
          animations.push(
            `${prop} ${options.duration || 300}ms ${options.easing || "ease"}`,
          );
        } else {
          // 处理顶点动画
          vertexAnimations[prop] = {
            from: parseFloat(from),
            to: parseFloat(to),
          };
        }
      });
    }

    // 处理样式过渡
    if (Object.keys(styleAnimations).length > 0) {
      Object.entries(styleAnimations).forEach(([prop, { from }]) => {
        polygon.style.setProperty(prop, from);
        setTimeout(
          () => polygon.style.setProperty(prop, styleAnimations[prop].to),
          0,
        );
      });
      polygon.style.transition = animations.join(", ");
    }

    // 处理顶点动画
    if (Object.keys(vertexAnimations).length > 0) {
      const duration = options.duration || 300;
      const startTime = performance.now();

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = options.easing ? easeInOut(progress) : progress;

        Object.entries(vertexAnimations).forEach(([prop, { from, to }]) => {
          const coord = prop.charAt(0);
          const index = parseInt(prop.slice(1)) - 1;
          if (!isNaN(index) && index < points.length) {
            points[index][coord as "x" | "y"] =
              from + (to - from) * easeProgress;
          }
        });

        updatePolygonPath();
        points.forEach((point, index) => {
          const vertexPoint = group.querySelector(
            `circle[data-vertex="${index}"]`,
          );
          if (vertexPoint) {
            vertexPoint.setAttribute("cx", point.x.toString());
            vertexPoint.setAttribute("cy", (-point.y).toString());
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          options.onEnd?.();
        }
      }

      options.onStart?.();
      if (options.delay) {
        setTimeout(() => requestAnimationFrame(animate), options.delay);
      } else {
        requestAnimationFrame(animate);
      }
    } else {
      // 如果只有样式动画，在结束时调用回调
      if (options.onEnd) {
        setTimeout(
          options.onEnd,
          (options.duration || 300) + (options.delay || 0),
        );
      }
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
    polygon.addEventListener(type, handler);
    return {
      remove: () => polygon.removeEventListener(type, handler),
      rtn,
    };
  }

  /**
   * 设置属性
   * @param name 属性名
   * @param value 属性值
   * @returns 多边形对象
   */
  function attr(name: string, value: string) {
    polygon.setAttribute(name, value);
    return rtn;
  }

  /**
   * 设置数据属性
   * @param key 数据键名
   * @param value 数据值
   * @returns 多边形对象
   */
  function data(key: string, value: any) {
    polygon.dataset[key] = value;
    return rtn;
  }

  /**
   * 添加CSS类
   * @param names 类名或类名数组
   * @returns 包含移除类名方法的对象
   */
  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      polygon.classList.add(...names);
    } else {
      polygon.classList.add(names);
    }
    return {
      remove: () =>
        polygon.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn,
    };
  }

  /**
   * 添加工具提示
   * @param content 提示内容，可以是字符串或HTML元素
   * @param options 提示选项，包括位置、样式等
   * @returns 多边形对象
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

    polygon.addEventListener("mouseenter", (e) => {
      document.body.appendChild(tip);
      const rect = polygon.getBoundingClientRect();
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

    polygon.addEventListener("mouseleave", () => {
      tip.remove();
    });

    return rtn;
  }

  /**
   * 添加视觉效果
   * @param type 效果类型：'glow'发光、'shadow'阴影、'blur'模糊
   * @param options 效果选项，包括颜色、强度等
   * @returns 多边形对象
   */
  function effect(
    type: "glow" | "shadow" | "blur",
    options: EffectOptions = {},
  ) {
    const { color = "#000", strength = 5, spread = 0 } = options;
    switch (type) {
      case "glow":
        polygon.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case "shadow":
        polygon.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case "blur":
        polygon.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  function enableDragging() {
    if (dragEnabled) return rtn;
    dragEnabled = true;

    // 为每个顶点添加拖拽功能
    vertices.forEach((vertex, index) => {
      let startDragX = 0;
      let startDragY = 0;
      let endDragX = 0;
      let endDragY = 0;
      let isDragging = false;

      draggable(
        vertex,
        (_x, _y) => true,
        (x, y) => {
          if (!isDragging) {
            startDragX = x;
            startDragY = y;
            endDragX = points[index].x;
            endDragY = points[index].y;
            isDragging = true;
          }

          // 使用初始保存的位置计算偏移
          const dx = x - startDragX;
          const dy = y - startDragY;

          // 更新顶点位置
          points[index].x = endDragX + dx;
          points[index].y = endDragY - dy;

          // 更新视图
          updatePolygonPath();
        },
      );

      // 添加鼠标抬起事件处理
      const handleMouseUp = () => {
        startDragX = 0;
        startDragY = 0;
        endDragX = 0;
        endDragY = 0;
        isDragging = false;
      };
      vertex.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    });

    return rtn;
  }

  return rtn;
}

// 内置缓动函数
function easeInOut(progress: number) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}
