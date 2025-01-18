// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// RAF 优化函数
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | undefined;
  
  return function(...args: Parameters<T>) {
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = undefined;
    });
  };
}

// 批量操作优化
export class BatchOperation {
  private operations: Set<() => void> = new Set();
  private rafId: number | undefined;

  add(operation: () => void): void {
    this.operations.add(operation);
    this.schedule();
  }

  private schedule(): void {
    if (this.rafId) return;
    
    this.rafId = requestAnimationFrame(() => {
      this.operations.forEach(operation => operation());
      this.operations.clear();
      this.rafId = undefined;
    });
  }

  clear(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    this.operations.clear();
  }
}

// 对象池
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn?: (item: T) => void;
  private maxSize: number;

  constructor(createFn: () => T, options: { maxSize?: number; resetFn?: (item: T) => void } = {}) {
    this.createFn = createFn;
    this.maxSize = options.maxSize || 100;
    this.resetFn = options.resetFn;
  }

  acquire(): T {
    return this.pool.pop() || this.createFn();
  }

  release(item: T): void {
    if (this.pool.length >= this.maxSize) return;
    
    if (this.resetFn) {
      this.resetFn(item);
    }
    this.pool.push(item);
  }

  clear(): void {
    this.pool = [];
  }
}

// LRU 缓存
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// 事件管理器
export class EventManager {
  private handlers: Map<string, Set<(...args: any[]) => void>> = new Map();

  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  clear(): void {
    this.handlers.clear();
  }
} 