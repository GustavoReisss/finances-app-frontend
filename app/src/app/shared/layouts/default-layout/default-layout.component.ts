import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
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
    CdkScrollableModule
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {
  showSelectedFeatures = signal(false)
  responsive = inject(BreakpointObserver)

  portrait = this.responsive.observe(Breakpoints.HandsetPortrait)
    .pipe(map(state => state.matches))

  toggle() {
    this.showSelectedFeatures.set(!this.showSelectedFeatures())
  }

  // ngOnInit(): void {
  //   this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(value => console.log(value))
  // }

}
