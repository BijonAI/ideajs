# Polygon API

`polygon` 模块提供了创建和操作多边形的功能。

## 创建多边形

```typescript
import { polygon } from 'math-components';

const poly = polygon(points: { x: number, y: number }[]);
```

### 参数

- `points` - 顶点坐标数组

## 方法

### setPoints()

设置所有顶点。

```typescript
poly.setPoints(points: { x: number, y: number }[])
```

### setPoint()

设置单个顶点。

```typescript
poly.setPoint(index: number, point: { x: number, y: number })
```

### insertBefore()

在指定位置前插入顶点。

```typescript
poly.insertBefore(index: number, point: { x: number, y: number })
```

### insertAfter()

在指定位置后插入顶点。

```typescript
poly.insertAfter(index: number, point: { x: number, y: number })
```

### remove()

移除指定顶点。

```typescript
poly.remove(index: number)
```

### stroke()

设置描边颜色。

```typescript
poly.stroke(color?: string)
```

### fill()

设置填充颜色。

```typescript
poly.fill(color?: string)
```

### style()

设置样式。

```typescript
poly.style(options: PolygonStyle)
```

#### 参数

```typescript
interface PolygonStyle {
  strokeWidth?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeDasharray?: string;
  fillColor?: string;
  fillOpacity?: number;
  lineJoin?: "miter" | "round" | "bevel";
  cursor?: string;
  filter?: string;
  visibility?: "visible" | "hidden";
  pointerEvents?: "none" | "all";
}
```

## 继承的方法

多边形对象继承了所有通用的图形方法:

- transform()
- animation()
- event()
- tooltip()
- effect()
- highlight()
- annotate()
- pulse()
- trace()
- lock()/unlock()
- restrict()
- snap()
- connect()
