import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-horizontal-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './horizontal-menu.component.html',
  styleUrl: './horizontal-menu.component.scss'
})
export class HorizontalMenuComponent {
  menuItems = signal([
    {
      "route": "/organizacao-financeira",
      "icon": "savings",
      "label": "Minhas Finanças"
    },
    {
      "route": "/acoes",
      "icon": "monitoring",
      "label": "Ações"
    },
    {
      "route": "/steps",
      "icon": "rebase",
      "label": "Steps"
    }
  ])
}
