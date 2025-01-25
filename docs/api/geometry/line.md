# Line API

`line` 模块提供了创建和操作线段的功能。

## 创建线段

```typescript
import { line } from 'math-components';

const l = line(x1: number, y1: number, x2: number, y2: number);
```

### 参数
- `x1: number` - 起点x坐标
- `y1: number` - 起点y坐标
- `x2: number` - 终点x坐标
- `y2: number` - 终点y坐标

## 方法

### from()

设置线段起点。

```typescript
l.from(x1: number, y1: number)
```

### to()

设置线段终点。

```typescript
l.to(x2: number, y2: number)
```

### stroke()

设置线条颜色。

```typescript
l.stroke(color?: string)
```

### style()

设置线段样式。

```typescript
l.style(options: LineStyle)
```

#### 参数
```typescript
interface LineStyle {
  strokeWidth?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeDasharray?: string;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
  cursor?: string;
  filter?: string;
  visibility?: 'visible' | 'hidden';
  pointerEvents?: 'none' | 'all';
}
```

### length()

获取线段长度。

```typescript
const length = l.length()
```

### angle()

获取线段角度。

```typescript
const angle = l.angle()
```

### midpoint()

获取线段中点。

```typescript
const { x, y } = l.midpoint()
```

### parallel()

创建平行线。

```typescript
l.parallel(distance: number)
```

### perpendicular()

创建垂线。

```typescript
l.perpendicular(point: { x: number, y: number })
```

### extend()

延长线段。

```typescript
l.extend(start?: number, end?: number)
```

### trim()

裁剪线段。

```typescript
l.trim(start?: number, end?: number)
```

### dash()

设置虚线样式。

```typescript
l.dash(pattern: number[])
```

### marker()

添加线段标记。

```typescript
l.marker(options?: MarkerOptions)
```

#### 参数
```typescript
interface MarkerOptions {
  start?: 'arrow' | 'dot' | 'square' | SVGElement;
  end?: 'arrow' | 'dot' | 'square' | SVGElement;
  size?: number;
  color?: string;
}
```

### gradient()

设置渐变。

```typescript
l.gradient(stops: GradientStop[])
```

### measure()

显示测量信息。

```typescript
l.measure(options?: {
  showLength?: boolean;
  showAngle?: boolean;
  unit?: string;
})
```

### animateDrawing()

添加绘制动画。

```typescript
l.animateDrawing(duration?: number)
```

### constrain()

添加约束。

```typescript
l.constrain(options: {
  minLength?: number;
  maxLength?: number;
  angle?: number;
  parallel?: Line;
})
```

## 继承的方法

线段对象继承了所有通用的图形方法(transform, animation, event等)。 