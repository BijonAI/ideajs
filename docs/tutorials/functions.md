# 函数绘制

本教程介绍如何使用数学组件库绘制数学函数。

## 基本用法

使用 `func` 函数来绘制数学函数:

```typescript
import { func, coordinate } from "math-components";

// 创建坐标系
const coord = coordinate(800, 600);

// 绘制函数 y = x^2
const f = func((x) => x * x, [-10, 10]) // 定义函数和x轴范围
  .stroke("blue") // 设置颜色
  .style({
    width: 2, // 线宽
    opacity: 0.8, // 透明度
  });

// 添加到坐标系
coord.add(f);
```

## 函数定制

### 设置范围

```typescript
// 设置x轴范围
f.domain(-5, 5);

// 设置y轴范围(超出范围的部分不显示)
f.range(-10, 10);

// 设置采样点数量(默认200)
f.samples(500);
```

### 不连续点处理

```typescript
// 标记不连续点
f.discontinuity([0, 2, -2]); // 在x=0,2,-2处有不连续点
```

### 渐变效果

```typescript
f.gradient([
  { offset: 0, color: "blue", opacity: 1 },
  { offset: 0.5, color: "purple", opacity: 0.8 },
  { offset: 1, color: "red", opacity: 1 },
]);
```

## 函数分析

### 导数

```typescript
// 绘制导函数
f.derivative().stroke("green").style({ dashArray: "5,5" }); // 用虚线表示
```

### 积分

```typescript
// 绘制积分函数(从-5开始积分)
f.integral(-5).stroke("red");
```

### 交点

```typescript
// 绘制另一个函数
const g = func((x) => -x * x + 4, [-10, 10]);

// 标记两个函数的交点
f.intersection(g);
```

### 极值点

```typescript
// 标记极大值和极小值点
f.extrema();
```

### 渐近线

```typescript
// 显示水平和垂直渐近线
f.asymptotes();
```

## 高亮和标注

### 区间高亮

```typescript
// 高亮显示[-2,2]区间
f.highlight(-2, 2, "rgba(255,0,0,0.2)");
```

### 添加标签

```typescript
// 在特定点添加标签
f.label("最大值", 0);
```

### 工具提示

```typescript
// 添加悬停提示(显示坐标)
f.tooltip();
```

## 动画效果

### 绘制动画

```typescript
// 1秒内完成函数图像的绘制
f.animate(1000);
```

### 更新函数

```typescript
// 更新函数定义和范围
f.update((x) => Math.sin(x), [-Math.PI, Math.PI]);
```

## 组合使用

下面是一个综合示例:

```typescript
import { func, coordinate, field } from "math-components";

// 创建画布和坐标系
const canvas = field(800, 600);
const coord = coordinate(800, 600)
  .origin(400, 300) // 设置原点位置
  .grid(50) // 设置网格大小
  .unit(50); // 设置单位长度

// 创建函数
const f = func((x) => Math.sin(x), [-2 * Math.PI, 2 * Math.PI])
  .stroke("blue")
  .style({ width: 2 })
  .samples(500);

// 添加导数
f.derivative().stroke("green").style({ dashArray: "5,5" });

// 高亮[-π,π]区间
f.highlight(-Math.PI, Math.PI, "rgba(0,0,255,0.1)");

// 添加标签
f.label("y=sin(x)", 0);

// 添加到画布
canvas.add(coord);
coord.add(f);

// 添加动画效果
f.animate(1500);
```

## 下一步

- 了解[坐标系统](./coordinate-system.md)的更多用法
- 探索[动画效果](./animations.md)的实现
- 学习[交互功能](./interactions.md)的使用
