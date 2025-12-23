/**
 * Lucide Icons Framework for MikoJS
 * 
 * A comprehensive icon library wrapper that provides access to 1500+ Lucide icons
 * with dynamic loading, search functionality, and MikoJS integration.
 * 
 * @version 1.0.0
 * @author MikoJS Framework
 * @license ISC
 */

// Main exports from wrapper
export {
  LucideIcon,
  IconPicker,
  IconGallery,
  iconRegistry,
  iconNames,
  getIconStats,
  getIcon,
  hasIcon,
  searchIcons,
  getIconsByCategory,
  getIconsByTag,
  type LucideIconProps,
  type IconPickerProps,
  type IconGalleryProps,
  type IconComponent,
  type IconStats
} from './Wrapper';

// Generated exports (lazy-loaded)
export type { IconComponent as GeneratedIconComponent } from './Generated';

// Framework metadata
export const LucideIconsFramework = {
  name: 'LucideIcons.framework',
  version: '1.0.0',
  description: 'Lucide Icons integration for MikoJS framework',
  author: 'MikoJS Framework',
  license: 'ISC',
  
  // Framework capabilities
  capabilities: {
    totalIcons: 1500,
    dynamicLoading: true,
    searchSupport: true,
    categoryFiltering: true,
    tagFiltering: true,
    lazyLoading: true,
    typeScript: true,
    mikoJSIntegration: true
  },
  
  // Quick start guide
  quickStart: {
    installation: 'Framework is pre-installed in MikoJS applications',
    basicUsage: `
import { LucideIcon } from './Frameworks/LucideIcons.framework';

// Basic icon
<LucideIcon name="heart" />

// Customized icon
<LucideIcon 
  name="star" 
  size={32} 
  color="#ff6b6b" 
  strokeWidth={1.5}
/>
    `,
    searchUsage: `
import { searchIcons, IconPicker } from './Frameworks/LucideIcons.framework';

// Search programmatically
const heartIcons = searchIcons('heart');

// Use picker component
<IconPicker onSelect={(name) => setSelectedIcon(name)} />
    `,
    galleryUsage: `
import { IconGallery } from './Frameworks/LucideIcons.framework';

// Show all icons
<IconGallery />

// Show category-specific icons
<IconGallery category="arrows" showNames={true} />
    `
  },
  
  // Performance recommendations
  performance: {
    lazyLoading: 'Icons are loaded in chunks of 50 for optimal performance',
    caching: 'Icon components are cached after first load',
    bundleSize: 'Only used icons are included in the final bundle',
    recommendations: [
      'Use specific icon names rather than dynamic imports when possible',
      'Implement icon preloading for critical icons',
      'Use IconPicker for user selection scenarios',
      'Consider using IconGallery for showcasing available icons'
    ]
  }
};

// Convenience re-exports for common patterns
export { LucideIcon as Icon } from './Wrapper';
export { LucideIcon as LucideIconComponent } from './Wrapper';

// Default export
export { LucideIcon as default } from './Wrapper';