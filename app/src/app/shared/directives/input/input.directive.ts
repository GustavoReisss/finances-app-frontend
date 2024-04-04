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
    bg-[transparent] text-lg w-full ps-4 py-1 outline-none
    rounded-md border border-primary-500
    focus:ring-2 focus:ring--primary-500
    disabled:opacity-70
    [&.ng-invalid.ng-touched.ng-dirty]:border-danger-500/60
    [&.ng-invalid.ng-touched.ng-dirty]:ring-danger-500/50
    [&.ng-invalid.ng-touched.ng-dirty]:placeholder:text-danger-500/70
    `
  )

}
