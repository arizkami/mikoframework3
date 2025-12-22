// CSS parsing and utilities
export interface CSSRule {
  selector: string;
  declarations: Record<string, string>;
}

export class CSSParser {
  private static readonly RULE_REGEX = /([^{]+)\{([^}]+)\}/g;
  private static readonly DECLARATION_REGEX = /([^:]+):\s*([^;]+);?/g;

  static parse(cssString: string): CSSRule[] {
    const rules: CSSRule[] = [];
    let match;

    while ((match = this.RULE_REGEX.exec(cssString)) !== null) {
      const [, selector, declarations] = match;
      const rule: CSSRule = {
        selector: selector.trim(),
        declarations: this.parseDeclarations(declarations)
      };
      rules.push(rule);
    }

    return rules;
  }

  private static parseDeclarations(declarationsString: string): Record<string, string> {
    const declarations: Record<string, string> = {};
    let match;

    while ((match = this.DECLARATION_REGEX.exec(declarationsString)) !== null) {
      const [, property, value] = match;
      declarations[property.trim()] = value.trim();
    }

    return declarations;
  }

  static stringify(rules: CSSRule[]): string {
    return rules.map(rule => {
      const declarations = Object.entries(rule.declarations)
        .map(([prop, value]) => `  ${prop}: ${value};`)
        .join('\n');
      
      return `${rule.selector} {\n${declarations}\n}`;
    }).join('\n\n');
  }
}

// CSS-in-JS utilities
export function createStyleSheet(css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = css;
  return style;
}

export function injectCSS(css: string): void {
  const style = createStyleSheet(css);
  document.head.appendChild(style);
}

// Scoped CSS generator
export function scopedCSS(css: string, scope: string): string {
  const rules = CSSParser.parse(css);
  
  const scopedRules = rules.map(rule => ({
    ...rule,
    selector: rule.selector
      .split(',')
      .map(sel => `${scope} ${sel.trim()}`)
      .join(', ')
  }));

  return CSSParser.stringify(scopedRules);
}

// CSS class name utilities
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function conditionalClass(condition: boolean, trueClass: string, falseClass?: string): string {
  return condition ? trueClass : (falseClass || '');
}