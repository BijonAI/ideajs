# 快速开始

本教程将帮助你快速上手使用数学组件库。

## 安装

使用 npm 安装:

```bash
npm install math-components
```

## 基本使用

1. 创建一个画布

```typescript
import { field } from 'math-components';

// 创建一个 800x600 的画布
const canvas = field(800, 600);

// 设置画布原点位置(默认在左上角)
canvas.origin(400, 300); // 将原点移到画布中心

// 将画布添加到页面
document.body.appendChild(canvas.node());
```

2. 绘制基本图形

```typescript
import { dot, line, arc } from 'math-components';

// 创建一个点
const point = dot(100, 100)
  .resize(5)  // 设置点的大小
  .fill('red'); // 设置填充颜色

// 创建一条线
const l = line(0, 0, 100, 100)
  .stroke('blue') // 设置线条颜色
  .style({ strokeWidth: 2 }); // 设置线条宽度

// 创建一个圆弧
const a = arc(50, 50)
  .from(0)  // 起始角度
  .to(Math.PI/2); // 结束角度

// 将图形添加到画布
canvas.add(point)
      .add(l)
      .add(a);
```

3. 添加交互效果

```typescript
// 让点可拖动
point.draggable();

// 添加点击事件
point.event('click', () => {
  console.log('点击了点');
});

// 添加悬停提示
point.tooltip('这是一个点');
```

4. 动画效果

```typescript
// 绘制线条的动画
l.animateDrawing(1000); // 1000ms内完成绘制

// 自定义动画
point.animation({
  duration: 1000,
  properties: {
    opacity: { from: '1', to: '0' }
  }
});
```

## 主题设置

库提供了亮色和暗色两种主题:

```typescript
import { setTheme } from 'math-components';

// 设置为暗色主题
setTheme('dark');
```

## 下一步

- 了解更多[基础图形](./basic-shapes.md)的使用
- 学习如何[绘制函数](./functions.md)
- 探索[坐标系统](./coordinate-system.md)的使用
- 查看完整的[API参考](../api/README.md)
