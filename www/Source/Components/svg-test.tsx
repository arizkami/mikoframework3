import { container, center, svg, createSVGElement } from '../../Frameworks/MikoJS.framework';
import { 
  MikoSVGCanvas, 
  MikoIconBuilder, 
  createMikoIcon, 
  mikoAnimations 
} from '../../Library/MikoSVG.ext';

// SVG Test Component showcasing comprehensive SVG support
function SVGTest() {
  // Create a custom SVG canvas
  const createCustomSVG = () => {
    const canvas = new MikoSVGCanvas(200, 200);
    
    // Add gradient
    canvas.addLinearGradient('myGradient', [
      { offset: '0%', color: '#3b82f6' },
      { offset: '50%', color: '#8b5cf6' },
      { offset: '100%', color: '#ec4899' }
    ]);
    
    // Draw shapes
    canvas.drawCircle(100, 100, 80, { 
      fill: 'url(#myGradient)', 
      stroke: '#1f2937', 
      strokeWidth: 2 
    });
    
    canvas.drawText('SVG', 100, 110, { 
      textAnchor: 'middle', 
      fontSize: '24px', 
      fill: 'white', 
      fontWeight: 'bold' 
    });
    
    return canvas.build();
  };

  // Create animated icon
  const createAnimatedIcon = () => {
    const icon = new MikoIconBuilder(48)
      .star()
      .fill('#f59e0b')
      .stroke('#d97706', 2)
      .build();
    
    // Add spin animation
    icon.animate(mikoAnimations.spin, {
      duration: 2000,
      iterations: Infinity
    });
    
    return icon;
  };

  return container('min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6')
    .add(
      container('max-w-4xl mx-auto')
        .add(
          // Header
          center('text-center mb-12')
            .title('SVG Integration Test', 'text-4xl font-bold text-gray-900 mb-4')
            .subtitle('MikoJS Framework with Enhanced SVG Support', 'text-lg text-gray-600 mb-8')
            .build()
        )
        .add(
          // SVG Examples Grid
          container('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')
            .add(
              // Custom SVG Canvas
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('text-lg font-semibold text-gray-900 mb-4')
                    .add('Custom SVG Canvas')
                    .build()
                )
                .add(
                  container('flex justify-center mb-4')
                    .add(createCustomSVG())
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Created with MikoSVGCanvas: gradients, shapes, and text')
                    .build()
                )
                .build()
            )
            .add(
              // Animated Icons
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('text-lg font-semibold text-gray-900 mb-4')
                    .add('Animated Icons')
                    .build()
                )
                .add(
                  container('flex justify-center items-center gap-4 mb-4 h-24')
                    .add(createAnimatedIcon())
                    .add(
                      (() => {
                        const heart = createMikoIcon('heart', 48);
                        heart.animate(mikoAnimations.pulse, {
                          duration: 1500,
                          iterations: Infinity
                        });
                        return heart;
                      })()
                    )
                    .add(
                      (() => {
                        const check = createMikoIcon('check', 48);
                        check.animate(mikoAnimations.bounce, {
                          duration: 1000,
                          iterations: Infinity
                        });
                        return check;
                      })()
                    )
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Built-in icons with CSS animations: spin, pulse, bounce')
                    .build()
                )
                .build()
            )
            .add(
              // Native SVG Elements
              container('bg-white rounded-xl p-6 shadow-sm border border-gray-200')
                .add(
                  container('text-lg font-semibold text-gray-900 mb-4')
                    .add('Native SVG Elements')
                    .build()
                )
                .add(
                  container('flex justify-center mb-4')
                    .add(
                      svg({
                        width: 120,
                        height: 120,
                        viewBox: '0 0 120 120',
                        className: 'border border-gray-200 rounded'
                      },
                        createSVGElement('rect', { 
                          x: 10, y: 10, width: 100, height: 100, 
                          fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2, rx: 8 
                        }),
                        createSVGElement('circle', { 
                          cx: 60, cy: 60, r: 30, 
                          fill: '#6366f1', opacity: 0.8 
                        }),
                        createSVGElement('text', { 
                          x: 60, y: 67, textAnchor: 'middle', 
                          fontSize: '14px', fill: 'white', fontWeight: 'bold' 
                        }, 'MikoJS')
                      )
                    )
                    .build()
                )
                .add(
                  container('text-sm text-gray-600')
                    .add('Direct SVG element creation with MikoJS createElement')
                    .build()
                )
                .build()
            )
            .build()
        )
        .add(
          // Features Overview
          container('mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-200')
            .add(
              container('text-xl font-semibold text-gray-900 mb-6')
                .add('SVG Framework Features')
                .build()
            )
            .add(
              container('grid grid-cols-1 md:grid-cols-2 gap-6')
                .add(
                  container('space-y-3')
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Native SVG namespace support')
                            .build()
                        )
                        .build()
                    )
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Fluent API with method chaining')
                            .build()
                        )
                        .build()
                    )
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Built-in animation presets')
                            .build()
                        )
                        .build()
                    )
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Gradient and pattern support')
                            .build()
                        )
                        .build()
                    )
                    .build()
                )
                .add(
                  container('space-y-3')
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Icon builder with common shapes')
                            .build()
                        )
                        .build()
                    )
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Canvas-style drawing API')
                            .build()
                        )
                        .build()
                    )
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('TypeScript support with full typing')
                            .build()
                        )
                        .build()
                    )
                    .add(
                      container('flex items-center gap-3')
                        .add(createMikoIcon('check', 20))
                        .add(
                          container('text-gray-700')
                            .add('Seamless MikoJS DSL integration')
                            .build()
                        )
                        .build()
                    )
                    .build()
                )
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
                    .add(createMikoIcon('code', 16))
                    .add('Enhanced SVG Support for MikoJS Framework')
                    .build()
                )
                .add(
                  container('text-sm')
                    .add('Native SVG • Animations • Gradients • Canvas API • Icon Builder')
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

export default SVGTest;