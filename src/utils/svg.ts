// SVG 命名空间
export const SVG_NS = "http://www.w3.org/2000/svg";

// 创建 SVG 元素的工具函数
export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  attrs?: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NS, tagName);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value.toString());
    });
  }
  return element;
}

// 创建 SVG 路径的工具函数
export function createPath(attrs?: Record<string, string | number>): SVGPathElement {
  return createSVGElement('path', {
    fill: 'none',
    stroke: 'black',
    'stroke-width': '2',
    ...attrs
  });
}

// 创建 SVG 线段的工具函数
export function createLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  attrs?: Record<string, string | number>
): SVGLineElement {
  return createSVGElement('line', {
    x1,
    y1,
    x2,
    y2,
    ...attrs
  });
}

// 创建 SVG 文本的工具函数
export function createText(
  content: string,
  attrs?: Record<string, string | number>
): SVGTextElement {
  const text = createSVGElement('text', attrs);
  text.textContent = content;
  return text;
}

// 创建 SVG 组的工具函数
export function createGroup(
  attrs?: Record<string, string | number>
): SVGGElement {
  return createSVGElement('g', attrs);
}

// 创建 SVG 圆形的工具函数
export function createCircle(
  cx: number,
  cy: number,
  r: number,
  attrs?: Record<string, string | number>
): SVGCircleElement {
  return createSVGElement('circle', {
    cx,
    cy,
    r,
    ...attrs
  });
}

// 创建 SVG 多边形的工具函数
export function createPolygon(
  points: string,
  attrs?: Record<string, string | number>
): SVGPolygonElement {
  return createSVGElement('polygon', {
    points,
    ...attrs
  });
}

// 批量设置属性的工具函数
export function setAttributes(
  element: SVGElement,
  attrs: Record<string, string | number>
): void {
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value.toString());
  });
}

// 创建文档片段的工具函数
export function createFragment(): DocumentFragment {
  return document.createDocumentFragment();
}

// 应用变换的工具函数
export function applyTransform(
  element: SVGElement,
  transform: string
): void {
  const currentTransform = element.getAttribute('transform') || '';
  element.setAttribute('transform', `${currentTransform} ${transform}`.trim());
}

// 清除元素内容的工具函数
export function clearElement(element: SVGElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// 计算路径数据的工具函数
export function generatePathData(
  points: [number, number][],
  closed = false
): string {
  if (points.length === 0) return '';
  
  const commands = points.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`
  );
  
  if (closed) {
    commands.push('Z');
  }
  
  return commands.join(' ');
} 