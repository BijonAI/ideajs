import { getTheme } from '../theme';
import { Arc } from '../interfaces/geometry';
import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import { gsap } from 'gsap';

export function arc(x: number, y: number, radius: number = 50): Arc {
  const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
  
  // 初始化为0度弧
  arc.setAttribute("d", describeArc(x, y, radius, 0, 0));
  
  const theme = getTheme();
  arc.setAttribute("stroke", theme.colors.primary);
  arc.setAttribute("fill", "none");
  
  const rtn = {
    node: () => arc,
    from,
    to,
    stroke,
    fill,
    transform,
    animation,
    event,
    attr,
    data,
    class_,
    tooltip,
    effect,
    scale: (x: number, y: number = x) => {
      const currentD = arc.getAttribute('d') || '';
      const scaledD = currentD.replace(/[\d.-]+/g, (match) => {
        const num = parseFloat(match);
        return (num * x).toString();
      });
      arc.setAttribute('d', scaledD);
      return rtn;
    },
    offset: (x: number, y: number) => {
      const transform = arc.getAttribute('transform') || '';
      arc.setAttribute('transform', transform + ` translate(${x},${y})`);
      return rtn;
    },
    samples: (n: number) => rtn,
    update: (newFn: (x: number) => number, newRange?: [number, number]) => rtn,
    range: (min: number, max: number) => rtn,
    domain: (min: number, max: number) => rtn,
    style: (options: any) => {
      if (options.color) arc.setAttribute('stroke', options.color);
      if (options.width) arc.setAttribute('stroke-width', options.width.toString());
      if (options.opacity) arc.setAttribute('opacity', options.opacity.toString());
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
      arc.style.pointerEvents = 'none';
      return rtn;
    },
    unlock: () => {
      arc.style.pointerEvents = 'all';
      return rtn;
    },
    restrict: (bounds: {x: [number, number], y: [number, number]}) => {
      return rtn;
    },
    snap: (gridSize: number) => {
      return rtn;
    },
    connect: (target: Arc, options?: {elastic?: boolean, distance?: number, strength?: number}) => {
      return rtn;
    },
    animateDrawing: (duration: number = 1000) => {
      requestAnimationFrame(() => {
        const length = arc.getTotalLength?.() || 0;
        if (length === 0) return rtn;
        
        arc.style.strokeDasharray = length.toString();
        arc.style.strokeDashoffset = length.toString();
        
        arc.animate([
          { strokeDashoffset: length },
          { strokeDashoffset: 0 }
        ], {
          duration,
          easing: 'ease-in-out',
          fill: 'forwards'
        });
      });
      return rtn;
    },
    show: () => {
      arc.style.display = '';
      return rtn;
    },
    hide: () => {
      arc.style.display = 'none';
      return rtn;
    },
    opacity: (value: number) => {
      arc.style.opacity = value.toString();
      return rtn;
    },
    remove: () => {
      arc.remove();
    },
    morph: (target: Arc, duration: number = 1000) => {
      if (!target?.node()) return rtn;
      const targetArc = target.node();
      gsap.to(arc, {
        duration: duration / 1000,
        attr: { d: targetArc.getAttribute('d') },
        ease: "power1.inOut"
      });
      return rtn;
    }
  }

  function from(startAngle: number) {
    const endAngle = Number(arc.dataset.endAngle || 0);
    arc.dataset.startAngle = startAngle.toString();
    arc.setAttribute("d", describeArc(x, y, radius, startAngle, endAngle));
    return rtn;
  }

  function to(endAngle: number) {
    const startAngle = Number(arc.dataset.startAngle || 0);
    arc.dataset.endAngle = endAngle.toString();
    arc.setAttribute("d", describeArc(x, y, radius, startAngle, endAngle));
    return rtn;
  }

  function stroke(color?: string) {
    const theme = getTheme();
    arc.setAttribute("stroke", color || theme.colors.primary);
    return rtn;
  }

  function fill(color?: string) {
    const theme = getTheme();
    arc.setAttribute("fill", color || theme.colors.secondary);
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
      arc.style.transformOrigin = `${options.origin[0]}px ${options.origin[1]}px`;
    }
    arc.setAttribute('transform', transform.trim());
    return rtn;
  }

  function animation(options: Animation) {
    const animations: string[] = [];
    if (options.properties) {
      Object.entries(options.properties).forEach(([prop, { from, to }]) => {
        arc.style.setProperty(prop, from);
        animations.push(`${prop} ${options.duration || 300}ms ${options.easing || 'ease'}`);
        setTimeout(() => arc.style.setProperty(prop, to), 0);
      });
    }
    arc.style.transition = animations.join(', ');
    options.onStart?.();
    if (options.onEnd) {
      setTimeout(options.onEnd, (options.duration || 300) + (options.delay || 0));
    }
    return rtn;
  }

  function event(type: string, handler: (e: Event) => void) {
    arc.addEventListener(type, handler);
    return {
      remove: () => arc.removeEventListener(type, handler),
      rtn
    };
  }

  function attr(name: string, value: string) {
    arc.setAttribute(name, value);
    return rtn;
  }

  function data(key: string, value: any) {
    arc.dataset[key] = value;
    return rtn;
  }

  function class_(names: string | string[]) {
    if (Array.isArray(names)) {
      arc.classList.add(...names);
    } else {
      arc.classList.add(names);
    }
    return {
      remove: () => arc.classList.remove(...(Array.isArray(names) ? names : [names])),
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
    
    arc.addEventListener('mouseenter', (e) => {
      document.body.appendChild(tip);
      const rect = arc.getBoundingClientRect();
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
    
    arc.addEventListener('mouseleave', () => {
      tip.remove();
    });
    
    return rtn;
  }

  function effect(type: 'glow' | 'shadow' | 'blur', options: EffectOptions = {}) {
    const { color = '#000', strength = 5, spread = 0 } = options;
    switch (type) {
      case 'glow':
        arc.style.filter = `drop-shadow(0 0 ${strength}px ${color})`;
        break;
      case 'shadow':
        arc.style.filter = `drop-shadow(${spread}px ${spread}px ${strength}px ${color})`;
        break;
      case 'blur':
        arc.style.filter = `blur(${strength}px)`;
        break;
    }
    return rtn;
  }

  return rtn;
}

// 辅助函数：将角度转换为弧度
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// 辅助函数：生成圆弧路径
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const sweepFlag = "1";
  
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
  ].join(" ");
}

