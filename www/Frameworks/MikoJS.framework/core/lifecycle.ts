// Component lifecycle management
export interface LifecycleHooks {
  onMount?: () => void;
  onUnmount?: () => void;
  onUpdate?: () => void;
}

export class LifecycleManager {
  private hooks: LifecycleHooks = {};
  private mounted = false;

  setHooks(hooks: LifecycleHooks): void {
    this.hooks = { ...this.hooks, ...hooks };
  }

  mount(): void {
    if (this.mounted) return;
    this.mounted = true;
    this.hooks.onMount?.();
  }

  unmount(): void {
    if (!this.mounted) return;
    this.mounted = false;
    this.hooks.onUnmount?.();
  }

  update(): void {
    if (this.mounted) {
      this.hooks.onUpdate?.();
    }
  }

  isMounted(): boolean {
    return this.mounted;
  }
}

// Effect system similar to React useEffect
export function createEffect(
  effectFn: () => void | (() => void),
  dependencies?: any[]
): () => void {
  let cleanup: (() => void) | void;
  let lastDeps: any[] | undefined;

  const runEffect = () => {
    // Check if dependencies changed
    if (dependencies && lastDeps) {
      const depsChanged = dependencies.some((dep, index) => dep !== lastDeps![index]);
      if (!depsChanged) return;
    }

    // Cleanup previous effect
    if (cleanup) {
      cleanup();
    }

    // Run new effect
    cleanup = effectFn();
    lastDeps = dependencies ? [...dependencies] : undefined;
  };

  // Run effect immediately
  runEffect();

  // Return cleanup function
  return () => {
    if (cleanup) {
      cleanup();
    }
  };
}