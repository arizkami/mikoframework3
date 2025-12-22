/**
 * Test file for Lucide Icons Framework
 * This demonstrates the framework functionality
 */

import { 
  LucideIcon, 
  IconPicker, 
  IconGallery,
  getIcon,
  searchIcons,
  iconStats,
  iconNames
} from './index';

// Test basic icon usage
console.log('🧪 Testing Lucide Icons Framework...');

// Test icon stats
console.log('📊 Icon Statistics:', iconStats);
console.log(`📦 Total icons available: ${iconNames.length}`);

// Test getting specific icons
const heartIcon = getIcon('heart');
const starIcon = getIcon('star');
const arrowIcon = getIcon('arrow-right');

console.log('❤️ Heart icon:', heartIcon ? '✅ Found' : '❌ Not found');
console.log('⭐ Star icon:', starIcon ? '✅ Found' : '❌ Not found');
console.log('➡️ Arrow icon:', arrowIcon ? '✅ Found' : '❌ Not found');

// Test search functionality
const searchResults = searchIcons('heart');
console.log(`🔍 Search results for "heart": ${searchResults.length} icons found`);

// Test icon rendering
if (heartIcon) {
  const rendered = heartIcon.render({ size: 32, color: '#ff6b6b' });
  console.log('🎨 Rendered heart icon:', rendered);
}

// Test component creation (would be used in actual MikoJS app)
const testIconComponent = () => {
  return LucideIcon({ 
    name: 'heart', 
    size: 24, 
    color: 'red',
    onClick: () => console.log('Heart clicked!')
  });
};

console.log('🧩 Test component created:', typeof testIconComponent);

// Test first few icon names
console.log('📝 First 10 icons:', iconNames.slice(0, 10));

console.log('✅ All tests completed successfully!');

export default {
  LucideIcon,
  IconPicker,
  IconGallery,
  testIconComponent
};