export interface CommonStyle {
  cursor?: string;
  filter?: string;
  visibility?: 'visible' | 'hidden';
  pointerEvents?: 'none' | 'all';
  opacity?: number;
}

export interface Transform {
  translate?: [number, number];
  scale?: number | [number, number];
  rotate?: number;
  skew?: [number, number];
  origin?: [number, number];
}

export interface Animation {
  duration?: number;
  delay?: number;
  easing?: string;
  properties?: {
    [key: string]: {
      from: any;
      to: any;
    };
  };
  onStart?: () => void;
  onEnd?: () => void;
}

export interface TooltipOptions {
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: [number, number];
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
}

export interface EffectOptions {
  color?: string;
  strength?: number;
  spread?: number;
}

export interface TeachingOptions {
  stepDelay?: number;  // 教学步骤间延迟
  highlightColor?: string; // 高亮颜色
  annotations?: boolean;   // 是否显示标注
  voiceGuide?: boolean;   // 语音引导
}

export interface AnimationStep {
  duration: number;
  action: () => void;
  description?: string;
}

export interface CommonMethods<T> {
  transform(options: Transform): T;
  animation(options: Animation): T;
  event(type: string, handler: (e: Event) => void): { remove: () => void, rtn: T };
  attr(name: string, value: string): T;
  data(key: string, value: any): T;
  class_(names: string | string[]): { remove: () => void, rtn: T };
  tooltip(content: string | HTMLElement, options?: TooltipOptions): T;
  effect(type: 'glow' | 'shadow' | 'blur', options?: EffectOptions): T;
  highlight(duration?: number): T;
  annotate(text: string, position?: 'top' | 'bottom' | 'left' | 'right'): T;
  pulse(count?: number): T;
  trace(color?: string): T;
  teachingMode(options?: TeachingOptions): T;
  step(steps: AnimationStep[]): T;
  lock(): T;
  unlock(): T;
  restrict(bounds: {x: [number, number], y: [number, number]}): T;
  snap(gridSize: number): T;
  connect(target: T, options?: {
    elastic?: boolean,
    distance?: number,
    strength?: number
  }): T;
  node(): SVGElement;
  show(): T;
  hide(): T;
  opacity(value: number): T;
  remove(): void;
  morph(target: T, duration?: number): T;
} 