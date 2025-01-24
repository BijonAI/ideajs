# 动画效果

本教程介绍如何使用数学组件库的动画功能。

## 基本动画

### 绘制动画

所有图形都支持绘制动画:

```typescript
// 线条绘制动画
line(0, 0, 100, 100).animateDrawing(1000); // 1秒内完成绘制

// 圆弧绘制动画
arc(50, 50).from(0).to(Math.PI).animateDrawing(1500); // 1.5秒内完成绘制

// 函数图像绘制动画
func((x) => Math.sin(x), [-Math.PI, Math.PI]).animate(2000); // 2秒内完成绘制
```

### 属性动画

可以对任意属性进行动画:

```typescript
shape.animation({
  duration: 1000, // 持续时间
  delay: 200, // 延迟开始
  easing: "ease-in-out", // 缓动函数
  properties: {
    opacity: {
      from: "1",
      to: "0",
    },
    transform: {
      from: "scale(1)",
      to: "scale(2)",
    },
  },
  onStart: () => console.log("动画开始"),
  onEnd: () => console.log("动画结束"),
});
```

## 变换动画

### 平移

```typescript
shape.transform({
  translate: [100, 100],
  duration: 1000,
  easing: "ease",
});
```

### 旋转

```typescript
shape.transform({
  rotate: 360,
  duration: 2000,
  easing: "linear",
});
```

### 缩放

```typescript
shape.transform({
  scale: 2,
  duration: 1000,
  easing: "ease-out",
});
```

## 序列动画

使用 `step` 方法创建动画序列:

```typescript
shape.step([
  {
    duration: 1000,
    action: () => shape.transform({ translate: [100, 0] }),
  },
  {
    duration: 1000,
    action: () => shape.transform({ rotate: 360 }),
  },
  {
    duration: 1000,
    action: () => shape.transform({ scale: 2 }),
  },
]);
```

## 交互动画

### 悬停效果

```typescript
shape
  .effect("glow", {
    color: "#ff0000",
    strength: 5,
  })
  .animation({
    duration: 300,
    properties: {
      filter: {
        from: "none",
        to: "drop-shadow(0 0 5px #ff0000)",
      },
    },
  });
```

### 点击效果

```typescript
shape.event("click", () => {
  shape.animation({
    duration: 200,
    properties: {
      transform: {
        from: "scale(1)",
        to: "scale(1.2)",
      },
    },
  });
});
```

## 组合动画

下面是一个综合示例:

```typescript
import { field, dot, line } from "math-components";

const canvas = field(800, 600);

// 创建一个点
const point = dot(100, 100).resize(5).fill("red");

// 创建一条线
const l = line(0, 0, 100, 100).stroke("blue");

// 添加到画布
canvas.add(point).add(l);

// 点的动画序列
point.step([
  {
    duration: 1000,
    action: () => point.transform({ translate: [200, 0] }),
  },
  {
    duration: 1000,
    action: () => point.transform({ translate: [200, 200] }),
  },
  {
    duration: 1000,
    action: () => point.transform({ translate: [0, 200] }),
  },
  {
    duration: 1000,
    action: () => point.transform({ translate: [0, 0] }),
  },
]);

// 线的动画
l.animateDrawing(1000).animation({
  delay: 1000,
  duration: 3000,
  properties: {
    transform: {
      from: "rotate(0)",
      to: "rotate(360)",
    },
  },
});
```

## 下一步

- 学习[交互功能](./interactions.md)的使用
- 了解[主题定制](./theming.md)的方法
- 探索[教学模式](./teaching.md)的功能
