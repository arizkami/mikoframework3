// Event handling utilities
export type EventHandler<T = Event> = (event: T) => void;

export class EventBus {
  private listeners = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, data?: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  once(event: string, handler: EventHandler): void {
    const onceHandler: EventHandler = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  clear(): void {
    this.listeners.clear();
  }
}

// Global event bus
export const globalEvents = new EventBus();

// DOM event helpers
export function delegate(
  parent: HTMLElement,
  selector: string,
  eventType: string,
  handler: EventHandler
): () => void {
  const delegateHandler = (event: Event) => {
    const target = event.target as HTMLElement;
    const element = target.closest(selector);
    if (element && parent.contains(element)) {
      handler.call(element, event);
    }
  };

  parent.addEventListener(eventType, delegateHandler);
  
  return () => parent.removeEventListener(eventType, delegateHandler);
}