import { getTheme } from '../theme';
import { Parametric, ParametricStyle } from '../interfaces/geometry';
import { Transform, Animation, TooltipOptions, EffectOptions, TeachingOptions, AnimationStep } from '../interfaces/common';
import { gsap } from 'gsap';

export function parametric(
  fn: (t: number) => [number, number],
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
  bind(node: ReturnType<typeof import('../geometry/dot').dot>, t: number): Parametric;
  update(newFn: (t: number) => [number, number], newRange?: [number, number]): Parametric;
} {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  
  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;
  let samples = 200;
  let [tMin, tMax] = range;
  let currentFn = fn;
  let unit = 1;
  let discontinuityPoints: number[] = [];
  
  const theme = getTheme();
  path.setAttribute("stroke", theme.colors.primary);
  path.setAttribute("stroke-width", theme.sizes.function.toString());
  
  function generatePath() {
    const step = (tMax - tMin) / samples;
    const points: [number, number][] = [];
    let currentPath = '';
    
    for (let t = tMin; t <= tMax; t += step) {
      try {
        const [x, y] = currentFn(t);
        const scaledX = x * scaleX;
        const scaledY = -y * scaleY;
        
        if (isFinite(scaledX) && isFinite(scaledY)) {
          if (discontinuityPoints.some(p => Math.abs(t - p) < step)) {
            if (points.length > 0) {
              currentPath += points.reduce((acc, [x, y], i) => 
                acc + `${i === 0 ? 'M' : 'L'} ${x + offsetX},${y + offsetY} `, '');
              points.length = 0;
            }
          }
          points.push([scaledX, scaledY]);
        }
      } catch (e) {
        if (points.length > 0) {
          currentPath += points.reduce((acc, [x, y], i) => 
            acc + `${i === 0 ? 'M' : 'L'} ${x + offsetX},${y + offsetY} `, '');
          points.length = 0;
        }
        continue;
      }
    }
    
    if (points.length > 0) {
      currentPath += points.reduce((acc, [x, y], i) => 
        acc + `${i === 0 ? 'M' : 'L'} ${x + offsetX},${y + offsetY} `, '');
    }
    
    if (currentPath) {
      path.setAttribute("d", currentPath);
    }
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
      generatePath();
      return rtn;
    },
    offset: (x: number, y: number) => {
      offsetX = x;
      offsetY = y;
      generatePath();
      return rtn;
    },
    discontinuity: (points: number[]) => {
      discontinuityPoints = points;
      generatePath();
      return rtn;
    },
    derivative: () => {
      const h = (tMax - tMin) / 1000;
      return parametric((t: number) => {
        const [x1, y1] = currentFn(t);
        const [x2, y2] = currentFn(t + h);
        return [(x2 - x1) / h, (y2 - y1) / h];
      }, [tMin, tMax])
        .scale(scaleX, scaleY)
        .offset(offsetX, offsetY)
        .samples(samples);
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
    integral: (from: number = tMin) => {
      const h = (tMax - tMin) / samples;
      let accumX = 0;
      let accumY = 0;
      
      return parametric((t: number) => {
        if (t < from) return [0, 0];
        accumX = 0;
        accumY = 0;
        for (let i = from; i <= t; i += h) {
          const [x, y] = currentFn(i);
          accumX += x * h;
          accumY += y * h;
        }
        return [accumX, accumY];
      }, [tMin, tMax])
        .scale(scaleX, scaleY)
        .offset(offsetX, offsetY)
        .samples(samples);
    },
    intersection: (other: Parametric) => {
      const intersections: { x: number; y: number }[] = [];
      const threshold = 0.1 / unit;
      
      for (let t1 = tMin; t1 <= tMax; t1 += (tMax - tMin) / samples) {
        const [x1, y1] = currentFn(t1);
        const scaledX1 = x1 * scaleX * unit + offsetX;
        const scaledY1 = -y1 * scaleY * unit + offsetY;
        
        for (let t2 = tMin; t2 <= tMax; t2 += (tMax - tMin) / samples) {
          const otherPath = other.node();
          const otherD = otherPath.getAttribute('d');
          if (!otherD) continue;
          
          const points = otherD.split(/[ML]\s*/).slice(1).map(point => {
            const [x, y] = point.trim().split(',').map(Number);
            return { x: (x - offsetX) / (scaleX * unit), y: -(y - offsetY) / (scaleY * unit) };
          });
          
          const x2 = points[Math.floor(t2 * points.length / (tMax - tMin))].x * scaleX * unit + offsetX;
          const y2 = -points[Math.floor(t2 * points.length / (tMax - tMin))].y * scaleY * unit + offsetY;
          
          if (Math.abs(scaledX1 - x2) < threshold && Math.abs(scaledY1 - y2) < threshold) {
            const found = intersections.some(p => 
              Math.abs(p.x - scaledX1) < threshold && Math.abs(p.y - scaledY1) < threshold
            );
            if (!found) {
              intersections.push({ x: scaledX1, y: scaledY1 });
            }
          }
        }
      }
      
      return intersections;
    },
    extrema: () => {
      const h = (tMax - tMin) / 1000;
      const extremaPoints: { x: number; y: number }[] = [];
      
      for (let t = tMin + h; t <= tMax - h; t += h) {
        const [x0, y0] = currentFn(t - h);
        const [x1, y1] = currentFn(t);
        const [x2, y2] = currentFn(t + h);
        
        const dxPrev = (x1 - x0) / h;
        const dxNext = (x2 - x1) / h;
        const dyPrev = (y1 - y0) / h;
        const dyNext = (y2 - y1) / h;
        
        if ((dxPrev * dxNext <= 0 || dyPrev * dyNext <= 0) && 
            (Math.abs(dxPrev) > 1e-6 || Math.abs(dyPrev) > 1e-6)) {
          const scaledX = x1 * scaleX * unit + offsetX;
          const scaledY = -y1 * scaleY * unit + offsetY;
          extremaPoints.push({ x: scaledX, y: scaledY });
        }
      }
      
      return extremaPoints;
    },
    asymptotes: () => {
      const asymptotes: { horizontal?: number[]; vertical?: number[] } = {
        horizontal: [],
        vertical: []
      };
      
      const step = (tMax - tMin) / samples;
      let lastY = null;
      let lastX = null;
      const threshold = 1000;
      
      for (let t = tMin; t <= tMax; t += step) {
        try {
          const [x, y] = currentFn(t);
          
          if (lastY !== null && lastX !== null) {
            const dy = Math.abs(y - lastY);
            const dx = Math.abs(x - lastX);
            
            if (dy > threshold && !asymptotes.horizontal?.includes(lastY)) {
              asymptotes.horizontal?.push(lastY);
            }
            
            if (dx > threshold && !asymptotes.vertical?.includes(lastX)) {
              asymptotes.vertical?.push(lastX);
            }
          }
          
          lastX = x;
          lastY = y;
        } catch (e) {
          if (lastX !== null && !asymptotes.vertical?.includes(lastX)) {
            asymptotes.vertical?.push(lastX);
          }
        }
      }
      
      return asymptotes;
    },
    highlight: (duration: number = 1000) => {
      const originalColor = path.getAttribute('stroke');
      const originalWidth = path.getAttribute('stroke-width');
      const originalOpacity = path.getAttribute('opacity');
      
      path.setAttribute('stroke', theme.colors.secondary);
      path.setAttribute('stroke-width', (parseFloat(originalWidth || '2') * 1.5).toString());
      path.setAttribute('opacity', '1');
      
      setTimeout(() => {
        path.setAttribute('stroke', originalColor || theme.colors.primary);
        path.setAttribute('stroke-width', originalWidth || theme.sizes.function.toString());
        path.setAttribute('opacity', originalOpacity || '1');
      }, duration);
      
      return rtn;
    },
    label: (text: string) => {
      const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const pathLength = path.getTotalLength();
      const point = path.getPointAtLength(pathLength / 2);
      
      textElement.setAttribute('x', point.x.toString());
      textElement.setAttribute('y', point.y.toString());
      textElement.setAttribute('fill', theme.colors.text);
      textElement.setAttribute('font-size', '12');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('dominant-baseline', 'middle');
      textElement.textContent = text;
      
      const parent = path.parentNode;
      if (parent) {
        parent.appendChild(textElement);
      }
      
      return rtn;
    },
    bind: (node: ReturnType<typeof import('../geometry/dot').dot>, t: number) => {
      const [x, y] = currentFn(t);
      const scaledX = x * scaleX * unit + offsetX;
      const scaledY = -y * scaleY * unit + offsetY;
      node.node().setAttribute('cx', scaledX.toString());
      node.node().setAttribute('cy', scaledY.toString());
      return rtn;
    },
    update: (newFn: (t: number) => [number, number], newRange?: [number, number]) => {
      currentFn = newFn;
      if (newRange) {
        [tMin, tMax] = newRange;
      }
      generatePath();
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