import { Directive, ElementRef, computed, effect, input } from '@angular/core';

type colorVariants = "primary" | "danger" | "secondary" | "accent"

type VarianteStyle = {
  [color in colorVariants]: string
}

const variants: VarianteStyle = {
  primary: 'bg-primary-500 border-primary-600 hover:bg-primary-600',
  secondary: 'bg-secondary-500 border-secondary-500 hover:bg-secondary-600',
  accent: 'bg-accent-500 border-accent-500 hover:bg-accent-600',
  danger: 'bg-danger-500 border-danger-500 hover:bg-danger-600',
}

const LoadingContent = `
  <div class="w-full grid items-center">
    <span class="material-symbols-outlined animate-spin"> progress_activity </span>
  </div>
`

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    '[class]': 'buttonClasses()'
  }
})
export class ButtonDirective {
  color = input<colorVariants>("primary")
  loading = input<boolean>(false)
  buttonContent = ""

  protected buttonClasses = computed(() =>
    `rounded-md border py-1 px-5 transition cursor-pointer ${variants[this.color()]} disabled:opacity-60 disabled:hover:bg-[unset] ` +
    `${this.loading() ? `animate-pulse opacity-90` : ''}`
  )

  constructor(private buttom: ElementRef) {
  }

  toggleLoading = effect(() => {
    if (this.loading()) {
      this.buttonContent = this.buttom.nativeElement.innerHTML;
      this.buttom.nativeElement.innerHTML = LoadingContent
      return
    }

    if (this.buttonContent) {
      this.buttom.nativeElement.innerHTML = this.buttonContent;
    }

  }, { allowSignalWrites: true })

  // ngOnInit() {
  //   this.buttom.nativeElement.innerHTML = LoadingContent
  // }
}
