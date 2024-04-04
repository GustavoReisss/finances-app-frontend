import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("slide", [
      transition(':enter', [
        style({ height: 0 }),
        animate("200ms ease-out")
      ]),
      transition(':leave', [
        animate("200ms ease-out", style({ height: 0 })),
      ]),
    ])
  ],
  host: {
    "class": "grid grid-rows-[auto_auto]"
  }
})
export class AccordionComponent {
  openState = signal(false)

  @Input()
  set open(newState: boolean) {
    this.openState.set(newState)
  }

  toggleContent() {
    this.openState.set(!this.openState())
    console.log(this.openState())
  }
}
