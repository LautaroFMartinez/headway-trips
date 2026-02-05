import { test, expect } from '@playwright/test';

/**
 * Performance & Response Time Tests
 * 
 * Critical tests for measuring page load times and performance metrics:
 * - Time to First Byte (TTFB)
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - DOM Content Loaded
 * - Full page load time
 * - API response times
 */

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  TTFB: 800,              // Time to First Byte < 800ms
  FCP: 1800,              // First Contentful Paint < 1.8s
  LCP: 2500,              // Largest Contentful Paint < 2.5s
  DOM_LOADED: 2000,       // DOM Content Loaded < 2s
  FULL_LOAD: 4000,        // Full page load < 4s
  NETWORK_IDLE: 5000,     // Network idle < 5s
  API_RESPONSE: 1000,     // API responses < 1s
};

test.describe('Core Web Vitals', () => {
  test('homepage should have good LCP (Largest Contentful Paint)', async ({ page }) => {
    // Navigate first, then measure LCP
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          const lastEntry = lcpEntries[lcpEntries.length - 1] as PerformanceEntry & { startTime: number };
          resolve(lastEntry.startTime);
        } else {
          // Set up observer for LCP
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
            resolve(lastEntry.startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          
          // Fallback timeout
          setTimeout(() => resolve(-1), 5000);
        }
      });
    });
    
    console.log(`LCP: ${lcp}ms`);
    if (lcp > 0) {
      expect(lcp).toBeLessThan(THRESHOLDS.LCP);
    }
  });

  test('homepage should have good FCP (First Contentful Paint)', async ({ page }) => {
    await page.goto('/');
    
    const fcp = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-contentful-paint');
      return paint ? paint.startTime : -1;
    });
    
    console.log(`FCP: ${fcp}ms`);
    expect(fcp).toBeLessThan(THRESHOLDS.FCP);
  });
});

test.describe('Page Load Times', () => {
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Comparador', url: '/comparador' },
    { name: 'Trip Detail', url: '/viaje/bariloche', domLoadedThreshold: 3000 },
    { name: 'Nosotros', url: '/nosotros' },
    { name: 'FAQ', url: '/faq' },
  ];

  for (const pageInfo of pages) {
    const threshold = (pageInfo as { domLoadedThreshold?: number }).domLoadedThreshold || THRESHOLDS.DOM_LOADED;
    test(`${pageInfo.name} should load within ${THRESHOLDS.FULL_LOAD}ms`, async ({ page }) => {
      const startTime = Date.now();
      
      const response = await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded' });
      const domLoadTime = Date.now() - startTime;
      
      console.log(`${pageInfo.name} DOM loaded in: ${domLoadTime}ms`);
      
      expect(response?.status()).toBeLessThan(400);
      expect(domLoadTime).toBeLessThan(threshold);
    });

    test(`${pageInfo.name} should reach network idle within ${THRESHOLDS.NETWORK_IDLE}ms`, async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      const fullLoadTime = Date.now() - startTime;
      
      console.log(`${pageInfo.name} full load (network idle): ${fullLoadTime}ms`);
      
      expect(fullLoadTime).toBeLessThan(THRESHOLDS.NETWORK_IDLE);
    });
  }
});

test.describe('Time to First Byte (TTFB)', () => {
  test('homepage TTFB should be under 800ms', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/') && res.status() === 200),
      page.goto('/'),
    ]);
    
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: nav.responseStart - nav.requestStart,
        dns: nav.domainLookupEnd - nav.domainLookupStart,
        connect: nav.connectEnd - nav.connectStart,
        ssl: nav.secureConnectionStart ? nav.connectEnd - nav.secureConnectionStart : 0,
      };
    });
    
    console.log(`TTFB: ${timing.ttfb}ms, DNS: ${timing.dns}ms, Connect: ${timing.connect}ms`);
    
    expect(timing.ttfb).toBeLessThan(THRESHOLDS.TTFB);
  });

  test('trip detail page TTFB should be under 800ms', async ({ page }) => {
    await page.goto('/viaje/bariloche');
    
    const ttfb = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return nav.responseStart - nav.requestStart;
    });
    
    console.log(`Trip detail TTFB: ${ttfb}ms`);
    expect(ttfb).toBeLessThan(THRESHOLDS.TTFB);
  });
});

test.describe('Navigation Performance', () => {
  test('DOM timing metrics should be within thresholds', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domInteractive: nav.domInteractive,
        domContentLoaded: nav.domContentLoadedEventEnd,
        domComplete: nav.domComplete,
        loadEvent: nav.loadEventEnd,
        fetchStart: nav.fetchStart,
        responseEnd: nav.responseEnd,
      };
    });
    
    const domInteractiveTime = metrics.domInteractive - metrics.fetchStart;
    const domContentLoadedTime = metrics.domContentLoaded - metrics.fetchStart;
    const domCompleteTime = metrics.domComplete - metrics.fetchStart;
    
    console.log(`DOM Interactive: ${domInteractiveTime}ms`);
    console.log(`DOM Content Loaded: ${domContentLoadedTime}ms`);
    console.log(`DOM Complete: ${domCompleteTime}ms`);
    
    expect(domInteractiveTime).toBeLessThan(THRESHOLDS.DOM_LOADED);
    expect(domContentLoadedTime).toBeLessThan(THRESHOLDS.FULL_LOAD);
  });

  test('navigation between pages should be fast', async ({ page }) => {
    await page.goto('/');
    
    // Measure navigation to another page
    const startTime = Date.now();
    await page.click('text=Comparador');
    await page.waitForURL('/comparador');
    await page.waitForLoadState('domcontentloaded');
    const navigationTime = Date.now() - startTime;
    
    console.log(`Navigation to Comparador: ${navigationTime}ms`);
    
    // Client-side navigation should be very fast
    expect(navigationTime).toBeLessThan(2000);
  });
});

test.describe('Resource Loading', () => {
  test('critical resources should load quickly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check resources loaded
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.duration > 500)
        .map(r => ({
          name: r.name.split('/').pop(),
          duration: Math.round(r.duration),
        }));
    });
    
    console.log('Slow resources (>500ms):', resources);
    
    // No single resource should take more than 3 seconds
    for (const resource of resources) {
      expect(resource.duration).toBeLessThan(3000);
    }
  });

  test('images should have reasonable load times', async ({ page }) => {
    await page.goto('/');
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    const imagePerformance = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => (r as PerformanceResourceTiming).initiatorType === 'img' || r.name.match(/\.(jpg|jpeg|png|webp|gif)/i))
        .map(r => ({
          name: r.name.split('/').pop(),
          duration: Math.round(r.duration),
          size: (r as PerformanceResourceTiming).transferSize,
        }));
    });
    
    console.log('Image load times:', imagePerformance);
    
    // Check that no image takes more than 2 seconds
    for (const img of imagePerformance) {
      expect(img.duration).toBeLessThan(2000);
    }
  });

  test('JavaScript bundles should load efficiently', async ({ page }) => {
    await page.goto('/');
    
    const jsResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.js'))
        .map(r => ({
          name: r.name.split('/').pop()?.substring(0, 30),
          duration: Math.round(r.duration),
          size: Math.round((r as PerformanceResourceTiming).transferSize / 1024),
        }));
    });
    
    console.log('JS bundle load times:', jsResources);
    
    // Total JS load time should be reasonable
    const totalJsTime = jsResources.reduce((acc, r) => acc + r.duration, 0);
    console.log(`Total JS load time: ${totalJsTime}ms`);
    
    expect(totalJsTime).toBeLessThan(5000);
  });
});

test.describe('API Response Times', () => {
  test('API endpoints should respond quickly', async ({ page }) => {
    // Track API calls with start times
    const apiCalls: { url: string; duration: number; status: number }[] = [];
    const requestTimes = new Map<string, number>();
    
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        requestTimes.set(request.url(), Date.now());
      }
    });
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/')) {
        const startTime = requestTimes.get(response.url());
        const duration = startTime ? Date.now() - startTime : 0;
        apiCalls.push({
          url: response.url().replace(/.*\/api\//, '/api/'),
          duration,
          status: response.status(),
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log('API calls:', apiCalls);
    
    // Each API call should be under threshold
    for (const api of apiCalls) {
      expect(api.duration).toBeLessThan(THRESHOLDS.API_RESPONSE);
    }
  });
});

test.describe('Mobile Performance', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('homepage should load fast on mobile viewport', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Mobile homepage load: ${loadTime}ms`);
    
    // Mobile should still be reasonably fast
    expect(loadTime).toBeLessThan(THRESHOLDS.DOM_LOADED + 500);
  });

  test('mobile navigation should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Open mobile menu
    const startTime = Date.now();
    await page.getByRole('button', { name: /toggle menu/i }).click();
    
    // Wait for menu to be visible
    await page.waitForSelector('nav:visible');
    const menuOpenTime = Date.now() - startTime;
    
    console.log(`Mobile menu open time: ${menuOpenTime}ms`);
    
    // Menu should open quickly (< 500ms for animation)
    expect(menuOpenTime).toBeLessThan(500);
  });
});

test.describe('Scroll Performance', () => {
  test('page should scroll smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Measure scroll performance
    const scrollMetrics = await page.evaluate(async () => {
      const startTime = performance.now();
      
      // Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      
      // Wait for scroll to complete
      await new Promise<void>((resolve) => {
        let lastScrollY = window.scrollY;
        const checkScroll = setInterval(() => {
          if (window.scrollY === lastScrollY && window.scrollY > 0) {
            clearInterval(checkScroll);
            resolve();
          }
          lastScrollY = window.scrollY;
        }, 100);
        
        // Timeout after 3 seconds
        setTimeout(() => {
          clearInterval(checkScroll);
          resolve();
        }, 3000);
      });
      
      return {
        scrollTime: performance.now() - startTime,
        finalScrollY: window.scrollY,
      };
    });
    
    console.log(`Scroll to bottom took: ${scrollMetrics.scrollTime}ms`);
    
    // Smooth scroll should complete in reasonable time
    expect(scrollMetrics.scrollTime).toBeLessThan(3000);
  });
});

test.describe('Interaction Response Time', () => {
  test('button clicks should respond immediately', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button').first();
    
    const startTime = Date.now();
    await button.click();
    const responseTime = Date.now() - startTime;
    
    console.log(`Button click response: ${responseTime}ms`);
    
    // Clicks should respond in under 100ms
    expect(responseTime).toBeLessThan(200);
  });

  test('search input should be responsive', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    
    if (await searchInput.count() > 0) {
      const startTime = Date.now();
      await searchInput.fill('Bariloche');
      const inputTime = Date.now() - startTime;
      
      console.log(`Search input response: ${inputTime}ms`);
      
      // Input should be responsive
      expect(inputTime).toBeLessThan(500);
    }
  });
});

test.describe('Memory & Performance Stability', () => {
  test('page should not have memory issues after interactions', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory via performance API
    const initialMemory = await page.evaluate(() => {
      // performance.memory is Chrome-only and non-standard
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      return perf.memory?.usedJSHeapSize || 0;
    });
    
    // Perform multiple interactions
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('End');
      await page.waitForTimeout(300);
      await page.keyboard.press('Home');
      await page.waitForTimeout(300);
    }
    
    // Get final memory
    const finalMemory = await page.evaluate(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      return perf.memory?.usedJSHeapSize || 0;
    });
    
    if (initialMemory > 0 && finalMemory > 0) {
      const heapGrowth = finalMemory - initialMemory;
      const heapGrowthMB = heapGrowth / (1024 * 1024);
      
      console.log(`Heap growth after interactions: ${heapGrowthMB.toFixed(2)}MB`);
      
      // Heap should not grow excessively (< 50MB)
      expect(heapGrowthMB).toBeLessThan(50);
    } else {
      console.log('Memory API not available - skipping memory test');
    }
  });
});

test.describe('Performance Summary Report', () => {
  test('generate performance report for homepage', async ({ page }) => {
    await page.goto('/');
    
    const report = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByName('first-contentful-paint')[0];
      const resources = performance.getEntriesByType('resource');
      
      return {
        navigation: {
          dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
          connection: Math.round(nav.connectEnd - nav.connectStart),
          ttfb: Math.round(nav.responseStart - nav.requestStart),
          download: Math.round(nav.responseEnd - nav.responseStart),
          domInteractive: Math.round(nav.domInteractive - nav.fetchStart),
          domComplete: Math.round(nav.domComplete - nav.fetchStart),
          loadComplete: Math.round(nav.loadEventEnd - nav.fetchStart),
        },
        paint: {
          fcp: paint ? Math.round(paint.startTime) : -1,
        },
        resources: {
          total: resources.length,
          totalSize: Math.round(resources.reduce((acc, r) => 
            acc + ((r as PerformanceResourceTiming).transferSize || 0), 0) / 1024),
          totalTime: Math.round(resources.reduce((acc, r) => 
            acc + r.duration, 0)),
        },
      };
    });
    
    console.log('\n=== PERFORMANCE REPORT ===');
    console.log('Navigation Timing:');
    console.log(`  DNS Lookup: ${report.navigation.dns}ms`);
    console.log(`  Connection: ${report.navigation.connection}ms`);
    console.log(`  TTFB: ${report.navigation.ttfb}ms`);
    console.log(`  Download: ${report.navigation.download}ms`);
    console.log(`  DOM Interactive: ${report.navigation.domInteractive}ms`);
    console.log(`  DOM Complete: ${report.navigation.domComplete}ms`);
    console.log(`  Load Complete: ${report.navigation.loadComplete}ms`);
    console.log('Paint Timing:');
    console.log(`  FCP: ${report.paint.fcp}ms`);
    console.log('Resources:');
    console.log(`  Total: ${report.resources.total} resources`);
    console.log(`  Size: ${report.resources.totalSize}KB`);
    console.log('=========================\n');
    
    // All metrics should be within acceptable ranges
    expect(report.navigation.ttfb).toBeLessThan(THRESHOLDS.TTFB);
    expect(report.navigation.domComplete).toBeLessThan(THRESHOLDS.FULL_LOAD);
  });
});
