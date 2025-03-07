/**
 * @file theme.ts
 * @description 定义主题相关的类型和功能，提供明暗两种主题的颜色方案
 */

/**
 * 主题颜色配置接口
 */
export type ThemeColors = {
  /** 背景颜色 */
  background: string;
  /** 主要颜色 */
  primary: string;
  /** 次要颜色 */
  secondary: string;
  /** 文本颜色 */
  text: string;
  /** 网格颜色 */
  grid: string;
  /** 坐标轴颜色 */
  axis: string;
  /** 函数图像相关颜色 */
  function: {
    /** 函数曲线颜色 */
    stroke: string;
    /** 导数曲线颜色 */
    derivative: string;
    /** 积分区域颜色 */
    integral: string;
  };
  /** 标记点相关颜色 */
  marker: {
    /** 填充颜色 */
    fill: string;
    /** 边框颜色 */
    stroke: string;
  };
};

/**
 * 主题配置接口
 */
export type Theme = {
  /** 颜色配置 */
  colors: ThemeColors;
  /** 不透明度配置 */
  opacity: {
    /** 网格不透明度 */
    grid: number;
    /** 函数图像不透明度 */
    function: number;
  };
  /** 尺寸配置 */
  sizes: {
    /** 坐标轴宽度 */
    axis: number;
    /** 网格线宽度 */
    grid: number;
    /** 函数曲线宽度 */
    function: number;
  };
};

/**
 * 亮色主题配置
 */
const lightTheme: Theme = {
  colors: {
    background: "#ffffff",
    primary: "#1976d2",
    secondary: "#dc004e",
    text: "#000000",
    grid: "#e0e0e0",
    axis: "#000000",
    function: {
      stroke: "#1976d2",
      derivative: "#2196f3",
      integral: "#4caf50",
    },
    marker: {
      fill: "#ffffff",
      stroke: "#000000",
    },
  },
  opacity: {
    grid: 0.5,
    function: 1,
  },
  sizes: {
    axis: 2,
    grid: 1,
    function: 2,
  },
};

/**
 * 暗色主题配置
 */
const darkTheme: Theme = {
  colors: {
    background: "#121212",
    primary: "#90caf9",
    secondary: "#f48fb1",
    text: "#ffffff",
    grid: "#424242",
    axis: "#ffffff",
    function: {
      stroke: "#90caf9",
      derivative: "#64b5f6",
      integral: "#81c784",
    },
    marker: {
      fill: "#424242",
      stroke: "#ffffff",
    },
  },
  opacity: {
    grid: 0.3,
    function: 0.8,
  },
  sizes: {
    axis: 2,
    grid: 1,
    function: 2,
  },
};

/**
 * 可用的主题配置
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

/**
 * 当前使用的主题配置
 */
let currentTheme: Theme = lightTheme;

/**
 * 设置当前主题
 * @param theme 主题名称（'light' | 'dark'）
 */
export function setTheme(theme: "light" | "dark") {
  currentTheme = themes[theme];
}

/**
 * 获取当前主题配置
 * @returns 当前主题配置对象
 */
export function getTheme(): Theme {
  return currentTheme;
}
