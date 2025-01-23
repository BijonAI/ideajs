/**
 * @file axis.ts
 * @description 定义坐标轴相关功能，提供可自定义的坐标轴绘制和操作方法
 */

/**
 * 创建一个坐标轴
 * @param x1 起点x坐标
 * @param y1 起点y坐标
 * @param x2 终点x坐标
 * @param y2 终点y坐标
 * @returns 包含坐标轴操作方法的对象
 */
export function axis(x1: number, y1: number, x2: number, y2: number) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const mainLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  const ticks = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const labels = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // 设置主轴线属性
  mainLine.setAttribute("x1", x1.toString());
  mainLine.setAttribute("y1", y1.toString());
  mainLine.setAttribute("x2", x2.toString());
  mainLine.setAttribute("y2", y2.toString());
  mainLine.setAttribute("stroke-width", "2");
  mainLine.setAttribute("stroke", "black");

  // 设置箭头属性
  arrow.setAttribute("points", "-5,-4 0,0 5,-4 0,8");
  arrow.setAttribute("fill", "black");
  arrow.setAttribute("stroke", "none");
  adjustArrow(x1, y1, x2, y2);

  // 组装SVG元素
  group.appendChild(mainLine);
  group.appendChild(arrow);
  group.appendChild(ticks);
  group.appendChild(labels);

  const rtn = {
    node: () => group,
    from,
    to,
    stroke,
    ticks: setTicks,
    labels: setLabels,
  }

  /**
   * 调整箭头位置和角度
   * @param x1 起点x坐标
   * @param y1 起点y坐标
   * @param x2 终点x坐标
   * @param y2 终点y坐标
   */
  function adjustArrow(x1: number, y1: number, x2: number, y2: number) {
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI - 90;
    arrow.setAttribute("transform", `translate(${x2}, ${y2}) rotate(${angle})`);
  }

  /**
   * 设置坐标轴起点
   * @param x 起点x坐标
   * @param y 起点y坐标
   * @returns 坐标轴对象
   */
  function from(x: number, y: number) {
    mainLine.setAttribute("x1", x.toString());
    mainLine.setAttribute("y1", y.toString());
    adjustArrow(x, y, Number(mainLine.getAttribute("x2")), Number(mainLine.getAttribute("y2")));
    updateTicks();
    return rtn;
  }

  /**
   * 设置坐标轴终点
   * @param x 终点x坐标
   * @param y 终点y坐标
   * @returns 坐标轴对象
   */
  function to(x: number, y: number) {
    mainLine.setAttribute("x2", x.toString());
    mainLine.setAttribute("y2", y.toString());
    adjustArrow(Number(mainLine.getAttribute("x1")), Number(mainLine.getAttribute("y1")), x, y);
    updateTicks();
    return rtn;
  }

  /**
   * 设置坐标轴颜色
   * @param color 颜色值
   * @returns 坐标轴对象
   */
  function stroke(color: string) {
    mainLine.setAttribute("stroke", color);
    arrow.setAttribute("fill", color);
    return rtn;
  }

  /**
   * 设置刻度线
   * @param interval 刻度间隔
   * @param length 刻度线长度
   * @returns 坐标轴对象
   */
  function setTicks(interval: number, length: number = 10) {
    ticks.innerHTML = "";
    const x1 = Number(mainLine.getAttribute("x1"));
    const y1 = Number(mainLine.getAttribute("y1"));
    const x2 = Number(mainLine.getAttribute("x2"));
    const y2 = Number(mainLine.getAttribute("y2"));

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const tickCount = Math.floor(lineLength / interval);

    // 创建刻度线
    for (let i = 0; i <= tickCount; i++) {
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const x = x1 + Math.cos(angle) * interval * i;
      const y = y1 + Math.sin(angle) * interval * i;

      tick.setAttribute("x1", (x - Math.sin(angle) * length / 2).toString());
      tick.setAttribute("y1", (y + Math.cos(angle) * length / 2).toString());
      tick.setAttribute("x2", (x + Math.sin(angle) * length / 2).toString());
      tick.setAttribute("y2", (y - Math.cos(angle) * length / 2).toString());
      tick.setAttribute("stroke", mainLine.getAttribute("stroke"));
      tick.setAttribute("stroke-width", "1");

      ticks.appendChild(tick);
    }
    return rtn;
  }

  /**
   * 设置刻度标签
   * @param start 起始值
   * @param step 步进值
   * @param format 格式化函数
   * @returns 坐标轴对象
   */
  function setLabels(start: number, step: number = 1, format: (n: number) => string = String) {
    labels.innerHTML = "";
    const x1 = Number(mainLine.getAttribute("x1"));
    const y1 = Number(mainLine.getAttribute("y1"));
    const x2 = Number(mainLine.getAttribute("x2"));
    const y2 = Number(mainLine.getAttribute("y2"));

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const tickCount = ticks.children.length;
    const interval = tickCount > 0 ? lineLength / tickCount : lineLength;

    // 创建刻度标签
    for (let i = 0; i <= tickCount; i++) {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const x = x1 + Math.cos(angle) * interval * i;
      const y = y1 + Math.sin(angle) * interval * i;

      text.setAttribute("x", x.toString());
      text.setAttribute("y", (y + 20).toString());
      text.setAttribute("text-anchor", "middle");
      text.textContent = format(start + step * i);

      labels.appendChild(text);
    }
    return rtn;
  }

  /**
   * 更新刻度线位置
   */
  function updateTicks() {
    const tickLength = ticks.children.length > 0 ?
      Math.abs(Number(ticks.children[0].getAttribute("y2")) - Number(ticks.children[0].getAttribute("y1"))) :
      10;
    const interval = ticks.children.length > 0 ?
      Math.sqrt((Number(ticks.children[1].getAttribute("x1")) - Number(ticks.children[0].getAttribute("x1"))) ** 2 +
        (Number(ticks.children[1].getAttribute("y1")) - Number(ticks.children[0].getAttribute("y1"))) ** 2) :
      0;

    if (interval > 0) {
      setTicks(interval, tickLength);
    }
  }

  return rtn;
}