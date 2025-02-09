import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { FormsModule } from '@angular/forms';

export const MENU_ITEMS = [
  {
    "route": "/dashboard",
    "icon": "dashboard_customize",
    "label": "Dashboard"
  },
  {
    "route": "/organizacao-financeira",
    "icon": "savings",
    "label": "Minhas Finanças"
  },
  {
    "route": "/investimentos",
    "icon": "monitoring",
    "label": "Investimentos"
  },
  {
    "route": "/educacao-financeira",
    "icon": "school",
    "label": "Educação Financeira"
  }
]

@Component({
  selector: 'app-horizontal-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './horizontal-menu.component.html',
  styleUrl: './horizontal-menu.component.scss'
})
export class HorizontalMenuComponent {
  menuItems = signal(MENU_ITEMS)

  themeService = inject(ThemeService)

}
