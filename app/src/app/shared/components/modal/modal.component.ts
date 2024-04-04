import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, computed, input, signal } from '@angular/core';

type Position = "center" | "left" | "right"

type PositionStyle = {
  [key in Position]: string
}

const POSITION_STYLE: PositionStyle = {
  "center": "transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "left": "transform top-1/2 left-0 -translate-y-1/2",
  "right": "transform top-1/2 right-0 -translate-y-1/2",
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger("modalChangeVisibility", [
      transition(':enter', [
        style({ opacity: 0 }),
        animate("200ms ease-out")
      ]),
      transition(':leave', [
        animate("200ms ease-out", style({ opacity: 0 })),
      ]),
    ]),
    trigger("backdropDelay", [
      transition(':enter', [
        style({ opacity: 0 }),
        animate("100ms ease-out")
      ]),
      transition(':leave', [
        animate("300ms ease-out", style({ opacity: 0 })),
      ]),
    ])
  ],
  host: {
    class: 'fixed'
  }
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>()

  @Input({ alias: 'open' })
  set _open(newValue: boolean) {
    this.changeOpenState(newValue)
  }

  backdrop = input(true)
  open = signal(false)

  userClasses = input('', { alias: 'class' })
  position = input<Position>("center")

  readonly _positionStyle = computed(() => POSITION_STYLE[this.position()])

  closeModal() {
    this.changeOpenState(false)
    this.close.emit()
  }

  changeOpenState(newState: boolean) {
    this.open.set(newState)
  }
}
