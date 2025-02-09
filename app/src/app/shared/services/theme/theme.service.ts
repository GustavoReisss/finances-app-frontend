import { Injectable, signal } from '@angular/core';

const AVAILABLE_THEMES = ['light', 'dark'];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal('dark');

  constructor() {
    const theme = localStorage.getItem('finances-app-theme');
    this.setTheme(theme)
  }

  setTheme(theme: any): void {
    if (typeof (theme) === 'string' && AVAILABLE_THEMES.includes(theme.toLocaleLowerCase())) {
      this.currentTheme.set(theme);
      localStorage.setItem('finances-app-theme', theme);
    }
  }
}
