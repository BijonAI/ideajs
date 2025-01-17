import { Renderable } from "./field";

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

  function translate(x: number, y: number) {
    groupElement.setAttribute("transform", `translate(${x}, ${y})`);
    return rtn;
  }

  function scale(x: number, y: number) {
    groupElement.setAttribute("transform", `scale(${x}, ${y})`);
    return rtn;
  }

  function rotate(angle: number) {
    groupElement.setAttribute("transform", `rotate(${angle})`);
    return rtn;
  }

  function opacity(value: number) {
    groupElement.setAttribute('opacity', value.toString());
    return rtn;
  }

  function visibility(visible: boolean) {
    groupElement.style.display = visible ? 'block' : 'none';
    return rtn;
  }

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

  function clip(path: SVGPathElement) {
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    const id = 'clip-' + Math.random().toString(36).substr(2, 9);
    clipPath.setAttribute('id', id);
    clipPath.appendChild(path);
    groupElement.appendChild(clipPath);
    groupElement.setAttribute('clip-path', `url(#${id})`);
    return rtn;
  }

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

  function order(index: number) {
    if (groupElement.parentNode) {
      const parent = groupElement.parentNode;
      if (index >= 0 && index < parent.children.length) {
        parent.insertBefore(groupElement, parent.children[index]);
      }
    }
    return rtn;
  }

  function clear() {
    while (groupElement.firstChild) {
      groupElement.removeChild(groupElement.firstChild);
    }
    return rtn;
  }

  function remove(element: SVGElement) {
    groupElement.removeChild(element);
    return rtn;
  }

  function find(selector: string) {
    return Array.from(groupElement.querySelectorAll(selector));
  }

  function forEach(callback: (element: SVGElement, index: number) => void) {
    Array.from(groupElement.children).forEach((child, index) => {
      callback(child as SVGElement, index);
    });
    return rtn;
  }

  function transform(matrix: DOMMatrix | string) {
    if (typeof matrix === 'string') {
      groupElement.setAttribute('transform', matrix);
    } else {
      groupElement.setAttribute('transform', matrix.toString());
    }
    return rtn;
  }

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
