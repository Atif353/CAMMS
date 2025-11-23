import { useState, useEffect } from 'react';

/**
 * DARK MODE HOOK
 * 
 * Purpose: Manages dark mode state across the application
 * 
 * How it works:
 * 1. Checks localStorage for saved theme preference
 * 2. Falls back to system preference if no saved preference
 * 3. Adds/removes 'dark' class from HTML element
 * 4. Saves preference to localStorage
 * 
 * Easy to explain in viva:
 * - "I used React hooks to manage global dark mode state"
 * - "The theme persists across page reloads using localStorage"
 * - "It respects user's system preference by default"
 */
export const useDarkMode = () => {
  // Initialize state from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Otherwise, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update HTML class and localStorage whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Toggle function to switch between light and dark
  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return { isDark, toggleDarkMode };
};
