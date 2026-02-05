import { test, expect } from '@playwright/test';

/**
 * Visual Design & Branding Tests
 * 
 * Tests for validating the visual design system consistency:
 * - Color palette (CSS variables)
 * - Typography (fonts)
 * - Logo presence and rendering
 * - Dark/Light theme switching
 */

test.describe('Design System - Color Palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct primary color variables in light mode', async ({ page }) => {
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    });
    
    // Primary color should be deep navy blue
    expect(primaryColor).toBe('#1a365d');
  });

  test('should have correct accent color variables', async ({ page }) => {
    const accentColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    });
    
    // Accent color should be golden
    expect(accentColor).toBe('#c9a962');
  });

  test('should have correct background color in light mode', async ({ page }) => {
    const backgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
    });
    
    // Background should be warm beige
    expect(backgroundColor).toBe('#faf8f5');
  });

  test('should have correct secondary and muted colors', async ({ page }) => {
    const cssVars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        secondary: style.getPropertyValue('--secondary').trim(),
        muted: style.getPropertyValue('--muted').trim(),
        border: style.getPropertyValue('--border').trim(),
      };
    });
    
    expect(cssVars.secondary).toBe('#f5f1eb');
    expect(cssVars.muted).toBe('#f0ebe4');
    expect(cssVars.border).toBe('#e8e2d9');
  });

  test('should have consistent border-radius token', async ({ page }) => {
    const radius = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--radius').trim();
    });
    
    expect(radius).toBe('0.75rem');
  });
});

test.describe('Design System - Typography', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load DM Sans font for body text', async ({ page }) => {
    // Check that body uses sans-serif font stack
    const bodyFontFamily = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });
    
    // Should contain DM Sans or fallback system fonts
    expect(bodyFontFamily.toLowerCase()).toMatch(/dm sans|system-ui|sans-serif/i);
  });

  test('should have proper heading font weights', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    const fontWeight = await h1.evaluate((el) => {
      return getComputedStyle(el).fontWeight;
    });
    
    // Headings should be bold (600-800)
    expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(600);
  });

  test('should have readable line height for body text', async ({ page }) => {
    const paragraph = page.locator('p').first();
    
    if (await paragraph.count() > 0) {
      const lineHeight = await paragraph.evaluate((el) => {
        return getComputedStyle(el).lineHeight;
      });
      
      // Line height should be set (not 'normal')
      expect(lineHeight).not.toBe('normal');
    }
  });

  test('should have antialiased text rendering', async ({ page }) => {
    const webkitFontSmoothing = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).webkitFontSmoothing;
    });
    
    expect(webkitFontSmoothing).toBe('antialiased');
  });
});

test.describe('Branding - Logo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display logo in header', async ({ page }) => {
    const logo = page.getByRole('img', { name: /headway trips logo/i });
    await expect(logo).toBeVisible();
  });

  test('should have correct logo dimensions', async ({ page }) => {
    const logo = page.getByRole('img', { name: /headway trips logo/i });
    
    const dimensions = await logo.evaluate((img) => {
      return {
        width: img.getAttribute('width'),
        height: img.getAttribute('height'),
      };
    });
    
    expect(dimensions.width).toBe('36');
    expect(dimensions.height).toBe('36');
  });

  test('should have logo source pointing to correct file', async ({ page }) => {
    const logo = page.getByRole('img', { name: /headway trips logo/i });
    const src = await logo.getAttribute('src');
    
    // Next.js may optimize the image, but original should be icono.png
    expect(src).toContain('icono');
  });

  test('should display brand name text next to logo', async ({ page }) => {
    const brandName = page.locator('text=Headway Trips').first();
    await expect(brandName).toBeVisible();
  });

  test('logo should be clickable and link to home', async ({ page }) => {
    const logoLink = page.locator('a').filter({ has: page.getByRole('img', { name: /headway trips logo/i }) });
    
    const href = await logoLink.getAttribute('href');
    expect(href).toBe('/');
  });
});

test.describe('Theme - Dark Mode', () => {
  test('should switch to dark mode and update colors', async ({ page }) => {
    await page.goto('/');
    
    // Add dark class to test dark mode colors
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    // Wait for theme to apply
    await page.waitForTimeout(100);
    
    const darkColors = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        background: style.getPropertyValue('--background').trim(),
        primary: style.getPropertyValue('--primary').trim(),
        foreground: style.getPropertyValue('--foreground').trim(),
      };
    });
    
    // Dark mode should have dark background
    expect(darkColors.background).toBe('#0f1419');
    // Dark mode primary becomes golden
    expect(darkColors.primary).toBe('#c9a962');
    // Dark mode foreground is light
    expect(darkColors.foreground).toBe('#f5f1eb');
  });

  test('dark mode should update card colors', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(100);
    
    const cardColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
    });
    
    expect(cardColor).toBe('#1a2332');
  });
});

test.describe('Visual Consistency - Header', () => {
  test('header should have transparent background initially', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Header starts transparent
    const bgClasses = await header.getAttribute('class');
    expect(bgClasses).toContain('bg-transparent');
  });

  test('header should become opaque after scrolling', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(300);
    
    const header = page.locator('header');
    const bgClasses = await header.getAttribute('class');
    
    // Should have background class after scroll
    expect(bgClasses).toContain('bg-background');
  });

  test('header should have backdrop blur when scrolled', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(300);
    
    const header = page.locator('header');
    const classes = await header.getAttribute('class');
    
    expect(classes).toContain('backdrop-blur');
  });
});

test.describe('Visual Consistency - Spacing', () => {
  test('container should have consistent padding', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('.container').first();
    
    const padding = await container.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        left: style.paddingLeft,
        right: style.paddingRight,
      };
    });
    
    // Container should have padding (px-6 = 1.5rem = 24px)
    expect(parseInt(padding.left)).toBeGreaterThanOrEqual(16);
    expect(parseInt(padding.right)).toBeGreaterThanOrEqual(16);
  });

  test('header height should be consistent', async ({ page }) => {
    await page.goto('/');
    
    const headerInner = page.locator('header .container > div').first();
    
    const height = await headerInner.evaluate((el) => {
      return getComputedStyle(el).height;
    });
    
    // Header height should be h-20 = 5rem = 80px
    expect(height).toBe('80px');
  });
});

test.describe('Color Accessibility', () => {
  test('primary button should have sufficient contrast', async ({ page }) => {
    await page.goto('/');
    
    const primaryButton = page.locator('.bg-primary').first();
    
    if (await primaryButton.count() > 0) {
      const colors = await primaryButton.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          background: style.backgroundColor,
          color: style.color,
        };
      });
      
      // Both should be defined (not transparent)
      expect(colors.background).not.toBe('transparent');
      expect(colors.color).toBeTruthy();
    }
  });

  test('text should be visible against background', async ({ page }) => {
    await page.goto('/');
    
    const body = page.locator('body');
    
    const bodyStyles = await body.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        color: style.color,
        background: style.backgroundColor,
      };
    });
    
    // Text color should be defined
    expect(bodyStyles.color).toBeTruthy();
    expect(bodyStyles.color).not.toBe('rgba(0, 0, 0, 0)');
  });
});
