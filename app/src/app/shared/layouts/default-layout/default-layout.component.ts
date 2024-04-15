import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { map, Subscription } from 'rxjs';
import { HorizontalMenuComponent } from '../../components/horizontal-menu/horizontal-menu.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';

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
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  showSelectedFeatures = signal(false)
  responsive = inject(BreakpointObserver)
  lastPortraitState: null | boolean = null

  displayChangeSub!: Subscription

  portrait = signal(false)

  ngOnInit(): void {
    this.displayChangeSub = this.responsive.observe(Breakpoints.HandsetPortrait)
      .pipe(
        map(state => state.matches)
      ).subscribe(state => this.portrait.set(state))
  }

  toggle() {
    this.showSelectedFeatures.set(!this.showSelectedFeatures())
  }

  ngOnDestroy(): void {
    this.displayChangeSub.unsubscribe()
  }


}
