import { getTheme, setTheme } from "../theme";
// import { draggable } from "../utils/draggable";

export function coordinate() {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // frame
  const frame = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  const layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const axes = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // geom
  const geom = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const cont = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  group.setAttribute("width", "100vw");
  group.setAttribute("height", "100vh");
  group.setAttribute("fill", "transparent");
  group.setAttribute("overflow", "hidden");

  frame.setAttribute("width", "100%");
  frame.setAttribute("height", "100%");
  frame.style.cursor = "grab";

  geom.setAttribute("width", "100%");
  geom.setAttribute("height", "100%");

  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", "transparent");

  layer.append(grid, axes);
  frame.append(bg, layer);
  geom.append(cont);

  group.append(frame);
  group.append(geom);

  const rtn = {
    node: () => group,

    // frame
    axes: setAxes,
    grid: setGrid,
    ticks: setTicks,
    axesStyle,
    gridStyle,
    exportSVG,
    theme,

    // geom
    zoom,
    pan,
    add,
    addMarker,
    addText,
  };

  const viewBox = {
    x: -document.getElementById("canvas")!.getBoundingClientRect().width / 2,
    y: -document.getElementById("canvas")!.getBoundingClientRect().height / 2,
    w: document.getElementById("canvas")!.getBoundingClientRect().width,
    h: document.getElementById("canvas")!.getBoundingClientRect().height,
  };

  grid.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
  );

  axes.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
  );

  cont.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
  );

  function lightenHex(hex: string, factor: number): string {
    if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    // 解析 RGB 分量
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // 调整亮度
    r = Math.min(255, Math.round(r * (1 + factor)));
    g = Math.min(255, Math.round(g * (1 + factor)));
    b = Math.min(255, Math.round(b * (1 + factor)));

    return `#${(r | 256).toString(16).slice(1)}${(g | 256)
      .toString(16)
      .slice(1)}${(b | 256).toString(16).slice(1)}`;
  }

  /* ---------------------------------- frame --------------------------------- */

  let gridEnabled = false;
  let axesEnabled = false;
  let TicksEnabled = false;

  let gridSpacing: number = 50;
  let axesColor: string = "#505050";
  let tickSpacing: number = 50;

  function setGrid(space?: number) {
    gridEnabled = true;

    // 垂直网格线
    for (
      let x =
        Math.floor(viewBox.x / (space || gridSpacing)) * (space || gridSpacing);
      x < viewBox.x + viewBox.w;
      x += space || gridSpacing
    ) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("class", "grid-line");
      line.setAttribute("x1", `${x}`);
      line.setAttribute("x2", `${x}`);
      line.setAttribute("y1", `${viewBox.y}`);
      line.setAttribute("y2", `${viewBox.y + viewBox.h}`);
      line.setAttribute("stroke", "#ddd");
      line.setAttribute("stroke-width", "1");
      grid.appendChild(line);
    }

    // 水平网格线
    for (
      let y =
        Math.floor(viewBox.y / (space || gridSpacing)) * (space || gridSpacing);
      y < viewBox.y + viewBox.h;
      y += space || gridSpacing
    ) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("class", "grid-line");
      line.setAttribute("y1", `${y}`);
      line.setAttribute("y2", `${y}`);
      line.setAttribute("x1", `${viewBox.x}`);
      line.setAttribute("x2", `${viewBox.x + viewBox.w}`);
      line.setAttribute("stroke", "#ddd");
      line.setAttribute("stroke-width", "1");
      grid.appendChild(line);
    }

    return rtn;
  }

  function setAxes(color?: string) {
    axesEnabled = true;

    const xAxis = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    const yAxis = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );

    xAxis.setAttribute("x1", `${viewBox.x}`);
    xAxis.setAttribute("x2", `${viewBox.x + viewBox.w}`);
    xAxis.setAttribute("y1", "0");
    xAxis.setAttribute("y2", "0");
    xAxis.setAttribute("stroke", color || axesColor);
    xAxis.setAttribute("stroke-width", "2");

    yAxis.setAttribute("y1", `${viewBox.y}`);
    yAxis.setAttribute("y2", `${viewBox.y + viewBox.h}`);
    yAxis.setAttribute("x1", "0");
    yAxis.setAttribute("x2", "0");
    yAxis.setAttribute("stroke", color || axesColor);
    yAxis.setAttribute("stroke-width", "2");

    axes.append(xAxis, yAxis);

    return rtn;
  }

  function setTicks(space?: number) {
    TicksEnabled = true;

    const tickColor = lightenHex(axesColor, 0.2);

    // X轴刻度
    for (
      let x =
        Math.floor(viewBox.x / (space || tickSpacing) + 1) *
        (space || tickSpacing);
      x < viewBox.x + viewBox.w;
      x += space || tickSpacing
    ) {
      if (x === 0) continue;
      const tick = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      tick.setAttribute("x1", `${x}`);
      tick.setAttribute("x2", `${x}`);
      tick.setAttribute("y1", "-5");
      tick.setAttribute("y2", "5");
      tick.setAttribute("stroke", `${tickColor}`);
      tick.setAttribute("stroke-width", "2");

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", `${x}`);
      text.setAttribute("y", "25");
      text.setAttribute("fill", `${tickColor}`);
      text.style.font = "14px sans-serif";
      text.style.fontFamily = "Comic Sans MS";
      text.textContent = `${Math.round(x / (space || tickSpacing))}`;

      axes.append(tick, text);
    }

    // Y轴刻度
    for (
      let y =
        Math.floor(viewBox.y / (space || tickSpacing) + 1) *
        (space || tickSpacing);
      y < viewBox.y + viewBox.h;
      y += space || tickSpacing
    ) {
      if (y === 0) continue;
      const tick = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      tick.setAttribute("y1", `${y}`);
      tick.setAttribute("y2", `${y}`);
      tick.setAttribute("x1", "-5");
      tick.setAttribute("x2", "5");
      tick.setAttribute("stroke", `${tickColor}`);
      tick.setAttribute("stroke-width", "2");

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", "20");
      text.setAttribute("y", `${y + 3}`);
      text.setAttribute("fill", `${tickColor}`);
      text.style.font = "14px sans-serif";
      text.style.fontFamily = "Comic Sans MS";
      text.textContent = `${Math.round(-y / (space || tickSpacing))}`;

      axes.append(tick, text);
    }

    return rtn;
  }

  const elements: Array<{
    node: () => SVGElement;
    scale?: (x: number, y?: number) => any;
    offset?: (x: number, y: number) => any;
  }> = [];

  function gridStyle(options: {
    color?: string;
    width?: number;
    opacity?: number;
    dashArray?: string;
  }) {
    grid.childNodes.forEach((node) => {
      const line = node as SVGLineElement;
      line.setAttribute("stroke", options.color || "#ddd");
      line.setAttribute("stroke-width", options.width?.toString() || "1");
      line.setAttribute("stroke-opacity", options.opacity?.toString() || "1");
      line.setAttribute("stroke-dasharray", options.dashArray || "");
    });
    return rtn;
  }

  function axesStyle(options: {
    color?: string;
    width?: number;
    opacity?: number;
  }) {
    axes.childNodes.forEach((node) => {
      const line = node as SVGLineElement;
      line.setAttribute("stroke", options.color || "black");
      line.setAttribute("stroke-width", options.width?.toString() || "2");
      line.setAttribute("stroke-opacity", options.opacity?.toString() || "1");
    });

    return rtn;
  }

  function exportSVG() {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(group);
    return "data:image/svg+xml;base64," + btoa(source);
  }

  function theme(name: "light" | "dark") {
    setTheme(name);
    const theme = getTheme();

    group.style.background = theme.colors.background;

    gridStyle({
      color: theme.colors.grid,
      width: theme.sizes.grid,
      opacity: theme.opacity.grid,
    });

    axesStyle({
      color: theme.colors.axis,
      width: theme.sizes.axis,
    });

    // labels.childNodes.forEach((node) => {
    //   const text = node as SVGTextElement;
    //   text.setAttribute("fill", theme.colors.text);
    // });

    return rtn;
  }

  /* ---------------------------------- geom ---------------------------------- */

  function zoom(scale: number) {
    cont.setAttribute("transform", `scale(${scale})`);
    return rtn;
  }

  function pan(x: number, y: number) {
    const currentTransform = cont.getAttribute("transform") || "";
    cont.setAttribute("transform", `${currentTransform} translate(${x}, ${y})`);
    return rtn;
  }

  function add(element: {
    node: () => SVGElement;
    scale?: (x: number, y?: number) => any;
    offset?: (x: number, y: number) => any;
  }) {
    cont.appendChild(element.node());
    elements.push(element);
    return rtn;
  }

  function addMarker(
    x: number,
    y: number,
    options: {
      type?: "circle" | "cross" | "square";
      size?: number;
      color?: string;
    } = {},
  ) {
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const { type = "circle", size = 5, color = "black" } = options;

    switch (type) {
      case "circle":
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", size.toString());
        circle.setAttribute("fill", color);
        marker.appendChild(circle);
        break;
    }

    cont.appendChild(marker);
    return rtn;
  }

  function addText(
    x: number,
    y: number,
    text: string,
    options: {
      size?: number;
      color?: string;
      anchor?: "start" | "middle" | "end";
    } = {},
  ) {
    const { size = 12, color = "black", anchor = "middle" } = options;
    const textElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    textElement.setAttribute("x", x.toString());
    textElement.setAttribute("y", y.toString());
    textElement.setAttribute("font-size", size.toString());
    textElement.setAttribute("fill", color);
    textElement.setAttribute("text-anchor", anchor);
    textElement.style.fontFamily = "Comic Sans MS";
    textElement.textContent = text;
    cont.appendChild(textElement);
    return rtn;
  }

  let isDragging = false;
  let startPos = { x: 0, y: 0 };

  frame.addEventListener("mousedown", (e) => {
    isDragging = true;
    startPos = { x: e.clientX, y: e.clientY };
  });

  frame.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    viewBox.x -= dx;
    viewBox.y -= dy;
    startPos = { x: e.clientX, y: e.clientY };

    grid.setAttribute(
      "viewBox",
      `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
    );

    axes.setAttribute(
      "viewBox",
      `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
    );

    cont.setAttribute(
      "viewBox",
      `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
    );

    // 清空并重新绘制
    grid.innerHTML = "";
    axes.innerHTML = "";
    cont.innerHTML = "";

    if (axesEnabled) setAxes(axesColor);
    if (gridEnabled) setGrid(gridSpacing);
    if (TicksEnabled) setTicks(tickSpacing);

    elements.forEach((element) => {
      cont.appendChild(element.node());
    });
  });

  group.addEventListener("mouseup", () => (isDragging = false));
  group.addEventListener("mouseleave", () => (isDragging = false));

  return rtn;
}
