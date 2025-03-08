import { Appendable, Renderable } from "./types/common"
import { set } from "./utils/set"

export interface FieldOptions {
  width: number
  height: number
  origin?: [number, number]
  xDirection?: 'left' | 'right'
  yDirection?: 'top' | 'bottom'
}

export class Field implements Renderable, Appendable {
  private width: number
  private height: number
  private _origin: [number, number] = [0, 0]
  container: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  root: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  private xDirection: 'left' | 'right' = 'right'
  private yDirection: 'top' | 'bottom' = 'top'
  private children: Renderable[] = []

  constructor(options: FieldOptions) {
    this.width = options.width
    this.height = options.height
    if (options.origin) {
      this.origin(...options.origin)
    }
    this.direct(options.xDirection, options.yDirection)
    this.origin(this.width / 2, this.height / 2)
    this.container.appendChild(this.root)
    set(this.root, 'transform', `translate(${this._origin[0]}, ${this._origin[1]}) scale(${this.xDirection === 'left' ? -1 : 1}, ${this.yDirection === 'top' ? -1 : 1})`)
  }

  getSize() {
    return {
      width: this.width,
      height: this.height,
    }
  }

  getOrigin() {
    return this._origin
  }

  origin(x: number, y: number) {
    this._origin = [x, y]
  }

  size(width: number, height: number) {
    this.width = width
    this.height = height
  }

  direct(x: 'left' | 'right' = 'right', y: 'top' | 'bottom' = 'top') {
    this.xDirection = x
    this.yDirection = y
  }

  node() {
    return this.container
  }

  append(renderable: Renderable) {
    this.children.push(renderable)
  }
}
