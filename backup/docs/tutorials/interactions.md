# 交互功能

本教程介绍如何使用数学组件库的交互功能。

## 事件处理

### 基本事件

所有图形都支持标准的DOM事件:

```typescript
shape.event('click', (e) => {
  console.log('点击事件');
});

shape.event('mouseenter', (e) => {
  console.log('鼠标进入');
});

shape.event('mouseleave', (e) => {
  console.log('鼠标离开');
});
```

### 移除事件

```typescript
const { remove } = shape.event('click', handler);
remove(); // 移除事件监听
```

## 拖拽功能

### 基本拖拽

```typescript
// 启用拖拽
shape.draggable();

// 限制拖拽范围
shape.draggable((x, y) => {
  return x >= 0 && x <= 100 && y >= 0 && y <= 100;
});
```

### 拖拽事件

```typescript
shape.onDrag((x, y) => {
  console.log(`当前位置: (${x}, ${y})`);
});
```

### 网格吸附

```typescript
// 启用网格吸附
shape.snap(20); // 网格大小为20

// 结合拖拽使用
shape.draggable()
     .snap(20);
```

## 选择和焦点

### 焦点效果

```typescript
shape.focus('blue'); // 鼠标悬停时变为蓝色

shape.onFocus(() => {
  console.log('获得焦点');
});
```

### 选择效果

```typescript
shape.select('green'); // 点击选中时变为绿色

shape.onSelect(() => {
  console.log('被选中');
});
```

## 工具提示

### 基本提示

```typescript
shape.tooltip('这是一个提示');
```

### 自定义提示

```typescript
shape.tooltip('详细信息', {
  position: 'top',         // 位置
  offset: [0, -10],       // 偏移
  className: 'my-tooltip', // 自定义类名
  style: {                 // 自定义样式
    background: '#000',
    color: '#fff',
    padding: '5px'
  }
});
```

## 连接功能

### 基本连接

```typescript
// 连接两个图形
shape1.connect(shape2);
```

### 弹性连接

```typescript
shape1.connect(shape2, {
  elastic: true,     // 启用弹性
  distance: 100,     // 理想距离
  strength: 0.5      // 弹性强度
});
```

## 约束

### 范围约束

```typescript
shape.restrict({
  x: [0, 100],    // x轴范围
  y: [0, 100]     // y轴范围
});
```

### 锁定/解锁

```typescript
// 锁定图形,禁止交互
shape.lock();

// 解锁图形
shape.unlock();
```

## 组合使用

下面是一个综合示例:

```typescript
import { field, dot, line } from 'math-components';

const canvas = field(800, 600);

// 创建两个可拖动的点
const p1 = dot(100, 100)
  .draggable()
  .snap(20)
  .tooltip('拖动我!')
  .focus('blue')
  .select('green');

const p2 = dot(200, 200)
  .draggable()
  .snap(20)
  .tooltip('也可以拖动我!')
  .focus('blue')
  .select('green');

// 创建连接线
const l = line(100, 100, 200, 200)
  .stroke('gray');

// 点的拖动会更新线的位置
p1.onDrag((x, y) => {
  l.from(x, y);
});

p2.onDrag((x, y) => {
  l.to(x, y);
});

// 添加到画布
canvas.add(l)
      .add(p1)
      .add(p2);
```

## 下一步

- 了解[主题定制](./theming.md)的方法
- 探索[教学模式](./teaching.md)的功能
- 查看[API参考](../api/README.md)获取更多信息 