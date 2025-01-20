import { getTheme } from '../theme';
import { Parametric, ParametricStyle } from '../interfaces/geometry';
import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import { gsap } from 'gsap';

export function parametric(
  xFn: (t: number) => number,
  yFn: (t: number) => number,
  range: [number, number] = [0, 1]
): Parametric & {
  domain(min: number, max: number): Parametric;
  animate(options: Animation): Parametric;
  animateDrawing(duration?: number): Parametric;
  discontinuity(points: number[]): Parametric;
  derivative(): Parametric;
  integral(from?: number): Parametric;
  intersection(other: Parametric): { x: number, y: number }[];
  extrema(): { x: number, y: number }[];
  asymptotes(): { horizontal?: number[], vertical?: number[] };
  highlight(duration?: number): Parametric;
  label(text: string): Parametric;
  bind(node: ReturnType<typeof import('../geometry/dot').dot>, x: number): Parametric;
  update(newFn: (x: number) => number, newRange?: [number, number]): Parametric;
} {
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
  let unit = 1;
  
  const theme = getTheme();
  path.setAttribute("stroke", theme.colors.primary);
  path.setAttribute("stroke-width", theme.sizes.function.toString());
  
  function generatePath() {
    const step = (tMax - tMin) / samples;
    const points: [number, number][] = [];
    
    for (let t = tMin; t <= tMax; t += step) {
      try {
        const x = currentXFn(t) * scaleX * unit + offsetX;
        const y = -currentYFn(t) * scaleY * unit + offsetY;
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
    domain: (min: number, max: number) => {
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
      unit = x;
      generatePath();
      return rtn;
    },
    offset: (x: number, y: number) => {
      offsetX = x;
      offsetY = y;
      generatePath();
      return rtn;
    },
    update: (newFn: (x: number) => number, newRange?: [number, number]) => {
      currentXFn = t => t;
      currentYFn = newFn;
      if (newRange) {
        [tMin, tMax] = newRange;
      }
      generatePath();
      return rtn;
    },
    animate: (options: Animation) => {
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
    animateDrawing: (duration: number = 1000) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length.toString();
      path.style.strokeDashoffset = length.toString();
      path.style.transition = `stroke-dashoffset ${duration}ms linear`;
      setTimeout(() => path.style.strokeDashoffset = '0', 0);
      return rtn;
    },
    discontinuity: (points: number[]) => {
      return rtn;
    },
    derivative: () => {
      return rtn;
    },
    integral: (from?: number) => {
      return rtn;
    },
    intersection: (other: Parametric) => {
      return [];
    },
    extrema: () => {
      return [];
    },
    asymptotes: () => {
      return {};
    },
    highlight: (duration?: number) => {
      return rtn;
    },
    label: (text: string) => {
      return rtn;
    },
    bind: (node: ReturnType<typeof import('../geometry/dot').dot>, x: number) => {
      return rtn;
    },
    morph: (target: any, duration: number = 1000) => {
      if (!target?.node()) return rtn;
      const targetPath = target.node();
      
      const currentD = path.getAttribute('d') || '';
      const targetD = targetPath.getAttribute('d') || '';
      
      if (currentD && targetD) {
        const currentPoints = currentD.split(/[ML]\s*/).slice(1).map(point => {
          const [x, y] = point.trim().split(',').map(Number);
          return { x: x / unit, y: y / unit };
        });
        
        const targetPoints = targetD.split(/[ML]\s*/).slice(1).map(point => {
          const [x, y] = point.trim().split(',').map(Number);
          return { x: x / unit, y: y / unit };
        });
        
        const interpolatedPoints = currentPoints.map((currentPoint, i) => {
          const targetPoint = targetPoints[Math.floor(i * targetPoints.length / currentPoints.length)];
          return {
            x: currentPoint.x * unit,
            y: currentPoint.y * unit,
            targetX: (targetPoint?.x || currentPoint.x) * unit,
            targetY: (targetPoint?.y || currentPoint.y) * unit
          };
        });
        
        gsap.to(interpolatedPoints, {
          duration: duration / 1000,
          x: 'targetX',
          y: 'targetY',
          ease: "power1.inOut",
          onUpdate: () => {
            const newD = interpolatedPoints.reduce((acc, point, i) => {
              return acc + `${i === 0 ? 'M' : 'L'} ${point.x},${point.y} `;
            }, '');
            path.setAttribute('d', newD);
          }
        });
      }
      
      return rtn;
    }
  };
  
  generatePath();
  return rtn as any;
} 