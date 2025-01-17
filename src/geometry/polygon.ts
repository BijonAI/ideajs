import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import { Polygon } from '../interfaces/geometry';
import { getTheme } from '../theme';

export function polygon(points: { x: number, y: number }[]): Polygon {
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", points.map(point => `${point.x},${point.y}`).join(" "));
  
  const theme = getTheme();
  polygon.setAttribute("stroke-width", theme.sizes.function.toString());
  polygon.setAttribute("stroke", theme.colors.primary);
  polygon.setAttribute("fill", theme.colors.background);
  polygon.setAttribute("fill-opacity", "0.1");
  
  const rtn = {
    node: () => polygon,
    points,
    setPoints,
    setPoint,
    insertBefore,
    insertAfter,
    remove,
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
    highlight: (duration?: number) => {
      return rtn;
    },
    annotate: (text: string, position?: 'top' | 'bottom' | 'left' | 'right') => {
      return rtn;
    },
    pulse: (count?: number) => {
      return rtn;
    },
    trace: (color?: string) => {
      return rtn;
    },
    teachingMode: (options?: TeachingOptions) => {
      return rtn;
    },
    step: (steps: AnimationStep[]) => {
      return rtn;
    },
    lock: () => {
      polygon.style.pointerEvents = 'none';
      return rtn;
    },
    unlock: () => {
      polygon.style.pointerEvents = 'all';
      return rtn;
    },
    restrict: (bounds: {x: [number, number], y: [number, number]}) => {
      return rtn;
    },
    snap: (gridSize: number) => {
      return rtn;
    },
    connect: (target: Polygon, options?: {elastic?: boolean, distance?: number, strength?: number}) => {
      return rtn;
    }
  }

  function setPoints(points: { x: number, y: number }[]) {
    polygon.setAttribute("points", points.map(point => `${point.x},${point.y}`).join(" "));
    return rtn;
  }

  function setPoint(index: number, point: { x: number, y: number }) {
    const points = polygon.getAttribute("points")?.split(" ").map(point => point.split(","));
    points[index] = [point.x.toString(), point.y.toString()];
    polygon.setAttribute("points", points.flat().join(" "));
    return rtn;
  }

  function insertBefore(index: number, point: { x: number, y: number }) {
    const points = polygon.getAttribute("points")?.split(" ").map(point => point.split(","));
    points.splice(index, 0, [point.x.toString(), point.y.toString()]);
    polygon.setAttribute("points", points.flat().join(" "));
    return rtn;
  }

  function insertAfter(index: number, point: { x: number, y: number }) {
    const points = polygon.getAttribute("points")?.split(" ").map(point => point.split(","));
    points.splice(index + 1, 0, [point.x.toString(), point.y.toString()]);
    polygon.setAttribute("points", points.flat().join(" "));
    return rtn;
  }

  function remove(index: number) {
    const points = polygon.getAttribute("points")?.split(" ").map(point => point.split(","));
    points.splice(index, 1);
    polygon.setAttribute("points", points.flat().join(" "));
    return rtn;
  }

  function stroke(color?: string) {
    const theme = getTheme();
    polygon.setAttribute("stroke", color || theme.colors.primary);
    return rtn;
  }

  function fill(color?: string) {
    const theme = getTheme();
    polygon.setAttribute("fill", color || theme.colors.secondary);
    return rtn;
  }

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

  function animate(duration: number, easing?: string) {
    const length = polygon.getTotalLength();
    polygon.style.strokeDasharray = length.toString();
    polygon.style.strokeDashoffset = length.toString();
    polygon.style.transition = `stroke-dashoffset ${duration}ms ${easing || 'linear'}`;
    setTimeout(() => polygon.style.strokeDashoffset = '0', 0);
    return rtn;
  }

  function morph(points: { x: number, y: number }[]) {
    // Implementation for morphing
    return rtn;
  }

  function rotate(angle: number) {
    // Implementation for rotating
    return rtn;
  }

  function scale(factor: number) {
    // Implementation for scaling
    return rtn;
  }

  function translate(dx: number, dy: number) {
    // Implementation for translating
    return rtn;
  }

  function center() {
    // Implementation for finding the center
    return rtn;
  }

  function area() {
    // Implementation for calculating area
    return rtn;
  }

  function perimeter() {
    // Implementation for calculating perimeter
    return rtn;
  }

  function contains(point: { x: number, y: number }) {
    // Implementation for checking if a point is inside the polygon
    return rtn;
  }

  function intersects(polygon: { x: number, y: number }[]) {
    // Implementation for checking intersection
    return rtn;
  }

  function smooth() {
    // Implementation for smoothing
    return rtn;
  }

  function simplify() {
    // Implementation for simplifying
    return rtn;
  }

  function regular() {
    // Implementation for creating a regular polygon
    return rtn;
  }

  function clone() {
    // Implementation for cloning
    return rtn;
  }

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

  function event(type: string, handler: (e: Event) => void) {
    polygon.addEventListener(type, handler);
    return {
      remove: () => polygon.removeEventListener(type, handler),
      rtn
    };
  }

  function attr(name: string, value: string) {
    polygon.setAttribute(name, value);
    return rtn;
  }

  function data(key: string, value: any) {
    polygon.dataset[key] = value;
    return rtn;
  }

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
          tip.style.left = `${rect.left + rect.width/2 + offsetX}px`;
          tip.style.top = `${rect.top - tip.offsetHeight + offsetY}px`;
          break;
        case 'bottom':
          tip.style.left = `${rect.left + rect.width/2 + offsetX}px`;
          tip.style.top = `${rect.bottom + offsetY}px`;
          break;
        case 'left':
          tip.style.left = `${rect.left - tip.offsetWidth + offsetX}px`;
          tip.style.top = `${rect.top + rect.height/2 + offsetY}px`;
          break;
        case 'right':
          tip.style.left = `${rect.right + offsetX}px`;
          tip.style.top = `${rect.top + rect.height/2 + offsetY}px`;
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

  return rtn;
}

