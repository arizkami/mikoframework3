// Component system for MikoJS
import type { MikoNode } from './element';

export interface ComponentProps {
  [key: string]: any;
  children?: MikoNode[];
}

export type ComponentFunction<T = ComponentProps> = (props: T) => HTMLElement;

export abstract class Component<T = ComponentProps> {
  protected props: T;
  protected element: HTMLElement | null = null;
  private mounted = false;

  constructor(props: T) {
    this.props = props;
  }

  abstract render(): HTMLElement;

  mount(container: HTMLElement): void {
    if (this.mounted) return;
    
    this.element = this.render();
    container.appendChild(this.element);
    this.mounted = true;
    this.onMount();
  }

  unmount(): void {
    if (!this.mounted || !this.element) return;
    
    this.onUnmount();
    this.element.remove();
    this.element = null;
    this.mounted = false;
  }

  update(newProps: Partial<T>): void {
    this.props = { ...this.props, ...newProps };
    if (this.mounted) {
      this.onUpdate();
    }
  }

  protected onMount(): void {}
  protected onUnmount(): void {}
  protected onUpdate(): void {}

  isMounted(): boolean {
    return this.mounted;
  }
}

// Higher-order component for functional components
export function createComponent<T = ComponentProps>(
  renderFn: ComponentFunction<T>
): (props: T) => Component<T> {
  return (props: T) => {
    return new (class extends Component<T> {
      render(): HTMLElement {
        return renderFn(this.props);
      }
    })(props);
  };
}