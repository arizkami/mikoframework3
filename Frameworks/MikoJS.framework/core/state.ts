// State management system
export type StateUpdater<T> = (value: T | ((prev: T) => T)) => void;
export type StateGetter<T> = () => T;
export type StateSubscriber = () => void;

export interface State<T> {
  get: StateGetter<T>;
  set: StateUpdater<T>;
  subscribe: (callback: StateSubscriber) => () => void;
}

// Create reactive state
export function createState<T>(initialValue: T): State<T> {
  let value = initialValue;
  const subscribers = new Set<StateSubscriber>();

  const get: StateGetter<T> = () => value;
  
  const set: StateUpdater<T> = (newValue) => {
    const nextValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(value) 
      : newValue;
    
    if (nextValue !== value) {
      value = nextValue;
      subscribers.forEach(callback => callback());
    }
  };

  const subscribe = (callback: StateSubscriber) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  return { get, set, subscribe };
}

// Hook-style state for functional components
export function useState<T>(initialValue: T): [StateGetter<T>, StateUpdater<T>] {
  const state = createState(initialValue);
  return [state.get, state.set];
}

// Computed state that derives from other states
export function createComputed<T>(computeFn: () => T, dependencies: State<any>[]): State<T> {
  const computed = createState(computeFn());
  
  // Subscribe to all dependencies
  dependencies.forEach(dep => {
    dep.subscribe(() => {
      computed.set(computeFn());
    });
  });

  return {
    get: computed.get,
    set: () => {
      throw new Error('Cannot directly set computed state');
    },
    subscribe: computed.subscribe
  };
}

// Global state store
class Store {
  private states = new Map<string, State<any>>();

  createState<T>(key: string, initialValue: T): State<T> {
    if (this.states.has(key)) {
      return this.states.get(key)!;
    }

    const state = createState(initialValue);
    this.states.set(key, state);
    return state;
  }

  getState<T>(key: string): State<T> | undefined {
    return this.states.get(key);
  }

  removeState(key: string): void {
    this.states.delete(key);
  }

  clear(): void {
    this.states.clear();
  }
}

export const globalStore = new Store();