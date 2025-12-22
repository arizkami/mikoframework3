// Element creation and manipulation
export interface MikoProps {
  [key: string]: any;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  children?: MikoNode[];
  ref?: (element: HTMLElement) => void;
}

export type MikoNode = HTMLElement | Text | string | number | boolean | null | undefined;

export class ElementBuilder {
  private element: HTMLElement;
  
  constructor(tag: string, props?: MikoProps) {
    this.element = document.createElement(tag);
    if (props) {
      this.applyProps(props);
    }
  }

  private applyProps(props: MikoProps) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') {
        this.appendChildren(value);
      } else if (key === 'ref' && typeof value === 'function') {
        value(this.element);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        this.element.addEventListener(eventName, value);
      } else if (key === 'className') {
        this.element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(this.element.style, value);
      } else if (value !== null && value !== undefined) {
        this.element.setAttribute(key, String(value));
      }
    }
  }

  private appendChildren(children: MikoNode[]) {
    if (!Array.isArray(children)) return;
    
    for (const child of children) {
      if (child === null || child === undefined || child === false) continue;
      
      if (typeof child === 'string' || typeof child === 'number') {
        this.element.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof HTMLElement || child instanceof Text) {
        this.element.appendChild(child);
      }
    }
  }

  build(): HTMLElement {
    return this.element;
  }
}

// Factory function for creating elements
export function createElement(tag: string, props?: MikoProps, ...children: MikoNode[]): HTMLElement {
  const allProps = { ...props, children: children.flat() };
  return new ElementBuilder(tag, allProps).build();
}