/**
 * @file vector.ts
 * @description 向量对象的实现，提供创建和操作SVG向量的功能，包括箭头的绘制和变换
 */

import { getTheme } from '../theme';
import { Vector } from '../interfaces/geometry';
import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import gsap from 'gsap';
import { draggable } from '../utils/draggable';

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
  vector.setAttribute("transform", `translate(${x1}, ${y1})`);

  // 应用主题样式
  const theme = getTheme();
  vector.setAttribute("stroke", theme.colors.primary);
  vector.setAttribute("stroke-width", theme.sizes.function.toString());

  // 创建线段元素
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x2", (x2 - x1).toString());
  line.setAttribute("y2", (-y2 + y1).toString());

  // 创建箭头元素
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  arrow.setAttribute("points", `-5,-4 0,0 5,-4 0,8`);
  arrow.setAttribute("stroke", "none");
  arrow.setAttribute("fill", theme.colors.primary);

  // 更新箭头位置和方向
  function updateArrow() {
    const dx = Number(line.getAttribute("x2")) - x1;
    const dy = Number(line.getAttribute("y2")) - (-y1);  // 注意y轴方向
    // 使用起点到终点的方向计算角度
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    arrow.setAttribute("transform", `translate(${line.getAttribute("x2")},${line.getAttribute("y2")}) rotate(${angle - 90})`);
  }

  // 将元素添加到向量组中
  vector.append(line, arrow);
  updateArrow();

  // 添加拖拽功能
  let isDragging = false;
  let startDragX = 0;
  let startDragY = 0;
  let startVectorX = 0;
  let startVectorY = 0;

  // 在向量末端区域添加拖拽功能
  arrow.style.cursor = 'move';
  arrow.style.pointerEvents = 'all';

  draggable(arrow,
    (_x, _y) => true,
    (x, y) => {
      if (!isDragging) {
        startDragX = x;
        startDragY = y;
        startVectorX = Number(line.getAttribute("x2"));
        startVectorY = Number(line.getAttribute("y2"));
        isDragging = true;
      }

      // 计算拖拽的相对位移
      const dx = x - startDragX;
      const dy = y - startDragY;

      // 更新向量终点位置
      const newX = startVectorX + dx;
      const newY = startVectorY + dy;  // 注意y轴方向相反

      line.setAttribute("x2", newX.toString());
      line.setAttribute("y2", newY.toString());
      updateArrow();
    }
  );

  // 状态管理
  arrow.addEventListener('mousedown', (e) => {
    isDragging = true;
    // 阻止默认的文本选择行为
    e.preventDefault();
    // 禁用文本选择
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      startDragX = 0;
      startDragY = 0;
      startVectorX = 0;
      startVectorY = 0;
    }
  });

  // 返回对象，包含所有可用的操作方法
  const rtn = {
    node: () => vector,
    from,
    to,
    stroke,
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
      vector.style.pointerEvents = 'none';
      return rtn;
    },
    // 解锁交互
    unlock: () => {
      vector.style.pointerEvents = 'all';
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
    // 连接其他向量
    connect: (target: Vector, options?: { elastic?: boolean, distance?: number, strength?: number }) => {
      return rtn;
    },
    // 显示向量
    show: () => {
      vector.style.display = '';
      return rtn;
    },
    // 隐藏向量
    hide: () => {
      vector.style.display = 'none';
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
      if (!target?.node()) return rtn;
      const targetVector = target.node();
      gsap.to(vector, {
        duration: duration / 1000,
        attr: { transform: targetVector.getAttribute('transform') },
        ease: "power1.inOut"
      });
      return rtn;
    }
  }

  /**
   * 设置向量的起点
   * @param x1 新的起点x坐标
   * @param y1 新的起点y坐标
   * @returns 向量对象
   */
  function from(x1: number, y1: number) {
    vector.setAttribute("transform", `translate(${x1}, ${y1})`);
    return rtn;
  }

  /**
   * 设置向量的终点
   * @param x2 新的终点x坐标
   * @param y2 新的终点y坐标
   * @returns 向量对象
   */
  function to(x2: number, y2: number) {
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    updateArrow();
    return rtn;
  }

  /**
   * 设置向量的颜色
   * @param color 可选的颜色值，未指定则使用主题色
   * @returns 向量对象
   */
  function stroke(color?: string) {
    const theme = getTheme();
    line.setAttribute("stroke", color || theme.colors.primary);
    arrow.setAttribute("fill", color || theme.colors.primary);
    return rtn;
  }

  /**
   * 应用变换
   * @param options 变换选项，包括平移、缩放、旋转和倾斜
   * @returns 向量对象
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
      vector.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    vector.setAttribute('transform', transform.trim());
    return rtn;
  }

  /**
   * 应用动画效果
   * @param options 动画选项，包括属性、持续时间和回调函数
   * @returns 向量对象
   */
  function animation(options: Animation) {
    const animations: string[] = [];
    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        vector.style.setProperty(prop, from);
        animations.push(`${prop} ${options.duration || 300}ms ${options.easing || 'ease'}`);
        setTimeout(() => vector.style.setProperty(prop, to), 0);
      });
    }
    vector.style.transition = animations.join(', ');
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
    vector.addEventListener(type, handler);
    return {
      remove: () => vector.removeEventListener(type, handler),
      rtn
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
      remove: () => vector.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn
    };
  }

  /**
   * 添加工具提示
   * @param content 提示内容，可以是字符串或HTML元素
   * @param options 提示选项，包括位置、样式等
   * @returns 向量对象
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

    vector.addEventListener('mouseenter', (e) => {
      document.body.appendChild(tip);
      const rect = vector.getBoundingClientRect();
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

    vector.addEventListener('mouseleave', () => {
      tip.remove();
    });

    return rtn;
  }

  /**
   * 添加视觉效果
   * @param type 效果类型：'glow'发光、'shadow'阴影、'blur'模糊
   * @param options 效果选项，包括颜色、强度等
   * @returns 向量对象
   */
  function effect(type: 'glow' | 'shadow' | 'blur', options: EffectOptions = {}) {
    const { color = '#000', strength = 5, spread = 0 } = options;
    switch (type) {
      case 'glow':
        vector.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case 'shadow':
        vector.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case 'blur':
        vector.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  return rtn;
}
