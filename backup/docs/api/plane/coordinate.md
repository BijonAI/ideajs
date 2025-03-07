# Coordinate API

`coordinate` 模块提供了创建和管理坐标系的功能。

## 创建坐标系

```typescript
import { coordinate } from 'math-components';

const coord = coordinate(width: number, height: number);
```

### 参数
- `width: number` - 坐标系宽度
- `height: number` - 坐标系高度

## 方法

### origin()

设置原点位置。

```typescript
coord.origin(x: number, y: number)
```

### grid()

设置网格。

```typescript
coord.grid(size: number)
```

### unit()

设置单位长度。

```typescript
coord.unit(value: number)
```

### gridStyle()

设置网格样式。

```typescript
coord.gridStyle(options: {
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: string;
})
```

### axisStyle()

设置坐标轴样式。

```typescript
coord.axisStyle(options: {
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: string;
})
```

### hideAxis()

隐藏坐标轴。

```typescript
coord.hideAxis()
```

### hideGrid()

隐藏网格。

```typescript
coord.hideGrid()
```

### hideLabels()

隐藏标签。

```typescript
coord.hideLabels()
```

### zoom()

缩放坐标系。

```typescript
coord.zoom(scale: number)
```

### pan()

平移坐标系。

```typescript
coord.pan(x: number, y: number)
```

### snap()

启用网格吸附。

```typescript
coord.snap(enable: boolean)
```

### exportSVG()

导出为SVG。

```typescript
const url = coord.exportSVG()
```

### addMarker()

添加标记。

```typescript
coord.addMarker(x: number, y: number, options?: {
  type?: 'circle' | 'cross' | 'square';
  size?: number;
  color?: string;
})
```

### addText()

添加文本。

```typescript
coord.addText(x: number, y: number, text: string, options?: {
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
})
```

### theme()

设置主题。

```typescript
coord.theme(name: 'light' | 'dark')
``` 