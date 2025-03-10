import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private themeService: ThemeService
  ) {
    effect(() => {
      document.body.setAttribute('theme', this.themeService.currentTheme());
    });
  }

}
