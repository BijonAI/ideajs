/**
 * @file polygon.ts
 * @description 多边形对象的实现，提供创建和操作SVG多边形的功能，支持点的添加、删除、变形等操作
 */

import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import { Polygon } from '../interfaces/geometry';
import { getTheme } from '../theme';
import { gsap } from 'gsap';
import { draggable } from '../utils/draggable'

/**
 * 创建一个多边形对象
 * @param points 多边形的顶点数组，每个点包含x和y坐标
 * @returns 多边形对象，包含多种操作方法
 */
export function polygon(points: { x: number, y: number }[]): Polygon {
  // 创建SVG组元素作为容器
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // 创建SVG路径元素
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const d = pointsToPath(points);
  polygon.setAttribute("d", d);

  // 应用主题样式
  const theme = getTheme();
  polygon.setAttribute("stroke-width", theme.sizes.function.toString());
  polygon.setAttribute("stroke", theme.colors.primary);
  polygon.setAttribute("fill", theme.colors.background);
  polygon.setAttribute("fill-opacity", "0.1");

  // 创建顶点控制点和保存初始位置
  const startPositions = points.map(point => ({ x: point.x, y: point.y }));
  const vertices = points.map((point, index) => {
    const vertex = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    vertex.setAttribute("r", "4");
    vertex.setAttribute("fill", theme.colors.primary);
    vertex.setAttribute("cx", point.x.toString());
    vertex.setAttribute("cy", (-point.y).toString());
    vertex.style.cursor = "move";
    vertex.style.pointerEvents = "all";
    return vertex;
  });

  // 将多边形和顶点控制点添加到组中
  group.appendChild(polygon);
  vertices.forEach(vertex => group.appendChild(vertex));

  let dragEnabled = false;

  // 更新顶点位置的函数
  function updateVertexPosition(index: number) {
    const vertex = vertices[index];
    vertex.setAttribute("cx", points[index].x.toString());
    vertex.setAttribute("cy", (points[index].y).toString());
  }

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
    annotate: (text: string, position?: 'top' | 'bottom' | 'left' | 'right') => {
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
      polygon.style.pointerEvents = 'none';
      return rtn;
    },
    // 解锁交互
    unlock: () => {
      polygon.style.pointerEvents = 'all';
      return rtn;
    },
    // 限制范围
    restrict: (bounds: { x: [number, number], y: [number, number] }) => {
      return rtn;
    },
    // 网格对齐
    snap: (gridSize: number) => {
      return rtn;
    },
    // 连接其他多边形
    connect: (target: Polygon, options?: { elastic?: boolean, distance?: number, strength?: number }) => {
      return rtn;
    },
    // 显示多边形
    show: () => {
      polygon.style.display = '';
      return rtn;
    },
    // 隐藏多边形
    hide: () => {
      polygon.style.display = 'none';
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
  }

  /**
   * 将点数组转换为SVG路径数据
   * @param points 点数组
   * @returns SVG路径数据字符串
   */
  function pointsToPath(points: { x: number, y: number }[]): string {
    if (points.length === 0) return '';
    return `M ${points[0].x} ${-points[0].y} ` +
      points.slice(1).map(p => `L ${p.x} ${-p.y}`).join(' ') +
      ' Z';
  }

  /**
   * 设置多边形的所有顶点
   * @param points 新的顶点数组
   * @returns 多边形对象
   */
  function setPoints(points: { x: number, y: number }[]) {
    polygon.setAttribute("d", pointsToPath(points));
    return rtn;
  }

  /**
   * 设置指定位置的顶点
   * @param index 顶点索引
   * @param point 新的顶点坐标
   * @returns 多边形对象
   */
  function setPoint(index: number, point: { x: number, y: number }) {
    const points = getPoints();
    points[index] = point;
    polygon.setAttribute("d", pointsToPath(points));
    return rtn;
  }

  /**
   * 获取多边形的所有顶点
   * @returns 顶点数组
   */
  function getPoints(): { x: number, y: number }[] {
    const d = polygon.getAttribute("d") || '';
    const commands = d.split(/(?=[MLZ])/);
    return commands
      .filter(cmd => cmd.trim().length > 0 && cmd[0] !== 'Z')
      .map(cmd => {
        const [x, y] = cmd.slice(1).trim().split(/\s+/);
        return { x: Number(x), y: -Number(y) };
      });
  }

  /**
   * 在指定位置之前插入新顶点
   * @param index 插入位置
   * @param point 新顶点坐标
   * @returns 多边形对象
   */
  function insertBefore(index: number, point: { x: number, y: number }) {
    const points = getPoints();
    points.splice(index, 0, point);
    polygon.setAttribute("d", pointsToPath(points));
    return rtn;
  }

  /**
   * 在指定位置之后插入新顶点
   * @param index 插入位置
   * @param point 新顶点坐标
   * @returns 多边形对象
   */
  function insertAfter(index: number, point: { x: number, y: number }) {
    const points = getPoints();
    points.splice(index + 1, 0, point);
    polygon.setAttribute("d", pointsToPath(points));
    return rtn;
  }

  /**
   * 移除指定位置的顶点
   * @param index 要移除的顶点索引
   * @returns 多边形对象
   */
  function remove(index: number) {
    const points = getPoints();
    points.splice(index, 1);
    polygon.setAttribute("d", pointsToPath(points));
    return rtn;
  }

  /**
   * 设置描边颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 多边形对象
   */
  function stroke(color?: string) {
    const theme = getTheme();
    polygon.setAttribute("stroke", color || theme.colors.primary);
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
    return rtn;
  }

  /**
   * 设置多边形的样式
   * @param options 样式选项，包括描边、填充等
   * @returns 多边形对象
   */
  function style(options: {
    strokeColor?: string,
    strokeWidth?: number,
    fillColor?: string,
    opacity?: number,
    dashArray?: string
  }) {
    if (options.strokeColor) polygon.setAttribute('stroke', options.strokeColor);
    if (options.strokeWidth) polygon.setAttribute('stroke-width', options.strokeWidth.toString());
    if (options.fillColor) polygon.setAttribute('fill', options.fillColor);
    if (options.opacity) polygon.setAttribute('opacity', options.opacity.toString());
    if (options.dashArray) polygon.setAttribute('stroke-dasharray', options.dashArray);
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
    polygon.style.transition = `stroke-dashoffset ${duration}ms ${easing || 'linear'}`;
    setTimeout(() => polygon.style.strokeDashoffset = '0', 0);
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
    gsap.to(polygon, {
      duration: duration / 1000,
      attr: { d: targetPath.getAttribute('d') },
      ease: "power1.inOut"
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
  function contains(point: { x: number, y: number }) {
    // Implementation for checking if a point is inside the polygon
    return rtn;
  }

  /**
   * 检查是否与另一个多边形相交
   * @param polygon 要检查的多边形
   * @returns 多边形对象
   */
  function intersects(polygon: { x: number, y: number }[]) {
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
   * 应用变换
   * @param options 变换选项，包括平移、缩放、旋转和倾斜
   * @returns 多边形对象
   */
  function transform(options: Transform) {
    let transform = '';
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
      polygon.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    polygon.setAttribute('transform', transform.trim());
    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 多边形对象
   */
  function animation(options: Animation) {
    const animations: string[] = [];
    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        polygon.style.setProperty(prop, from);
        animations.push(`${prop} ${options.duration || 300}ms ${options.easing || 'ease'}`);
        setTimeout(() => polygon.style.setProperty(prop, to), 0);
      });
    }
    polygon.style.transition = animations.join(', ');
    options.onStart?.();
    if (options.onEnd) {
      setTimeout(options.onEnd, (options.duration || 300) + (options.delay || 0));
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
      rtn
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
      remove: () => polygon.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn
    };
  }

  /**
   * 添加工具提示
   * @param content 提示内容，可以是字符串或HTML元素
   * @param options 提示选项，包括位置、样式等
   * @returns 多边形对象
   */
  function tooltip(content: string | HTMLElement, options: TooltipOptions = {}) {
    const tip = document.createElement('div');
    if (typeof content === 'string') {
      tip.textContent = content;
    } else {
      tip.appendChild(content);
    }
    if (options.className) tip.className = options.className;
    if (options.style) Object.assign(tip.style, options.style);

    polygon.addEventListener('mouseenter', (e) => {
      document.body.appendChild(tip);
      const rect = polygon.getBoundingClientRect();
      const [offsetX = 0, offsetY = 0] = options.offset || [0, 0];

      switch (options.position) {
        case 'top':
          tip.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
          tip.style.top = `${rect.top - tip.offsetHeight + offsetY}px`;
          break;
        case 'bottom':
          tip.style.left = `${rect.left + rect.width / 2 + offsetX}px`;
          tip.style.top = `${rect.bottom + offsetY}px`;
          break;
        case 'left':
          tip.style.left = `${rect.left - tip.offsetWidth + offsetX}px`;
          tip.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
          break;
        case 'right':
          tip.style.left = `${rect.right + offsetX}px`;
          tip.style.top = `${rect.top + rect.height / 2 + offsetY}px`;
          break;
        default:
          tip.style.left = `${e.pageX + offsetX}px`;
          tip.style.top = `${e.pageY + offsetY}px`;
      }
    });

    polygon.addEventListener('mouseleave', () => {
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
  function effect(type: 'glow' | 'shadow' | 'blur', options: EffectOptions = {}) {
    const { color = '#000', strength = 5, spread = 0 } = options;
    switch (type) {
      case 'glow':
        polygon.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case 'shadow':
        polygon.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case 'blur':
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

      draggable(vertex,
        (_x, _y) => true,
        (x, y) => {
          if (!isDragging) {
            startDragX = x;
            startDragY = y;
            endDragX = Number(vertex.getAttribute('cx'));
            endDragY = Number(vertex.getAttribute('cy'));
            isDragging = true;
          }

          // 使用初始保存的位置计算偏移
          const dx = x - startDragX;
          const dy = y - startDragY;

          // 更新顶点位置
          points[index].x = endDragX + dx;
          points[index].y = endDragY + dy;

          // 更新视图
          updateVertexPosition(index);
          updatePolygonPath();
        }
      );

      // 添加鼠标抬起事件处理
      const handleMouseUp = () => {
        isDragging = false;
      };
      vertex.addEventListener('mouseup', handleMouseUp);
    });



    return rtn;
  }

  return rtn;
}
