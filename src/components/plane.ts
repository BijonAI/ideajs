import { Base, BaseOptions } from "@/base"
import { Appendable } from "@/types/common"

export type NumbericTrend = (count: number) => number
export type StringTrend = (count: number) => string

export interface PlaneOptions extends BaseOptions {
  tick?: number | NumbericTrend
  tickLabel?: StringTrend
  grid?: number | NumbericTrend
  xLabel?: string
  yLabel?: string
}

export class Plane extends Base implements Appendable {
  private tick: number | NumbericTrend = 50
  private tickLabel: StringTrend = (count) => count.toString()
  private grid: number | NumbericTrend = 50
  private xLabel: string = 'x'
  private yLabel: string = 'y'

  constructor(options: PlaneOptions) {
    super(options)
    options.tick && (this.tick = options.tick)
    options.tickLabel && (this.tickLabel = options.tickLabel)
    options.grid && (this.grid = options.grid)
    options.xLabel && (this.xLabel = options.xLabel)
    options.yLabel && (this.yLabel = options.yLabel)
  }
}
