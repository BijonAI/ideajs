# Dot API

`dot` 模块提供了创建和操作点的功能。

## 创建点

```typescript
import { dot } from 'math-components';

const point = dot(x: number, y: number);
```

### 参数

- `x: number` - 点的x坐标
- `y: number` - 点的y坐标

## 方法

### resize()

设置点的大小。

```typescript
point.resize(radius: number)
```

#### 参数

- `radius: number` - 点的半径

### stroke()

设置点的边框颜色。

```typescript
point.stroke(color?: string)
```

#### 参数

- `color?: string` - CSS颜色值,不传则使用主题色

### fill()

设置点的填充颜色。

```typescript
point.fill(color?: string)
```

#### 参数

- `color?: string` - CSS颜色值,不传则使用主题色

### border()

设置点的边框宽度。

```typescript
point.border(width: number)
```

#### 参数

- `width: number` - 边框宽度

### style()

设置点的样式。

```typescript
point.style(options: DotStyle)
```

#### 参数

- `options: DotStyle` - 样式配置
  ```typescript
  interface DotStyle {
    radius?: number;
    strokeWidth?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    fillColor?: string;
    fillOpacity?: number;
    cursor?: string;
    filter?: string;
    visibility?: "visible" | "hidden";
    pointerEvents?: "none" | "all";
  }
  ```

### focus()

设置焦点效果。

```typescript
point.focus(color: string)
```

#### 参数

- `color: string` - 焦点状态的颜色

### select()

设置选中效果。

```typescript
point.select(color: string)
```

#### 参数

- `color: string` - 选中状态的颜色

### draggable()

使点可拖动。

```typescript
point.draggable(condition?: (x: number, y: number) => boolean)
```

#### 参数

- `condition?: (x: number, y: number) => boolean` - 拖动限制条件

### onDrag()

添加拖动事件监听。

```typescript
point.onDrag(callback: (x: number, y: number) => void)
```

#### 参数

- `callback: (x: number, y: number) => void` - 拖动回调函数

## 继承的方法

点对象继承了所有通用的图形方法:

### transform()

应用变换。

```typescript
point.transform(options: Transform)
```

### animation()

添加动画。

```typescript
point.animation(options: Animation)
```

### event()

添加事件监听。

```typescript
point.event(type: string, handler: (e: Event) => void)
```

### tooltip()

添加工具提示。

```typescript
point.tooltip(content: string | HTMLElement, options?: TooltipOptions)
```

### effect()

添加特效。

```typescript
point.effect(type: 'glow' | 'shadow' | 'blur', options?: EffectOptions)
```

### highlight()

高亮显示。

```typescript
point.highlight(duration?: number)
```

### annotate()

添加标注。

```typescript
point.annotate(text: string, position?: 'top' | 'bottom' | 'left' | 'right')
```

### pulse()

添加脉冲动画。

```typescript
point.pulse(count?: number)
```

### trace()

显示轨迹。

```typescript
point.trace(color?: string)
```

### lock()/unlock()

锁定/解锁交互。

```typescript
point.lock();
point.unlock();
```

### restrict()

限制移动范围。

```typescript
point.restrict(bounds: {x: [number, number], y: [number, number]})
```

### snap()

启用网格吸附。

```typescript
point.snap(gridSize: number)
```

### connect()

连接到其他图形。

```typescript
point.connect(target: Dot, options?: {
  elastic?: boolean,
  distance?: number,
  strength?: number
})
```
