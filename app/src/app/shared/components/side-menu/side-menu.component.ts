import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU_ITEMS } from '../horizontal-menu/horizontal-menu.component';
import { ThemeService } from '../../services/theme/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  themeService = inject(ThemeService)
  open = signal(false)

  menuItems = signal(MENU_ITEMS)


}
