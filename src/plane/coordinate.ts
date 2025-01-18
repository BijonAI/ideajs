import { COORDINATE, SVG } from '../config/constants';
import { 
  createSVGElement, 
  createGroup, 
  createLine, 
  createText, 
  createPolygon,
  setAttributes,
  clearElement,
  createFragment
} from '../utils/svg';
import { BatchOperation } from '../utils/performance';

export interface CoordinateOptions {
  unit?: number;
  gridInterval?: number;
  tickLength?: number;
  labelOffset?: number;
  font?: string;
}

export function coordinate(width: number, height: number, options: CoordinateOptions = {}) {
  // 创建基本容器
  const containers = {
    group: createGroup(),
    grid: createGroup(),
    axes: createGroup(),
    labels: createGroup(),
    content: createGroup()
  };

  // 组装容器
  Object.values(containers).slice(1).forEach(container => {
    containers.group.appendChild(container);
  });

  // 性能优化工具
  const batchOp = new BatchOperation();

  // 配置项
  const config = {
    unit: options.unit || COORDINATE.DEFAULT_UNIT,
    gridInterval: options.gridInterval || COORDINATE.DEFAULT_GRID_INTERVAL,
    tickLength: options.tickLength || COORDINATE.DEFAULT_TICK_LENGTH,
    labelOffset: options.labelOffset || COORDINATE.DEFAULT_LABEL_OFFSET,
    font: options.font || SVG.DEFAULT_FONT
  };

  // 内部状态
  let currentUnit = config.unit;
  let currentGridInterval = config.gridInterval;
  let currentScale = 1;

  // 创建坐标轴
  const axes = {
    x: {
      line: createLine(-width / 2, 0, width / 2, 0, {
        stroke: 'black',
        'stroke-width': '1'
      }),
      arrow: createPolygon(COORDINATE.ARROW.X.points, {
        transform: `translate(${width / 2 - 10}, 0)`,
        fill: 'black'
      })
    },
    y: {
      line: createLine(0, -height / 2, 0, height / 2, {
        stroke: 'black',
        'stroke-width': '1'
      }),
      arrow: createPolygon(COORDINATE.ARROW.Y.points, {
        transform: `translate(0, ${-height / 2 + 10})`,
        fill: 'black'
      })
    }
  };

  // 添加坐标轴到容器
  Object.values(axes).forEach(axis => {
    containers.axes.appendChild(axis.line);
    containers.axes.appendChild(axis.arrow);
  });

  // 设置初始变换
  setAttributes(containers.group, {
    transform: `scale(${currentScale})`
  });

  // 更新变换
  function updateTransform() {
    const transform = `scale(${currentScale})`;
    setAttributes(containers.group, { transform });
  }

  const api = {
    node: () => containers.group,

    origin: (x: number, y: number) => {
      const transform = `scale(${currentScale})`;
      setAttributes(containers.group, { transform });
      return api;
    },

    unit: (value: number) => {
      if (value <= 0) return api;
      
      currentUnit = value;
      currentScale = value / config.unit;
      currentGridInterval = value;
      
      batchOp.add(() => {
        updateTransform();
        api.grid(currentGridInterval);
        api.ticks(currentGridInterval);
        api.labels(currentGridInterval);
      });

      return api;
    },

    grid: (interval: number) => {
      if (interval <= 0) return api;
      
      currentGridInterval = interval;
      batchOp.add(() => {
        clearElement(containers.grid);
        const fragment = createFragment();
        const counts = {
          vertical: Math.ceil(width / 2 / interval),
          horizontal: Math.ceil(height / 2 / interval)
        };

        // 创建网格线
        for (let i = -counts.vertical; i <= counts.vertical; i++) {
          if (i === 0) continue;
          fragment.appendChild(
            createLine(i * interval, -height / 2, i * interval, height / 2, {
              stroke: '#e0e0e0',
              'stroke-width': '0.5'
            })
          );
        }

        for (let i = -counts.horizontal; i <= counts.horizontal; i++) {
          if (i === 0) continue;
          fragment.appendChild(
            createLine(-width / 2, i * interval, width / 2, i * interval, {
              stroke: '#e0e0e0',
              'stroke-width': '0.5'
            })
          );
        }

        containers.grid.appendChild(fragment);
      });
      return api;
    },

    ticks: (interval: number, length: number = config.tickLength) => {
      if (interval <= 0) return api;
      
      batchOp.add(() => {
        const fragment = createFragment();
        const counts = {
          vertical: Math.ceil(width / 2 / interval),
          horizontal: Math.ceil(height / 2 / interval)
        };

        // 创建刻度
        for (let i = -counts.vertical; i <= counts.vertical; i++) {
          if (i === 0) continue;
          fragment.appendChild(
            createLine(i * interval, -length / 2, i * interval, length / 2, {
              stroke: 'black',
              'stroke-width': '1'
            })
          );
        }

        for (let i = -counts.horizontal; i <= counts.horizontal; i++) {
          if (i === 0) continue;
          fragment.appendChild(
            createLine(-length / 2, i * interval, length / 2, i * interval, {
              stroke: 'black',
              'stroke-width': '1'
            })
          );
        }

        containers.axes.appendChild(fragment);
      });
      return api;
    },

    labels: (interval: number, step: number = 1) => {
      if (interval <= 0) return api;
      
      batchOp.add(() => {
        clearElement(containers.labels);
        const fragment = createFragment();
        const counts = {
          vertical: Math.ceil(width / 2 / interval),
          horizontal: Math.ceil(height / 2 / interval)
        };

        // 创建标签
        for (let i = -counts.vertical; i <= counts.vertical; i++) {
          if (i === 0) continue;
          fragment.appendChild(
            createText((i * step).toString(), {
              x: i * interval,
              y: config.labelOffset,
              'text-anchor': 'middle',
              'font-family': config.font,
              'font-size': '12px',
              fill: 'black'
            })
          );
        }

        for (let i = -counts.horizontal; i <= counts.horizontal; i++) {
          if (i === 0) continue;
          fragment.appendChild(
            createText((-i * step).toString(), {
              x: -config.labelOffset,
              y: i * interval,
              'text-anchor': 'end',
              'dominant-baseline': 'middle',
              'font-family': config.font,
              'font-size': '12px',
              fill: 'black'
            })
          );
        }

        containers.labels.appendChild(fragment);
      });
      return api;
    },

    axisStyle: (options: { color?: string; width?: number; opacity?: number }) => {
      batchOp.add(() => {
        const { color, width: lineWidth, opacity } = options;
        
        if (color) {
          [axes.x.line, axes.y.line].forEach(line => 
            setAttributes(line, { stroke: color })
          );
          [axes.x.arrow, axes.y.arrow].forEach(arrow => 
            setAttributes(arrow, { fill: color })
          );
        }
        
        if (lineWidth) {
          [axes.x.line, axes.y.line].forEach(line => 
            setAttributes(line, { 'stroke-width': lineWidth })
          );
        }
        
        if (opacity) {
          setAttributes(containers.axes, { opacity });
        }
      });
      return api;
    },

    gridStyle: (options: { color?: string; width?: number; opacity?: number }) => {
      batchOp.add(() => {
        const { color, width: lineWidth, opacity } = options;
        const lines = containers.grid.getElementsByTagName('line');
        
        Array.from(lines).forEach(line => {
          if (color) setAttributes(line, { stroke: color });
          if (lineWidth) setAttributes(line, { 'stroke-width': lineWidth });
          if (opacity) setAttributes(line, { opacity });
        });
      });
      return api;
    },

    add: (element: { node: () => SVGElement }) => {
      batchOp.add(() => {
        containers.content.appendChild(element.node());
      });
      return api;
    },

    dispose: () => {
      batchOp.clear();
      Object.values(containers).forEach(container => {
        container.parentNode?.removeChild(container);
      });
    }
  };

  return api;
}