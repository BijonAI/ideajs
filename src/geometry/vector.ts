import { getTheme } from '../theme';
import { Vector } from '../interfaces/geometry';
import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import gsap from 'gsap';

export function vector(x1: number, y1: number, x2: number, y2: number): Vector {
  const vector = document.createElementNS("http://www.w3.org/2000/svg", "g");
  vector.setAttribute("transform", `translate(${x1}, ${y1})`);
  
  const theme = getTheme();
  vector.setAttribute("stroke", theme.colors.primary);
  vector.setAttribute("stroke-width", theme.sizes.function.toString());
  
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x2", (x2 - x1).toString());
  line.setAttribute("y2", (-y2 + y1).toString());
  
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  arrow.setAttribute("points", `-5,-4 0,0 5,-4 0,8`);
  arrow.setAttribute("stroke", "none");
  arrow.setAttribute("fill", theme.colors.primary);
  
  vector.append(line, arrow);
  
  const rtn = {
    node: () => vector,
    from,
    to,
    stroke,
    scale: (x: number, y: number = x) => {
      x1 *= x;
      y1 *= y;
      vector.setAttribute("transform", `translate(${x1}, ${-y1})`);
      line.setAttribute("x2", (Number(line.getAttribute("x2")) * x).toString());
      line.setAttribute("y2", (Number(line.getAttribute("y2")) * y).toString());
      adjustAngle(0, 0, Number(line.getAttribute("x2")), Number(line.getAttribute("y2")));
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
      vector.style.pointerEvents = 'none';
      return rtn;
    },
    unlock: () => {
      vector.style.pointerEvents = 'all';
      return rtn;
    },
    restrict: (bounds: {x: [number, number], y: [number, number]}) => {
      return rtn;
    },
    snap: (gridSize: number) => {
      return rtn;
    },
    connect: (target: Vector, options?: {elastic?: boolean, distance?: number, strength?: number}) => {
      return rtn;
    },
    show: () => {
      vector.style.display = '';
      return rtn;
    },
    hide: () => {
      vector.style.display = 'none';
      return rtn;
    },
    opacity: (value: number) => {
      vector.style.opacity = value.toString();
      return rtn;
    },
    remove: () => {
      vector.remove();
    },
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

  function from(x1: number, y1: number) {
    adjustAngle(x1, y1, x2, y2);
    vector.setAttribute("transform", `translate(${x1}, ${y1})`);
    return rtn;
  }

  function to(x2: number, y2: number) {
    adjustAngle(x1, y1, x2, y2);
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    arrow.setAttribute("transform", `translate(${x2}, ${y2})`);
    return rtn;
  }

  function stroke(color?: string) {
    const theme = getTheme();
    line.setAttribute("stroke", color || theme.colors.primary);
    arrow.setAttribute("fill", color || theme.colors.primary);
    return rtn;
  }

  function adjustAngle(x1: number, y1: number, x2: number, y2: number) {
    const angle = Math.atan2(y1 - y2, x2 - x1);
    arrow.setAttribute("transform", `translate(${x2}, ${-y2}) rotate(${angle * 180 / Math.PI - 90})`);
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
      vector.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    vector.setAttribute('transform', transform.trim());
    return rtn;
  }

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

  function event(type: string, handler: (e: Event) => void) {
    vector.addEventListener(type, handler);
    return {
      remove: () => vector.removeEventListener(type, handler),
      rtn
    };
  }

  function attr(name: string, value: string) {
    vector.setAttribute(name, value);
    return rtn;
  }

  function data(key: string, value: any) {
    vector.dataset[key] = value;
    return rtn;
  }

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
    
    vector.addEventListener('mouseleave', () => {
      tip.remove();
    });
    
    return rtn;
  }

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

  adjustAngle(x1, y1, x2, y2);
  return rtn;
}
