import { Renderable } from "../field";
import { dot } from "../geometry/dot";
import { getTheme } from "../theme";
import { gsap } from "gsap";

export function func(fn: (x: number) => number, xRange: [number, number]) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", "2");

  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;
  let samples = 200;
  let yRange: [number, number] | null = null;

  const rtn = {
    node: () => path,
    stroke,
    scale,
    offset,
    samples: setSamples,
    update,
    range,
    domain,
    style,
    animate,
    animateDrawing,
    discontinuity,
    derivative,
    integral,
    intersection,
    extrema,
    asymptotes,
    highlight,
    label,
    tooltip,
    show,
    hide,
    opacity,
    remove,
    morph,
    bind,
  };

  function bind(node: ReturnType<typeof dot>, x: number) {
    path.parentElement?.appendChild(node.node());
    node.move(x * scaleX + offsetX, -fn(x) * scaleY + offsetY);
    return rtn;
  }

  function generatePath() {
    const [start, end] = xRange;
    const step = (end - start) / samples;
    const points: [number, number][] = [];

    for (let x = start; x <= end; x += step) {
      try {
        const y = fn(x);
        if (
          isFinite(y) &&
          (yRange === null || (y >= yRange[0] && y <= yRange[1]))
        ) {
          points.push([x * scaleX + offsetX, -y * scaleY + offsetY]);
        }
      } catch (e) {
        continue;
      }
    }

    if (points.length === 0) return;

    const d = points.reduce((acc, [x, y], i) => {
      return acc + `${i === 0 ? "M" : "L"} ${x},${y} `;
    }, "");

    path.setAttribute("d", d);
  }

  function stroke(color: string) {
    path.setAttribute("stroke", color);
    return rtn;
  }

  function scale(x: number, y: number = x) {
    scaleX = x;
    scaleY = y;
    generatePath();
    return rtn;
  }

  function offset(x: number, y: number) {
    offsetX = x;
    offsetY = y;
    generatePath();
    return rtn;
  }

  function setSamples(n: number) {
    samples = n;
    generatePath();
    return rtn;
  }

  function update(newFn: (x: number) => number, newRange?: [number, number]) {
    fn = newFn;
    if (newRange) {
      xRange = newRange;
    }
    generatePath();
    return rtn;
  }

  function range(min: number, max: number) {
    yRange = [min, max];
    generatePath();
    return rtn;
  }

  function domain(min: number, max: number) {
    xRange = [min, max];
    generatePath();
    return rtn;
  }

  function style(options: {
    color?: string;
    width?: number;
    opacity?: number;
    dashArray?: string;
    lineCap?: string;
  }) {
    path.setAttribute("stroke", options.color || "black");
    path.setAttribute("stroke-width", options.width?.toString() || "2");
    path.setAttribute("stroke-opacity", options.opacity?.toString() || "1");
    path.setAttribute("stroke-dasharray", options.dashArray || "");
    path.setAttribute("stroke-linecap", options.lineCap || "butt");
    return rtn;
  }

  function animate(duration: number, easing?: string) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length.toString();
    path.style.strokeDashoffset = length.toString();
    path.style.transition = `stroke-dashoffset ${duration}ms ${easing || "linear"}`;
    setTimeout(() => (path.style.strokeDashoffset = "0"), 0);
    return rtn;
  }

  function animateDrawing(duration: number = 1000) {
    const [start, end] = xRange;
    const originalRange = [...xRange];
    const step = (end - start) / 50;
    let currentEnd = start;

    const interval = setInterval(() => {
      currentEnd += step;
      if (currentEnd >= end) {
        currentEnd = end;
        clearInterval(interval);
      }
      xRange = [start, currentEnd];
      generatePath();
    }, duration / 50);

    return rtn;
  }

  function discontinuity(points: number[]) {
    // 在这些点处分段绘制函数
    const segments: [number, number][][] = [];
    const [start, end] = xRange;
    let lastPoint = start;

    points.sort().forEach((point) => {
      if (point > start && point < end) {
        segments.push(generateSegment(lastPoint, point - 0.0001));
        lastPoint = point + 0.0001;
      }
    });

    segments.push(generateSegment(lastPoint, end));

    const d = segments
      .map((segment) =>
        segment.reduce(
          (acc, [x, y], i) => acc + `${i === 0 ? "M" : "L"} ${x},${y} `,
          "",
        ),
      )
      .join(" ");

    path.setAttribute("d", d);
    return rtn;
  }

  function derivative() {
    const derivFn = (x: number) => {
      const h = 0.0001;
      return (fn(x + h) - fn(x)) / h;
    };

    const theme = getTheme();
    const derivPath = func(derivFn, xRange).style({
      color: theme.colors.function.derivative,
      width: theme.sizes.function,
      opacity: theme.opacity.function,
      dashArray: "5,5",
    });

    if (path.parentNode) {
      path.parentNode.appendChild(derivPath.node());
    }

    return rtn;
  }

  function integral(from: number = xRange[0]) {
    const integralFn = (x: number) => {
      const dx = 0.001; // 使用更小的步长提高精度
      let sum = 0;
      for (let t = from; t <= x; t += dx) {
        const value = fn(t);
        if (isFinite(value)) {
          // 只累加有限值
          sum += value * dx;
        }
      }
      return sum;
    };

    const theme = getTheme();
    const integralPath = func(integralFn, xRange).style({
      color: theme.colors.function.integral,
      width: theme.sizes.function,
      opacity: theme.opacity.function,
    });

    if (path.parentNode) {
      path.parentNode.appendChild(integralPath.node());
    }

    return rtn;
  }

  function intersection(otherFn: (x: number) => number) {
    const points: [number, number][] = [];
    const [start, end] = xRange;
    const step = (end - start) / samples;

    for (let x = start; x <= end; x += step) {
      const y1 = fn(x);
      const y2 = otherFn(x);
      if (Math.abs(y1 - y2) < 0.01) {
        points.push([x, y1]);
      }
    }

    points.forEach(([x, y]) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", (x * scaleX + offsetX).toString());
      circle.setAttribute("cy", (-y * scaleY + offsetY).toString());
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "red");
      path.parentNode?.appendChild(circle);
    });

    return rtn;
  }

  function extrema() {
    const points: [number, number][] = [];
    const [start, end] = xRange;
    const step = (end - start) / samples;

    for (let x = start + step; x < end - step; x += step) {
      const y = fn(x);
      const yPrev = fn(x - step);
      const yNext = fn(x + step);

      if ((y > yPrev && y > yNext) || (y < yPrev && y < yNext)) {
        points.push([x, y]);
      }
    }

    points.forEach(([x, y]) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", (x * scaleX + offsetX).toString());
      circle.setAttribute("cy", (-y * scaleY + offsetY).toString());
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "green");
      path.parentNode?.appendChild(circle);
    });

    return rtn;
  }

  function highlight(
    from: number,
    to: number,
    color: string = "rgba(255,0,0,0.2)",
  ) {
    const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const points: [number, number][] = [];
    const step = (to - from) / samples;

    for (let x = from; x <= to; x += step) {
      const y = fn(x);
      points.push([x * scaleX + offsetX, -y * scaleY + offsetY]);
    }

    const d =
      points.reduce((acc, [x, y], i) => {
        return acc + `${i === 0 ? "M" : "L"} ${x},${y} `;
      }, "") +
      `L ${to * scaleX + offsetX},${offsetY} L ${from * scaleX + offsetX},${offsetY} Z`;

    area.setAttribute("d", d);
    area.setAttribute("fill", color);
    path.parentNode?.insertBefore(area, path);

    return rtn;
  }

  function label(text: string, x: number, y: number = fn(x)) {
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("x", (x * scaleX + offsetX).toString());
    label.setAttribute("y", (-y * scaleY + offsetY - 10).toString());
    label.setAttribute("text-anchor", "middle");
    label.textContent = text;
    path.parentNode?.appendChild(label);
    return rtn;
  }

  function tooltip() {
    const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    tooltip.appendChild(background);
    tooltip.appendChild(text);
    tooltip.style.display = "none";
    path.parentNode?.appendChild(tooltip);

    path.addEventListener("mousemove", (e) => {
      const rect = path.getBoundingClientRect();
      const x = (e.clientX - rect.left - offsetX) / scaleX;
      const y = fn(x);

      text.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
      background.setAttribute("fill", "white");
      background.setAttribute("stroke", "black");

      tooltip.style.display = "block";
      tooltip.setAttribute(
        "transform",
        `translate(${e.clientX - rect.left},${e.clientY - rect.top - 20})`,
      );
    });

    path.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });

    return rtn;
  }

  function asymptotes() {
    const points: { x: number; vertical: boolean; horizontal?: number }[] = [];
    const [start, end] = xRange;
    const step = (end - start) / samples;

    // 查找垂直渐近线
    for (let x = start; x <= end; x += step) {
      try {
        const y1 = fn(x - step / 2);
        const y2 = fn(x + step / 2);

        if (!isFinite(y1) || !isFinite(y2)) {
          points.push({ x, vertical: true });
        }
      } catch (e) {
        points.push({ x, vertical: true });
      }
    }

    // 查找水平渐近线
    const checkHorizontal = (x: number) => {
      try {
        return fn(x);
      } catch (e) {
        return Infinity;
      }
    };

    const leftLimit = checkHorizontal(start);
    const rightLimit = checkHorizontal(end);

    if (Math.abs(leftLimit - rightLimit) < 0.1 && isFinite(leftLimit)) {
      points.push({ x: start, vertical: false, horizontal: leftLimit });
    }

    // 绘制渐近线
    points.forEach((point) => {
      if (point.vertical) {
        // 绘制垂直渐近线
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        const x = point.x * scaleX + offsetX;
        line.setAttribute("x1", x.toString());
        line.setAttribute("y1", (-1000 * scaleY + offsetY).toString());
        line.setAttribute("x2", x.toString());
        line.setAttribute("y2", (1000 * scaleY + offsetY).toString());
        line.setAttribute("stroke", "red");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("stroke-dasharray", "5,5");
        path.parentNode?.appendChild(line);
      } else if (point.horizontal !== undefined) {
        // 绘制水平渐近线
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        const y = -point.horizontal * scaleY + offsetY;
        line.setAttribute("x1", (start * scaleX + offsetX).toString());
        line.setAttribute("y1", y.toString());
        line.setAttribute("x2", (end * scaleX + offsetX).toString());
        line.setAttribute("y2", y.toString());
        line.setAttribute("stroke", "red");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("stroke-dasharray", "5,5");
        path.parentNode?.appendChild(line);
      }
    });

    return rtn;
  }

  function generateSegment(start: number, end: number): [number, number][] {
    const points: [number, number][] = [];
    const step = (end - start) / samples;

    for (let x = start; x <= end; x += step) {
      try {
        const y = fn(x);
        if (
          isFinite(y) &&
          (yRange === null || (y >= yRange[0] && y <= yRange[1]))
        ) {
          points.push([x * scaleX + offsetX, -y * scaleY + offsetY]);
        }
      } catch (e) {
        continue;
      }
    }

    return points;
  }

  function show() {
    path.style.display = "";
    return rtn;
  }

  function hide() {
    path.style.display = "none";
    return rtn;
  }

  function opacity(value: number) {
    path.style.opacity = value.toString();
    return rtn;
  }

  function remove() {
    path.remove();
  }

  function morph(target: typeof rtn, duration: number = 1000) {
    if (!target || !target.node || typeof target.node !== "function") {
      console.error("Invalid target for morphing");
      return rtn;
    }

    const targetPath = target.node();
    if (!(targetPath instanceof SVGPathElement)) {
      console.error("Target must be a path element");
      return rtn;
    }

    const currentD = path.getAttribute("d") || "";
    const targetD = targetPath.getAttribute("d") || "";

    gsap.to(path, {
      duration: duration / 1000,
      attr: { d: targetD },
      ease: "power1.inOut",
    });

    return rtn;
  }

  generatePath();
  const theme = getTheme();
  style({
    color: theme.colors.function.stroke,
    width: theme.sizes.function,
    opacity: theme.opacity.function,
  });
  return rtn;
}
