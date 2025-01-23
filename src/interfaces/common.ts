/**
 * @file common.ts
 * @description 定义通用接口和类型，包含样式、变换、动画等基础功能
 */

/**
 * 通用样式接口，定义基础的视觉属性
 */
export interface CommonStyle {
  cursor?: string;           // 鼠标指针样式
  filter?: string;           // SVG滤镜效果
  visibility?: 'visible' | 'hidden';  // 元素可见性
  pointerEvents?: 'none' | 'all';     // 鼠标事件响应
  opacity?: number;          // 透明度
}

/**
 * 变换接口，定义2D变换属性
 */
export interface Transform {
  translate?: [number, number];   // 平移变换 [x, y]
  scale?: number | [number, number];  // 缩放变换，单值或[x, y]
  rotate?: number;                // 旋转角度（度）
  skew?: [number, number];        // 倾斜变换 [x, y]
  origin?: [number, number];      // 变换原点 [x, y]
}

/**
 * 动画接口，定义动画相关属性和回调
 */
export interface Animation {
  duration?: number;         // 动画持续时间（毫秒）
  delay?: number;           // 动画延迟时间（毫秒）
  easing?: string;          // 缓动函数
  properties?: {            // 动画属性配置
    [key: string]: {
      from: any;           // 起始值
      to: any;             // 结束值
    };
  };
  onStart?: () => void;    // 动画开始回调
  onEnd?: () => void;      // 动画结束回调
}

/**
 * 工具提示选项接口
 */
export interface TooltipOptions {
  position?: 'top' | 'bottom' | 'left' | 'right';  // 提示框位置
  offset?: [number, number];                       // 偏移量 [x, y]
  className?: string;                              // 自定义CSS类名
  style?: Partial<CSSStyleDeclaration>;           // 自定义样式
}

/**
 * 特效选项接口
 */
export interface EffectOptions {
  color?: string;          // 特效颜色
  strength?: number;       // 特效强度
  spread?: number;         // 特效扩散范围
}

/**
 * 教学模式选项接口
 */
export interface TeachingOptions {
  stepDelay?: number;      // 教学步骤间延迟
  highlightColor?: string; // 高亮颜色
  annotations?: boolean;   // 是否显示标注
  voiceGuide?: boolean;   // 语音引导
}

/**
 * 动画步骤接口
 */
export interface AnimationStep {
  duration: number;        // 步骤持续时间
  action: () => void;      // 步骤执行的动作
  description?: string;    // 步骤描述
}

/**
 * 通用方法接口，定义所有图形对象共有的方法
 * @template T 具体图形类型
 */
export interface CommonMethods<T> {
  transform(options: Transform): T;                // 应用变换
  animation(options: Animation): T;                // 应用动画
  event(type: string, handler: (e: Event) => void): { remove: () => void, rtn: T };  // 事件绑定
  attr(name: string, value: string): T;           // 设置属性
  data(key: string, value: any): T;              // 设置数据
  class_(names: string | string[]): { remove: () => void, rtn: T };  // 设置CSS类
  tooltip(content: string | HTMLElement, options?: TooltipOptions): T;  // 添加工具提示
  effect(type: 'glow' | 'shadow' | 'blur', options?: EffectOptions): T;  // 添加特效
  highlight(duration?: number): T;                // 高亮显示
  annotate(text: string, position?: 'top' | 'bottom' | 'left' | 'right'): T;  // 添加注释
  pulse(count?: number): T;                      // 脉冲动画
  trace(color?: string): T;                      // 轨迹跟踪
  teachingMode(options?: TeachingOptions): T;    // 教学模式
  step(steps: AnimationStep[]): T;               // 执行动画步骤
  lock(): T;                                     // 锁定对象
  unlock(): T;                                   // 解锁对象
  restrict(bounds: {x: [number, number], y: [number, number]}): T;  // 限制移动范围
  snap(gridSize: number): T;                     // 网格对齐
  connect(target: T, options?: {                 // 连接到目标对象
    elastic?: boolean,                           // 是否弹性连接
    distance?: number,                           // 连接距离
    strength?: number                            // 连接强度
  }): T;
  node(): SVGElement;                           // 获取SVG节点
  show(): T;                                    // 显示对象
  hide(): T;                                    // 隐藏对象
  opacity(value: number): T;                    // 设置透明度
  remove(): void;                               // 移除对象
  morph(target: T, duration?: number): T;       // 形状变形
} 