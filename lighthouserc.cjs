module.exports = {
  ci: {
    collect: {
      startServerCommand: 'python3 -m http.server 8765 --bind 127.0.0.1',
      startServerReadyPattern: 'Serving HTTP',
      startServerReadyTimeout: 10000,
      url: ['/', '/engineering/', '/products/property-os/', '/insights/mcp-permission-boundaries/'].map(p => 'http://127.0.0.1:8765' + p),
      numberOfRuns: 2,
      settings: {chromeFlags: '--no-sandbox --disable-dev-shm-usage'}
    },
    assert: { assertions: {
      'categories:performance': ['warn', { minScore: 0.85, aggregationMethod: 'median' }],
      'categories:accessibility': ['warn', { minScore: 0.95, aggregationMethod: 'median' }],
      'categories:best-practices': ['warn', { minScore: 0.9 }],
      'categories:seo': ['warn', { minScore: 0.95 }],
      'largest-contentful-paint': ['warn', { maxNumericValue: 2500, aggregationMethod: 'median' }],
      'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1, aggregationMethod: 'median' }]
    }},
    upload: { target: 'filesystem', outputDir: './lighthouse-report' }
  }
};
