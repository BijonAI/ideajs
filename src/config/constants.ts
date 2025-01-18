// SVG 相关常量
export const SVG = {
  NAMESPACE: "http://www.w3.org/2000/svg",
  DEFAULT_FONT: "Comic Sans MS",
  DEFAULT_STROKE_WIDTH: 2,
  DEFAULT_OPACITY: 1,
} as const;

// 坐标系相关常量
export const COORDINATE = {
  DEFAULT_UNIT: 50,
  DEFAULT_GRID_INTERVAL: 50,
  DEFAULT_TICK_LENGTH: 6,
  DEFAULT_LABEL_OFFSET: 20,
  ARROW: {
    X: { points: "0,-5 10,0 0,5" },
    Y: { points: "-5,0 0,-10 5,0" }
  }
} as const;

// 函数图像相关常量
export const FUNCTION = {
  DEFAULT_SAMPLES: 200,
  DEFAULT_ANIMATION_DURATION: 1000,
  DISCONTINUITY_OFFSET: 0.0001,
  DERIVATIVE_STEP: 0.0001,
  INTEGRAL_STEP: 0.001,
  INTERSECTION_THRESHOLD: 0.01
} as const;

// 动画相关常量
export const ANIMATION = {
  DEFAULT_DURATION: 1000,
  DEFAULT_EASING: "power1.inOut",
  FRAME_RATE: 60,
  FRAME_DURATION: 1000 / 60
} as const;

// 性能相关常量
export const PERFORMANCE = {
  DEBOUNCE_WAIT: 100,
  THROTTLE_LIMIT: 100,
  BATCH_SIZE: 100,
  POOL_SIZE: 100,
  CACHE_SIZE: 100
} as const;

// 主题相关常量
export const THEME = {
  LIGHT: {
    COLORS: {
      BACKGROUND: "#ffffff",
      PRIMARY: "#1976d2",
      SECONDARY: "#dc004e",
      TEXT: "#000000",
      GRID: "#e0e0e0",
      AXIS: "#000000",
      FUNCTION: {
        STROKE: "#1976d2",
        DERIVATIVE: "#2196f3",
        INTEGRAL: "#4caf50"
      }
    },
    OPACITY: {
      GRID: 0.5,
      FUNCTION: 1
    },
    SIZES: {
      AXIS: 2,
      GRID: 1,
      FUNCTION: 2
    }
  },
  DARK: {
    COLORS: {
      BACKGROUND: "#121212",
      PRIMARY: "#90caf9",
      SECONDARY: "#f48fb1",
      TEXT: "#ffffff",
      GRID: "#424242",
      AXIS: "#ffffff",
      FUNCTION: {
        STROKE: "#90caf9",
        DERIVATIVE: "#64b5f6",
        INTEGRAL: "#81c784"
      }
    },
    OPACITY: {
      GRID: 0.3,
      FUNCTION: 0.8
    },
    SIZES: {
      AXIS: 2,
      GRID: 1,
      FUNCTION: 2
    }
  }
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  INVALID_ARGUMENT: "Invalid argument provided",
  ELEMENT_NOT_FOUND: "Element not found",
  INITIALIZATION_FAILED: "Failed to initialize component",
  OPERATION_FAILED: "Operation failed",
  INVALID_STATE: "Invalid state",
  NOT_IMPLEMENTED: "Method not implemented"
} as const; 