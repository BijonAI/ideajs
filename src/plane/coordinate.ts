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

  //   const rtn = {
  //     node: () => group,
  //     origin,
  //     grid: setGrid,
  //     labels: setLabels,
  //     stroke,
  //     add,
  //     unit: setUnit,
  //     axisStyle,
  //     gridStyle,
  //     hideAxis,
  //     hideGrid,
  //     hideLabels,
  //     zoom,
  //     pan,
  //     snap,
  //     exportSVG,
  //     addMarker,
  //     addText,
  //     theme,
  //     draggable: enableDragging,
  //   };

  const rtn = {
    node: () => group,
    axes: setAxes,
    grid: setGrid,
    ticks: setTicks,
    labels: setLabels,
    stroke,
    add,
    axisStyle,
    gridColor,
    gridStyle,
    // hideAxis,
    hideGrid,
    // hideLabels,
    zoom,
    pan,
    exportSVG,
    addMarker,
    addText,
    theme,
    // draggable: enableDragging,
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

  let gridSpacing: number;
  function setGrid(space: number = 50) {
    gridSpacing = space;

    // 垂直网格线
    for (
      let x = Math.floor(viewBox.x / space) * space;
      x < viewBox.x + viewBox.w;
      x += space
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
      let y = Math.floor(viewBox.y / space) * space;
      y < viewBox.y + viewBox.h;
      y += space
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

  let AxesColor: string;
  function setAxes(color: string = "#505050") {
    AxesColor = color;
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
    xAxis.setAttribute("stroke", color);
    xAxis.setAttribute("stroke-width", "2");

    yAxis.setAttribute("y1", `${viewBox.y}`);
    yAxis.setAttribute("y2", `${viewBox.y + viewBox.h}`);
    yAxis.setAttribute("x1", "0");
    yAxis.setAttribute("x2", "0");
    yAxis.setAttribute("stroke", color);
    yAxis.setAttribute("stroke-width", "2");

    axes.append(xAxis, yAxis);

    return rtn;
  }

  let tickSpacing: number;
  function setTicks(space: number = 50) {
    tickSpacing = space;
    const tickColor = lightenHex(AxesColor, 0.2);

    // X轴刻度
    for (
      let x = Math.floor(viewBox.x / space + 1) * space;
      x < viewBox.x + viewBox.w;
      x += space
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
      text.textContent = `${Math.round(x / space)}`;

      axes.append(tick, text);
    }

    // Y轴刻度
    for (
      let y = Math.floor(viewBox.y / space + 1) * space;
      y < viewBox.y + viewBox.h;
      y += space
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
      text.textContent = `${Math.round(-y / space)}`;

      axes.append(tick, text);
    }

    return rtn;
  }

  const elements: Array<{
    node: () => SVGElement;
    scale?: (x: number, y?: number) => any;
    offset?: (x: number, y: number) => any;
  }> = [];

  function add(element: {
    node: () => SVGElement;
    scale?: (x: number, y?: number) => any;
    offset?: (x: number, y: number) => any;
  }) {
    cont.appendChild(element.node());
    elements.push(element);
    return rtn;
  }

  function setLabels(interval: number) {
    // labels.innerHTML = "";
    // const verticalCount = Math.ceil(width / 2 / interval);
    // const horizontalCount = Math.ceil(height / 2 / interval);

    // for (let i = -verticalCount; i <= verticalCount; i++) {
    //   if (i === 0) continue;
    //   const x = i * interval;
    //   const text = document.createElementNS(
    //     "http://www.w3.org/2000/svg",
    //     "text",
    //   );
    //   text.setAttribute("x", x.toString());
    //   text.setAttribute("y", "20");
    //   text.setAttribute("text-anchor", "middle");
    //   text.style.fontFamily = "Comic Sans MS";
    //   text.textContent = format(i * step);
    //   labels.appendChild(text);
    // }

    // for (let i = -horizontalCount; i <= horizontalCount; i++) {
    //   if (i === 0) continue;
    //   const y = i * interval;
    //   const text = document.createElementNS(
    //     "http://www.w3.org/2000/svg",
    //     "text",
    //   );
    //   text.setAttribute("x", "20");
    //   text.setAttribute("y", y.toString());
    //   text.setAttribute("dominant-baseline", "middle");
    //   text.style.fontFamily = "Comic Sans MS";
    //   text.textContent = format(-i * step);
    //   labels.appendChild(text);
    // }

    return rtn;
  }

  function stroke(color: string) {
    // xAxis.setAttribute("stroke", color);
    // yAxis.setAttribute("stroke", color);
    return rtn;
  }

  function axisStyle(options: {
    color?: string;
    width?: number;
    opacity?: number;
    dashArray?: string;
  }) {
    return rtn;
  }

  let gColor: string;
  function gridColor(color: string = "#ddd") {
    // TODO 待修复，或者不让定义颜色，这个不重要
    gColor = color;
    grid.childNodes.forEach((node) => {
      const line = node as SVGLineElement;
      line.setAttribute("stroke", color);
    });

    return rtn;
  }

  function gridStyle(options: {
    color?: string;
    width?: number;
    opacity?: number;
    dashArray?: string;
  }) {
    // grid.childNodes.forEach((node) => {
    //   const line = node as SVGLineElement;
    //   line.setAttribute("stroke", options.color || "#ddd");
    //   line.setAttribute("stroke-width", options.width?.toString() || "1");
    //   line.setAttribute("stroke-opacity", options.opacity?.toString() || "1");
    //   line.setAttribute("stroke-dasharray", options.dashArray || "");
    // });

    return rtn;
  }

  function hideAxis() {
    // axis.style.display = "none";
    return rtn;
  }

  function hideGrid() {
    // grid.style.display = "none";
    return rtn;
  }

  function hideLabels() {
    // labels.style.display = "none";
    return rtn;
  }

  function zoom(scale: number) {
    cont.setAttribute("transform", `scale(${scale})`);
    return rtn;
  }

  function pan(x: number, y: number) {
    const currentTransform = cont.getAttribute("transform") || "";
    cont.setAttribute("transform", `${currentTransform} translate(${x}, ${y})`);
    return rtn;
  }

  function exportSVG() {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(group);
    return "data:image/svg+xml;base64," + btoa(source);
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
      //
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

  function theme(name: "light" | "dark") {
    setTheme(name);
    const theme = getTheme();

    group.style.background = theme.colors.background;

    gridStyle({
      color: theme.colors.grid,
      width: theme.sizes.grid,
      opacity: theme.opacity.grid,
    });

    axisStyle({
      color: theme.colors.axis,
      width: theme.sizes.axis,
    });

    // labels.childNodes.forEach((node) => {
    //   const text = node as SVGTextElement;
    //   text.setAttribute("fill", theme.colors.text);
    // });

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

    setAxes(AxesColor);
    setGrid(gridSpacing);
    gridColor(gColor);
    setTicks(tickSpacing);
    elements.forEach((element) => {
      cont.appendChild(element.node());
    });
  });

  group.addEventListener("mouseup", () => (isDragging = false));
  group.addEventListener("mouseleave", () => (isDragging = false));

  return rtn;
}

//   function origin(x: number, y: number) {
//     group.setAttribute("transform", `translate(${x},${y})`);
//     return rtn;
//   }

//   function add(element: {
//     node: () => SVGElement;
//     scale?: (x: number, y?: number) => any;
//     offset?: (x: number, y: number) => any;
//   }) {
//     content.appendChild(element.node());
//     return rtn;
//   }

//   function setUnit(value: number) {
//     unit = value;
//     if (grid.children.length > 0) {
//       setGrid(unit);
//     }
//     Array.from(content.children).forEach((child) => {
//       const element = child as SVGElement;
//       if (element.getAttribute("data-original-transform")) {
//         const transform = element.getAttribute("data-original-transform");
//         element.setAttribute("transform", `scale(${unit}) ${transform}`);
//       } else {
//         const transform = element.getAttribute("transform") || "";
//         element.setAttribute("data-original-transform", transform);
//         element.setAttribute("transform", `scale(${unit}) ${transform}`);
//       }
//     });
//     return rtn;
//   }

//   function setGrid(interval: number) {
//     grid.innerHTML = "";

//     const verticalCount = Math.ceil(width / 2 / interval);
//     const horizontalCount = Math.ceil(height / 2 / interval);

//     for (let i = -verticalCount; i <= verticalCount; i++) {
//       if (i === 0) continue;
//       const x = i * interval;
//       const line = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line",
//       );
//       line.setAttribute("x1", x.toString());
//       line.setAttribute("y1", (-height / 2).toString());
//       line.setAttribute("x2", x.toString());
//       line.setAttribute("y2", (height / 2).toString());
//       line.setAttribute("stroke", "#ddd");
//       line.setAttribute("stroke-width", "1");
//       grid.appendChild(line);
//     }

//     for (let i = -horizontalCount; i <= horizontalCount; i++) {
//       if (i === 0) continue;
//       const y = i * interval;
//       const line = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line",
//       );
//       line.setAttribute("x1", (-width / 2).toString());
//       line.setAttribute("y1", y.toString());
//       line.setAttribute("x2", (width / 2).toString());
//       line.setAttribute("y2", y.toString());
//       line.setAttribute("stroke", "#ddd");
//       line.setAttribute("stroke-width", "1");
//       grid.appendChild(line);
//     }

//     return rtn;
//   }

//   function setTicks(interval: number, length: number = 6) {
//     while (axes.children.length > 4) {
//       const lastChild = axes.lastChild;
//       if (lastChild) {
//         axes.removeChild(lastChild);
//       }
//     }

//     const verticalCount = Math.ceil(width / 2 / interval);
//     const horizontalCount = Math.ceil(height / 2 / interval);

//     for (let i = -verticalCount; i <= verticalCount; i++) {
//       if (i === 0) continue;
//       const x = i * interval;
//       const tick = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line",
//       );
//       tick.setAttribute("x1", x.toString());
//       tick.setAttribute("y1", (-length / 2).toString());
//       tick.setAttribute("x2", x.toString());
//       tick.setAttribute("y2", (length / 2).toString());
//       tick.setAttribute("stroke", "black");
//       tick.setAttribute("stroke-width", "2");
//       axes.appendChild(tick);
//     }

//     for (let i = -horizontalCount; i <= horizontalCount; i++) {
//       if (i === 0) continue;
//       const y = i * interval;
//       const tick = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "line",
//       );
//       tick.setAttribute("x1", (-length / 2).toString());
//       tick.setAttribute("y1", y.toString());
//       tick.setAttribute("x2", (length / 2).toString());
//       tick.setAttribute("y2", y.toString());
//       tick.setAttribute("stroke", "black");
//       tick.setAttribute("stroke-width", "2");
//       axes.appendChild(tick);
//     }

//     return rtn;
//   }

//   function setLabels(
//     interval: number,
//     step: number = 1,
//     format: (n: number) => string = String,
//   ) {
//     labels.innerHTML = "";
//     const verticalCount = Math.ceil(width / 2 / interval);
//     const horizontalCount = Math.ceil(height / 2 / interval);

//     for (let i = -verticalCount; i <= verticalCount; i++) {
//       if (i === 0) continue;
//       const x = i * interval;
//       const text = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "text",
//       );
//       text.setAttribute("x", x.toString());
//       text.setAttribute("y", "20");
//       text.setAttribute("text-anchor", "middle");
//       text.style.fontFamily = "Comic Sans MS";
//       text.textContent = format(i * step);
//       labels.appendChild(text);
//     }

//     for (let i = -horizontalCount; i <= horizontalCount; i++) {
//       if (i === 0) continue;
//       const y = i * interval;
//       const text = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "text",
//       );
//       text.setAttribute("x", "20");
//       text.setAttribute("y", y.toString());
//       text.setAttribute("dominant-baseline", "middle");
//       text.style.fontFamily = "Comic Sans MS";
//       text.textContent = format(-i * step);
//       labels.appendChild(text);
//     }

//     return rtn;
//   }

//   function stroke(color: string) {
//     xAxis.setAttribute("stroke", color);
//     yAxis.setAttribute("stroke", color);
//     return rtn;
//   }

//   function axisStyle(options: {
//     color?: string;
//     width?: number;
//     opacity?: number;
//     dashArray?: string;
//   }) {
//     xAxis.setAttribute("stroke", options.color || "black");
//     xAxis.setAttribute("stroke-width", options.width?.toString() || "2");
//     xAxis.setAttribute("stroke-opacity", options.opacity?.toString() || "1");
//     xAxis.setAttribute("stroke-dasharray", options.dashArray || "");
//     return rtn;
//   }

//   function gridStyle(options: {
//     color?: string;
//     width?: number;
//     opacity?: number;
//     dashArray?: string;
//   }) {
//     grid.childNodes.forEach((node) => {
//       const line = node as SVGLineElement;
//       line.setAttribute("stroke", options.color || "#ddd");
//       line.setAttribute("stroke-width", options.width?.toString() || "1");
//       line.setAttribute("stroke-opacity", options.opacity?.toString() || "1");
//       line.setAttribute("stroke-dasharray", options.dashArray || "");
//     });
//     return rtn;
//   }

//   function hideAxis() {
//     axes.style.display = "none";
//     return rtn;
//   }

//   function hideGrid() {
//     grid.style.display = "none";
//     return rtn;
//   }

//   function hideLabels() {
//     labels.style.display = "none";
//     return rtn;
//   }

//   function zoom(scale: number) {
//     content.setAttribute("transform", `scale(${scale})`);
//     return rtn;
//   }

//   function pan(x: number, y: number) {
//     const currentTransform = content.getAttribute("transform") || "";
//     content.setAttribute(
//       "transform",
//       `${currentTransform} translate(${x}, ${y})`,
//     );
//     return rtn;
//   }

//   function snap(enable: boolean) {
//     if (enable) {
//       content.setAttribute("data-snap", "true");
//       content.addEventListener("mousemove", (e) => {
//         const rect = content.getBoundingClientRect();
//         const x = Math.round((e.clientX - rect.left) / unit) * unit;
//         const y = Math.round((e.clientY - rect.top) / unit) * unit;
//         content.setAttribute("transform", `translate(${x}, ${y})`);
//       });
//     } else {
//       content.removeAttribute("data-snap");
//     }
//     return rtn;
//   }

//   function exportSVG() {
//     const serializer = new XMLSerializer();
//     const source = serializer.serializeToString(group);
//     return "data:image/svg+xml;base64," + btoa(source);
//   }

//   function addMarker(
//     x: number,
//     y: number,
//     options: {
//       type?: "circle" | "cross" | "square";
//       size?: number;
//       color?: string;
//     } = {},
//   ) {
//     const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
//     const { type = "circle", size = 5, color = "black" } = options;

//     switch (type) {
//       case "circle":
//         const circle = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "circle",
//         );
//         circle.setAttribute("cx", x.toString());
//         circle.setAttribute("cy", y.toString());
//         circle.setAttribute("r", size.toString());
//         circle.setAttribute("fill", color);
//         marker.appendChild(circle);
//         break;
//       //
//     }

//     content.appendChild(marker);
//     return rtn;
//   }

//   function addText(
//     x: number,
//     y: number,
//     text: string,
//     options: {
//       size?: number;
//       color?: string;
//       anchor?: "start" | "middle" | "end";
//     } = {},
//   ) {
//     const { size = 12, color = "black", anchor = "middle" } = options;
//     const textElement = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "text",
//     );
//     textElement.setAttribute("x", x.toString());
//     textElement.setAttribute("y", y.toString());
//     textElement.setAttribute("font-size", size.toString());
//     textElement.setAttribute("fill", color);
//     textElement.setAttribute("text-anchor", anchor);
//     textElement.style.fontFamily = "Comic Sans MS";
//     textElement.textContent = text;
//     content.appendChild(textElement);
//     return rtn;
//   }

//   function theme(name: "light" | "dark") {
//     setTheme(name);
//     const theme = getTheme();

//     group.style.background = theme.colors.background;

//     gridStyle({
//       color: theme.colors.grid,
//       width: theme.sizes.grid,
//       opacity: theme.opacity.grid,
//     });

//     axisStyle({
//       color: theme.colors.axis,
//       width: theme.sizes.axis,
//     });

//     labels.childNodes.forEach((node) => {
//       const text = node as SVGTextElement;
//       text.setAttribute("fill", theme.colors.text);
//     });

//     return rtn;
//   }

//   let isDragging = false;
//   let dragEnabled = false;

//   function enableDragging() {
//     if (dragEnabled) return rtn;

//     dragEnabled = true;

//     const destroy = draggable(
//       background as SVGElement,
//       (x, y) => true,
//       (x, y) => {
//         const originX = x + width / 2;
//         const originY = y + height / 2;
//         origin(originX, originY);
//       },
//     );

//     const updateCursor = (cursor: string) => {
//       if (background.style) {
//         background.style.cursor = cursor;
//       }
//     };

//     background.addEventListener("mousedown", () => {
//       isDragging = true;
//       updateCursor("grabbing");
//     });

//     window.addEventListener("mouseup", () => {
//       if (isDragging) {
//         isDragging = false;
//         updateCursor("grab");
//       }
//     });

//     background.addEventListener("mouseover", () => {
//       if (!isDragging) {
//         updateCursor("grab");
//       }
//     });

//     background.addEventListener("mouseout", () => {
//       if (!isDragging) {
//         updateCursor("default");
//       }
//     });

//     updateCursor("grab");

//     return rtn;
//   }

//   return rtn;
// }
