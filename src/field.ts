import { Direction, down, left, right, up } from "./direction";
import { TeachingOptions } from "./interfaces/common";

export type Renderable = object & { node: () => SVGElement }

export function field(width: number, height: number) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(g);
  const originPoint = [0, 0];

  const rtn = {
    origin,
    direct,
    node,
    add,
    size,
    background,
    border,
    clear,
    remove,
    toDataURL,
    viewBox,
    zoom,
    presentation,
    enableSnap,
    teachingMode,
  }

  function origin(x: number, y: number) {
    originPoint[0] = x;
    originPoint[1] = y;
    g.setAttribute('transform', `translate(${x}, ${y})`);
    return rtn;
  }

  function direct(x: Direction, y: Direction) {
    const xValue = x === left() ? -1 : x === right() ? 1 : 0;
    const yValue = y === up() ? -1 : y === down() ? 1 : 0;
    g.setAttribute('transform', `translate(${xValue}, ${yValue})`);
    return rtn;
  }

  function node() {
    return svg;
  }

  function add(renderable: Renderable) {
    g.appendChild(renderable.node());
    return rtn;
  }

  function size(width: number, height: number) {
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    return rtn;
  }

  function background(color: string) {
    svg.style.background = color;
    return rtn;
  }

  function border(width: number, color: string) {
    svg.style.border = `${width}px solid ${color}`;
    return rtn;
  }

  function clear() {
    g.innerHTML = '';
    return rtn;
  }

  function remove(element: Renderable) {
    g.removeChild(element.node());
    return rtn;
  }

  function toDataURL() {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    return 'data:image/svg+xml;base64,' + btoa(source);
  }

  function viewBox(x: number, y: number, width: number, height: number) {
    svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
    return rtn;
  }

  function zoom(scale: number) {
    g.setAttribute('transform', `scale(${scale})`);
    return rtn;
  }

  function presentation(steps: {
    elements: Renderable[],
    duration: number,
    description?: string
  }[]) {
    let currentStep = 0;
    
    function playStep() {
      if (currentStep >= steps.length) return;
      
      const step = steps[currentStep];
      clear();
      
      step.elements.forEach(element => add(element));
      
      if (step.description) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = step.description;
        text.setAttribute("x", "10");
        text.setAttribute("y", "30");
        svg.appendChild(text);
      }
      
      currentStep++;
      if (currentStep < steps.length) {
        setTimeout(playStep, step.duration);
      }
    }
    
    playStep();
    return rtn;
  }

  function enableSnap(size: number) {
    const snapToGrid = (value: number) => Math.round(value / size) * size;
    
    svg.addEventListener('mousemove', (e) => {
      Array.from(g.children).forEach(child => {
        if (child.getAttribute('data-draggable')) {
          const rect = svg.getBoundingClientRect();
          const x = snapToGrid(e.clientX - rect.left);
          const y = snapToGrid(e.clientY - rect.top);
          child.setAttribute('transform', `translate(${x}, ${y})`);
        }
      });
    });
    
    return rtn;
  }

  function teachingMode(options: TeachingOptions = {}) {
    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    overlay.setAttribute("width", width.toString());
    overlay.setAttribute("height", height.toString());
    overlay.setAttribute("fill", "none");
    overlay.setAttribute("pointer-events", "none");
    svg.appendChild(overlay);
    
    if (options.annotations) {
      const annotationLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg.appendChild(annotationLayer);
    }
    
    return rtn;
  }

  return rtn;
}
