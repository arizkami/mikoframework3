// Template string parsing and interpolation
export interface TemplateContext {
  [key: string]: any;
}

export class TemplateParser {
  private static readonly INTERPOLATION_REGEX = /\{\{([^}]+)\}\}/g;
  private static readonly DIRECTIVE_REGEX = /\s*([\w-]+)="([^"]*)"|\s*([\w-]+)='([^']*)'|\s*([\w-]+)=([^\s>]+)/g;

  static parse(template: string, context: TemplateContext = {}): string {
    return template.replace(this.INTERPOLATION_REGEX, (match, expression) => {
      try {
        return this.evaluateExpression(expression.trim(), context);
      } catch (error) {
        console.warn(`Template interpolation error: ${error}`);
        return match;
      }
    });
  }

  private static evaluateExpression(expression: string, context: TemplateContext): string {
    // Simple expression evaluation - supports basic property access
    const keys = Object.keys(context);
    const values = Object.values(context);
    
    try {
      const func = new Function(...keys, `return ${expression}`);
      const result = func(...values);
      return result !== null && result !== undefined ? String(result) : '';
    } catch {
      // Fallback to simple property access
      return this.getNestedProperty(context, expression) || '';
    }
  }

  private static getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  static parseDirectives(attributeString: string): Record<string, string> {
    const directives: Record<string, string> = {};
    let match;

    while ((match = this.DIRECTIVE_REGEX.exec(attributeString)) !== null) {
      const [, name1, value1, name2, value2, name3, value3] = match;
      const name = name1 || name2 || name3;
      const value = value1 || value2 || value3;
      
      if (name && value !== undefined) {
        directives[name] = value;
      }
    }

    return directives;
  }
}

// Template literal tag function
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  let result = '';
  
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      const value = values[i];
      result += value !== null && value !== undefined ? String(value) : '';
    }
  }
  
  return result;
}

// CSS template literal tag
export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return html(strings, ...values);
}