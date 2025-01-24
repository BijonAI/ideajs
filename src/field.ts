/**
 * @file field.ts
 * @description 定义绘图场域相关的功能，提供SVG绘图环境和基本操作方法
 */

import { Direction, down, left, right, up } from "./direction";
import { TeachingOptions } from "./interfaces/common";

/**
 * 可渲染对象的接口定义
 * 任何实现此接口的对象都必须提供node方法返回SVG元素
 */
export type Renderable = object & { node: () => SVGElement };

/**
 * 创建一个绘图场域
 * @param width 场域宽度
 * @param height 场域高度
 * @returns 包含各种绘图和操作方法的场域对象
 */
export function field(width: number, height: number) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(g);
  const originPoint = [0, 0];

  const rtn = {
    origin,
    direct,
    node,
    add,
    size,
    background,
    border,
    clear,
    remove,
    toDataURL,
    viewBox,
    zoom,
    presentation,
    enableSnap,
    teachingMode,
  };

  /**
   * 设置场域的原点
   * @param x 原点x坐标
   * @param y 原点y坐标
   * @returns 场域对象
   */
  function origin(x: number, y: number) {
    originPoint[0] = x;
    originPoint[1] = y;
    g.setAttribute("transform", `translate(${x}, ${y})`);
    return rtn;
  }

  /**
   * 设置场域的方向
   * @param x 方向x坐标
   * @param y 方向y坐标
   * @returns 场域对象
   */
  function direct(x: Direction, y: Direction) {
    const xValue = x === left() ? -1 : x === right() ? 1 : 0;
    const yValue = y === up() ? -1 : y === down() ? 1 : 0;
    g.setAttribute("transform", `translate(${xValue}, ${yValue})`);
    return rtn;
  }

  /**
   * 获取场域的SVG元素
   * @returns SVG元素
   */
  function node() {
    return svg;
  }

  /**
   * 添加可渲染对象到场域
   * @param renderable 可渲染对象
   * @returns 场域对象
   */
  function add(renderable: Renderable) {
    g.appendChild(renderable.node());
    return rtn;
  }

  /**
   * 设置场域的大小
   * @param width 场域宽度
   * @param height 场域高度
   * @returns 场域对象
   */
  function size(width: number, height: number) {
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    return rtn;
  }

  /**
   * 设置场域的背景颜色
   * @param color 背景颜色
   * @returns 场域对象
   */
  function background(color: string) {
    svg.style.background = color;
    return rtn;
  }

  /**
   * 设置场域的边框样式
   * @param width 边框宽度
   * @param color 边框颜色
   * @returns 场域对象
   */
  function border(width: number, color: string) {
    svg.style.border = `${width}px solid ${color}`;
    return rtn;
  }

  /**
   * 清除场域中的所有元素
   * @returns 场域对象
   */
  function clear() {
    g.innerHTML = "";
    return rtn;
  }

  /**
   * 移除场域中的元素
   * @param element 元素
   * @returns 场域对象
   */
  function remove(element: Renderable) {
    g.removeChild(element.node());
    return rtn;
  }

  /**
   * 获取场域的DataURL
   * @returns DataURL
   */
  function toDataURL() {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    return "data:image/svg+xml;base64," + btoa(source);
  }

  /**
   * 设置场域的视口
   * @param x 视口x坐标
   * @param y 视口y坐标
   * @param width 视口宽度
   * @param height 视口高度
   * @returns 场域对象
   */
  function viewBox(x: number, y: number, width: number, height: number) {
    svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    return rtn;
  }

  /**
   * 设置场域的缩放比例
   * @param scale 缩放比例
   * @returns 场域对象
   */
  function zoom(scale: number) {
    g.setAttribute("transform", `scale(${scale})`);
    return rtn;
  }

  /**
   * 设置场域的演示模式
   * @param steps 演示步骤
   * @returns 场域对象
   */
  function presentation(
    steps: {
      elements: Renderable[];
      duration: number;
      description?: string;
    }[],
  ) {
    let currentStep = 0;

    function playStep() {
      if (currentStep >= steps.length) return;

      const step = steps[currentStep];
      clear();

      step.elements.forEach((element) => add(element));

      if (step.description) {
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        text.textContent = step.description;
        text.setAttribute("x", "10");
        text.setAttribute("y", "30");
        svg.appendChild(text);
      }

      currentStep++;
      if (currentStep < steps.length) {
        setTimeout(playStep, step.duration);
      }
    }

    playStep();
    return rtn;
  }

  /**
   * 启用场域的对齐功能
   * @param size 对齐网格大小
   * @returns 场域对象
   */
  function enableSnap(size: number) {
    const snapToGrid = (value: number) => Math.round(value / size) * size;

    svg.addEventListener("mousemove", (e) => {
      Array.from(g.children).forEach((child) => {
        if (child.getAttribute("data-draggable")) {
          const rect = svg.getBoundingClientRect();
          const x = snapToGrid(e.clientX - rect.left);
          const y = snapToGrid(e.clientY - rect.top);
          child.setAttribute("transform", `translate(${x}, ${y})`);
        }
      });
    });

    return rtn;
  }

  /**
   * 启用场域的教学模式
   * @param options 教学模式选项
   * @returns 场域对象
   */
  function teachingMode(options: TeachingOptions = {}) {
    const overlay = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    overlay.setAttribute("width", width.toString());
    overlay.setAttribute("height", height.toString());
    overlay.setAttribute("fill", "none");
    overlay.setAttribute("pointer-events", "none");
    svg.appendChild(overlay);

    if (options.annotations) {
      const annotationLayer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      svg.appendChild(annotationLayer);
    }

    return rtn;
  }

  return rtn;
}
