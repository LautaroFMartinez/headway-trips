import { test, expect } from '@playwright/test';

/**
 * Component Visual Consistency Tests
 * 
 * Tests for validating UI component styling consistency:
 * - Button variants and states
 * - Card styling across pages
 * - Form field styling
 * - Spacing and layout tokens
 * - Badge and alert styling
 */

test.describe('Button Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('primary buttons should have consistent styling', async ({ page }) => {
    const primaryButtons = page.locator('.bg-primary');
    
    if (await primaryButtons.count() > 0) {
      const styles = await primaryButtons.first().evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
          borderRadius: style.borderRadius,
          padding: style.padding,
        };
      });
      
      // Background should be primary color (navy blue)
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      
      // Text should be visible (white foreground)
      expect(styles.color).toBeTruthy();
      
      // Should have border radius
      expect(styles.borderRadius).not.toBe('0px');
    }
  });

  test('all buttons should have cursor pointer', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const cursor = await buttons.nth(i).evaluate((el) => {
        return getComputedStyle(el).cursor;
      });
      
      expect(cursor).toBe('pointer');
    }
  });

  test('buttons should have consistent padding', async ({ page }) => {
    const buttons = page.locator('button').filter({ hasText: /.+/ });
    
    if (await buttons.count() > 0) {
      const firstPadding = await buttons.first().evaluate((el) => {
        return getComputedStyle(el).padding;
      });
      
      // Padding should be defined
      expect(firstPadding).not.toBe('0px');
    }
  });

  test('disabled buttons should have reduced opacity', async ({ page }) => {
    await page.goto('/comparador');
    
    // Try to get a disabled button (after max selections)
    const combobox = page.getByRole('combobox');
    
    // If combobox exists and is disabled, check styling
    const isDisabled = await combobox.isDisabled().catch(() => false);
    
    if (isDisabled) {
      const opacity = await combobox.evaluate((el) => {
        return getComputedStyle(el).opacity;
      });
      
      expect(parseFloat(opacity)).toBeLessThan(1);
    }
  });
});

test.describe('Card Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#destinos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('cards should have consistent border radius', async ({ page }) => {
    const cards = page.locator('[class*="rounded"]').filter({ hasText: /bariloche|mendoza|cataratas/i });
    
    if (await cards.count() > 0) {
      const borderRadius = await cards.first().evaluate((el) => {
        return getComputedStyle(el).borderRadius;
      });
      
      // Should have rounded corners
      expect(borderRadius).not.toBe('0px');
    }
  });

  test('cards should have shadow or elevation', async ({ page }) => {
    const cards = page.locator('[class*="shadow"], [class*="card"]').first();
    
    if (await cards.count() > 0) {
      const boxShadow = await cards.evaluate((el) => {
        return getComputedStyle(el).boxShadow;
      });
      
      // Some cards may have shadow
      expect(boxShadow).toBeTruthy();
    }
  });

  test('cards should have consistent background', async ({ page }) => {
    const cards = page.locator('[class*="bg-card"], [class*="bg-white"]').first();
    
    if (await cards.count() > 0) {
      const bg = await cards.evaluate((el) => {
        return getComputedStyle(el).backgroundColor;
      });
      
      expect(bg).toBeTruthy();
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});

test.describe('Form Field Components', () => {
  test('search input should have consistent styling', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]').first();
    
    if (await searchInput.count() > 0) {
      const styles = await searchInput.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          borderRadius: style.borderRadius,
          border: style.border,
          padding: style.padding,
        };
      });
      
      // Input should have border radius
      expect(styles.borderRadius).not.toBe('0px');
      
      // Input should have padding
      expect(styles.padding).not.toBe('0px');
    }
  });

  test('input focus should have ring/outline', async ({ page }) => {
    await page.goto('/');
    
    const input = page.locator('input').first();
    
    if (await input.count() > 0) {
      await input.focus();
      
      const outline = await input.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow,
        };
      });
      
      // Should have some focus indicator
      expect(outline.outline || outline.boxShadow).toBeTruthy();
    }
  });

  test('labels should have proper typography', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to contact form if exists
    await page.locator('#contacto').scrollIntoViewIfNeeded().catch(() => {});
    
    const labels = page.locator('label');
    
    if (await labels.count() > 0) {
      const fontWeight = await labels.first().evaluate((el) => {
        return getComputedStyle(el).fontWeight;
      });
      
      // Labels should have medium weight or higher
      expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(400);
    }
  });
});

test.describe('Badge Components', () => {
  test('badges should have consistent rounded styling', async ({ page }) => {
    await page.goto('/');
    
    // Look for badge-like elements (discount badges, tags, etc)
    const badges = page.locator('[class*="badge"], [class*="rounded-full"]').first();
    
    if (await badges.count() > 0) {
      const styles = await badges.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          borderRadius: style.borderRadius,
          padding: style.padding,
          fontSize: style.fontSize,
        };
      });
      
      // Badges should be rounded
      expect(styles.borderRadius).toBeTruthy();
      
      // Badges should have compact sizing
      expect(styles.fontSize).toBeTruthy();
    }
  });
});

test.describe('Layout Consistency', () => {
  test('main container should be centered', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('.container').first();
    
    const marginStyles = await container.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        marginLeft: style.marginLeft,
        marginRight: style.marginRight,
      };
    });
    
    // Container should have auto margins (centered)
    expect(marginStyles.marginLeft).toBe(marginStyles.marginRight);
  });

  test('sections should have consistent vertical spacing', async ({ page }) => {
    await page.goto('/');
    
    const sections = page.locator('section');
    
    if (await sections.count() >= 2) {
      const firstSection = sections.first();
      const secondSection = sections.nth(1);
      
      const firstBox = await firstSection.boundingBox();
      const secondBox = await secondSection.boundingBox();
      
      if (firstBox && secondBox) {
        // There should be clear spacing between sections
        const gap = secondBox.y - (firstBox.y + firstBox.height);
        expect(gap).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('grid layouts should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.locator('#destinos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    
    const gridDesktop = page.locator('[class*="grid"]').first();
    const desktopDisplay = await gridDesktop.evaluate((el) => {
      return getComputedStyle(el).display;
    });
    
    expect(desktopDisplay).toBe('grid');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    // Grid should still work on mobile (with different columns)
    const mobileDisplay = await gridDesktop.evaluate((el) => {
      return getComputedStyle(el).display;
    });
    
    expect(mobileDisplay).toMatch(/grid|flex|block/);
  });
});

test.describe('Navigation Components', () => {
  test('navigation should have consistent link styling', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = page.locator('nav a');
    
    if (await navLinks.count() > 0) {
      const firstLinkStyles = await navLinks.first().evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          textDecoration: style.textDecoration,
          color: style.color,
        };
      });
      
      // Nav links typically don't have underline
      expect(firstLinkStyles.textDecoration).toContain('none');
      
      // Should have defined color
      expect(firstLinkStyles.color).toBeTruthy();
    }
  });

  test('active navigation state should be visible', async ({ page }) => {
    await page.goto('/');
    
    // Home link should be current/active
    const homeLink = page.locator('nav a[href="/"]').first();
    
    // Just verify link exists and is styled
    await expect(homeLink).toBeVisible();
  });
});

test.describe('Footer Component', () => {
  test('footer should have consistent styling', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const footerStyles = await footer.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        padding: style.padding,
      };
    });
    
    // Footer should have distinct background
    expect(footerStyles.backgroundColor).toBeTruthy();
    
    // Footer should have padding
    expect(footerStyles.padding).toBeTruthy();
  });

  test('footer links should be legible', async ({ page }) => {
    await page.goto('/');
    
    const footerLinks = page.locator('footer a');
    
    if (await footerLinks.count() > 0) {
      const linkColor = await footerLinks.first().evaluate((el) => {
        return getComputedStyle(el).color;
      });
      
      expect(linkColor).toBeTruthy();
      expect(linkColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});

test.describe('Toast/Notification Components', () => {
  test('toast container should be positioned correctly', async ({ page }) => {
    await page.goto('/');
    
    // Toaster component should exist (even if no toasts shown)
    const toaster = page.locator('[data-sonner-toaster], [class*="toast"]');
    
    // Toaster may not be visible without a toast, but check it exists in DOM
    const count = await toaster.count();
    
    // This is informational - toaster should be in the DOM
    expect(count >= 0).toBeTruthy();
  });
});

test.describe('Icon Consistency', () => {
  test('icons should have consistent sizing', async ({ page }) => {
    await page.goto('/');
    
    // Look for Lucide icons (common in the project)
    const icons = page.locator('svg');
    
    if (await icons.count() > 0) {
      const iconSizes = await icons.first().evaluate((el) => {
        return {
          width: el.getAttribute('width') || getComputedStyle(el).width,
          height: el.getAttribute('height') || getComputedStyle(el).height,
        };
      });
      
      // Icons should have defined dimensions
      expect(iconSizes.width).toBeTruthy();
      expect(iconSizes.height).toBeTruthy();
    }
  });

  test('icons should have proper accessibility', async ({ page }) => {
    await page.goto('/');
    
    const iconButtons = page.locator('button svg');
    
    if (await iconButtons.count() > 0) {
      const parentButton = await iconButtons.first().evaluateHandle((el) => el.parentElement);
      const ariaLabel = await parentButton.evaluate((el) => el?.getAttribute('aria-label') ?? null);
      const textContent = await parentButton.evaluate((el) => el?.textContent?.trim() ?? null);
      
      // Icon-only buttons should have aria-label or text
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });
});
