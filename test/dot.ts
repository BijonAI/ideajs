import * as  idea from '../src'

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

// 创建点
const dot = idea.dot(0, 0)
.stroke("#FFFF00")
.fill("#FF0000")
.animation({
    duration: 5000,
    delay: 2000,
    easing: "ease-in-out",
    properties: {
        "x1": { from: 0, to: 100 },
        "y1": { from: 0, to: 100 },
        "r": { from: 4, to: 16 },
        "stroke-width": { from: 1, to: 3 },
        "stroke-opacity": { from: 0.5, to: 1 },
        "fill-opacity": { from: 0.3, to: 0.8 },
    },
    onStart: () => console.log("Animation started"),
    onEnd: () => console.log("Animation completed")
})
    .draggable()

// 绘制向量
coord.add(dot)
canvas.add(coord)