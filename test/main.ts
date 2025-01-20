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
  .scale(50)

const expFunc = idea.func(x => Math.exp(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: '#2196F3',
    width: 2,
    opacity: 1
  })
  .scale(10)

const tanFunc = idea.func(x => Math.tan(x), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: 'red',
    width: 2,
    opacity: 1
  })
  .scale(10)

const circle = idea.parametric((x) => Math.cos(x), (y) => Math.sin(y), [0, 2 * Math.PI])
  .samples(500)
  .style({
    color: 'red',
    width: 2,
    opacity: 1
  })
  .scale(10)

const normalDistribution = idea.func(x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), [-2 * Math.PI, 2 * Math.PI])
  .samples(500)
  .style({
    color: 'blue',
    width: 2,
    opacity: 1
  })
  .scale(10)

coord.add(sinFunc)

const v1 = idea.vector(0, 0, 2, 3).stroke('red')
const v2 = idea.vector(0, 0, 0, 6).stroke('purple')
const v3 = idea.vector(0, 0, 2, 9).stroke('green').animation({
  duration: 1000,
  easing: 'ease-in-out',
  properties: {
    'x2': {
      from: 0,
      to: 2
    }
  }
})
const l1 = idea.line(0, 6, 2, 9).stroke('#2196F3').dash(10, 10)
const l2 = idea.line(2, 3, 2, 9).stroke('#2196F3').dash(10, 10)
coord.add(v1)
coord.add(v2)
coord.add(v3)
coord.add(l1)
coord.add(l2)

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