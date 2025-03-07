/**
 * @file draggable.ts
 * @description 提供使SVG元素可拖拽的功能，支持鼠标和触摸事件
 */

/**
 * 使SVG元素可拖拽
 * @param node 要使其可拖拽的SVG元素
 * @param condition 可选的拖拽条件函数，接收当前x和y坐标，返回是否允许拖拽
 * @param callback 可选的拖拽回调函数，在拖拽过程中会被调用，接收当前x和y坐标
 * @returns 包含destroy方法的对象，用于清理事件监听器
 */
export function draggable(
  node: SVGElement,
  condition?: (x: number, y: number) => boolean,
  callback?: (x: number, y: number) => void,
) {
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  /**
   * 处理拖拽开始事件（鼠标/触摸）
   */
  function handleStart(event: MouseEvent | TouchEvent) {
    // 阻止默认行为，防止触摸时页面滚动
    event.preventDefault();
    
    if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
    }

    startX = currentX;
    startY = currentY;
    document.body.style.userSelect = "none";
  }

  /**
   * 处理移动事件（鼠标/触摸）
   */
  function handleMove(event: MouseEvent | TouchEvent) {
    // 阻止默认行为，防止触摸时页面滚动
    event.preventDefault();
    
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      return;
    }

    const dx = clientX - x;
    const dy = clientY - y;

    currentX = startX + dx;
    currentY = startY + dy;

    if (condition && !condition(currentX, currentY)) {
      handleEnd();
      return;
    }

    node.setAttribute("transform", `translate(${currentX}, ${currentY})`);
    callback?.(currentX, currentY);
  }

  /**
   * 处理拖拽结束事件（鼠标/触摸）
   */
  function handleEnd() {
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("touchend", handleEnd);
    document.body.style.userSelect = "auto";
  }

  // 绑定事件监听器，设置 passive: false 以允许阻止默认行为
  node.addEventListener("mousedown", handleStart);
  node.addEventListener("touchstart", handleStart, { passive: false });

  return {
    destroy() {
      node.removeEventListener("mousedown", handleStart);
      node.removeEventListener("touchstart", handleStart);
      handleEnd();
    },
  };
}
