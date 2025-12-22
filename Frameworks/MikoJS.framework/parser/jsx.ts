// JSX parsing and transformation utilities
import { createElement } from '../core/element';
import type { MikoProps, MikoNode } from '../core/element';

export interface JSXElement {
  type: string | Function;
  props: MikoProps;
  children: MikoNode[];
}

// JSX factory function
export function jsx(
  type: string | Function,
  props: MikoProps | null,
  ...children: MikoNode[]
): HTMLElement {
  const allProps = props || {};
  
  if (typeof type === 'string') {
    return createElement(type, allProps, ...children);
  } else if (typeof type === 'function') {
    // Component function
    return type({ ...allProps, children });
  }
  
  throw new Error(`Invalid JSX element type: ${type}`);
}

// JSX fragment
export function Fragment(props: { children: MikoNode[] }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  
  if (props.children) {
    for (const child of props.children) {
      if (child === null || child === undefined || child === false) continue;
      
      if (typeof child === 'string' || typeof child === 'number') {
        fragment.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof HTMLElement || child instanceof Text) {
        fragment.appendChild(child);
      }
    }
  }
  
  return fragment;
}

// JSX runtime exports
export const jsxs = jsx;
export const jsxDEV = jsx;

// Transform JSX-like object to HTML element
export function transformJSX(jsxObj: JSXElement): HTMLElement {
  return jsx(jsxObj.type, jsxObj.props, ...jsxObj.children);
}

// Parse JSX string (basic implementation)
export class JSXParser {
  private static readonly TAG_REGEX = /<(\w+)([^>]*?)(?:\s*\/\s*>|>(.*?)<\/\1>)/gs;
  private static readonly ATTR_REGEX = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;

  static parse(jsxString: string): HTMLElement {
    // This is a simplified JSX parser - in a real implementation,
    // you'd want to use a proper parser like Babel
    const match = this.TAG_REGEX.exec(jsxString);
    
    if (!match) {
      throw new Error('Invalid JSX syntax');
    }

    const [, tagName, attributes, content] = match;
    const props = this.parseAttributes(attributes);
    const children = content ? [content] : [];

    return createElement(tagName, props, ...children);
  }

  private static parseAttributes(attrString: string): MikoProps {
    const props: MikoProps = {};
    let match;

    while ((match = this.ATTR_REGEX.exec(attrString)) !== null) {
      const [, name, value1, value2, value3] = match;
      const value = value1 || value2 || value3;
      props[name] = value;
    }

    return props;
  }
}