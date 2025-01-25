import * as idea from '../src'

// 创建画布
const canvas = idea.field(1000, 800)
document.body.appendChild(canvas.node())

// 创建坐标系
const coord = idea.coordinate(1000, 800)
    .origin(500, 400)
    .unit(50)
    .grid(50)
    .ticks(50)
    .labels(50)
    .draggable()

// 创建一个简单的动画
function createAnimation() {
    // 创建三条线段，形成一个三角形
    const line1 = idea.line(0, 0, 100, 0)
        .stroke("#FF0000")

    const line2 = idea.line(100, 0, 50, 86.6)
        .stroke("#00FF00")

    const line3 = idea.line(50, 86.6, 0, 0)
        .stroke("#0000FF")

    coord.add(line1)
    coord.add(line2)
    coord.add(line3)
    canvas.add(coord)

    // 创建动画序列
    function animate() {
        // 第一阶段：三角形变形
        const redEndX = 50 + 100 * Math.cos(Math.PI / 3);
        const redEndY = 100 * Math.sin(Math.PI / 3);

        line1.animation({
            duration: 3000,
            properties: {
                x2: { to: redEndX },
                y2: { to: redEndY }
            },
            easing: 'power2.inOut'
        });

        line2.animation({
            duration: 3000,
            properties: {
                x1: { to: redEndX },
                y1: { to: redEndY },
                x2: { to: 50 },
                y2: { to: -86.6 }
            },
            easing: 'power2.inOut'
        });

        line3.animation({
            duration: 3000,
            properties: {
                x1: { to: 50 },
                y1: { to: -86.6 },
                x2: { to: 0 },
                y2: { to: 0 }
            },
            easing: 'power2.inOut'
        });

        // 第二阶段：返回原始位置
        setTimeout(() => {
            line1.animation({
                duration: 3000,
                properties: {
                    x2: { to: 100 },
                    y2: { to: 0 }
                },
                easing: 'power2.inOut'
            });

            line2.animation({
                duration: 3000,
                properties: {
                    x1: { to: 100 },
                    y1: { to: 0 },
                    x2: { to: 50 },
                    y2: { to: 86.6 }
                },
                easing: 'power2.inOut'
            });

            line3.animation({
                duration: 3000,
                properties: {
                    x1: { to: 50 },
                    y1: { to: 86.6 },
                    x2: { to: 0 },
                    y2: { to: 0 }
                },
                easing: 'power2.inOut'
            });

            setTimeout(animate, 3500);
        }, 3500);
    }

    animate();
}

// 运行动画
createAnimation();