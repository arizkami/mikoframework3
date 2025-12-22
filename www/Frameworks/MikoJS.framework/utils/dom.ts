// DOM manipulation utilities
export function query<T extends HTMLElement = HTMLElement>(selector: string, parent?: Element): T | null {
  return (parent || document).querySelector<T>(selector);
}

export function queryAll<T extends HTMLElement = HTMLElement>(selector: string, parent?: Element): T[] {
  return Array.from((parent || document).querySelectorAll<T>(selector));
}

export function ready(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  ...children: (string | HTMLElement)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

export function mount(element: HTMLElement, container: HTMLElement | string): void {
  const target = typeof container === 'string' ? query(container) : container;
  if (!target) {
    throw new Error(`Mount target not found: ${container}`);
  }
  target.appendChild(element);
}

export function unmount(element: HTMLElement): void {
  element.remove();
}

export function empty(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function addClass(element: HTMLElement, ...classes: string[]): void {
  element.classList.add(...classes);
}

export function removeClass(element: HTMLElement, ...classes: string[]): void {
  element.classList.remove(...classes);
}

export function toggleClass(element: HTMLElement, className: string, force?: boolean): void {
  element.classList.toggle(className, force);
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

// Animation utilities
export function animate(
  element: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions
): Animation {
  return element.animate(keyframes, options);
}

export function fadeIn(element: HTMLElement, duration = 300): Animation {
  return animate(element, [
    { opacity: 0 },
    { opacity: 1 }
  ], { duration, easing: 'ease-out' });
}

export function fadeOut(element: HTMLElement, duration = 300): Animation {
  return animate(element, [
    { opacity: 1 },
    { opacity: 0 }
  ], { duration, easing: 'ease-in' });
}

export function slideDown(element: HTMLElement, duration = 300): Animation {
  const height = element.scrollHeight;
  return animate(element, [
    { height: '0px', overflow: 'hidden' },
    { height: `${height}px`, overflow: 'hidden' }
  ], { duration, easing: 'ease-out' });
}

export function slideUp(element: HTMLElement, duration = 300): Animation {
  const height = element.scrollHeight;
  return animate(element, [
    { height: `${height}px`, overflow: 'hidden' },
    { height: '0px', overflow: 'hidden' }
  ], { duration, easing: 'ease-in' });
}