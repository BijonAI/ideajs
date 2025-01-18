import { draggable } from "../utils/draggable";
import { getTheme } from '../theme';
import { TeachingOptions, AnimationStep } from '../interfaces/common';
import { Dot } from "../interfaces/geometry";

export function dot(x: number, y: number) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x.toString());
  circle.setAttribute("cy", y.toString());
  circle.setAttribute("r", "4");
  circle.setAttribute("stroke-width", "2");

  const dragEvents = [];
  function onDrag(callback: (x: number, y: number) => void) {
    dragEvents.push(callback);
    return rtn;
  }
  
  const rtn = {
    node,
    resize,
    stroke,
    fill,
    border,
    focus,
    select,
    onFocus,
    onSelect,
    draggable(condition?: (x: number, y: number) => boolean) {
      draggable(circle, condition, () => dragEvents.forEach(callback => callback(
        Number(circle.getAttribute('cx')) + Number(circle.transform.baseVal[0].matrix.e),
        Number(circle.getAttribute('cy')) + Number(circle.transform.baseVal[0].matrix.f),
      )));
      return rtn;
    },
    onDrag,
    style,
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
      const annotation = document.createElementNS("http://www.w3.org/2000/svg", "text");
      annotation.textContent = text;
      annotation.setAttribute('x', circle.getAttribute('cx') || '0');
      annotation.setAttribute('y', (Number(circle.getAttribute('cy')) - 10).toString());
      annotation.setAttribute('text-anchor', 'middle');
      circle.parentNode?.appendChild(annotation);
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
      circle.style.pointerEvents = 'none';
      return rtn;
    },
    unlock: () => {
      circle.style.pointerEvents = 'all';
      return rtn;
    },
    restrict: (bounds: {x: [number, number], y: [number, number]}) => {
      return rtn;
    },
    snap: (gridSize: number) => {
      return rtn;
    },
    connect: (target: Dot, options?: {elastic?: boolean, distance?: number, strength?: number}) => {
      return rtn;
    },
    move,
  }

  function node() {
    return circle;
  }

  function move(x: number, y: number) {
    circle.setAttribute("cx", x.toString());
    circle.setAttribute("cy", y.toString());
    return rtn;
  }

  function resize(radius: number) {
    circle.setAttribute("r", radius.toString());
    return rtn;
  }

  function stroke(color?: string) {
    const theme = getTheme();
    circle.setAttribute("stroke", color || theme.colors.marker.stroke);
    return rtn;
  }

  function fill(color?: string) {
    const theme = getTheme();
    circle.setAttribute("fill", color || theme.colors.marker.fill);
    return rtn;
  }

  function border(width: number) {
    circle.setAttribute("stroke-width", width.toString());
    return rtn;
  }

  const focusEvents = [];
  function onFocus(callback: () => void) {
    focusEvents.push(callback);
    return rtn;
  }

  function focus(color: string) {
    focusEvents.forEach(callback => callback());
    const oldColor = circle.getAttribute("stroke");
    circle.addEventListener('mouseover', () => {
      console.log('focus', color);
      circle.setAttribute("stroke", color);
    });
    circle.addEventListener('mouseout', () => {
      circle.setAttribute("stroke", oldColor);
    });
    return rtn;
  }

  const selectEvents = [];
  function onSelect(callback: () => void) {
    selectEvents.push(callback);
    return rtn;
  }

  function select(color: string) {
    selectEvents.forEach(callback => callback());
    const oldColor = circle.getAttribute("stroke");
    let isMouseOver = false;
    circle.addEventListener('mousedown', () => {
      isMouseOver = true;
    });
    circle.addEventListener('mouseout', () => {
      isMouseOver = false;
    });
    circle.addEventListener('click', () => {
      if (isMouseOver) {
        circle.setAttribute("stroke", color);
      }
    });
    document.addEventListener('click', () => {
      if (!isMouseOver) {
        circle.setAttribute("stroke", oldColor);
      }
    });
    return rtn;
  }

  function style(options: {
    radius?: number;
    strokeWidth?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    fillColor?: string;
    fillOpacity?: number;
    cursor?: string;
    filter?: string;
    visibility?: 'visible' | 'hidden';
    pointerEvents?: 'none' | 'all';
  }) {
    if (options.radius) circle.setAttribute('r', options.radius.toString());
    if (options.strokeWidth) circle.setAttribute('stroke-width', options.strokeWidth.toString());
    if (options.strokeColor) circle.setAttribute('stroke', options.strokeColor);
    if (options.strokeOpacity) circle.setAttribute('stroke-opacity', options.strokeOpacity.toString());
    if (options.strokeDasharray) circle.setAttribute('stroke-dasharray', options.strokeDasharray);
    if (options.fillColor) circle.setAttribute('fill', options.fillColor);
    if (options.fillOpacity) circle.setAttribute('fill-opacity', options.fillOpacity.toString());
    if (options.cursor) circle.style.cursor = options.cursor;
    if (options.filter) circle.style.filter = options.filter;
    if (options.visibility) circle.style.visibility = options.visibility;
    if (options.pointerEvents) circle.style.pointerEvents = options.pointerEvents;
    return rtn;
  }

  function transform(options: {
    translate?: [number, number];
    scale?: number | [number, number];
    rotate?: number;
    skew?: [number, number];
    origin?: [number, number];
  }) {
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
      circle.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    circle.setAttribute('transform', transform.trim());
    return rtn;
  }

  function animation(options: {
    duration?: number;
    delay?: number;
    easing?: string;
    properties?: {
      [key: string]: {
        from: any;
        to: any;
      };
    };
    onStart?: () => void;
    onEnd?: () => void;
  }) {
    const animations: string[] = [];
    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        circle.style.setProperty(prop, from);
        animations.push(`${prop} ${options.duration || 300}ms ${options.easing || 'ease'}`);
        setTimeout(() => circle.style.setProperty(prop, to), 0);
      });
    }
    circle.style.transition = animations.join(', ');
    options.onStart?.();
    if (options.onEnd) {
      setTimeout(options.onEnd, (options.duration || 300) + (options.delay || 0));
    }
    return rtn;
  }

  function event(type: string, handler: (e: Event) => void) {
    circle.addEventListener(type, handler);
    return {
      remove: () => circle.removeEventListener(type, handler),
      rtn
    };
  }

  function attr(name: string, value: string) {
    circle.setAttribute(name, value);
    return rtn;
  }

  function data(key: string, value: any) {
    circle.dataset[key] = value;
    return rtn;
  }

  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      circle.classList.add(...names);
    } else {
      circle.classList.add(names);
    }
    return {
      remove: () => circle.classList.remove(...(Array.isArray(names) ? names : [names])),
      rtn
    };
  }

  function tooltip(content: string | HTMLElement, options: {
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: [number, number];
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
  } = {}) {
    const tip = document.createElement('div');
    if (typeof content === 'string') {
      tip.textContent = content;
    } else {
      tip.appendChild(content);
    }
    if (options.className) tip.className = options.className;
    if (options.style) Object.assign(tip.style, options.style);
    
    circle.addEventListener('mouseenter', () => {
      document.body.appendChild(tip);
      const rect = circle.getBoundingClientRect();
      // Position tooltip based on options.position
      // ...
    });
    
    circle.addEventListener('mouseleave', () => {
      tip.remove();
    });
    
    return rtn;
  }

  function effect(type: 'glow' | 'shadow' | 'blur', options: {
    color?: string;
    strength?: number;
    spread?: number;
  } = {}) {
    const { color = '#000', strength = 5, spread = 0 } = options;
    switch (type) {
      case 'glow':
        circle.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case 'shadow':
        circle.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case 'blur':
        circle.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  return rtn;
}

