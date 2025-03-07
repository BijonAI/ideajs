# Field API

`field` 模块提供了创建和管理画布的功能。

## 创建画布

```typescript
import { field } from 'math-components';

const canvas = field(width: number, height: number);
```

### 参数

- `width: number` - 画布宽度(像素)
- `height: number` - 画布高度(像素)

### 返回值

返回一个画布对象,包含以下方法:

## 方法

### origin()

设置画布原点位置。

```typescript
canvas.origin(x: number, y: number)
```

#### 参数
- `x: number` - 原点x坐标
- `y: number` - 原点y坐标

### direct()

设置坐标轴方向。

```typescript
canvas.direct(x: Direction, y: Direction)
```

#### 参数
- `x: Direction` - x轴方向,可选值: `left()`, `right()`
- `y: Direction` - y轴方向,可选值: `up()`, `down()`

### add()

添加可渲染对象到画布。

```typescript
canvas.add(renderable: Renderable)
```

#### 参数
- `renderable: Renderable` - 任何实现了 `node()` 方法的对象

### size()

调整画布大小。

```typescript
canvas.size(width: number, height: number)
```

#### 参数
- `width: number` - 新的宽度
- `height: number` - 新的高度

### background()

设置画布背景色。

```typescript
canvas.background(color: string)
```

#### 参数
- `color: string` - CSS颜色值

### border()

设置画布边框。

```typescript
canvas.border(width: number, color: string)
```

#### 参数
- `width: number` - 边框宽度
- `color: string` - 边框颜色

### clear()

清空画布内容。

```typescript
canvas.clear()
```

### remove()

移除指定元素。

```typescript
canvas.remove(element: Renderable)
```

#### 参数
- `element: Renderable` - 要移除的元素

### toDataURL()

将画布导出为 data URL。

```typescript
const url = canvas.toDataURL()
```

#### 返回值
- `string` - SVG 格式的 data URL

### viewBox()

设置 SVG viewBox。

```typescript
canvas.viewBox(x: number, y: number, width: number, height: number)
```

#### 参数
- `x: number` - 视口左上角x坐标
- `y: number` - 视口左上角y坐标
- `width: number` - 视口宽度
- `height: number` - 视口高度

### zoom()

缩放画布。

```typescript
canvas.zoom(scale: number)
```

#### 参数
- `scale: number` - 缩放比例

### presentation()

创建演示序列。

```typescript
canvas.presentation(steps: {
  elements: Renderable[],
  duration: number,
  description?: string
}[])
```

#### 参数
- `steps` - 演示步骤数组
  - `elements` - 该步骤要显示的元素
  - `duration` - 该步骤持续时间(毫秒)
  - `description` - 步骤描述文本

### enableSnap()

启用网格吸附。

```typescript
canvas.enableSnap(size: number)
```

#### 参数
- `size: number` - 网格大小

### teachingMode()

启用教学模式。

```typescript
canvas.teachingMode(options?: TeachingOptions)
```

#### 参数
- `options` - 教学模式配置
  - `annotations?: boolean` - 是否启用标注
  - `stepDelay?: number` - 步骤间延迟
  - `highlightColor?: string` - 高亮颜色
  - `voiceGuide?: boolean` - 是否启用语音引导

## 类型定义

### Renderable

```typescript
interface Renderable {
  node(): SVGElement;
}
```

任何要添加到画布的对象都必须实现这个接口。

### TeachingOptions

```typescript
interface TeachingOptions {
  annotations?: boolean;
  stepDelay?: number;
  highlightColor?: string;
  voiceGuide?: boolean;
}
```

教学模式的配置选项。 