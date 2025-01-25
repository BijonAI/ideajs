# 坐标系统

本教程介绍如何使用数学组件库的坐标系统功能。

## 基本用法

创建和配置坐标系:

```typescript
import { coordinate, field } from 'math-components';

// 创建画布
const canvas = field(800, 600);

// 创建坐标系
const coord = coordinate(800, 600)
  .origin(400, 300)     // 设置原点位置
  .grid(50)             // 设置网格大小
  .unit(50);            // 设置单位长度(1个单位对应50像素)

// 添加到画布
canvas.add(coord);
```

## 坐标系配置

### 网格设置

```typescript
coord
  .grid(50)                    // 设置网格间距
  .gridStyle({
    color: '#ddd',            // 网格颜色
    width: 1,                 // 网格线宽
    opacity: 0.5,             // 透明度
    dashArray: '2,2'          // 虚线样式
  });

// 隐藏网格
coord.hideGrid();
```

### 坐标轴样式

```typescript
coord
  .axisStyle({
    color: '#000',            // 轴线颜色
    width: 2,                 // 轴线宽度
    opacity: 1,               // 透明度
    dashArray: ''             // 实线
  });

// 隐藏坐标轴
coord.hideAxis();
```

### 刻度和标签

```typescript
// 设置刻度
coord.ticks(50, 6);           // 间距50px,刻度长度6px

// 设置标签
coord.labels(50, 1,           // 间距50px,每个单位是1
  n => n.toFixed(1)          // 自定义格式化函数
);

// 隐藏标签
coord.hideLabels();
```

## 变换

### 缩放

```typescript
// 整体缩放
coord.zoom(1.5);              // 放大1.5倍

// 设置单位长度
coord.unit(100);              // 1个单位对应100像素
```

### 平移

```typescript
// 平移坐标系
coord.pan(100, -50);          // 向右100,向上50
```

## 网格吸附

启用网格吸附功能:

```typescript
// 启用网格吸附
coord.snap(true);

// 添加可吸附的图形
const point = dot(0, 0)
  .draggable();              // 拖动时会自动吸附到网格点

coord.add(point);
```

## 标记和文本

### 添加标记

```typescript
// 添加点标记
coord.addMarker(2, 3, {
  type: 'circle',            // 标记类型: circle/cross/square
  size: 5,                   // 标记大小
  color: 'red'              // 标记颜色
});
```

### 添加文本

```typescript
// 添加文本标签
coord.addText(1, 1, 'Point A', {
  size: 12,                 // 字体大小
  color: 'blue',           // 文字颜色
  anchor: 'middle'         // 对齐方式: start/middle/end
});
```

## 主题

坐标系支持主题切换:

```typescript
// 切换到暗色主题
coord.theme('dark');

// 切换到亮色主题
coord.theme('light');
```

## 导出

```typescript
// 导出为SVG数据URL
const svgUrl = coord.exportSVG();
```

## 组合使用

下面是一个综合示例:

```typescript
import { coordinate, field, dot, func } from 'math-components';

// 创建画布和坐标系
const canvas = field(800, 600);
const coord = coordinate(800, 600)
  .origin(400, 300)
  .grid(50)
  .unit(50)
  .gridStyle({
    color: '#eee',
    opacity: 0.5
  })
  .axisStyle({
    color: '#333',
    width: 2
  });

// 添加函数图像
const f = func(x => Math.sin(x), [-2 * Math.PI, 2 * Math.PI]);
coord.add(f);

// 添加可拖动点
const p = dot(0, 0)
  .draggable()
  .tooltip('拖动我!');
coord.add(p);

// 添加标记和文本
coord.addMarker(Math.PI/2, 1, {
  type: 'circle',
  color: 'red'
});
coord.addText(Math.PI/2, 1.2, 'Maximum');

// 启用网格吸附
coord.snap(true);

// 添加到画布
canvas.add(coord);
```

## 下一步

- 探索[动画效果](./animations.md)的实现
- 学习[交互功能](./interactions.md)的使用
- 了解[主题定制](./theming.md)的方法 