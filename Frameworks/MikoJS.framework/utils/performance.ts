// Performance utilities and monitoring
export function measure<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
  return result;
}

export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
  return result;
}

export class PerformanceMonitor {
  private marks = new Map<string, number>();
  private measures = new Map<string, number[]>();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark?: string): number {
    const end = performance.now();
    const start = startMark ? this.marks.get(startMark) || 0 : 0;
    const duration = end - start;
    
    if (!this.measures.has(name)) {
      this.measures.set(name, []);
    }
    this.measures.get(name)!.push(duration);
    
    return duration;
  }

  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const measurements = this.measures.get(name);
    if (!measurements || measurements.length === 0) return null;
    
    const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    
    return { avg, min, max, count: measurements.length };
  }

  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

// Memory usage monitoring
export function getMemoryUsage(): MemoryInfo | null {
  return (performance as any).memory || null;
}

export function logMemoryUsage(label = 'Memory Usage'): void {
  const memory = getMemoryUsage();
  if (memory) {
    console.log(`${label}:`, {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
    });
  }
}

// FPS monitoring
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime = 0;
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop(): void {
    this.running = false;
  }

  private tick = (): void => {
    if (!this.running) return;
    
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    const fps = 1000 / delta;
    this.frames.push(fps);
    
    // Keep only last 60 frames
    if (this.frames.length > 60) {
      this.frames.shift();
    }
    
    requestAnimationFrame(this.tick);
  };

  getFPS(): number {
    if (this.frames.length === 0) return 0;
    return this.frames.reduce((sum, fps) => sum + fps, 0) / this.frames.length;
  }

  getMinFPS(): number {
    return this.frames.length > 0 ? Math.min(...this.frames) : 0;
  }

  getMaxFPS(): number {
    return this.frames.length > 0 ? Math.max(...this.frames) : 0;
  }
}

// Lazy loading utilities
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
}

export function lazyLoad(
  element: HTMLElement,
  loadFn: () => void | Promise<void>,
  options?: IntersectionObserverInit
): () => void {
  const observer = createIntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.unobserve(element);
        await loadFn();
      }
    }
  }, options);
  
  observer.observe(element);
  
  return () => observer.unobserve(element);
}