/**
 * MikoSVG Extension - Enhanced SVG support for MikoJS Framework
 * 
 * Provides comprehensive SVG creation, manipulation, and animation capabilities
 * with a fluent API that integrates seamlessly with MikoJS DSL patterns.
 */

// SVG namespace constant
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// SVG-specific props interface
export interface SVGProps {
  [key: string]: any;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  children?: SVGNode[];
  ref?: (element: SVGElement) => void;
  
  // Common SVG attributes
  viewBox?: string;
  width?: string | number;
  height?: string | number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeDasharray?: string;
  strokeDashoffset?: string | number;
  opacity?: string | number;
  transform?: string;
  
  // Animation attributes
  animate?: boolean;
  animationDuration?: string;
  animationDelay?: string;
  animationIterationCount?: string | number;
  animationTimingFunction?: string;
}

export type SVGNode = SVGElement | Text | string | number | boolean | null | undefined;

// SVG Element Builder with fluent API
export class MikoSVGBuilder {
  private element: SVGElement;
  
  constructor(tag: string, props?: SVGProps) {
    this.element = document.createElementNS(SVG_NAMESPACE, tag);
    if (props) {
      this.applyProps(props);
    }
  }

  private applyProps(props: SVGProps) {
    for (const [key, value] of Object.entries(props)) {
      if (key === 'children') {
        this.appendChildren(value);
      } else if (key === 'ref' && typeof value === 'function') {
        value(this.element);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        this.element.addEventListener(eventName, value);
      } else if (key === 'className') {
        this.element.setAttribute('class', value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign((this.element as any).style, value);
      } else if (key.startsWith('animation') && this.element.tagName === 'svg') {
        this.handleAnimation(key, value);
      } else if (value !== null && value !== undefined) {
        const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.element.setAttribute(attrName, String(value));
      }
    }
  }

  private handleAnimation(key: string, value: any) {
    const style = (this.element as any).style;
    switch (key) {
      case 'animationDuration':
        style.animationDuration = value;
        break;
      case 'animationDelay':
        style.animationDelay = value;
        break;
      case 'animationIterationCount':
        style.animationIterationCount = value;
        break;
      case 'animationTimingFunction':
        style.animationTimingFunction = value;
        break;
    }
  }

  private appendChildren(children: SVGNode[]) {
    if (!Array.isArray(children)) return;
    
    for (const child of children) {
      if (child === null || child === undefined || child === false) continue;
      
      if (typeof child === 'string' || typeof child === 'number') {
        this.element.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof SVGElement || child instanceof Text) {
        this.element.appendChild(child);
      }
    }
  }

  add(child: SVGElement | string): MikoSVGBuilder {
    if (typeof child === 'string') {
      this.element.appendChild(document.createTextNode(child));
    } else {
      this.element.appendChild(child);
    }
    return this;
  }

  attr(name: string, value: string | number): MikoSVGBuilder {
    this.element.setAttribute(name, String(value));
    return this;
  }

  style(styles: Partial<CSSStyleDeclaration>): MikoSVGBuilder {
    Object.assign((this.element as any).style, styles);
    return this;
  }

  animate(keyframes: Keyframe[], options?: KeyframeAnimationOptions): Animation {
    return this.element.animate(keyframes, options);
  }

  build(): SVGElement {
    return this.element;
  }
}

// Factory functions for creating SVG elements
export function createMikoSVGElement(tag: string, props?: SVGProps, ...children: SVGNode[]): SVGElement {
  const allProps = { ...props, children: children.flat() };
  return new MikoSVGBuilder(tag, allProps).build();
}

// Convenience functions for common SVG elements
export function mikoSvg(props?: SVGProps, ...children: SVGNode[]): SVGElement {
  const defaultProps: SVGProps = {
    xmlns: SVG_NAMESPACE,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...props
  };
  return createMikoSVGElement('svg', defaultProps, ...children);
}

export function mikoPath(d: string, props?: SVGProps): SVGElement {
  return createMikoSVGElement('path', { d, ...props });
}

export function mikoCircle(cx: number, cy: number, r: number, props?: SVGProps): SVGElement {
  return createMikoSVGElement('circle', { cx, cy, r, ...props });
}

export function mikoRect(x: number, y: number, width: number, height: number, props?: SVGProps): SVGElement {
  return createMikoSVGElement('rect', { x, y, width, height, ...props });
}

export function mikoLine(x1: number, y1: number, x2: number, y2: number, props?: SVGProps): SVGElement {
  return createMikoSVGElement('line', { x1, y1, x2, y2, ...props });
}

export function mikoEllipse(cx: number, cy: number, rx: number, ry: number, props?: SVGProps): SVGElement {
  return createMikoSVGElement('ellipse', { cx, cy, rx, ry, ...props });
}

export function mikoPolygon(points: string, props?: SVGProps): SVGElement {
  return createMikoSVGElement('polygon', { points, ...props });
}

export function mikoPolyline(points: string, props?: SVGProps): SVGElement {
  return createMikoSVGElement('polyline', { points, ...props });
}

export function mikoText(content: string, x: number, y: number, props?: SVGProps): SVGElement {
  const textEl = createMikoSVGElement('text', { x, y, ...props });
  textEl.textContent = content;
  return textEl;
}

export function mikoGroup(props?: SVGProps, ...children: SVGNode[]): SVGElement {
  return createMikoSVGElement('g', props, ...children);
}

export function mikoDefs(props?: SVGProps, ...children: SVGNode[]): SVGElement {
  return createMikoSVGElement('defs', props, ...children);
}

export function mikoLinearGradient(id: string, props?: SVGProps, ...children: SVGNode[]): SVGElement {
  return createMikoSVGElement('linearGradient', { id, ...props }, ...children);
}

export function mikoRadialGradient(id: string, props?: SVGProps, ...children: SVGNode[]): SVGElement {
  return createMikoSVGElement('radialGradient', { id, ...props }, ...children);
}

export function mikoStop(offset: string, stopColor: string, props?: SVGProps): SVGElement {
  return createMikoSVGElement('stop', { offset, 'stop-color': stopColor, ...props });
}

// Advanced SVG Canvas with DSL-style API
export class MikoSVGCanvas {
  private svgElement: SVGElement;
  private currentGroup: SVGElement;

  constructor(width: number = 24, height: number = 24, viewBox?: string) {
    this.svgElement = mikoSvg({
      width,
      height,
      viewBox: viewBox || `0 0 ${width} ${height}`
    });
    this.currentGroup = this.svgElement;
  }

  drawPath(d: string, props?: SVGProps): MikoSVGCanvas {
    this.currentGroup.appendChild(mikoPath(d, props));
    return this;
  }

  drawCircle(cx: number, cy: number, r: number, props?: SVGProps): MikoSVGCanvas {
    this.currentGroup.appendChild(mikoCircle(cx, cy, r, props));
    return this;
  }

  drawRect(x: number, y: number, width: number, height: number, props?: SVGProps): MikoSVGCanvas {
    this.currentGroup.appendChild(mikoRect(x, y, width, height, props));
    return this;
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, props?: SVGProps): MikoSVGCanvas {
    this.currentGroup.appendChild(mikoLine(x1, y1, x2, y2, props));
    return this;
  }

  drawText(content: string, x: number, y: number, props?: SVGProps): MikoSVGCanvas {
    this.currentGroup.appendChild(mikoText(content, x, y, props));
    return this;
  }

  startGroup(props?: SVGProps): MikoSVGCanvas {
    const newGroup = mikoGroup(props);
    this.currentGroup.appendChild(newGroup);
    this.currentGroup = newGroup;
    return this;
  }

  endGroup(): MikoSVGCanvas {
    if (this.currentGroup !== this.svgElement && this.currentGroup.parentElement) {
      const parent = this.currentGroup.parentElement;
      if (parent instanceof SVGElement) {
        this.currentGroup = parent;
      }
    }
    return this;
  }

  addLinearGradient(id: string, stops: Array<{offset: string, color: string}>): MikoSVGCanvas {
    let defsEl = this.svgElement.querySelector('defs') as SVGElement | null;
    if (!defsEl) {
      defsEl = mikoDefs();
      this.svgElement.insertBefore(defsEl, this.svgElement.firstChild);
    }

    const gradient = mikoLinearGradient(id);
    stops.forEach(stopData => {
      gradient.appendChild(mikoStop(stopData.offset, stopData.color));
    });
    if (defsEl) {
      defsEl.appendChild(gradient);
    }
    return this;
  }

  addRadialGradient(id: string, stops: Array<{offset: string, color: string}>): MikoSVGCanvas {
    let defsEl = this.svgElement.querySelector('defs') as SVGElement | null;
    if (!defsEl) {
      defsEl = mikoDefs();
      this.svgElement.insertBefore(defsEl, this.svgElement.firstChild);
    }

    const gradient = mikoRadialGradient(id);
    stops.forEach(stopData => {
      gradient.appendChild(mikoStop(stopData.offset, stopData.color));
    });
    if (defsEl) {
      defsEl.appendChild(gradient);
    }
    return this;
  }

  animateElement(selector: string, keyframes: Keyframe[], options?: KeyframeAnimationOptions): MikoSVGCanvas {
    const element = this.svgElement.querySelector(selector);
    if (element) {
      element.animate(keyframes, options);
    }
    return this;
  }

  build(): SVGElement {
    return this.svgElement;
  }

  toString(): string {
    return this.svgElement.outerHTML;
  }
}

// Icon creation helpers
export class MikoIconBuilder {
  private canvas: MikoSVGCanvas;

  constructor(size: number = 24) {
    this.canvas = new MikoSVGCanvas(size, size);
  }

  heart(): MikoIconBuilder {
    this.canvas.drawPath('M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3.016 0L5 15c-1.5-1.5-3-3.21-3-5.5');
    return this;
  }

  star(): MikoIconBuilder {
    this.canvas.drawPath('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
    return this;
  }

  arrow(direction: 'up' | 'down' | 'left' | 'right' = 'right'): MikoIconBuilder {
    const paths = {
      right: 'M5 12h14m-7-7 7 7-7 7',
      left: 'M19 12H5m7 7-7-7 7-7',
      up: 'M12 19V5m-7 7 7-7 7 7',
      down: 'M12 5v14m7-7-7 7-7-7'
    };
    this.canvas.drawPath(paths[direction]);
    return this;
  }

  check(): MikoIconBuilder {
    this.canvas.drawPath('M20 6 9 17l-5-5');
    return this;
  }

  x(): MikoIconBuilder {
    this.canvas.drawPath('M18 6 6 18M6 6l12 12');
    return this;
  }

  plus(): MikoIconBuilder {
    this.canvas.drawPath('M12 5v14M5 12h14');
    return this;
  }

  minus(): MikoIconBuilder {
    this.canvas.drawPath('M5 12h14');
    return this;
  }

  fill(color: string): MikoIconBuilder {
    (this.canvas.build() as any).style.fill = color;
    return this;
  }

  stroke(color: string, width: number = 2): MikoIconBuilder {
    const svg = this.canvas.build() as any;
    svg.style.stroke = color;
    svg.style.strokeWidth = width;
    return this;
  }

  size(width: number, height?: number): MikoIconBuilder {
    const svg = this.canvas.build();
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height || width));
    return this;
  }

  build(): SVGElement {
    return this.canvas.build();
  }
}

// Utility functions
export function createMikoIcon(type: string, size: number = 24): SVGElement {
  const builder = new MikoIconBuilder(size);
  
  switch (type) {
    case 'heart': return builder.heart().build();
    case 'star': return builder.star().build();
    case 'arrow-right': return builder.arrow('right').build();
    case 'arrow-left': return builder.arrow('left').build();
    case 'arrow-up': return builder.arrow('up').build();
    case 'arrow-down': return builder.arrow('down').build();
    case 'check': return builder.check().build();
    case 'x': return builder.x().build();
    case 'plus': return builder.plus().build();
    case 'minus': return builder.minus().build();
    default: return mikoSvg();
  }
}

// Animation presets
export const mikoAnimations = {
  spin: [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ],
  pulse: [
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0.7, transform: 'scale(1.05)' },
    { opacity: 1, transform: 'scale(1)' }
  ],
  bounce: [
    { transform: 'translateY(0)' },
    { transform: 'translateY(-10px)' },
    { transform: 'translateY(0)' }
  ],
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 }
  ],
  slideIn: [
    { transform: 'translateX(-100%)' },
    { transform: 'translateX(0)' }
  ]
};

// Default export
export default {
  mikoSvg,
  mikoPath,
  mikoCircle,
  mikoRect,
  mikoLine,
  mikoEllipse,
  mikoPolygon,
  mikoPolyline,
  mikoText,
  mikoGroup,
  mikoDefs,
  createMikoSVGElement,
  MikoSVGBuilder,
  MikoSVGCanvas,
  MikoIconBuilder,
  createMikoIcon,
  mikoAnimations
};
