import { Renderable } from "./types/common"
import { set } from "./utils/set"

export interface BaseOptions {
  x?: number
  y?: number
  opacity?: number
  scale?: [number, number] | number
  rotation?: number
  division?: number
}

export class Base implements Renderable {
  private x: number = 0
  private y: number = 0
  private opacity: number = 1
  private scale: [number, number] | number = 1
  private rotation: number = 0
  private division: number = 1
  children: Renderable[] = []
  root: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g')

  constructor(options: BaseOptions) {
    options.x && (this.x = options.x)
    options.y && (this.y = options.y)
    options.opacity && (this.opacity = options.opacity)
    options.scale && (this.scale = options.scale)
    options.rotation && (this.rotation = options.rotation)
    options.division && (this.division = options.division)

    set(this.root, 'transform', `translate(${this.x}, ${this.y}) scale(${this.scale}) rotate(${this.rotation})`)
    set(this.root, 'opacity', `${this.opacity}`)
  }

  node() {
    return this.root
  }

  append(renderable: Renderable) {
    this.children.push(renderable)
  }
}

