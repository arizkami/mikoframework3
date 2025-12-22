// MikoJS - Enhanced Web Framework
// Main entry point with declarative UI builder pattern

// Core exports (excluding createElement from element to avoid conflict with parser)
export { ElementBuilder } from './core/element';
export type { MikoProps, MikoNode } from './core/element';
export * from './core/component';
export * from './core/state';
export * from './core/events';
export * from './core/lifecycle';
export * from './utils';

// Parser exports
export { jsx, jsxs, Fragment, JSXParser, transformJSX } from './parser/jsx';
export { TemplateParser, html, css } from './parser/template';
export { CSSParser, createStyleSheet, injectCSS, scopedCSS, classNames, conditionalClass } from './parser/css';

// Re-export commonly used functions for convenience
export { useState, createState, globalStore } from './core/state';
export { Component, createComponent } from './core/component';
export { globalEvents, EventBus } from './core/events';
export { query, queryAll, mount, unmount } from './utils/dom';

// Declarative UI Builder (backward compatibility)
import { createElement } from './core/element';
import type { MikoProps } from './core/element';

export class UI {
  private element: HTMLElement;

  constructor(tag: string = 'div', className?: string, props?: MikoProps) {
    const elementProps: MikoProps = { ...props };
    if (className) {
      elementProps.className = className;
    }
    this.element = createElement(tag, elementProps);
  }

  // Add child elements
  add(child: HTMLElement | string): UI {
    if (typeof child === 'string') {
      this.element.appendChild(document.createTextNode(child));
    } else {
      this.element.appendChild(child);
    }
    return this;
  }

  // Create and add a title
  title(text: string, className: string = 'text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent'): UI {
    const title = createElement('h1', { className });
    title.textContent = text;
    this.element.appendChild(title);
    return this;
  }

  // Create and add a subtitle
  subtitle(text: string, className: string = 'text-lg mb-8 text-purple-100 opacity-90'): UI {
    const subtitle = createElement('p', { className });
    subtitle.textContent = text;
    this.element.appendChild(subtitle);
    return this;
  }

  // Create a panel
  panel(className: string = 'bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20'): UI {
    const panel = new UI('div', className);
    this.element.appendChild(panel.build());
    return panel;
  }

  // Create a row
  row(className: string = 'flex items-center justify-center gap-4 mb-4'): UI {
    const row = new UI('div', className);
    this.element.appendChild(row.build());
    return row;
  }

  // Add text
  text(content: string, className: string = 'text-xl font-semibold'): UI {
    const text = createElement('span', { className });
    text.textContent = content;
    this.element.appendChild(text);
    return this;
  }

  // Add button
  button(text: string, onClick: () => void, className?: string): UI {
    const defaultClass = 'px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg';
    const button = createElement('button', { 
      className: className || defaultClass,
      onclick: onClick 
    });
    button.textContent = text;
    this.element.appendChild(button);
    return this;
  }

  // Add input field
  input(props: {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
  }): UI {
    const defaultClass = 'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm';
    
    const inputProps: MikoProps = {
      type: props.type || 'text',
      placeholder: props.placeholder,
      value: props.value,
      className: props.className || defaultClass,
    };

    if (props.onChange) {
      inputProps.oninput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        props.onChange!(target.value);
      };
    }
    
    const input = createElement('input', inputProps);
    this.element.appendChild(input);
    return this;
  }

  // Add label
  label(text: string, className: string = 'block text-sm font-medium text-white/80 mb-2'): UI {
    const label = createElement('label', { className });
    label.textContent = text;
    this.element.appendChild(label);
    return this;
  }

  // Build the final element
  build(): HTMLElement {
    return this.element;
  }
}

// Helper functions for creating UI components
export function container(className: string = ''): UI {
  return new UI('div', className);
}

export function center(className: string = 'max-w-4xl mx-auto text-center'): UI {
  return new UI('div', className);
}

export function panel(className: string = 'bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20'): UI {
  return new UI('div', className);
}

// Framework version
export const VERSION = '2.0.0';