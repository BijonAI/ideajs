import { Direction, down, left, right, up } from './direction';
import { createSVGElement, createGroup, setAttributes, clearElement } from './utils/svg';
import { BatchOperation, EventManager, ObjectPool } from './utils/performance';
import { SVG } from './config/constants';

export interface Renderable {
  node: () => SVGElement;
  update?: (...args: any[]) => void;
  dispose?: () => void;
}

export function field(width: number, height: number) {
  // 创建基本元素
  const svg = createSVGElement('svg', {
    width,
    height,
    viewBox: `${-width/2} ${-height/2} ${width} ${height}`
  });
  
  const g = createGroup();
  svg.appendChild(g);

  // 性能优化工具
  const batchOp = new BatchOperation();
  const eventManager = new EventManager();
  const elementPool = new ObjectPool<Renderable>(
    () => ({ node: () => createGroup() }),
    { maxSize: 100 }
  );

  // 元素管理
  const elements = new Set<Renderable>();
  let originPoint = { x: 0, y: 0 };

  const api = {
    node: () => svg,

    origin: (x: number, y: number) => {
      originPoint = { x, y };
      batchOp.add(() => {
        setAttributes(g, {
          transform: `translate(${x}, ${y})`
        });
      });
      return api;
    },

    direct: (x: Direction, y: Direction) => {
      const xValue = x === left() ? -1 : x === right() ? 1 : 0;
      const yValue = y === up() ? -1 : y === down() ? 1 : 0;
      originPoint = { x: xValue, y: yValue };
      batchOp.add(() => {
        setAttributes(g, {
          transform: `translate(${xValue}, ${yValue})`
        });
      });
      return api;
    },

    add: (renderable: Renderable) => {
      elements.add(renderable);
      batchOp.add(() => {
        g.appendChild(renderable.node());
      });
      return api;
    },

    remove: (renderable: Renderable) => {
      if (elements.has(renderable)) {
        elements.delete(renderable);
        batchOp.add(() => {
          const node = renderable.node();
          if (node.parentNode === g) {
            g.removeChild(node);
          }
          renderable.dispose?.();
          elementPool.release(renderable);
        });
      }
      return api;
    },

    clear: () => {
      batchOp.add(() => {
        elements.forEach(element => {
          element.dispose?.();
          elementPool.release(element);
        });
        elements.clear();
        clearElement(g);
      });
      return api;
    },

    size: (w: number, h: number) => {
      batchOp.add(() => {
        setAttributes(svg, {
          width: w,
          height: h,
          viewBox: `${-w/2} ${-h/2} ${w} ${h}`
        });
      });
      return api;
    },

    background: (color: string) => {
      batchOp.add(() => {
        svg.style.backgroundColor = color;
      });
      return api;
    },

    border: (width: number, color: string) => {
      batchOp.add(() => {
        svg.style.border = `${width}px solid ${color}`;
      });
      return api;
    },

    viewBox: (x: number, y: number, w: number, h: number) => {
      batchOp.add(() => {
        setAttributes(svg, {
          viewBox: `${x} ${y} ${w} ${h}`
        });
      });
      return api;
    },

    zoom: (scale: number) => {
      batchOp.add(() => {
        setAttributes(g, {
          transform: `scale(${scale})`
        });
      });
      return api;
    },

    toDataURL: () => {
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      return 'data:image/svg+xml;base64,' + btoa(source);
    },

    dispose: () => {
      batchOp.clear();
      eventManager.clear();
      elements.forEach(element => element.dispose?.());
      elements.clear();
      elementPool.clear();
      svg.parentNode?.removeChild(svg);
    }
  };

  return api;
}
