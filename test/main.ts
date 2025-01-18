import * as idea from '../src'

const canvas = idea.field(1600, 900)
document.body.appendChild(canvas.node())

const coord = idea.coordinate(1600, 900)
  .ticks(50)
  .labels(50, 10)
  .grid(50)

const sinFunc = idea.func(x => Math.sin(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: '#2196F3',
    width: 2,
    opacity: 1
  })

const expFunc = idea.func(x => Math.exp(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: '#2196F3',
    width: 2,
    opacity: 1
  })
  .scale(50)

const tanFunc = idea.func(x => Math.tan(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: 'red',
    width: 2,
    opacity: 1
  })
  .scale(50)

const circle = idea.parametric((x) => Math.cos(x), (y) => (y / 1000) * Math.sin(y), [0, 1000])
  .samples(500)
  .style({
    color: 'red',
    width: 2,
    opacity: 1
  })
  .scale(500)

const normalDistribution = idea.func(x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: 'blue',
    width: 2,
    opacity: 1
  })
  .scale(50)

// const circle = idea.func((x) => Math.sqrt(10000 - x * x), [-100, 100])

coord.add(sinFunc)

const dot = idea.dot(0, 0)
sinFunc.bind(dot, 2)

sinFunc.morph(expFunc, 1000)
setTimeout(() => {
  sinFunc.morph(tanFunc, 1000)
  setTimeout(() => {
    sinFunc.morph(normalDistribution, 1000)
    setTimeout(() => {
      sinFunc.morph(circle, 1000)
    }, 1000)
  }, 1000)
}, 1000)

const group = idea.group(800, 450)
group.add(coord)

canvas.add(group)
const p = idea.dot(400, 400)
canvas.add(p)