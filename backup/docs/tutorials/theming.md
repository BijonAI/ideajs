# 主题定制

本教程介绍如何使用和自定义数学组件库的主题。

## 内置主题

库提供了两个内置主题:

```typescript
import { setTheme } from 'math-components';

// 切换到亮色主题
setTheme('light');

// 切换到暗色主题
setTheme('dark');
```

## 主题配置

### 颜色配置

```typescript
const theme = {
  colors: {
    background: '#ffffff',    // 背景色
    primary: '#1976d2',      // 主色
    secondary: '#dc004e',    // 次色
    text: '#000000',         // 文本色
    grid: '#e0e0e0',         // 网格色
    axis: '#000000',         // 坐标轴色
    function: {
      stroke: '#1976d2',     // 函数线条色
      derivative: '#2196f3',  // 导数线条色
      integral: '#4caf50'    // 积分线条色
    },
    marker: {
      fill: '#ffffff',       // 标记填充色
      stroke: '#000000'      // 标记边框色
    }
  },
  opacity: {
    grid: 0.5,              // 网格透明度
    function: 1             // 函数线条透明度
  },
  sizes: {
    axis: 2,                // 坐标轴宽度
    grid: 1,                // 网格线宽度
    function: 2             // 函数线条宽度
  }
};
```

### 应用主题

```typescript
import { setTheme } from 'math-components';

// 应用自定义主题
setTheme(theme);
```

## 组件级主题

可以为单个组件设置样式,覆盖全局主题:

### 坐标系

```typescript
coord
  .gridStyle({
    color: '#eee',
    width: 1,
    opacity: 0.3
  })
  .axisStyle({
    color: '#333',
    width: 2
  });
```

### 函数

```typescript
func(x => x * x, [-10, 10])
  .stroke('#ff0000')
  .style({
    width: 3,
    opacity: 0.8
  });
```

### 图形

```typescript
dot(0, 0)
  .fill('#ff0000')
  .stroke('#000000')
  .style({
    opacity: 0.8,
    cursor: 'pointer'
  });
```

## 响应式主题

可以根据系统主题自动切换:

```typescript
// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    setTheme(e.matches ? 'dark' : 'light');
  });
```

## 主题切换动画

```typescript
// 为主题切换添加过渡动画
document.documentElement.style.transition = 'background-color 0.3s';

function toggleTheme() {
  const isDark = getTheme().colors.background === '#121212';
  setTheme(isDark ? 'light' : 'dark');
}
```

## 组合使用

下面是一个综合示例:

```typescript
import { field, coordinate, func, setTheme } from 'math-components';

// 自定义主题
const customTheme = {
  colors: {
    background: '#f5f5f5',
    primary: '#2196f3',
    secondary: '#f50057',
    text: '#212121',
    grid: '#e0e0e0',
    axis: '#000000',
    function: {
      stroke: '#2196f3',
      derivative: '#1976d2',
      integral: '#4caf50'
    },
    marker: {
      fill: '#ffffff',
      stroke: '#000000'
    }
  },
  opacity: {
    grid: 0.4,
    function: 0.9
  },
  sizes: {
    axis: 2,
    grid: 1,
    function: 2.5
  }
};

// 应用主题
setTheme(customTheme);

// 创建画布和坐标系
const canvas = field(800, 600);
const coord = coordinate(800, 600)
  .origin(400, 300)
  .grid(50)
  .unit(50);

// 创建函数
const f = func(x => Math.sin(x), [-2 * Math.PI, 2 * Math.PI])
  .style({
    width: 3,
    opacity: 0.8
  });

// 添加到画布
canvas.add(coord);
coord.add(f);

// 添加主题切换按钮
const button = document.createElement('button');
button.textContent = '切换主题';
button.onclick = () => {
  const isDark = getTheme().colors.background === '#121212';
  setTheme(isDark ? 'light' : 'dark');
};
document.body.appendChild(button);
```

## 下一步

- 探索[教学模式](./teaching.md)的功能
- 了解[API参考](../api/README.md)中的更多选项
- 查看[示例](../examples/README.md)获取灵感 