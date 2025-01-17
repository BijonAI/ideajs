export function left() {
  return Symbol('left');
}

export function right() {
  return Symbol('right');
}

export function up() {
  return Symbol('up');
}

export function down() {
  return Symbol('down');
}

export type Direction = ReturnType<typeof left> | ReturnType<typeof right> | ReturnType<typeof up> | ReturnType<typeof down>;
