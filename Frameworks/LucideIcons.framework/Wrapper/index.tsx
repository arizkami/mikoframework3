import { createElement, createSVGElement, svg, path, type MikoNode } from '../../../Frameworks/MikoJS.framework';

// Import the generated icon registry
import { 
  iconRegistry, 
  iconNames, 
  getIcon, 
  hasIcon, 
  searchIcons, 
  getIconsByCategory,
  getIconsByTag,
  type IconComponent 
} from '../Generated';

export interface LucideIconProps {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
  style?: Record<string, any>;
  onClick?: (event: Event) => void;
  onMouseEnter?: (event: Event) => void;
  onMouseLeave?: (event: Event) => void;
}

export interface IconSearchResult {
  icon: IconComponent;
  relevance: number;
}

// Icon stats interface
export interface IconStats {
  totalIcons: number;
  totalChunks: number;
  categories: string[];
  tags: string[];
}

// Calculate icon stats - using function to avoid redeclaration
function calculateIconStats(): IconStats {
  return {
    totalIcons: iconNames.length,
    totalChunks: 34,
    categories: Array.from(new Set(Object.values(iconRegistry).flatMap(icon => icon.categories))),
    tags: Array.from(new Set(Object.values(iconRegistry).flatMap(icon => icon.tags)))
  };
}

/**
 * LucideIcon - Main wrapper component for Lucide icons in MikoJS
 * 
 * @example
 * ```tsx
 * // Basic usage
 * LucideIcon({ name: "heart" })
 * 
 * // With custom props
 * LucideIcon({ 
 *   name: "star", 
 *   size: 32, 
 *   color: "#ff6b6b", 
 *   strokeWidth: 1.5,
 *   className: "my-icon",
 *   onClick: () => console.log('Icon clicked!')
 * })
 * 
 * // Dynamic icon
 * LucideIcon({ name: iconName, size: "1.5rem" })
 * ```
 */
export function LucideIcon({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2,
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props 
}: LucideIconProps): SVGElement {
  // Get the icon component
  const iconComponent = getIcon(name);
  
  if (!iconComponent) {
    console.warn(`LucideIcon: Icon "${name}" not found. Available icons: ${iconNames.length}`);
    
    // Return a fallback icon (question mark) using SVG
    return svg({
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      preserveAspectRatio: 'xMidYMid meet',
      className: `lucide lucide-help-circle ${className}`.trim(),
      style,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    }, 
      path('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', {}),
      path('M12 17h.01', {}),
      createSVGElement('circle', { cx: '12', cy: '12', r: '10' })
    );
  }
  
  // Render the icon using the component's render method
  const rendered = iconComponent.render({
    size,
    color,
    className,
    style: {
      strokeWidth,
      ...style
    }
  });
  
  // Create SVG element using MikoJS enhanced SVG support
  const svgElement = createSVGElement('svg', {
    width: rendered.attributes.width,
    height: rendered.attributes.height,
    viewBox: rendered.attributes.viewBox,
    fill: rendered.attributes.fill,
    stroke: rendered.attributes.stroke,
    strokeWidth: rendered.attributes['stroke-width'] || strokeWidth,
    strokeLinecap: rendered.attributes['stroke-linecap'],
    strokeLinejoin: rendered.attributes['stroke-linejoin'],
    preserveAspectRatio: 'xMidYMid meet', // Ensure proper scaling
    class: rendered.attributes.class,
    style: `display: inline-block; vertical-align: middle; ${rendered.attributes.style || ''}`,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props
  });
  
  // Set innerHTML for the icon content
  if (rendered.innerHTML) {
    svgElement.innerHTML = rendered.innerHTML;
  }
  
  return svgElement;
}

/**
 * IconPicker - A component for selecting icons with search functionality
 */
export interface IconPickerProps {
  onSelect?: (iconName: string) => void;
  selectedIcon?: string;
  searchPlaceholder?: string;
  className?: string;
  style?: Record<string, any>;
  maxResults?: number;
  categories?: string[];
  size?: number | string;
}

export function IconPicker({
  onSelect,
  selectedIcon,
  searchPlaceholder = 'Search icons...',
  className = '',
  style = {},
  maxResults = 50,
  categories = [],
  size = 24
}: IconPickerProps): HTMLElement {
  let filteredIcons: IconComponent[] = [];
  
  const updateSearch = (query: string) => {
    const searchQuery = query.toLowerCase();
    
    if (!query) {
      filteredIcons = Object.values(iconRegistry).slice(0, maxResults);
    } else {
      const results = searchIcons(query);
      filteredIcons = results.slice(0, maxResults);
    }
    
    // Filter by categories if specified
    if (categories.length > 0) {
      filteredIcons = filteredIcons.filter(icon =>
        icon.categories.some((cat: string) => categories.includes(cat))
      );
    }
  };
  
  // Initialize with first batch of icons
  updateSearch('');
  
  const searchInput = createElement('input', {
    type: 'text',
    placeholder: searchPlaceholder,
    className: 'lucide-search-input',
    style: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    oninput: (e: Event) => {
      const target = e.target as HTMLInputElement;
      updateSearch(target.value);
      // Re-render logic would go here in a real framework
    }
  }) as HTMLElement;
  
  const iconButtons = filteredIcons.map(icon => {
    const iconElement = LucideIcon({
      name: icon.name,
      size,
      color: selectedIcon === icon.name ? '#3b82f6' : '#6b7280'
    });
    
    return createElement('button', {
      key: icon.name,
      className: `lucide-icon-button ${selectedIcon === icon.name ? 'selected' : ''}`,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        border: selectedIcon === icon.name ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: selectedIcon === icon.name ? '#eff6ff' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s'
      },
      onclick: () => onSelect?.(icon.name),
      title: icon.name
    }, iconElement) as HTMLElement;
  });
  
  const iconGrid = createElement('div', {
    className: 'lucide-icon-grid',
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
      gap: '8px',
      maxHeight: '300px',
      overflowY: 'auto'
    }
  }, ...iconButtons) as HTMLElement;
  
  return createElement('div', {
    className: `lucide-icon-picker ${className}`.trim(),
    style: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#ffffff',
      ...style
    }
  }, searchInput, iconGrid) as HTMLElement;
}

/**
 * IconGallery - Display icons in a gallery format with categories
 */
export interface IconGalleryProps {
  category?: string;
  className?: string;
  style?: Record<string, any>;
  iconSize?: number | string;
  showNames?: boolean;
  onIconClick?: (iconName: string) => void;
}

export function IconGallery({
  category,
  className = '',
  style = {},
  iconSize = 32,
  showNames = true,
  onIconClick
}: IconGalleryProps): HTMLElement {
  const icons = category ? getIconsByCategory(category) : Object.values(iconRegistry);
  
  const galleryItems = icons.map(icon => {
    const iconElement = LucideIcon({
      name: icon.name,
      size: iconSize,
      style: { marginBottom: showNames ? '8px' : '0' }
    });
    
    const nameElement = showNames ? createElement('span', {
      style: {
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center',
        wordBreak: 'break-word'
      }
    }, icon.name) as HTMLElement : null;
    
    const children: MikoNode[] = [iconElement];
    if (nameElement) {
      children.push(nameElement);
    }
    
    return createElement('div', {
      key: icon.name,
      className: 'lucide-gallery-item',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: onIconClick ? 'pointer' : 'default',
        transition: 'all 0.2s'
      },
      onclick: () => onIconClick?.(icon.name)
    }, ...children) as HTMLElement;
  });
  
  return createElement('div', {
    className: `lucide-icon-gallery ${className}`.trim(),
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '16px',
      padding: '16px',
      ...style
    }
  }, ...galleryItems) as HTMLElement;
}

// Utility exports
export {
  iconRegistry,
  iconNames,
  getIcon,
  hasIcon,
  searchIcons,
  getIconsByCategory,
  getIconsByTag
};

// Export icon stats getter
export const getIconStats = calculateIconStats;

// Export types
export type { IconComponent };

// Default export
export default LucideIcon;