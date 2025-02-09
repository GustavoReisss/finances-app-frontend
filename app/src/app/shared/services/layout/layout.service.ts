import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { map, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LayoutService implements OnDestroy {
  private responsive = inject(BreakpointObserver)
  private displayChangeSub!: Subscription
  portrait = signal(false)

  constructor() {
    this.displayChangeSub = this.responsive.observe(Breakpoints.HandsetPortrait)
      .pipe(
        map(state => state.matches)
      ).subscribe(state => this.portrait.set(state))
  }

  ngOnDestroy(): void {
    this.displayChangeSub.unsubscribe()
  }
}
