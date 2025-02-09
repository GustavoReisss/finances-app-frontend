import { Directive, ElementRef, computed, effect, input } from '@angular/core';

type colorVariants = "primary" | "primary-variant" | "secondary" | "secondary-variant" | "accent" | "accent-variant" | "success" | "error" | "warning" | "info" | "text-1" | "text-2"
type styleVariants = "default" | "outline" | "link" | "ghost"

type ColorVariantStyle = {
  [color in colorVariants]: {
    [variant in styleVariants]: string
  }
}

const colors: ColorVariantStyle = {
  "primary": {
    "default": 'bg-primary-base border-primary-base text-primary-base-contrast hover:bg-primary-base/80',
    "outline": "bg-transparent border-primary-base text-primary-base hover:bg-primary-base/80 hover:text-primary-base-contrast",
    "ghost": "bg-transparent border-none text-primary-base hover:bg-primary-base/80 hover:text-primary-base-contrast",
    "link": "bg-transparent border-none text-primary-base hover:underline"
  },
  "primary-variant": {
    "default": 'bg-primary-variant-1 border-primary-variant-1 text-primary-variant-1-contrast hover:bg-primary-variant-1/80',
    "outline": 'bg-transparent border-primary-variant-1 text-primary-variant-1 hover:bg-primary-variant-1/80 hover:text-primary-variant-1-contrast',
    "ghost": 'bg-transparent border-none text-primary-variant-1 hover:bg-primary-variant-1/80 hover:text-primary-variant-1-contrast',
    "link": "bg-transparent border-none text-primary-variant-1 hover:underline"
  },
  "secondary": {
    "default": 'bg-secondary-base border-secondary-base text-secondary-base-contrast hover:bg-secondary-base/80',
    "outline": 'bg-transparent border-secondary-base text-secondary-base hover:bg-secondary-base/80 hover:text-secondary-base-contrast',
    "ghost": 'bg-transparent border-none text-secondary-base hover:bg-secondary-base/80 hover:text-secondary-base-contrast',
    "link": "bg-transparent border-none text-secondary-base hover:underline"
  },
  "secondary-variant": {
    "default": 'bg-secondary-variant-1 border-secondary-variant-1 text-secondary-variant-1-contrast hover:bg-secondary-variant-1/80',
    "outline": 'bg-transparent border-secondary-variant-1 text-secondary-variant-1 hover:bg-secondary-variant-1/80 hover:text-secondary-variant-1-contrast',
    "ghost": 'bg-transparent border-none text-secondary-variant-1 hover:bg-secondary-variant-1/80 hover:text-secondary-variant-1-contrast',
    "link": "bg-transparent border-none text-secondary-variant-1 hover:underline"
  },
  "accent": {
    "default": 'bg-accent-base border-accent-base text-accent-base-contrast hover:bg-accent-base/80',
    "outline": 'bg-transparent border-accent-base text-accent-base hover:bg-accent-base/80 hover:text-accent-base-contrast',
    "ghost": 'bg-transparent border-none text-accent-base hover:bg-accent-base/80 hover:text-accent-base-contrast',
    "link": "bg-transparent border-none text-accent-base hover:underline"
  },
  "accent-variant": {
    "default": 'bg-accent-variant-1 border-accent-variant-1 text-accent-variant-1-contrast hover:bg-accent-variant-1/80',
    "outline": 'bg-transparent border-accent-variant-1 text-accent-variant-1 hover:bg-accent-variant-1/80 hover:text-accent-variant-1-contrast',
    "ghost": 'bg-transparent border-none text-accent-variant-1 hover:bg-accent-variant-1/80 hover:text-accent-variant-1-contrast',
    "link": "bg-transparent border-none text-accent-variant-1 hover:underline"
  },
  "success": {
    "default": 'bg-feedback-success border-feedback-success text-feedback-success-contrast hover:bg-feedback-success/80',
    "outline": 'bg-transparent border-feedback-success text-feedback-success hover:bg-feedback-success/80 hover:text-feedback-success-contrast',
    "ghost": 'bg-transparent border-none text-feedback-success hover:bg-feedback-success/80 hover:text-feedback-success-contrast',
    "link": "bg-transparent border-none text-feedback-success hover:underline"
  },
  "error": {
    "default": 'bg-feedback-error border-feedback-error text-feedback-error-contrast hover:bg-feedback-error/80',
    "outline": 'bg-transparent border-feedback-error text-feedback-error hover:bg-feedback-error/80 hover:text-feedback-error-contrast',
    "ghost": 'bg-transparent border-none text-feedback-error hover:bg-feedback-error/80 hover:text-feedback-error-contrast',
    "link": "bg-transparent border-none text-feedback-error hover:underline"
  },
  "warning": {
    "default": 'bg-feedback-warning border-feedback-warning text-feedback-warning-contrast hover:bg-feedback-warning/80',
    "outline": 'bg-transparent border-feedback-warning text-feedback-warning hover:bg-feedback-warning/80 hover:text-feedback-warning-contrast',
    "ghost": 'bg-transparent border-none text-feedback-warning hover:bg-feedback-warning/80 hover:text-feedback-warning-contrast',
    "link": "bg-transparent border-none text-feedback-warning hover:underline"
  },
  "info": {
    "default": 'bg-feedback-info border-feedback-info text-feedback-info-contrast hover:bg-feedback-info/80',
    "outline": 'bg-transparent border-feedback-info text-feedback-info hover:bg-feedback-info/80 hover:text-feedback-info-contrast',
    "ghost": 'bg-transparent border-none text-feedback-info hover:bg-feedback-info/80 hover:text-feedback-info-contrast',
    "link": "bg-transparent border-none text-feedback-info hover:underline"
  },
  "text-1": {
    "default": 'bg-text-body-1 border-text-body-1 text-background-base hover:bg-text-body-1/80',
    "outline": 'bg-transparent border-text-body-1 text-text-body-1 hover:bg-text-body-1/80 hover:text-text-background-base',
    "ghost": 'bg-transparent border-none text-text-body-1 hover:bg-text-body-1/80 hover:text-text-background-base',
    "link": "bg-transparent border-none text-text-body-1 hover:underline"
  },
  "text-2": {
    "default": 'bg-text-body-2 border-text-body-2 text-background-base hover:bg-text-body-2/80',
    "outline": 'bg-transparent border-text-body-2 text-text-body-2 hover:bg-text-body-2/80 hover:text-text-background-base',
    "ghost": 'bg-transparent border-none text-text-body-2 hover:bg-text-body-2/80 hover:text-text-background-base',
    "link": "bg-transparent border-none text-text-body-2 hover:underline underline-offset-[5px]"
  }
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
  variant = input<styleVariants>("default")
  loading = input<boolean>(false)
  buttonContent = ""

  protected buttonClasses = computed(() =>
    `rounded-md border py-1 px-5 transition cursor-pointer ${colors[this.color()][this.variant()]} disabled:opacity-60 disabled:hover:opacity-50 disabled:cursor-default` +
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
