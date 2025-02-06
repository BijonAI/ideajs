# IdeaJs

A powerful mathematical visualization library for interactive geometry and function plotting.

一个用于交互式几何和函数绘图的强大数学可视化库。

## Features 特性

- **Interactive Geometry 交互式几何**

  - Basic shapes (point, line, circle, etc.) 基础图形(点、线、圆等)
  - Drag & drop support 支持拖拽
  - Constraints & measurements 约束和测量
  - Grid snapping 网格吸附

- **Function Plotting 函数绘图**

  - Smooth curve rendering 平滑曲线渲染
  - Derivatives & integrals 导数和积分
  - Discontinuity handling 不连续点处理
  - Asymptotes & intersections 渐近线和交点

- **Rich Interactions 丰富的交互**

  - Mouse & touch events 鼠标和触摸事件
  - Tooltips & annotations 工具提示和标注
  - Animations & effects 动画和特效
  - Teaching mode 教学模式

- **Customization 定制功能**
  - Theming support 主题支持
  - Style configuration 样式配置
  - Custom shapes 自定义图形
  - Event handling 事件处理

## Quick Start 快速开始

```typescript
import { field, coordinate, func } from "idea-js";

// Create canvas 创建画布
const canvas = field(800, 600);

// Create coordinate system 创建坐标系
const coord = coordinate(800, 600).origin(400, 300).grid(50).unit(50);

// Plot function 绘制函数
const f = func((x) => Math.sin(x), [-2 * Math.PI, 2 * Math.PI])
  .stroke("blue")
  .animate(1000);

// Add to canvas 添加到画布
canvas.add(coord);
coord.add(f);
```

## Documentation 文档

- [Tutorials 教程](docs/tutorials/README.md)
- [API Reference API 参考](docs/api/README.md)
- [Examples 示例](docs/examples/README.md)
- [Contributing 贡献指南](CONTRIBUTING.md)

## Features in Detail 功能详情

### Geometry 几何

- Points, lines, circles, arcs 点、线、圆、圆弧
- Polygons & curves 多边形和曲线
- Vectors & angles 向量和角度
- Measurements & labels 测量和标签

### Functions 函数

- Basic plotting 基本绘图
- Multiple functions 多函数
- Analysis tools 分析工具
- Animation support 动画支持

### Interactivity 交互性

- Drag & drop 拖放
- Click & hover 点击和悬停
- Pan & zoom 平移和缩放
- Touch support 触摸支持

### Teaching 教学

- Step-by-step demos 逐步演示
- Annotations 标注
- Voice guidance 语音引导
- Exercise mode 练习模式

## 当前可用

### line

- setUnit
- info
- from
- to
- stroke
- fill
- style
- transform
- animation
- annotate
- draggable

### vector

- setUnit
- info
- from
- to
- stroke
- fill
- style
- transform
- animation
- effect
- annotate
- draggable

### polygon

- setUnit
- info
- points
- setPoints
- setPoint
- insertBefore
- insertAfter
- removePoint
- stroke
- fill
- style
- animation
- transform
- draggable

### arc

- setUnit
- info
- from
- to
- stroke
- fill
- transform
- animation
- draggable

## License 许可

MIT © [BugDuck Team](https://github.com/bug-duck)

ALL RIGHT RESERVED
