import { Renderable } from '../field';
import { CommonMethods, CommonStyle } from './common';

export interface DotStyle extends CommonStyle {
  radius?: number;
  strokeWidth?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeDasharray?: string;
  fillColor?: string;
  fillOpacity?: number;
}

export interface LineStyle extends CommonStyle {
  strokeWidth?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeDasharray?: string;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}

export interface MarkerOptions {
  start?: 'arrow' | 'dot' | 'square' | SVGElement;
  end?: 'arrow' | 'dot' | 'square' | SVGElement;
  size?: number;
  color?: string;
}

export interface GradientStop {
  offset: number;
  color: string;
  opacity?: number;
}

export interface Dot extends CommonMethods<Dot> {
  node(): SVGElement;
  resize(radius: number): Dot;
  stroke(color?: string): Dot;
  fill(color?: string): Dot;
  border(width: number): Dot;
  style(options: DotStyle): Dot;
  focus(color: string): Dot;
  select(color: string): Dot;
  onFocus(callback: () => void): Dot;
  onSelect(callback: () => void): Dot;
  draggable(condition?: (x: number, y: number) => boolean): Dot;
  onDrag(callback: (x: number, y: number) => void): Dot;
  connect(target: Renderable, options?: {
    elastic?: boolean,
    distance?: number,
    strength?: number
  }): Dot;
}

export interface Line extends CommonMethods<Line> {
  node(): SVGElement;
  from(x1: number, y1: number): Line;
  to(x2: number, y2: number): Line;
  stroke(color?: string): Line;
  style(options: LineStyle): Line;
  length(): number;
  angle(): number;
  midpoint(): { x: number, y: number };
  parallel(distance: number): Line;
  perpendicular(point: { x: number, y: number }): Line;
  extend(start?: number, end?: number): Line;
  trim(start?: number, end?: number): Line;
  dash(pattern: number[]): Line;
  marker(options?: MarkerOptions): Line;
  gradient(stops: GradientStop[]): Line;
  measure(options?: {
    showLength?: boolean;
    showAngle?: boolean;
    unit?: string;
  }): Line;
  animateDrawing(duration?: number): Line;
  constrain(options: {
    minLength?: number;
    maxLength?: number;
    angle?: number;
    parallel?: Line;
  }): Line;
  draggable(condition?: (x: number, y: number) => boolean): Line;
  connect(target: Renderable, options?: {
    elastic?: boolean,
    distance?: number,
    strength?: number
  }): Line;
}

export interface Polygon extends CommonMethods<Polygon> {
  node(): SVGElement;
  points: { x: number, y: number }[];
  setPoints(points: { x: number, y: number }[]): Polygon;
  setPoint(index: number, point: { x: number, y: number }): Polygon;
  insertBefore(index: number, point: { x: number, y: number }): Polygon;
  insertAfter(index: number, point: { x: number, y: number }): Polygon;
  remove(index: number): Polygon;
  stroke(color?: string): Polygon;
  fill(color?: string): Polygon;
  style(options: PolygonStyle): Polygon;
}

export interface Arc extends CommonMethods<Arc> {
  animateDrawing(arg0: number): import("..").Renderable;
  node(): SVGElement;
  from(angle: number): Arc;
  to(angle: number): Arc;
  stroke(color?: string): Arc;
  fill(color?: string): Arc;
}

export interface Vector extends CommonMethods<Vector> {
  node(): SVGElement;
  from(x1: number, y1: number): Vector;
  to(x2: number, y2: number): Vector;
  stroke(color?: string): Vector;
}

export interface Function extends CommonMethods<Function> {
  node(): SVGElement;
  stroke(color?: string): Function;
  style(options: FunctionStyle): Function;
  derivative(): Function;
  integral(from?: number): Function;
}

export interface FunctionStyle extends CommonStyle {
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: string;
  lineCap?: string;
}

export interface PolygonStyle extends CommonStyle {
  strokeWidth?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeDasharray?: string;
  fillColor?: string;
  fillOpacity?: number;
  lineJoin?: 'miter' | 'round' | 'bevel';
} 