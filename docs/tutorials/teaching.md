# 教学模式

本教程介绍如何使用数学组件库的教学模式功能。

## 启用教学模式

```typescript
import { field } from "math-components";

const canvas = field(800, 600).teachingMode({
  stepDelay: 1000, // 步骤间延迟
  highlightColor: "red", // 高亮颜色
  annotations: true, // 启用标注
  voiceGuide: true, // 启用语音引导
});
```

## 步骤演示

### 基本步骤

```typescript
shape.step([
  {
    duration: 1000,
    action: () => shape.highlight(),
    description: "这是第一步",
  },
  {
    duration: 1000,
    action: () => shape.transform({ scale: 2 }),
    description: "放大图形",
  },
  {
    duration: 1000,
    action: () => shape.annotate("重要点"),
    description: "添加标注",
  },
]);
```

### 演示控制

```typescript
// 创建演示序列
canvas.presentation([
  {
    elements: [point1, line1],
    duration: 2000,
    description: "首先创建一个点和一条线",
  },
  {
    elements: [point2, line2],
    duration: 2000,
    description: "然后添加第二个点和线",
  },
]);
```

## 标注功能

### 添加标注

```typescript
shape.annotate("这是一个重要的点", "top");
```

### 高亮显示

```typescript
// 临时高亮
shape.highlight(2000); // 高亮2秒

// 跟踪轨迹
shape.trace("red");
```

### 脉冲效果

```typescript
// 添加注意力引导
shape.pulse(3); // 闪烁3次
```

## 交互限制

### 锁定/解锁

```typescript
// 锁定图形,防止学生误操作
shape.lock();

// 完成教学后解锁
shape.unlock();
```

### 范围限制

```typescript
// 限制可操作范围
shape.restrict({
  x: [-100, 100],
  y: [-100, 100],
});
```

## 组合使用

下面是一个完整的教学示例:

```typescript
import { field, coordinate, dot, line, func } from "math-components";

// 创建教学画布
const canvas = field(800, 600).teachingMode({
  annotations: true,
  stepDelay: 1000,
});

// 创建坐标系
const coord = coordinate(800, 600).origin(400, 300).grid(50).unit(50);

// 创建图形
const point = dot(0, 0).resize(5).fill("red");

const f = func((x) => x * x, [-5, 5]).stroke("blue");

// 添加到画布
canvas.add(coord);
coord.add(point).add(f);

// 创建教学步骤
canvas.presentation([
  {
    elements: [coord],
    duration: 2000,
    description: "首先看到这个坐标系",
  },
  {
    elements: [coord, point],
    duration: 2000,
    description: "这是原点(0,0)",
  },
  {
    elements: [coord, point, f],
    duration: 2000,
    description: "这是函数 y = x² 的图像",
  },
]);

// 添加交互引导
point.draggable().tooltip("试着拖动这个点!").pulse(3);

// 添加重要点标注
f.annotate("顶点", 0, 0);

// 限制操作范围
point.restrict({
  x: [-5, 5],
  y: [-5, 5],
});

// 添加完成检查
point.event("dragend", (x, y) => {
  if (x === 0 && y === 0) {
    console.log("做得好!");
    point.highlight(1000);
  }
});
```

## 下一步

- 查看[API参考](../api/README.md)获取更多选项
- 探索[示例](../examples/README.md)获取更多教学灵感
- 了解如何[创建课程](../guides/creating-lessons.md)
