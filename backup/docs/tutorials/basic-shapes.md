# 基础图形

本教程介绍数学组件库提供的基础几何图形及其用法。

## 点 (Dot)

点是最基本的几何元素:

```typescript
import { dot } from 'math-components';

// 创建一个点
const point = dot(100, 100);

// 设置样式
point
  .resize(5)        // 设置点的大小
  .fill('red')      // 设置填充颜色
  .stroke('black')  // 设置边框颜色
  .border(2);       // 设置边框宽度

// 添加交互
point
  .draggable()      // 使点可拖动
  .focus('blue')    // 鼠标悬停时变色
  .select('green'); // 点击选中时变色

// 监听拖动事件
point.onDrag((x, y) => {
  console.log(`点被拖动到: (${x}, ${y})`);
});
```

## 线段 (Line)

线段连接两个点:

```typescript
import { line } from 'math-components';

// 创建一条从(0,0)到(100,100)的线
const l = line(0, 0, 100, 100);

// 设置样式
l.stroke('blue')                    // 设置颜色
 .style({
   strokeWidth: 2,                  // 线宽
   strokeDasharray: '5,5',          // 虚线样式
   lineCap: 'round'                 // 线段端点样式
 });

// 添加箭头标记
l.marker({
  start: 'arrow',                   // 起点箭头
  end: 'dot',                       // 终点圆点
  size: 10,                         // 标记大小
  color: 'blue'                     // 标记颜色
});

// 测量功能
l.measure({
  showLength: true,                 // 显示长度
  showAngle: true,                  // 显示角度
  unit: 'px'                        // 单位
});

// 动画绘制
l.animateDrawing(1000);            // 1秒内绘制完成
```

## 圆弧 (Arc)

圆弧是圆的一部分:

```typescript
import { arc } from 'math-components';

// 创建圆弧
const a = arc(100, 100)    // 圆心位置
  .from(0)                 // 起始角度(弧度)
  .to(Math.PI);           // 结束角度(弧度)

// 设置样式
a.stroke('purple')         // 描边颜色
 .fill('none');           // 不填充

// 动画绘制
a.animateDrawing(1000);    // 1秒内绘制完成
```

## 向量 (Vector)

向量是有方向的线段:

```typescript
import { vector } from 'math-components';

// 创建向量
const v = vector(0, 0, 100, 100);  // 从(0,0)指向(100,100)

// 设置样式
v.stroke('green');                 // 设置颜色

// 修改起点和终点
v.from(50, 50)                     // 修改起点
 .to(150, 150);                    // 修改终点
```

## 公共特性

所有基础图形都支持以下功能:

### 变换

```typescript
shape.transform({
  translate: [10, 20],     // 平移
  scale: 2,                // 缩放
  rotate: 45,              // 旋转(角度)
  skew: [10, 0],          // 倾斜
  origin: [0, 0]          // 变换原点
});
```

### 动画

```typescript
shape.animation({
  duration: 1000,          // 持续时间
  properties: {
    opacity: {
      from: '1',
      to: '0'
    }
  },
  easing: 'ease-in-out'    // 缓动函数
});
```

### 事件处理

```typescript
shape.event('click', (e) => {
  console.log('图形被点击');
});
```

### 工具提示

```typescript
shape.tooltip('提示文本', {
  position: 'top',         // 位置
  offset: [0, -10]         // 偏移
});
```

### 特效

```typescript
shape.effect('glow', {     // glow/shadow/blur
  color: '#ff0000',
  strength: 5,
  spread: 2
});
```

## 下一步

- 学习如何[绘制函数](./functions.md)
- 了解[坐标系统](./coordinate-system.md)的使用
- 探索[动画效果](./animations.md)的实现 