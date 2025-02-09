import { Directive, computed } from '@angular/core';

@Directive({
  selector: '[appInput]',
  standalone: true,
  host: {
    '[class]': 'inputClasses()'
  }
})
export class InputDirective {

  protected inputClasses = computed(() =>
    `
    bg-background-base/80 text-lg w-full ps-4 py-1 outline-none
    rounded-md border border-text-body-2/20
    focus:ring-2 focus:ring-text-body-2/20
    disabled:opacity-60
    [&.ng-invalid.ng-touched.ng-dirty]:border-feedback-error/60
    [&.ng-invalid.ng-touched.ng-dirty]:ring-feedback-error/50
    [&.ng-invalid.ng-touched.ng-dirty]:placeholder:text-feedback-error/70
    `
  )

}
