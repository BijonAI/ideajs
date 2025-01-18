import { getTheme } from '../theme';
import { Parametric, ParametricStyle } from '../interfaces/geometry';
import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import { gsap } from 'gsap';

export function parametric(
  xFn: (t: number) => number,
  yFn: (t: number) => number,
  range: [number, number] = [0, 1]
): Parametric {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  
  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;
  let samples = 200;
  let [tMin, tMax] = range;
  let currentXFn = xFn;
  let currentYFn = yFn;
  
  const theme = getTheme();
  path.setAttribute("stroke", theme.colors.primary);
  path.setAttribute("stroke-width", theme.sizes.function.toString());
  
  function generatePath() {
    const step = (tMax - tMin) / samples;
    const points: [number, number][] = [];
    
    for (let t = tMin; t <= tMax; t += step) {
      try {
        const x = currentXFn(t) * scaleX + offsetX;
        const y = -currentYFn(t) * scaleY + offsetY;
        if (isFinite(x) && isFinite(y)) {
          points.push([x, y]);
        }
      } catch (e) {
        continue;
      }
    }
    
    if (points.length === 0) return;
    
    const d = points.reduce((acc, [x, y], i) => {
      return acc + `${i === 0 ? 'M' : 'L'} ${x},${y} `;
    }, '');
    
    path.setAttribute("d", d);
  }
  
  const rtn = {
    node: () => path,
    stroke: (color?: string) => {
      path.setAttribute("stroke", color || theme.colors.primary);
      return rtn;
    },
    style: (options: ParametricStyle) => {
      if (options.color) path.setAttribute('stroke', options.color);
      if (options.width) path.setAttribute('stroke-width', options.width.toString());
      if (options.opacity) path.setAttribute('opacity', options.opacity.toString());
      if (options.dashArray) path.setAttribute('stroke-dasharray', options.dashArray);
      if (options.lineCap) path.setAttribute('stroke-linecap', options.lineCap);
      return rtn;
    },
    range: (min: number, max: number) => {
      tMin = min;
      tMax = max;
      generatePath();
      return rtn;
    },
    samples: (n: number) => {
      samples = n;
      generatePath();
      return rtn;
    },
    scale: (x: number, y: number = x) => {
      scaleX = x;
      scaleY = y;
      generatePath();
      return rtn;
    },
    offset: (x: number, y: number) => {
      offsetX = x;
      offsetY = y;
      generatePath();
      return rtn;
    },
    update: (newXFn: (t: number) => number, newYFn: (t: number) => number, newRange?: [number, number]) => {
      currentXFn = newXFn;
      currentYFn = newYFn;
      if (newRange) {
        [tMin, tMax] = newRange;
      }
      generatePath();
      return rtn;
    },
    transform: (options: Transform) => {
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
        path.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
      }
      path.setAttribute('transform', transform.trim());
      return rtn;
    },
    animation: (options: Animation) => {
      const animations: string[] = [];
      if (options.properties) {
        Object.entries(options.properties).forEach(([prop, { from, to }]) => {
          path.style.setProperty(prop, from);
          animations.push(`${prop} ${options.duration || 300}ms ${options.easing || 'ease'}`);
          setTimeout(() => path.style.setProperty(prop, to), 0);
        });
      }
      path.style.transition = animations.join(', ');
      options.onStart?.();
      if (options.onEnd) {
        setTimeout(options.onEnd, (options.duration || 300) + (options.delay || 0));
      }
      return rtn;
    },
    event: (type: string, handler: (e: Event) => void) => {
      path.addEventListener(type, handler);
      return {
        remove: () => path.removeEventListener(type, handler),
        rtn
      };
    },
    attr: (name: string, value: string) => {
      path.setAttribute(name, value);
      return rtn;
    },
    data: (key: string, value: any) => {
      path.dataset[key] = value;
      return rtn;
    },
    class_: (names: string | string[]) => {
      if (Array.isArray(names)) {
        path.classList.add(...names);
      } else {
        path.classList.add(names);
      }
      return {
        remove: () => path.classList.remove(...(Array.isArray(names) ? names : [names])),
        rtn
      };
    },
    tooltip: (content: string | HTMLElement, options: TooltipOptions = {}) => {
      const tip = document.createElement('div');
      if (typeof content === 'string') {
        tip.textContent = content;
      } else {
        tip.appendChild(content);
      }
      if (options.className) tip.className = options.className;
      if (options.style) Object.assign(tip.style, options.style);
      
      path.addEventListener('mouseenter', (e) => {
        document.body.appendChild(tip);
        const rect = path.getBoundingClientRect();
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
      
      path.addEventListener('mouseleave', () => {
        tip.remove();
      });
      
      return rtn;
    },
    effect: (type: 'glow' | 'shadow' | 'blur', options: EffectOptions = {}) => {
      const { color = '#000', strength = 5, spread = 0 } = options;
      switch (type) {
        case 'glow':
          path.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
          break;
        case 'shadow':
          path.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
          break;
        case 'blur':
          path.style.filter = `blur(${strength}px)`;
          break;
      }
      return rtn;
    },
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
      path.style.pointerEvents = 'none';
      return rtn;
    },
    unlock: () => {
      path.style.pointerEvents = 'all';
      return rtn;
    },
    restrict: (bounds: {x: [number, number], y: [number, number]}) => {
      return rtn;
    },
    snap: (gridSize: number) => {
      return rtn;
    },
    connect: (target: Parametric, options?: {elastic?: boolean, distance?: number, strength?: number}) => {
      return rtn;
    },
    show: () => {
      path.style.display = '';
      return rtn;
    },
    hide: () => {
      path.style.display = 'none';
      return rtn;
    },
    opacity: (value: number) => {
      path.style.opacity = value.toString();
      return rtn;
    },
    remove: () => {
      path.remove();
    },
    morph: (target: Parametric, duration: number = 1000) => {
      if (!target?.node()) return rtn;
      const targetPath = target.node();
      gsap.to(path, {
        duration: duration / 1000,
        attr: { d: targetPath.getAttribute('d') },
        ease: "power1.inOut"
      });
      return rtn;
    }
  };
  
  generatePath();
  return rtn;
} 