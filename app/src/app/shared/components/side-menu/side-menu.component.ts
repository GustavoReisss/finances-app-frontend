import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  open = signal(false)

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
