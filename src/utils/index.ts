/**
 * Utility functions for DOM manipulation and common operations
 */

// DOM selector shorthand utility
export const $ = (selector: string): HTMLElement | null => {
  return document.querySelector(selector);
};

// Multi-element selector
export const $$ = (selector: string): NodeListOf<HTMLElement> => {
  return document.querySelectorAll(selector);
};

// Event utility for better event handling
export const on = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void => {
  element.addEventListener(event, handler, options);
};

// Remove event listener utility
export const off = (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
): void => {
  element.removeEventListener(event, handler);
};

// Debounce utility for search and performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

// Format game rating for display
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};