# Function API

`func` 模块提供了创建和操作函数图像的功能。

## 创建函数

```typescript
import { func } from 'math-components';

const f = func(fn: (x: number) => number, xRange: [number, number]);
```

### 参数

- `fn: (x: number) => number` - 函数定义
- `xRange: [number, number]` - x轴范围

## 方法

### domain()

设置定义域。

```typescript
f.domain(min: number, max: number)
```

### range()

设置值域。

```typescript
f.range(min: number, max: number)
```

### samples()

设置采样点数量。

```typescript
f.samples(n: number)
```

### update()

更新函数定义。

```typescript
f.update(newFn: (x: number) => number, newRange?: [number, number])
```

### style()

设置样式。

```typescript
f.style(options: {
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: string;
  lineCap?: string;
})
```

### animate()

添加绘制动画。

```typescript
f.animate(duration: number, easing?: string)
```

### discontinuity()

标记不连续点。

```typescript
f.discontinuity(points: number[])
```

### derivative()

绘制导函数。

```typescript
f.derivative();
```

### integral()

绘制积分函数。

```typescript
f.integral(from?: number)
```

### intersection()

标记交点。

```typescript
f.intersection(g: Function)
```

### extrema()

标记极值点。

```typescript
f.extrema();
```

### asymptotes()

显示渐近线。

```typescript
f.asymptotes();
```

### highlight()

高亮区间。

```typescript
f.highlight(start: number, end: number, color?: string)
```

### label()

添加标签。

```typescript
f.label(text: string, x: number)
```

### tooltip()

添加工具提示。

```typescript
f.tooltip();
```
