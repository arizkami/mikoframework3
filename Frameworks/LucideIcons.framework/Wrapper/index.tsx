import { MikoComponent, createElement, createSVGElement, svg, path } from '../../Frameworks/MikoJS.framework';

// Import the generated icon registry
import { 
  iconRegistry, 
  iconNames, 
  getIcon, 
  hasIcon, 
  searchIcons, 
  getIconsByCategory,
  getIconsByTag,
  iconStats,
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

/**
 * LucideIcon - Main wrapper component for Lucide icons in MikoJS
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LucideIcon name="heart" />
 * 
 * // With custom props
 * <LucideIcon 
 *   name="star" 
 *   size={32} 
 *   color="#ff6b6b" 
 *   strokeWidth={1.5}
 *   className="my-icon"
 *   onClick={() => console.log('Icon clicked!')}
 * />
 * 
 * // Dynamic icon
 * <LucideIcon name={iconName} size="1.5rem" />
 * ```
 */
export const LucideIcon: MikoComponent<LucideIconProps> = ({ 
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
}) => {
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
      className: `lucide lucide-help-circle ${className}`.trim(),
      style,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    }, 
      path('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'),
      path('M12 17h.01'),
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
  return createSVGElement('svg', {
    ...rendered.attributes,
    onClick,
    onMouseEnter,
    onMouseLeave,
    innerHTML: rendered.innerHTML,
    ...props
  });
};

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

export const IconPicker: MikoComponent<IconPickerProps> = ({
  onSelect,
  selectedIcon,
  searchPlaceholder = 'Search icons...',
  className = '',
  style = {},
  maxResults = 50,
  categories = [],
  size = 24
}) => {
  let searchQuery = '';
  let filteredIcons: IconComponent[] = [];
  
  const updateSearch = (query: string) => {
    searchQuery = query.toLowerCase();
    
    if (!query) {
      filteredIcons = Object.values(iconRegistry).slice(0, maxResults);
    } else {
      const results = searchIcons(query);
      filteredIcons = results.slice(0, maxResults);
    }
    
    // Filter by categories if specified
    if (categories.length > 0) {
      filteredIcons = filteredIcons.filter(icon =>
        icon.categories.some(cat => categories.includes(cat))
      );
    }
  };
  
  // Initialize with first batch of icons
  updateSearch('');
  
  return createElement('div', {
    className: `lucide-icon-picker ${className}`.trim(),
    style: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#ffffff',
      ...style
    }
  }, [
    // Search input
    createElement('input', {
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
      onInput: (e: Event) => {
        const target = e.target as HTMLInputElement;
        updateSearch(target.value);
        // Re-render logic would go here in a real framework
      }
    }),
    
    // Icon grid
    createElement('div', {
      className: 'lucide-icon-grid',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
        gap: '8px',
        maxHeight: '300px',
        overflowY: 'auto'
      }
    }, filteredIcons.map(icon => 
      createElement('button', {
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
        onClick: () => onSelect?.(icon.name),
        title: icon.name
      }, [
        createElement(LucideIcon, {
          name: icon.name,
          size,
          color: selectedIcon === icon.name ? '#3b82f6' : '#6b7280'
        })
      ])
    ))
  ]);
};

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

export const IconGallery: MikoComponent<IconGalleryProps> = ({
  category,
  className = '',
  style = {},
  iconSize = 32,
  showNames = true,
  onIconClick
}) => {
  const icons = category ? getIconsByCategory(category) : Object.values(iconRegistry);
  
  return createElement('div', {
    className: `lucide-icon-gallery ${className}`.trim(),
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '16px',
      padding: '16px',
      ...style
    }
  }, icons.map(icon =>
    createElement('div', {
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
      onClick: () => onIconClick?.(icon.name)
    }, [
      createElement(LucideIcon, {
        name: icon.name,
        size: iconSize,
        style: { marginBottom: showNames ? '8px' : '0' }
      }),
      showNames && createElement('span', {
        style: {
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
          wordBreak: 'break-word'
        }
      }, icon.name)
    ])
  ));
};

// Utility exports
export {
  iconRegistry,
  iconNames,
  iconStats,
  getIcon,
  hasIcon,
  searchIcons,
  getIconsByCategory,
  getIconsByTag
};

// Export types
export type { IconComponent };

// Default export
export default LucideIcon;