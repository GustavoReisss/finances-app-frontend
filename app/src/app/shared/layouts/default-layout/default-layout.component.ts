import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { HorizontalMenuComponent } from '../../components/horizontal-menu/horizontal-menu.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HorizontalMenuComponent,
    SideMenuComponent,
    AsyncPipe,
    CdkScrollableModule,
    NgTemplateOutlet
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {
  private layoutService = inject(LayoutService)
  portrait = this.layoutService.portrait
}
