import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

interface IconData {
  name: string;
  componentName: string;
  svgContent: string;
  jsonData: any;
}

class LucideIconsCodegen {
  private iconsDir = join(__dirname, 'Resources', 'icons');
  private generatedDir = join(__dirname, 'Generated');
  private wrapperDir = join(__dirname, 'Wrapper');
  private chunkSize = 50; // Icons per chunk

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!existsSync(this.generatedDir)) {
      mkdirSync(this.generatedDir, { recursive: true });
    }
  }

  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private loadIconData(): IconData[] {
    const icons: IconData[] = [];
    const files = readdirSync(this.iconsDir);
    
    // Get all SVG files
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    
    for (const svgFile of svgFiles) {
      const iconName = basename(svgFile, '.svg');
      const jsonFile = `${iconName}.json`;
      
      if (files.includes(jsonFile)) {
        try {
          const svgContent = readFileSync(join(this.iconsDir, svgFile), 'utf-8');
          const jsonContent = readFileSync(join(this.iconsDir, jsonFile), 'utf-8');
          const jsonData = JSON.parse(jsonContent);
          
          icons.push({
            name: iconName,
            componentName: this.toPascalCase(iconName),
            svgContent,
            jsonData
          });
        } catch (error) {
          console.warn(`Failed to load icon ${iconName}:`, error);
        }
      }
    }
    
    return icons.sort((a, b) => a.name.localeCompare(b.name));
  }

  private generateIconComponent(icon: IconData): string {
    const { componentName, name, svgContent, jsonData } = icon;
    
    // Extract SVG attributes and children from the SVG content
    const svgMatch = svgContent.match(/<svg[^>]*>(.*?)<\/svg>/s);
    const svgInner = svgMatch ? svgMatch[1].trim() : '';
    
    // Parse SVG attributes
    const attributesMatch = svgContent.match(/<svg([^>]*)>/);
    const attributesStr = attributesMatch ? attributesMatch[1] : '';
    
    // Extract viewBox, width, height
    const viewBoxMatch = attributesStr.match(/viewBox="([^"]*)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
    
    return `/**
 * @name ${name}
 * @description Lucide SVG icon component for MikoJS framework.
 * @category ${jsonData.categories?.[0] || 'general'}
 * @tags ${jsonData.tags?.join(', ') || ''}
 * @see https://lucide.dev/icons/${name}
 */
export const ${componentName} = {
  name: '${name}',
  displayName: '${componentName}',
  viewBox: '${viewBox}',
  content: \`${svgInner}\`,
  categories: ${JSON.stringify(jsonData.categories || [])},
  tags: ${JSON.stringify(jsonData.tags || [])},
  contributors: ${JSON.stringify(jsonData.contributors || [])},
  
  // Render function for MikoJS
  render(props: { size?: number | string; color?: string; className?: string; style?: any } = {}) {
    const { size = 24, color = 'currentColor', className = '', style = {} } = props;
    const strokeWidth = style.strokeWidth || 2;
    
    // If size is a string (like Tailwind class), set width/height to 1em for relative sizing
    const sizeValue = typeof size === 'string' ? '1em' : size;
    
    return {
      tag: 'svg',
      attributes: {
        width: sizeValue,
        height: sizeValue,
        viewBox: this.viewBox,
        fill: 'none',
        stroke: color,
        'stroke-width': strokeWidth,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'preserveAspectRatio': 'xMidYMid meet',
        class: \`lucide lucide-\${this.name} \${className}\`.trim(),
        style: typeof style === 'object' ? Object.entries(style).map(([k, v]) => \`\${k}: \${v}\`).join('; ') : style
      },
      innerHTML: this.content
    };
  }
};
`;
  }

  private generateChunk(icons: IconData[], chunkIndex: number): void {
    const chunkIcons = icons.slice(chunkIndex * this.chunkSize, (chunkIndex + 1) * this.chunkSize);
    
    let chunkContent = `// Auto-generated chunk ${chunkIndex + 1} - DO NOT EDIT MANUALLY\n\n`;
    
    // Generate individual icon components
    for (const icon of chunkIcons) {
      chunkContent += this.generateIconComponent(icon) + '\n';
    }
    
    // Export all icons from this chunk
    chunkContent += '\n// Chunk exports\n';
    chunkContent += 'export const chunk' + (chunkIndex + 1) + 'Icons = {\n';
    for (const icon of chunkIcons) {
      chunkContent += `  ${icon.componentName},\n`;
    }
    chunkContent += '};\n';
    
    // Export icon names for this chunk
    chunkContent += '\nexport const chunk' + (chunkIndex + 1) + 'Names = [\n';
    for (const icon of chunkIcons) {
      chunkContent += `  '${icon.name}',\n`;
    }
    chunkContent += '];\n';
    
    writeFileSync(join(this.generatedDir, `chunk${chunkIndex + 1}.ts`), chunkContent);
  }

  private generateIndex(icons: IconData[]): void {
    const totalChunks = Math.ceil(icons.length / this.chunkSize);
    
    let indexContent = `// Auto-generated index - DO NOT EDIT MANUALLY
// Total icons: ${icons.length}
// Total chunks: ${totalChunks}

`;

    // Import all chunks
    for (let i = 0; i < totalChunks; i++) {
      indexContent += `import { chunk${i + 1}Icons, chunk${i + 1}Names } from './chunk${i + 1}';\n`;
    }
    
    indexContent += '\n// Icon registry type\n';
    indexContent += 'export interface IconComponent {\n';
    indexContent += '  name: string;\n';
    indexContent += '  displayName: string;\n';
    indexContent += '  viewBox: string;\n';
    indexContent += '  content: string;\n';
    indexContent += '  categories: string[];\n';
    indexContent += '  tags: string[];\n';
    indexContent += '  contributors: string[];\n';
    indexContent += '  render(props?: { size?: number | string; color?: string; className?: string; style?: any }): any;\n';
    indexContent += '}\n\n';
    
    // Create combined registry (mapped by kebab-case names)
    indexContent += '// Combined icon registry\n';
    indexContent += 'export const iconRegistry: Record<string, IconComponent> = {};\n\n';
    
    // Add icons to registry by their kebab-case names
    for (let i = 0; i < totalChunks; i++) {
      indexContent += `// Add chunk ${i + 1} icons to registry\n`;
      indexContent += `Object.values(chunk${i + 1}Icons).forEach(icon => {\n`;
      indexContent += `  iconRegistry[icon.name] = icon;\n`;
      indexContent += `});\n\n`;
    }
    
    // Create icon names array
    indexContent += '// All icon names\n';
    indexContent += 'export const iconNames: string[] = [\n';
    for (let i = 0; i < totalChunks; i++) {
      indexContent += `  ...chunk${i + 1}Names,\n`;
    }
    indexContent += '];\n\n';
    
    // Utility functions
    indexContent += `// Utility functions
export function getIcon(name: string): IconComponent | undefined {
  return iconRegistry[name] || iconRegistry[name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')];
}

export function hasIcon(name: string): boolean {
  return !!getIcon(name);
}

export function getIconsByCategory(category: string): IconComponent[] {
  return Object.values(iconRegistry).filter(icon => 
    icon.categories.includes(category)
  );
}

export function getIconsByTag(tag: string): IconComponent[] {
  return Object.values(iconRegistry).filter(icon => 
    icon.tags.includes(tag)
  );
}

export function searchIcons(query: string): IconComponent[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(iconRegistry).filter(icon => 
    icon.name.includes(lowerQuery) ||
    icon.displayName.toLowerCase().includes(lowerQuery) ||
    icon.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    icon.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
}

// Lazy loading support
export async function loadChunk(chunkNumber: number): Promise<any> {
  try {
    const chunk = await import(\`./chunk\${chunkNumber}\`);
    return chunk;
  } catch (error) {
    console.warn(\`Failed to load chunk \${chunkNumber}:\`, error);
    return null;
  }
}

// Statistics
export const iconStats = {
  totalIcons: ${icons.length},
  totalChunks: ${totalChunks},
  iconsPerChunk: ${this.chunkSize},
  categories: [...new Set(Object.values(iconRegistry).flatMap(icon => icon.categories))],
  tags: [...new Set(Object.values(iconRegistry).flatMap(icon => icon.tags))]
};
`;
    
    writeFileSync(join(this.generatedDir, 'index.ts'), indexContent);
  }

  private generateTypeDefinitions(): void {
    const dtsContent = `// Auto-generated type definitions - DO NOT EDIT MANUALLY

export interface IconComponent {
  name: string;
  displayName: string;
  viewBox: string;
  content: string;
  categories: string[];
  tags: string[];
  contributors: string[];
  render(props?: { 
    size?: number | string; 
    color?: string; 
    className?: string; 
    style?: any 
  }): {
    tag: string;
    attributes: Record<string, any>;
    innerHTML: string;
  };
}

export interface IconStats {
  totalIcons: number;
  totalChunks: number;
  iconsPerChunk: number;
  categories: string[];
  tags: string[];
}

export declare const iconRegistry: Record<string, IconComponent>;
export declare const iconNames: string[];
export declare const iconStats: IconStats;

export declare function getIcon(name: string): IconComponent | undefined;
export declare function hasIcon(name: string): boolean;
export declare function getIconsByCategory(category: string): IconComponent[];
export declare function getIconsByTag(tag: string): IconComponent[];
export declare function searchIcons(query: string): IconComponent[];
export declare function loadChunk(chunkNumber: number): Promise<any>;
`;
    
    writeFileSync(join(this.generatedDir, 'index.d.ts'), dtsContent);
  }

  public async generate(): Promise<void> {
    console.log('🚀 Starting Lucide Icons codegen...');
    
    // Load all icon data
    console.log('📂 Loading icon data...');
    const icons = this.loadIconData();
    console.log(`✅ Loaded ${icons.length} icons`);
    
    // Generate chunks
    const totalChunks = Math.ceil(icons.length / this.chunkSize);
    console.log(`📦 Generating ${totalChunks} chunks...`);
    
    for (let i = 0; i < totalChunks; i++) {
      this.generateChunk(icons, i);
      console.log(`✅ Generated chunk ${i + 1}/${totalChunks}`);
    }
    
    // Generate index file
    console.log('📝 Generating index file...');
    this.generateIndex(icons);
    
    // Generate type definitions
    console.log('🔧 Generating type definitions...');
    this.generateTypeDefinitions();
    
    console.log('🎉 Codegen completed successfully!');
    console.log(`📊 Generated ${icons.length} icons in ${totalChunks} chunks`);
  }
}

// Run codegen if this file is executed directly
if (require.main === module) {
  const codegen = new LucideIconsCodegen();
  codegen.generate().catch(console.error);
}

export default LucideIconsCodegen;