# Arc API

`arc` 模块提供了创建和操作圆弧的功能。

## 创建圆弧

```typescript
import { arc } from 'math-components';

const a = arc(x: number, y: number);
```

### 参数

- `x: number` - 圆心x坐标
- `y: number` - 圆心y坐标

## 方法

### from()

设置起始角度。

```typescript
a.from(angle: number)
```

#### 参数

- `angle: number` - 起始角度(弧度)

### to()

设置结束角度。

```typescript
a.to(angle: number)
```

#### 参数

- `angle: number` - 结束角度(弧度)

### stroke()

设置描边颜色。

```typescript
a.stroke(color?: string)
```

### fill()

设置填充颜色。

```typescript
a.fill(color?: string)
```

### animateDrawing()

添加绘制动画。

```typescript
a.animateDrawing(duration: number)
```

#### 参数

- `duration: number` - 动画持续时间(毫秒)

## 继承的方法

圆弧对象继承了所有通用的图形方法:

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
