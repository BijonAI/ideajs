import * as idea from '../src'

const canvas = idea.field(1600, 900)
document.body.appendChild(canvas.node())

const coord = idea.coordinate(300, 200)
  .ticks(50)
  .labels(50, 10)
  .grid(10)
  .snap(true)

coord.add(idea.func(x => Math.sin(x), [-2 * Math.PI, 2 * Math.PI]).integral())

const group = idea.group(200, 200)
group.add(coord)

canvas.add(group)
const p = idea.dot(400, 400)
canvas.add(p)