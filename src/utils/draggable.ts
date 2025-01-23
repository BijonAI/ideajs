/**
 * @file draggable.ts
 * @description 提供使SVG元素可拖拽的功能
 */

/**
 * 使SVG元素可拖拽
 * @param node 要使其可拖拽的SVG元素
 * @param condition 可选的拖拽条件函数，接收当前x和y坐标，返回是否允许拖拽
 * @param callback 可选的拖拽回调函数，在拖拽过程中会被调用，接收当前x和y坐标
 * @returns 包含destroy方法的对象，用于清理事件监听器
 */
export function draggable(node: SVGElement, condition?: (x: number, y: number) => boolean, callback?: (x: number, y: number) => void) {
  // 记录拖拽相关的坐标
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  /**
   * 处理鼠标按下事件
   * @param event 鼠标事件对象
   */
  function handleMouseDown(event: MouseEvent) {
    x = event.clientX;
    y = event.clientY;
    startX = currentX;
    startY = currentY;

    // 添加鼠标移动和抬起事件监听器
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * 处理鼠标移动事件
   * @param event 鼠标事件对象
   */
  function handleMouseMove(event: MouseEvent) {
    // 计算鼠标移动的距离
    const dx = event.clientX - x;
    const dy = event.clientY - y;

    // 更新元素当前位置
    currentX = startX + dx;
    currentY = startY + dy;

    // 如果设置了条件函数且不满足条件，则停止拖拽
    if (condition && !condition(currentX, currentY)) {
      handleMouseUp();
      return;
    };

    // 更新元素位置并触发回调
    node.setAttribute('transform', `translate(${currentX}, ${currentY})`);
    callback?.(currentX, currentY);
  }

  /**
   * 处理鼠标抬起事件
   * 移除事件监听器，结束拖拽
   */
  function handleMouseUp() {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  // 添加鼠标按下事件监听器
  node.addEventListener('mousedown', handleMouseDown);

  // 返回清理函数
  return {
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    }
  };
}