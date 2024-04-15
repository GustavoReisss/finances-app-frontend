import { NgModule } from '@angular/core';
import { GridComponent, gridLayout as layout } from './grid-component/grid.component';
import { GridItemDirective } from './grid-item-directive/grid-item.directive';

export type gridLayout = layout

@NgModule({
  imports: [
    GridComponent,
    GridItemDirective,
  ],
  exports: [
    GridComponent,
    GridItemDirective,
  ]
})
export class GridModule { }
