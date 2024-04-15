import { Directive, Input, signal, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appGridItem]',
  standalone: true
})
export class GridItemDirective {
  id = ""
  loading = signal(false)

  @Input()
  set appGridItem(value: string | number) {
    this.id = String(value)
  }

  @Input()
  set appGridItemLoading(value: boolean) {
    this.loading.set(value)
  }

  constructor(public template: TemplateRef<any>) {
  }

}
