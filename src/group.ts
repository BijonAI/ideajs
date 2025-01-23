/**
 * @file group.ts
 * @description 定义SVG元素分组功能，提供对组内元素的批量操作和变换
 */

import { Renderable } from "./field";

/**
 * 创建一个SVG元素组
 * @param x 组的x坐标
 * @param y 组的y坐标
 * @returns 包含各种组操作方法的对象
 */
export function group(x: number, y: number) {
  const groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
  groupElement.setAttribute("transform", `translate(${x}, ${y})`);
  
  const rtn = {
    groupElement,
    add: (element: Renderable) => {
      groupElement.appendChild(element.node());
      return rtn;
    },
    translate,
    scale,
    rotate,
    node: () => groupElement,
    opacity,
    visibility,
    clip,
    filter,
    animate,
    drag,
    order,
    clone,
    clear,
    remove,
    find,
    forEach,
    transform,
  }

  /**
   * 对组应用平移变换
   * @param x x方向的平移距离
   * @param y y方向的平移距离
   * @returns 组对象
   */
  function translate(x: number, y: number) {
    groupElement.setAttribute("transform", `translate(${x}, ${y})`);
    return rtn;
  }

  /**
   * 对组应用缩放变换
   * @param x x方向的缩放比例
   * @param y y方向的缩放比例
   * @returns 组对象
   */
  function scale(x: number, y: number) {
    groupElement.setAttribute("transform", `scale(${x}, ${y})`);
    return rtn;
  }

  /**
   * 对组应用旋转变换
   * @param angle 旋转角度
   * @returns 组对象
   */
  function rotate(angle: number) {
    groupElement.setAttribute("transform", `rotate(${angle})`);
    return rtn;
  }

  /**
   * 设置组的不透明度
   * @param value 不透明度值（0-1）
   * @returns 组对象
   */
  function opacity(value: number) {
    groupElement.setAttribute('opacity', value.toString());
    return rtn;
  }

  /**
   * 设置组的可见性
   * @param visible 是否可见
   * @returns 组对象
   */
  function visibility(visible: boolean) {
    groupElement.style.display = visible ? 'block' : 'none';
    return rtn;
  }

  /**
   * 对组应用动画效果
   * @param options 动画选项
   * @returns 组对象
   */
  function animate(options: {
    duration: number,
    translate?: [number, number],
    scale?: [number, number],
    rotate?: number,
    opacity?: number
  }) {
    groupElement.style.transition = `transform ${options.duration}ms, opacity ${options.duration}ms`;
    // Apply animations...
    return rtn;
  }

  /**
   * 对组应用剪切路径
   * @param path SVG路径元素
   * @returns 组对象
   */
  function clip(path: SVGPathElement) {
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    const id = 'clip-' + Math.random().toString(36).substr(2, 9);
    clipPath.setAttribute('id', id);
    clipPath.appendChild(path);
    groupElement.appendChild(clipPath);
    groupElement.setAttribute('clip-path', `url(#${id})`);
    return rtn;
  }

  /**
   * 对组应用滤镜效果
   * @param type 滤镜类型
   * @param value 滤镜值
   * @returns 组对象
   */
  function filter(type: 'blur' | 'shadow' | 'glow', value: number) {
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    const id = 'filter-' + Math.random().toString(36).substr(2, 9);
    filter.setAttribute('id', id);
    
    switch (type) {
      case 'blur':
        const blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        blur.setAttribute('stdDeviation', value.toString());
        filter.appendChild(blur);
        break;
      case 'shadow':
        const offset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
        offset.setAttribute('dx', value.toString());
        offset.setAttribute('dy', value.toString());
        filter.appendChild(offset);
        break;
      // Add more filter types...
    }
    
    groupElement.appendChild(filter);
    groupElement.setAttribute('filter', `url(#${id})`);
    return rtn;
  }

  /**
   * 使组可拖动
   * @param onDrag 拖动回调函数
   * @returns 组对象
   */
  function drag(onDrag?: (x: number, y: number) => void) {
    let startX: number, startY: number;
    
    groupElement.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      
      const onMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        translate(dx, dy);
        onDrag?.(dx, dy);
      };
      
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
    
    return rtn;
  }

  /**
   * 设置组在父元素中的顺序
   * @param index 目标索引
   * @returns 组对象
   */
  function order(index: number) {
    if (groupElement.parentNode) {
      const parent = groupElement.parentNode;
      if (index >= 0 && index < parent.children.length) {
        parent.insertBefore(groupElement, parent.children[index]);
      }
    }
    return rtn;
  }

  /**
   * 清除组内所有元素
   * @returns 组对象
   */
  function clear() {
    while (groupElement.firstChild) {
      groupElement.removeChild(groupElement.firstChild);
    }
    return rtn;
  }

  /**
   * 从组中移除指定元素
   * @param element 要移除的SVG元素
   * @returns 组对象
   */
  function remove(element: SVGElement) {
    groupElement.removeChild(element);
    return rtn;
  }

  /**
   * 查找组内符合选择器的元素
   * @param selector CSS选择器
   * @returns 匹配的元素数组
   */
  function find(selector: string) {
    return Array.from(groupElement.querySelectorAll(selector));
  }

  /**
   * 遍历组内所有元素
   * @param callback 回调函数
   * @returns 组对象
   */
  function forEach(callback: (element: SVGElement, index: number) => void) {
    Array.from(groupElement.children).forEach((child, index) => {
      callback(child as SVGElement, index);
    });
    return rtn;
  }

  /**
   * 对组应用变换矩阵
   * @param matrix 变换矩阵或变换字符串
   * @returns 组对象
   */
  function transform(matrix: DOMMatrix | string) {
    if (typeof matrix === 'string') {
      groupElement.setAttribute('transform', matrix);
    } else {
      groupElement.setAttribute('transform', matrix.toString());
    }
    return rtn;
  }

  /**
   * 克隆组及其所有子元素
   * @returns 新的组对象
   */
  function clone() {
    const clonedGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // 复制所有属性
    Array.from(groupElement.attributes).forEach(attr => {
      clonedGroup.setAttribute(attr.name, attr.value);
    });
    
    // 深度克隆所有子元素
    Array.from(groupElement.children).forEach(child => {
      clonedGroup.appendChild(child.cloneNode(true));
    });
    
    // 返回一个新的 group 实例
    return group(
      parseFloat(clonedGroup.getAttribute('transform')?.match(/translate\((.*?),(.*?)\)/)?.[1] || '0'),
      parseFloat(clonedGroup.getAttribute('transform')?.match(/translate\((.*?),(.*?)\)/)?.[2] || '0')
    ).add({ node: () => clonedGroup });
  }

  return rtn;
}
