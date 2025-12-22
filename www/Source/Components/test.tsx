import { container, center, useState } from '../../Frameworks/MikoJS.framework';
import { LucideIcon, searchIcons } from '../../Frameworks/LucideIcons.framework';

// Test Component showcasing Lucide Icons with MikoJS DSL
function IconTest() {
  const [selectedIcon, setSelectedIcon] = useState('heart');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [likedIcons, setLikedIcons] = useState<string[]>([]);

  const toggleLike = (iconName: string) => {
    const current = likedIcons();
    if (current.includes(iconName)) {
      setLikedIcons(current.filter(name => name !== iconName));
    } else {
      setLikedIcons([...current, iconName]);
    }
  };

  const handleSearchChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setSearchQuery(target.value);
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setShowPicker(false);
  };

  const searchResults = searchQuery() ? searchIcons(searchQuery()).slice(0, 12) : [];

  return container('min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6')
    .add(
      container('max-w-6xl mx-auto')
        .add(
          // Header Section
          center('text-center mb-12')
            .add(
              container('inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6')
                .add(
                  (() => {
                    const iconEl = LucideIcon({ 
                      name: 'palette', 
                      size: 32, 
                      color: 'white' 
                    });
                    return iconEl;
                  })()
                )
                .build()
            )
            .title('Lucide Icons Framework', 'text-4xl font-bold text-gray-900 mb-4')
            .subtitle('1666+ Beautiful Icons for MikoJS', 'text-lg text-gray-600 mb-2')
            .add(
              container('text-sm text-gray-500')
                .add('Dynamic loading • Search & filter • MikoJS integration')
                .build()
            )
            .build()
        )
        .add(
          // Stats Cards
          container('grid grid-cols-1 md:grid-cols-4 gap-6 mb-12')
            .add(
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('flex items-center justify-between mb-2')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'package', 
                          size: 24, 
                          color: '#3b82f6' 
                        });
                        return iconEl;
                      })()
                    )
                    .add(
                      container('text-2xl font-bold text-gray-900')
                        .add('1666')
                        .build()
                    )
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Total Icons')
                    .build()
                )
                .build()
            )
            .add(
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('flex items-center justify-between mb-2')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'layers', 
                          size: 24, 
                          color: '#10b981' 
                        });
                        return iconEl;
                      })()
                    )
                    .add(
                      container('text-2xl font-bold text-gray-900')
                        .add('34')
                        .build()
                    )
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Chunks')
                    .build()
                )
                .build()
            )
            .add(
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('flex items-center justify-between mb-2')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'zap', 
                          size: 24, 
                          color: '#f59e0b' 
                        });
                        return iconEl;
                      })()
                    )
                    .add(
                      container('text-2xl font-bold text-gray-900')
                        .add('50')
                        .build()
                    )
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Per Chunk')
                    .build()
                )
                .build()
            )
            .add(
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('flex items-center justify-between mb-2')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'heart', 
                          size: 24, 
                          color: '#ef4444' 
                        });
                        return iconEl;
                      })()
                    )
                    .add(
                      container('text-2xl font-bold text-gray-900')
                        .add(likedIcons().length.toString())
                        .build()
                    )
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Liked Icons')
                    .build()
                )
                .build()
            )
            .build()
        )
        .add(
          // Main Content Grid
          container('grid grid-cols-1 lg:grid-cols-2 gap-8')
            .add(
              // Icon Selector Section
              container('bg-white rounded-xl p-8 shadow-sm border border-gray-200')
                .add(
                  container('flex items-center gap-3 mb-6')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'mouse-pointer-click', 
                          size: 24, 
                          color: '#6366f1' 
                        });
                        return iconEl;
                      })()
                    )
                    .add(
                      container('text-xl font-semibold text-gray-900')
                        .add('Icon Selector')
                        .build()
                    )
                    .build()
                )
                .add(
                  // Current Selection
                  container('mb-6')
                    .add(
                      container('text-sm font-medium text-gray-700 mb-3')
                        .add('Selected Icon:')
                        .build()
                    )
                    .add(
                      container('flex items-center gap-4 p-4 bg-gray-50 rounded-lg')
                        .add(
                          (() => {
                            const iconEl = LucideIcon({ 
                              name: selectedIcon(), 
                              size: 32, 
                              color: '#374151' 
                            });
                            return iconEl;
                          })()
                        )
                        .add(
                          container('flex-1')
                            .add(
                              container('font-medium text-gray-900')
                                .add(selectedIcon())
                                .build()
                            )
                            .add(
                              container('text-sm text-gray-500')
                                .add('Click "Choose Icon" to change')
                                .build()
                            )
                            .build()
                        )
                        .add(
                          (() => {
                            const button = document.createElement('button');
                            button.className = 'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium';
                            button.textContent = 'Choose Icon';
                            button.addEventListener('click', () => setShowPicker(!showPicker()));
                            return button;
                          })()
                        )
                        .build()
                    )
                    .build()
                )
                .add(
                  // Icon Picker (conditional)
                  showPicker() ? 
                    container('border border-gray-200 rounded-lg p-4 bg-gray-50')
                      .add(
                        container('text-sm font-medium text-gray-700 mb-3')
                          .add('Popular Icons:')
                          .build()
                      )
                      .add(
                        (() => {
                          const gridContainer = container('grid grid-cols-6 gap-3');
                          ['heart', 'star', 'thumbs-up', 'settings', 'user', 'home', 'search', 'bell', 'mail', 'phone', 'calendar', 'camera'].forEach(iconName => {
                            const button = document.createElement('button');
                            button.className = `p-3 rounded-lg border-2 transition-all hover:bg-white ${selectedIcon() === iconName ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`;
                            button.appendChild(LucideIcon({ name: iconName, size: 20, color: selectedIcon() === iconName ? '#6366f1' : '#6b7280' }));
                            button.addEventListener('click', () => handleIconSelect(iconName));
                            gridContainer.add(button);
                          });
                          return gridContainer;
                        })()
                          .build()
                      )
                      .build()
                    : container().build()
                )
                .build()
            )
            .add(
              // Search Section
              container('bg-white rounded-xl p-8 shadow-sm border border-gray-200')
                .add(
                  container('flex items-center gap-3 mb-6')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'search', 
                          size: 24, 
                          color: '#059669' 
                        });
                        return iconEl;
                      })()
                    )
                    .add(
                      container('text-xl font-semibold text-gray-900')
                        .add('Icon Search')
                        .build()
                    )
                    .build()
                )
                .add(
                  // Search Input
                  container('mb-6')
                    .add(
                      container('relative')
                        .add(
                          (() => {
                            const input = document.createElement('input');
                            input.type = 'text';
                            input.placeholder = 'Search icons... (e.g., "heart", "arrow", "user")';
                            input.className = 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm';
                            input.value = searchQuery();
                            input.addEventListener('input', handleSearchChange);
                            return input;
                          })()
                        )
                        .add(
                          container('absolute left-3 top-1/2 transform -translate-y-1/2')
                            .add(
                              (() => {
                                const iconEl = LucideIcon({ 
                                  name: 'search', 
                                  size: 16, 
                                  color: '#9ca3af' 
                                });
                                return iconEl;
                              })()
                            )
                            .build()
                        )
                        .build()
                    )
                    .build()
                )
                .add(
                  // Search Results
                  searchQuery() ? 
                    container()
                      .add(
                        container('text-sm font-medium text-gray-700 mb-4')
                          .add(`Found ${searchResults.length} icons for "${searchQuery()}"`)
                          .build()
                      )
                      .add(
                        searchResults.length > 0 ?
                          (() => {
                            const gridContainer = container('grid grid-cols-4 gap-3');
                            searchResults.forEach(icon => {
                              const button = document.createElement('button');
                              const isLiked = likedIcons().includes(icon.name);
                              button.className = `group relative p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all`;
                              
                              const iconContainer = document.createElement('div');
                              iconContainer.className = 'flex flex-col items-center gap-2';
                              
                              const iconEl = LucideIcon({ name: icon.name, size: 24, color: '#374151' });
                              iconContainer.appendChild(iconEl);
                              
                              const nameEl = document.createElement('span');
                              nameEl.className = 'text-xs text-gray-600 text-center truncate w-full';
                              nameEl.textContent = icon.name;
                              iconContainer.appendChild(nameEl);
                              
                              button.appendChild(iconContainer);
                              
                              // Like button overlay
                              const likeBtn = document.createElement('button');
                              likeBtn.className = `absolute top-1 right-1 p-1 rounded-full ${isLiked ? 'bg-red-100' : 'bg-gray-100 opacity-0 group-hover:opacity-100'} transition-all`;
                              likeBtn.appendChild(LucideIcon({ name: 'heart', size: 12, color: isLiked ? '#ef4444' : '#9ca3af' }));
                              likeBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                toggleLike(icon.name);
                              });
                              button.appendChild(likeBtn);
                              
                              button.addEventListener('click', () => handleIconSelect(icon.name));
                              gridContainer.add(button);
                            });
                            return gridContainer;
                          })()
                            .build()
                          : container('text-center py-8 text-gray-500')
                              .add('No icons found. Try a different search term.')
                              .build()
                      )
                      .build()
                    : container('text-center py-12 text-gray-400')
                        .add(
                          (() => {
                            const iconEl = LucideIcon({ 
                              name: 'search', 
                              size: 48, 
                              color: '#d1d5db' 
                            });
                            return iconEl;
                          })()
                        )
                        .add(
                          container('mt-4 text-sm')
                            .add('Start typing to search through 1666+ icons')
                            .build()
                        )
                        .build()
                )
                .build()
            )
            .build()
        )
        .add(
          // Popular Categories Section
          container('mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200')
            .add(
              container('flex items-center gap-3 mb-8')
                .add(
                  (() => {
                    const iconEl = LucideIcon({ 
                      name: 'grid-3x3', 
                      size: 24, 
                      color: '#7c3aed' 
                    });
                    return iconEl;
                  })()
                )
                .add(
                  container('text-xl font-semibold text-gray-900')
                    .add('Popular Categories')
                    .build()
                )
                .build()
            )
            .add(
              (() => {
                const gridContainer = container('grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4');
                [
                  { name: 'arrows', icon: 'arrow-right', color: '#3b82f6' },
                  { name: 'communication', icon: 'message-circle', color: '#10b981' },
                  { name: 'files', icon: 'file-text', color: '#f59e0b' },
                  { name: 'navigation', icon: 'compass', color: '#ef4444' },
                  { name: 'social', icon: 'users', color: '#8b5cf6' },
                  { name: 'tools', icon: 'wrench', color: '#06b6d4' }
                ].forEach(category => {
                  const button = document.createElement('button');
                  button.className = 'p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-center group';
                  
                  const iconContainer = document.createElement('div');
                  iconContainer.className = 'flex flex-col items-center gap-3';
                  
                  const iconWrapper = document.createElement('div');
                  iconWrapper.className = 'w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform';
                  iconWrapper.style.backgroundColor = category.color + '20';
                  iconWrapper.appendChild(LucideIcon({ name: category.icon, size: 24, color: category.color }));
                  iconContainer.appendChild(iconWrapper);
                  
                  const nameEl = document.createElement('span');
                  nameEl.className = 'text-sm font-medium text-gray-700 capitalize';
                  nameEl.textContent = category.name;
                  iconContainer.appendChild(nameEl);
                  
                  button.appendChild(iconContainer);
                  button.addEventListener('click', () => setSearchQuery(category.name));
                  gridContainer.add(button);
                });
                return gridContainer;
              })()
                .build()
            )
            .build()
        )
        .add(
          // Footer
          center('mt-16 py-8 border-t border-gray-200')
            .add(
              container('text-center text-gray-500')
                .add(
                  container('flex items-center justify-center gap-2 mb-2')
                    .add(
                      (() => {
                        const iconEl = LucideIcon({ 
                          name: 'code', 
                          size: 16, 
                          color: '#6b7280' 
                        });
                        return iconEl;
                      })()
                    )
                    .add('Built with MikoJS Framework')
                    .build()
                )
                .add(
                  container('text-sm')
                    .add('Lucide Icons • 1666+ icons • Dynamic loading • Search & filter')
                    .build()
                )
                .build()
            )
            .build()
        )
        .build()
    )
    .build();
}

export default IconTest;