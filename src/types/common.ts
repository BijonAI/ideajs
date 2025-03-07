export interface Renderable {
  node: () => SVGElement
}

export interface Appendable {
  append: (renderable: Renderable) => void
}
