/**
 * Dynamic CSS Theme Loader
 * Handles loading and switching between different CSS theme files
 */

// Import theme CSS files
import defaultCss from '../themes/default.css?inline';
import t3ChatCss from '../themes/t3-chat.css?inline';
import twitterCss from '../themes/twitter.css?inline';
import tangerineCss from '../themes/tangerine.css?inline';

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  cssContent?: string;
}

export const availableThemes: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean black & white theme',
    cssContent: defaultCss
  },
  {
    id: 't3-chat',
    name: 'T3 Chat',
    description: 'Purple-toned chat theme',
    cssContent: t3ChatCss
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Twitter-inspired blue theme',
    cssContent: twitterCss
  },
  {
    id: 'tangerine',
    name: 'Tangerine',
    description: 'Orange-accented theme',
    cssContent: tangerineCss
  }
];

class ThemeLoader {
  private currentThemeId: string = 't3-chat';
  private loadedStyleElement: HTMLStyleElement | null = null;
  private readonly STORAGE_KEY = 'selected-theme';

  constructor() {
    this.loadSavedTheme();
  }

  /**
   * Load theme from localStorage on initialization
   */
  private loadSavedTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.isValidThemeId(saved)) {
      this.loadTheme(saved);
    } else {
      // Load default T3 Chat theme
      this.loadTheme('t3-chat');
    }
  }

  /**
   * Validate theme ID exists in available themes
   */
  private isValidThemeId(themeId: string): boolean {
    return availableThemes.some(theme => theme.id === themeId);
  }

  /**
   * Get current active theme
   */
  getCurrentTheme(): ThemeConfig {
    return availableThemes.find(theme => theme.id === this.currentThemeId) || availableThemes[0];
  }

  /**
   * Load and apply a theme by ID
   */
  async loadTheme(themeId: string): Promise<void> {
    if (!this.isValidThemeId(themeId)) {
      console.warn(`Invalid theme ID: ${themeId}`);
      return;
    }

    const theme = availableThemes.find(t => t.id === themeId)!;
    
    // Remove existing loaded theme
    this.removeCurrentTheme();

    try {
      // Use imported CSS content
      if (!theme.cssContent) {
        throw new Error(`No CSS content available for theme: ${themeId}`);
      }
      
      // Create and inject style element
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-theme', themeId);
      styleElement.textContent = theme.cssContent;
      
      // Insert after the main CSS to ensure proper cascade
      const mainStyle = document.querySelector('style[data-theme="main"]') || 
                       document.querySelector('link[href*="index.css"]') ||
                       document.head.querySelector('style');
      
      if (mainStyle && mainStyle.nextSibling) {
        document.head.insertBefore(styleElement, mainStyle.nextSibling);
      } else {
        document.head.appendChild(styleElement);
      }

      this.loadedStyleElement = styleElement;
      this.currentThemeId = themeId;
      this.saveTheme(themeId);

      // Dispatch custom event for components to react to theme changes
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { themeId, theme }
      }));

    } catch (error) {
      console.error('Failed to load theme:', error);
      throw error;
    }
  }

  /**
   * Remove currently loaded theme styles
   */
  private removeCurrentTheme(): void {
    if (this.loadedStyleElement) {
      this.loadedStyleElement.remove();
      this.loadedStyleElement = null;
    }
  }

  /**
   * Save theme selection to localStorage
   */
  private saveTheme(themeId: string): void {
    localStorage.setItem(this.STORAGE_KEY, themeId);
  }

  /**
   * Get all available themes
   */
  getAvailableThemes(): ThemeConfig[] {
    return [...availableThemes];
  }

  /**
   * Switch to next theme (useful for cycling)
   */
  async switchToNextTheme(): Promise<void> {
    const currentIndex = availableThemes.findIndex(t => t.id === this.currentThemeId);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    await this.loadTheme(availableThemes[nextIndex].id);
  }
}

// Export singleton instance
export const themeLoader = new ThemeLoader();

// Export hook for React components
export function useThemeLoader() {
  return {
    loadTheme: (themeId: string) => themeLoader.loadTheme(themeId),
    getCurrentTheme: () => themeLoader.getCurrentTheme(),
    getAvailableThemes: () => themeLoader.getAvailableThemes(),
    switchToNextTheme: () => themeLoader.switchToNextTheme()
  };
}