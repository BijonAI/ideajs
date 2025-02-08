import * as idea from "../src";

// 创建画布
const canvas = idea.field(1000, 800);
document.body.appendChild(canvas.node());

// 创建坐标系
const coord = idea.plane().grid().axes().ticks(50);
canvas.add(coord);

function createMathArt() {
  const butterfly = idea.parametric(
    (t) => [
      Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5)),
      Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5))
    ],
    [-Math.PI, Math.PI]
  ).setUnit(50).draggable();

  const dots: ReturnType<typeof idea.dot>[] = [];
  const numDots = 8;
  for(let i = 0; i < numDots; i++) {
    const angle = (2 * Math.PI * i) / numDots;
    const dot = idea.dot(
      3 * Math.cos(angle),
      3 * Math.sin(angle)
    ).fill("#4169E1").resize(4).setUnit(50).draggable();
    dots.push(dot);
  }

  const vectors: ReturnType<typeof idea.vector>[] = [];
  for(let i = 0; i < numDots; i++) {
    const vector = idea.vector(0, 0, 3, 0)
      .stroke("#7B68EE")
      .setUnit(50).draggable();
    vectors.push(vector);
  }

  const polygon = idea.polygon([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 2, y: 3.464 }
  ]).fill("#FF69B4").setUnit(50).draggable().style({ opacity: 0.5 });

  coord.add(butterfly);
  dots.forEach(dot => coord.add(dot));
  vectors.forEach(vector => coord.add(vector));
  coord.add(polygon);

  function animate() {
    // 1. 蝴蝶曲线动画
    butterfly.animation({
      duration: 8000,
      properties: {
        opacity: { from: 0.3, to: 1 }
      },
      easing: "power2.inOut"
    });

    dots.forEach((dot, i) => {
      const baseDelay = i * 200;
      dot.animation({
        duration: 4000,
        delay: baseDelay,
        properties: {
          x1: { 
            from: 3 * Math.cos(2 * Math.PI * i / numDots),
            to: 3 * Math.cos(2 * Math.PI * (i + 1) / numDots)
          },
          y1: {
            from: 3 * Math.sin(2 * Math.PI * i / numDots),
            to: 3 * Math.sin(2 * Math.PI * (i + 1) / numDots)
          }
        },
        easing: "power1.inOut"
      });
    });

    vectors.forEach((vector, i) => {
      const baseDelay = i * 300;
      vector.animation({
        duration: 3000,
        delay: baseDelay,
        properties: {
          x1: { from: 0, to: 2 * Math.cos(2 * Math.PI * i / numDots) },
          y1: { from: 0, to: 2 * Math.sin(2 * Math.PI * i / numDots) },
          x2: { from: 3, to: 3 * Math.cos(2 * Math.PI * (i + 0.5) / numDots) },
          y2: { from: 0, to: 3 * Math.sin(2 * Math.PI * (i + 0.5) / numDots) }
        },
        easing: "power2.inOut"
      });
    });

    polygon.animation({
      duration: 5000,
      properties: {
        x1: { from: 0, to: -4 },
        y1: { from: 0, to: 0 },
        x2: { from: 4, to: 4 },
        y2: { from: 0, to: 0 },
        x3: { from: 2, to: 0 },
        y3: { from: 3.464, to: 4 }
      },
      easing: "power3.inOut"
    });
  }

  // 启动动画
  animate();
}

// 运行动画
createMathArt();
