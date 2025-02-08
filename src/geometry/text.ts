/**
 * @file text.ts
 * @description 文本对象的实现，提供创建和操作SVG文本的功能，支持LaTeX语法转换和样式设置
 */

import { TextStyle } from "@/interfaces/geometry";

import { draggable } from "../utils/draggable";
import katex from "katex";

/**
 * 创建一个文本对象
 * @param x 文本的x坐标
 * @param y 文本的y坐标
 * @param width 文本的宽度
 * @param height 文本的高度
 * @param content 文本内容，支持LaTeX语法
 * @param isLatex 是否使用LaTeX渲染，默认为false
 * @returns 文本对象，包含多种操作方法
 */
export function text(x: number, y: number, width: number, height: number, content: string, isLatex: boolean = false) {
  const container = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  container.setAttribute("x", x.toString());
  container.setAttribute("y", (-y).toString());
  container.setAttribute("width", width.toString());
  container.setAttribute("height", height.toString());
  
  const div = document.createElement("div");
  div.style.width = "100%";
  div.style.height = "100%;";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.backgroundColor = "#ffffff";
  div.style.padding = "8px";
  div.style.boxSizing = "border-box";
  div.style.overflow = "hidden";
  
  container.appendChild(div);
  
  container.dataset.x = x.toString();
  container.dataset.y = y.toString();
  container.dataset.content = content;
  container.dataset.isLatex = isLatex.toString();

  function renderContent() {
    // div.
    div.innerHTML = '';
    if (isLatex) {
      try {
        katex.render(content, div, {
          throwOnError: true,
          displayMode: false,
          strict: false,
          trust: true,
          fleqn: true,
          output: "mathml"
        });
      } catch (error) {
        console.error("LaTeX Error:", error);
        try {
        } catch (e) {
          div.innerHTML = `<span style="color: red;">LaTeX Error: ${content}</span>`;
        }
      }
    } else {
      div.textContent = content;
    }
  }

  renderContent();

  const dragEvents: ((x: number, y: number) => void)[] = [];
  function onDrag(callback: (x: number, y: number) => void) {
    dragEvents.push(callback);
    return rtn;
  }

  function parsePositionParams() {
    return {
      x: Number(container.getAttribute("x")),
      y: -Number(container.getAttribute("y")),
    };
  }

  let isDraggable = false;

  let startDragX = 0;
  let startDragY = 0;
  let isDragging = false;

  // 返回对象
  const rtn = {
    node: () => container,
    
    setUnit: (unit: number) => {
      const { x, y } = parsePositionParams();
      container.setAttribute("x", (x * unit).toString());
      container.setAttribute("y", (-y * unit).toString());
      return rtn;
    },

    setText: (newContent: string, latex: boolean = isLatex) => {
      content = newContent;
      isLatex = latex;
      renderContent();
      return rtn;
    },

    setPosition: (newX: number, newY: number) => {
      container.setAttribute("x", newX.toString());
      container.setAttribute("y", (-newY).toString());
      return rtn;
    },

    style: (options: TextStyle) => {
      if (options.fontSize) div.style.fontSize = `${options.fontSize}px`;
      if (options.fontFamily) div.style.fontFamily = options.fontFamily;
      if (options.fontWeight) div.style.fontWeight = options.fontWeight.toString();
      if (options.textColor) div.style.color = options.textColor;
      if (options.textOpacity) div.style.opacity = options.textOpacity.toString();
      if (options.backgroundColor) div.style.backgroundColor = options.backgroundColor;
      if (options.backgroundOpacity) div.style.backgroundColor = `${options.backgroundColor}${Math.round(options.backgroundOpacity * 255).toString(16).padStart(2, '0')}`;
      if (options.padding) div.style.padding = `${options.padding}px`;
      if (options.borderRadius) div.style.borderRadius = `${options.borderRadius}px`;
      renderContent();
      return rtn;
    },

    draggable: () => {
      if (!isDraggable) {
        isDraggable = true;
        container.style.cursor = "move";
        
        container.addEventListener("mousedown", (e) => {
          isDragging = true;
          e.preventDefault();
          document.body.style.userSelect = "none";
        });

        draggable(container, (_x, _y) => true, (x: number, y: number) => {
          if (!isDragging) {
            startDragX = x;
            startDragY = y;
            isDragging = true;
          }

          const dx = x - startDragX;
          const dy = y - startDragY;


          const { x: currentX, y: currentY } = parsePositionParams();
          const newX = currentX + dx;
          const newY = currentY - dy;
          // container.setAttribute("x", newX.toString());
          // container.setAttribute("y", (-newY).toString());

          dragEvents.forEach((callback) => callback(newX, newY));
        });

        // 拖动结束时重置状态
        window.addEventListener("mouseup", () => {
          if (isDragging) {
            isDragging = false;
            startDragX = 0;
            startDragY = 0;
            document.body.style.userSelect = "auto";
          }
        });
      }
      
      return rtn;
    },

    onDrag,

    info: () => {
      const { x, y } = parsePositionParams();
      return {
        type: "text",
        x,
        y,
        content,
        isLatex,
      };
    },
  };

  return rtn;
}
