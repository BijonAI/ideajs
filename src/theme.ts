export type ThemeColors = {
  background: string;
  primary: string;
  secondary: string;
  text: string;
  grid: string;
  axis: string;
  function: {
    stroke: string;
    derivative: string;
    integral: string;
  };
  marker: {
    fill: string;
    stroke: string;
  };
};

export type Theme = {
  colors: ThemeColors;
  opacity: {
    grid: number;
    function: number;
  };
  sizes: {
    axis: number;
    grid: number;
    function: number;
  };
};

const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    primary: '#1976d2',
    secondary: '#dc004e',
    text: '#000000',
    grid: '#e0e0e0',
    axis: '#000000',
    function: {
      stroke: '#1976d2',
      derivative: '#2196f3',
      integral: '#4caf50'
    },
    marker: {
      fill: '#ffffff',
      stroke: '#000000'
    }
  },
  opacity: {
    grid: 0.5,
    function: 1
  },
  sizes: {
    axis: 2,
    grid: 1,
    function: 2
  }
};

const darkTheme: Theme = {
  colors: {
    background: '#121212',
    primary: '#90caf9',
    secondary: '#f48fb1',
    text: '#ffffff',
    grid: '#424242',
    axis: '#ffffff',
    function: {
      stroke: '#90caf9',
      derivative: '#64b5f6',
      integral: '#81c784'
    },
    marker: {
      fill: '#424242',
      stroke: '#ffffff'
    }
  },
  opacity: {
    grid: 0.3,
    function: 0.8
  },
  sizes: {
    axis: 2,
    grid: 1,
    function: 2
  }
};

export const themes = {
  light: lightTheme,
  dark: darkTheme
};

let currentTheme: Theme = lightTheme;

export function setTheme(theme: 'light' | 'dark') {
  currentTheme = themes[theme];
}

export function getTheme(): Theme {
  return currentTheme;
} 