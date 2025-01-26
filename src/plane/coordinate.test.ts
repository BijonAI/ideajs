import { getTheme, setTheme } from "../theme";
// import { draggable } from "../utils/draggable";

export function coordinate() {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // const labels = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const content = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.setAttribute("width", "100vw");
  group.setAttribute("height", "100vh");
  group.setAttribute("fill", "transparent");
  group.setAttribute("overflow", "hidden");

  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", "transparent");
  bg.style.pointerEvents = "all";
  bg.style.cursor = "grab";

  grid.setAttribute("width", "100%");
  grid.setAttribute("height", "100%");

  group.appendChild(bg);
  group.appendChild(grid);
  group.appendChild(content);
  // group.appendChild(grid);
  // group.appendChild(axes);
  // group.appendChild(labels);
  // group.appendChild(content);

  const rtn = {
    node: () => group,
    axis: setAxis,
    grid: setGrid,
    ticks: setTicks,
    labels: setLabels,
    stroke,
    add,
    axisStyle,
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

  let viewBox = {
    x: -document.getElementById("canvas")!.getBoundingClientRect().width / 2,
    y: -document.getElementById("canvas")!.getBoundingClientRect().height / 2,
    w: document.getElementById("canvas")!.getBoundingClientRect().width,
    h: document.getElementById("canvas")!.getBoundingClientRect().height,
  };

  grid.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`,
  );

  function setAxis() {
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
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "2");

    yAxis.setAttribute("y1", `${viewBox.y}`);
    yAxis.setAttribute("y2", `${viewBox.y + viewBox.h}`);
    yAxis.setAttribute("x1", "0");
    yAxis.setAttribute("x2", "0");
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "2");

    grid.append(xAxis, yAxis);

    return rtn;
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

  let tickSpacing: number;
  function setTicks(space: number = 50) {
    tickSpacing = space;

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
      tick.setAttribute("stroke", "#666"); // 刻度色
      tick.setAttribute("stroke-width", "2"); // 刻度宽

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", `${x}`);
      text.setAttribute("y", "25");
      text.setAttribute("fill", "#666");
      text.style.font = "14px sans-serif";
      text.style.fontFamily = "Comic Sans MS";
      text.textContent = `${Math.round(x / space)}`;

      grid.append(tick, text);
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
      tick.setAttribute("stroke", "#666"); // 刻度色
      tick.setAttribute("stroke-width", "2"); // 刻度宽

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", "20");
      text.setAttribute("y", `${y + 3}`);
      text.setAttribute("fill", "#666");
      text.style.font = "14px sans-serif";
      text.style.fontFamily = "Comic Sans MS";
      text.textContent = `${Math.round(-y / space)}`;

      grid.append(tick, text);
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
    grid.appendChild(element.node());
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
    content.setAttribute("transform", `scale(${scale})`);
    return rtn;
  }

  function pan(x: number, y: number) {
    const currentTransform = content.getAttribute("transform") || "";
    content.setAttribute(
      "transform",
      `${currentTransform} translate(${x}, ${y})`,
    );
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

    content.appendChild(marker);
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
    content.appendChild(textElement);
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

  bg.addEventListener("mousedown", (e) => {
    isDragging = true;
    startPos = { x: e.clientX, y: e.clientY };
  });

  bg.addEventListener("mousemove", (e) => {
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

    // 清空并重新绘制
    grid.innerHTML = "";

    setAxis();
    setGrid(gridSpacing);
    setTicks(tickSpacing);
    elements.forEach((element) => {
      grid.appendChild(element.node());
    });
  });

  group.addEventListener("mouseup", () => (isDragging = false));
  group.addEventListener("mouseleave", () => (isDragging = false));

  // let isDragging = false;
  // let dragEnabled = false;

  // function enableDragging() {
  //   if (dragEnabled) return rtn;

  //   dragEnabled = true;

  //   const destroy = draggable(
  //     background as SVGElement,
  //     (x, y) => true,
  //     (x, y) => {
  //       const originX = x + width / 2;
  //       const originY = y + height / 2;
  //       origin(originX, originY);
  //     },
  //   );

  //   const updateCursor = (cursor: string) => {
  //     if (background.style) {
  //       background.style.cursor = cursor;
  //     }
  //   };

  //   background.addEventListener("mousedown", () => {
  //     isDragging = true;
  //     updateCursor("grabbing");
  //   });

  //   window.addEventListener("mouseup", () => {
  //     if (isDragging) {
  //       isDragging = false;
  //       updateCursor("grab");
  //     }
  //   });

  //   background.addEventListener("mouseover", () => {
  //     if (!isDragging) {
  //       updateCursor("grab");
  //     }
  //   });

  //   background.addEventListener("mouseout", () => {
  //     if (!isDragging) {
  //       updateCursor("default");
  //     }
  //   });

  //   updateCursor("grab");

  //   return rtn;
  // }

  return rtn;
}
