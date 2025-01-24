# Vector API

`vector` 模块提供了创建和操作向量的功能。

## 创建向量

```typescript
import { vector } from 'math-components';

const v = vector(x1: number, y1: number, x2: number, y2: number);
```

### 参数

- `x1: number` - 起点x坐标
- `y1: number` - 起点y坐标
- `x2: number` - 终点x坐标
- `y2: number` - 终点y坐标

## 方法

### from()

设置向量起点。

```typescript
v.from(x1: number, y1: number)
```

### to()

设置向量终点。

```typescript
v.to(x2: number, y2: number)
```

### stroke()

设置向量颜色。

```typescript
v.stroke(color?: string)
```

## 继承的方法

向量对象继承了所有通用的图形方法:

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
