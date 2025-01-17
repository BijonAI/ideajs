export function draggable(node: SVGElement, condition?: (x: number, y: number) => boolean, callback?: (x: number, y: number) => void) {
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  function handleMouseDown(event: MouseEvent) {
    x = event.clientX;
    y = event.clientY;
    startX = currentX;
    startY = currentY;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    
    currentX = startX + dx;
    currentY = startY + dy;
    if (condition && !condition(currentX, currentY)) {
      handleMouseUp();
      return;
    };
    node.setAttribute('transform', `translate(${currentX}, ${currentY})`);
    callback?.(currentX, currentY);
  }

  function handleMouseUp() {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  node.addEventListener('mousedown', handleMouseDown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    }
  };
}