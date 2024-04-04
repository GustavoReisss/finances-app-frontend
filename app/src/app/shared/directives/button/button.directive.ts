import { Directive, computed, input } from '@angular/core';

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

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    '[class]': 'buttonClasses()'
  }
})
export class ButtonDirective {
  color = input<colorVariants>("primary")

  protected buttonClasses = computed(() =>
    `rounded-md border py-1 px-5 transition cursor-pointer ${variants[this.color()]} disabled:opacity-60 disabled:hover:bg-[unset]`
  )
}
