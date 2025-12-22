// Element creation and manipulation with enhanced SVG support
export interface MikoProps {
  [key: string]: any;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  children?: MikoNode[];
  ref?: (element: HTMLElement | SVGElement) => void;
  
  // SVG-specific props
  xmlns?: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeDasharray?: string;
  strokeDashoffset?: string | number;
  d?: string; // for path elements
  cx?: string | number; // for circle/ellipse
  cy?: string | number; // for circle/ellipse
  r?: string | number; // for circle
  rx?: string | number; // for ellipse
  ry?: string | number; // for ellipse
  x?: string | number; // for rect/text
  y?: string | number; // for rect/text
  width?: string | number; // for rect/svg
  height?: string | number; // for rect/svg
  x1?: string | number; // for line
  y1?: string | number; // for line
  x2?: string | number; // for line
  y2?: string | number; // for line
  points?: string; // for polygon/polyline
  transform?: string;
  opacity?: string | number;
}

export type MikoNode = HTMLElement | SVGElement | Text | string | number | boolean | null | undefined;

// SVG namespace constant
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// SVG element tags that should be created with SVG namespace
const SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'rect', 'line', 'ellipse', 'polygon', 'polyline',
  'text', 'g', 'defs', 'linearGradient', 'radialGradient', 'stop', 'use',
  'symbol', 'marker', 'clipPath', 'mask', 'pattern', 'image', 'foreignObject',
  'tspan', 'textPath', 'animate', 'animateTransform', 'animateMotion'
]);

export class ElementBuilder {
  private element: HTMLElement | SVGElement;
  private isSVG: boolean;
  
  constructor(tag: string, props?: MikoProps) {
    this.isSVG = SVG_TAGS.has(tag.toLowerCase());
    
    if (this.isSVG) {
      this.element = document.createElementNS(SVG_NAMESPACE, tag);
    } else {
      this.element = document.createElement(tag);
    }
    
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
        if (this.isSVG) {
          this.element.setAttribute('class', value);
        } else {
          (this.element as HTMLElement).className = value;
        }
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign((this.element as any).style, value);
      } else if (value !== null && value !== undefined) {
        // Convert camelCase to kebab-case for SVG attributes
        const attrName = this.isSVG ? this.camelToKebab(key) : key;
        this.element.setAttribute(attrName, String(value));
      }
    }
  }

  private camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  private appendChildren(children: MikoNode[]) {
    if (!Array.isArray(children)) return;
    
    for (const child of children) {
      if (child === null || child === undefined || child === false) continue;
      
      if (typeof child === 'string' || typeof child === 'number') {
        this.element.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof HTMLElement || child instanceof SVGElement || child instanceof Text) {
        this.element.appendChild(child);
      }
    }
  }

  build(): HTMLElement | SVGElement {
    return this.element;
  }
}

// Enhanced factory function for creating elements (HTML or SVG)
export function createElement(tag: string, props?: MikoProps, ...children: MikoNode[]): HTMLElement | SVGElement {
  const allProps = { ...props, children: children.flat() };
  return new ElementBuilder(tag, allProps).build();
}

// Specific SVG element factory
export function createSVGElement(tag: string, props?: MikoProps, ...children: MikoNode[]): SVGElement {
  const element = createElement(tag, props, ...children);
  return element as SVGElement;
}

// SVG Builder class for fluent API
export class SVGBuilder {
  private element: SVGElement;
  
  constructor(tag: string = 'svg', props?: MikoProps) {
    this.element = createSVGElement(tag, props);
  }

  // Fluent API methods
  add(child: SVGElement | HTMLElement | string): SVGBuilder {
    if (typeof child === 'string') {
      this.element.appendChild(document.createTextNode(child));
    } else {
      this.element.appendChild(child);
    }
    return this;
  }

  attr(name: string, value: string | number): SVGBuilder {
    this.element.setAttribute(name, String(value));
    return this;
  }

  style(styles: Partial<CSSStyleDeclaration>): SVGBuilder {
    Object.assign((this.element as any).style, styles);
    return this;
  }

  class(className: string): SVGBuilder {
    this.element.setAttribute('class', className);
    return this;
  }

  // Common SVG operations
  viewBox(x: number, y: number, width: number, height: number): SVGBuilder {
    this.element.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
    return this;
  }

  size(width: number | string, height?: number | string): SVGBuilder {
    this.element.setAttribute('width', String(width));
    this.element.setAttribute('height', String(height || width));
    return this;
  }

  fill(color: string): SVGBuilder {
    this.element.setAttribute('fill', color);
    return this;
  }

  stroke(color: string, width?: number): SVGBuilder {
    this.element.setAttribute('stroke', color);
    if (width !== undefined) {
      this.element.setAttribute('stroke-width', String(width));
    }
    return this;
  }

  transform(transform: string): SVGBuilder {
    this.element.setAttribute('transform', transform);
    return this;
  }

  opacity(value: number): SVGBuilder {
    this.element.setAttribute('opacity', String(value));
    return this;
  }

  // Animation support
  animate(keyframes: Keyframe[], options?: KeyframeAnimationOptions): Animation {
    return this.element.animate(keyframes, options);
  }

  build(): SVGElement {
    return this.element;
  }
}

// Convenience functions for common SVG elements
export function svg(props?: MikoProps, ...children: MikoNode[]): SVGElement {
  const defaultProps: MikoProps = {
    xmlns: SVG_NAMESPACE,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props
  };
  return createSVGElement('svg', defaultProps, ...children);
}

export function path(d: string, props?: MikoProps): SVGElement {
  return createSVGElement('path', { d, ...props });
}

export function circle(cx: number, cy: number, r: number, props?: MikoProps): SVGElement {
  return createSVGElement('circle', { cx, cy, r, ...props });
}

export function rect(x: number, y: number, width: number, height: number, props?: MikoProps): SVGElement {
  return createSVGElement('rect', { x, y, width, height, ...props });
}

export function line(x1: number, y1: number, x2: number, y2: number, props?: MikoProps): SVGElement {
  return createSVGElement('line', { x1, y1, x2, y2, ...props });
}

export function group(props?: MikoProps, ...children: MikoNode[]): SVGElement {
  return createSVGElement('g', props, ...children);
}