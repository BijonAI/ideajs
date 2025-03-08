import { Base, BaseOptions } from "@/base"
import { Appendable } from "@/types/common"
import { lightenHex } from "@/utils/hex"

export type NumbericTrend = (count: number) => number
export type StringTrend = (count: number) => string

export interface PlaneOptions extends BaseOptions {
  tick?: number | NumbericTrend
  tickLabel?: StringTrend
  grid?: number | NumbericTrend
  xLabel?: string
  yLabel?: string
  viewBox?: {
    x: number
    y: number
    w: number
    h: number
  }
}

export class Plane extends Base implements Appendable {
  private tick: number | NumbericTrend = 50
  private tickLabel: StringTrend = (count) => count.toString()
  private grid: number | NumbericTrend = 50
  private xLabel: string = 'x'
  private yLabel: string = 'y'
  private viewBox: {
    x: number
    y: number
    w: number
    h: number
  } = { x: 0, y: 0, w: 0, h: 0 }

  private groupElement: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
  private frameElement: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
  private bgElement: SVGRectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  private layerElement: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  private axesElement: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  private gridElement: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  private geomElement: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
  private contElement: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  private xAxisElement: SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
  private yAxisElement: SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");

  private xTicks: SVGLineElement[] = []
  private yTicks: SVGLineElement[] = []
  private xLabels: SVGTextElement[] = []
  private yLabels: SVGTextElement[] = []

  constructor(options: PlaneOptions) {
    super(options)
    options.tick && (this.tick = options.tick)
    options.tickLabel && (this.tickLabel = options.tickLabel)
    options.grid && (this.grid = options.grid)
    options.xLabel && (this.xLabel = options.xLabel)
    options.yLabel && (this.yLabel = options.yLabel)
    options.viewBox && (this.viewBox = options.viewBox)

    this.groupElement.setAttribute("width", "100vw");
    this.groupElement.setAttribute("height", "100vh");
    this.groupElement.setAttribute("fill", "transparent");
    this.groupElement.setAttribute("overflow", "hidden");

    this.frameElement.setAttribute("width", "100%");
    this.frameElement.setAttribute("height", "100%");
    this.frameElement.style.cursor = "grab";

    this.geomElement.setAttribute("width", "100%");
    this.geomElement.setAttribute("height", "100%");

    this.bgElement.setAttribute("width", "100%");
    this.bgElement.setAttribute("height", "100%");
    this.bgElement.setAttribute("fill", "transparent");

    this.layerElement.append(this.gridElement, this.axesElement);
    this.frameElement.append(this.bgElement, this.layerElement);
    this.geomElement.append(this.contElement);

    this.groupElement.append(this.frameElement);
    this.groupElement.append(this.geomElement);

    this.gridElement.setAttribute(
      "viewBox",
      `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`,
    );
  
    this.axesElement.setAttribute(
      "viewBox",
      `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`,
    );

    this.contElement.setAttribute(
      "viewBox",
      `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`,
    );

    this.initAxes()
    this.initTicks()
    this.initLabels()
  }

  initAxes() {
    this.xAxisElement.setAttribute("x1", `${this.viewBox.x}`);
    this.xAxisElement.setAttribute("x2", `${this.viewBox.x + this.viewBox.w}`);
    this.xAxisElement.setAttribute("y1", "0");
    this.xAxisElement.setAttribute("y2", "0");
    this.xAxisElement.setAttribute("stroke", 'black');
    this.xAxisElement.setAttribute("stroke-width", "2");

    this.yAxisElement.setAttribute("y1", `${this.viewBox.y}`);
    this.yAxisElement.setAttribute("y2", `${this.viewBox.y + this.viewBox.h}`);
    this.yAxisElement.setAttribute("x1", "0");
    this.yAxisElement.setAttribute("x2", "0");
    this.yAxisElement.setAttribute("stroke", 'black');
    this.yAxisElement.setAttribute("stroke-width", "2");

    this.axesElement.append(this.xAxisElement, this.yAxisElement);
  }

  initTicks() {
    // X轴刻度
    const resolveTick = (input: number | NumbericTrend) => {
      if (typeof input === 'number') return input
      if (typeof input === 'function') return input(0)
      return 0
    }
    for (
      let x = Math.floor(this.viewBox.x / resolveTick(this.tick) + 1) * resolveTick(this.tick);
      x < this.viewBox.x + this.viewBox.w;
      x += resolveTick(this.tick)
    ) {
      if (x === 0) continue;
      const tick = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      this.xTicks.push(tick)
      tick.setAttribute("x1", `${x}`);
      tick.setAttribute("x2", `${x}`);
      tick.setAttribute("y1", "-5");
      tick.setAttribute("y2", "5");
      tick.setAttribute("stroke", `black`);
      tick.setAttribute("stroke-width", "2");

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", `${x}`);
      text.setAttribute("y", "25");
      text.setAttribute("fill", `black`);
      text.style.font = "14px sans-serif";
      text.style.fontFamily = "Comic Sans MS";
      text.textContent = `${Math.round(x / resolveTick(this.tick))}`;

      this.xTicks.push(tick)
      this.xLabels.push(text)
    }

    // Y轴刻度
    for (
      let y = Math.floor(this.viewBox.y / resolveTick(this.tick) + 1) * resolveTick(this.tick);
      y < this.viewBox.y + this.viewBox.h;
      y += resolveTick(this.tick)
    ) {
      if (y === 0) continue;
      const tick = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      this.yTicks.push(tick)
      tick.setAttribute("y1", `${y}`);
      tick.setAttribute("y2", `${y}`);
      tick.setAttribute("x1", "-5");
      tick.setAttribute("x2", "5");
      tick.setAttribute("stroke", `black`);
      tick.setAttribute("stroke-width", "2");

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", "20");
      text.setAttribute("y", `${y + 3}`);
      text.setAttribute("fill", `black`);
      text.style.font = "14px sans-serif";
      text.style.fontFamily = "Comic Sans MS";
      text.textContent = `${Math.round(-y / resolveTick(this.tick))}`;

      this.yTicks.push(tick)
      this.yLabels.push(text)
    }
  }

  initLabels() {
  }
}
