import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, EventEmitter, inject, input, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { KtdGridBackgroundCfg, KtdGridComponent, KtdGridLayout, KtdGridLayoutItem, KtdGridModule, KtdResizeEnd, ktdTrackById } from '@katoid/angular-grid-layout';
import { debounceTime, filter, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { GridItemDirective } from '../grid-item-directive/grid-item.directive';
import { LayoutUtils } from './layout-utils';
import { SkeletonLoaderComponent } from '../../skeleton-loader/skeleton-loader.component';

export type customLayoutItem = KtdGridLayoutItem & { originalWidth?: number, originalX?: number, originalY?: number }
export type gridLayout = customLayoutItem[]


// 1 Coluna causa um erro ao realizar o drag/resize dos items do grid
const BREAKPOINTS_COLS_CONFIG = {
  [Breakpoints.XSmall]: 2,
  [Breakpoints.Small]: 2,
  [Breakpoints.Medium]: 4,
  [Breakpoints.Large]: 6,
  [Breakpoints.XLarge]: 8,
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [KtdGridModule, NgTemplateOutlet, JsonPipe, SkeletonLoaderComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit, OnDestroy {
  gridItems = contentChildren<GridItemDirective>(GridItemDirective)

  @ViewChild(KtdGridComponent, { static: true }) grid!: KtdGridComponent;

  @Input() updateLayout: Observable<void> = of()
  @Input() layout: gridLayout = []

  scrollableParentId = input('main-content')
  responsive = inject(BreakpointObserver)

  subs: Subscription[] = []

  @Output() layoutUpdated = new EventEmitter<gridLayout>()

  // Grid initial config
  cols: number = 4;
  rowHeight: number | "fit" = 130
  trackById = ktdTrackById

  backgroundConfig: Required<KtdGridBackgroundCfg> = {
    show: 'whenDragging',
    borderColor: 'transparent',
    gapColor: 'hsla(var(--background-variant-dark-1) / 0.5)',
    borderWidth: 0,
    rowColor: 'hsla(0 0 100 / 0.02)',
    columnColor: 'hsla(0 0 100 / 0.02)',
  };

  ngOnInit(): void {
    this.observeLayoutResize()
    this.observeBreakpointChanges()
    this.subs.push(this.updateLayout.subscribe(() => {
      this.updateLayoutSize(this.cols)
      // localStorage.setItem("layout", JSON.stringify(this.layout))
    }))
  }


  private updateGrid() {
    setTimeout(() => {
      this.grid.resize()
      this.layoutUpdated.emit(this.layout)
    }, 300);
  }


  onLayoutUpdated(_layout: KtdGridLayout) {
    // localStorage.setItem("layout", JSON.stringify(this.layout))
    this.updateGrid()
  }

  updateGridItemOriginalWidthOnResize(event: KtdResizeEnd) {
    let resizedItem = event.layoutItem

    let itemToUpdate = this.layout.find(item => item.id === resizedItem["id"])

    if (!itemToUpdate) return

    itemToUpdate["h"] = resizedItem["h"]
    itemToUpdate["w"] = resizedItem["w"]
    itemToUpdate["originalWidth"] = resizedItem["w"]

    this.setLayout(event.layout)
  }

  setLayout(newLayout: gridLayout) {
    for (let updatedItem of newLayout) {
      let itemToUpdate = this.layout.find(item => item.id === updatedItem["id"])

      if (!itemToUpdate) return

      itemToUpdate["x"] = updatedItem["x"]
      itemToUpdate["originalX"] = updatedItem["x"]
      itemToUpdate["y"] = updatedItem["y"]
      itemToUpdate["originalY"] = updatedItem["y"]

      itemToUpdate = { ...itemToUpdate }
    }
  }

  setSize(size: keyof typeof BREAKPOINTS_COLS_CONFIG) {
    this.updateLayoutSize(BREAKPOINTS_COLS_CONFIG[size])
  }

  updateLayoutSize(new_cols_value: number) {
    // if (new_cols_value === this.cols) return

    const LAYOUT_GROW = new_cols_value > this.cols


    const layoutUtils = new LayoutUtils(new_cols_value)

    const handleLayoutShrink = (item: customLayoutItem) => {

      // Control max width
      if (item["w"] > this.cols) {
        let previusOriginalWidth = item["originalWidth"] || 1
        item["originalWidth"] = (previusOriginalWidth > item["w"]) ? previusOriginalWidth : item["w"]
        item["w"] = this.cols
      }

      let [newY, newX] = layoutUtils.findAvailablePosition(item)

      if (newY !== item["y"] || newX !== item["x"]) {
        let originalY = item["originalY"]
        let originalX = item["originalX"]

        if (originalY === undefined || !originalX === undefined) {
          item["originalY"] = item["y"]
          item["originalX"] = item["x"]
        }

        item["y"] = newY
        item["x"] = newX
      }

      layoutUtils.fillRows(item)

      return item
    }

    const handleLayoutGrow = (item: customLayoutItem) => {
      const originalWidth = item["originalWidth"] || 1

      if (item["w"] < originalWidth) {
        item["w"] = (originalWidth > this.cols) ? this.cols : originalWidth
      }

      let originalY = (item["originalY"] !== undefined) ? item["originalY"] : item["y"]
      let originalX = (item["originalX"] !== undefined) ? item["originalX"] : item["x"]

      if (originalY !== item["y"] || originalX !== item["x"]) {
        let currentNumberOfFilledColumns = layoutUtils.layout[item["y"]] || 0

        if (currentNumberOfFilledColumns + item["w"] <= this.cols) {
          item["y"] = originalY
          item["x"] = (originalX >= this.cols) ? this.cols - item["w"] : originalX
        }
      }

      layoutUtils.fillRows(item)

      return item
    }

    this.cols = new_cols_value

    this.layout = LayoutUtils.orderLayout(this.layout).map(item => {
      if (LAYOUT_GROW) return handleLayoutGrow(item)
      return handleLayoutShrink(item)
    })

    this.updateGrid()
  }

  private observeLayoutResize() {
    this.subs.push(
      merge(
        fromEvent(window, 'resize'),
        fromEvent(window, 'orientationchange')
      ).pipe(
        debounceTime(100)
      ).subscribe(() => {
        this.updateGrid()
      })
    )
  }

  observeBreakpointChanges() {
    const BREAKPOINTS = [
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]

    for (let bp of BREAKPOINTS) {
      this.subs.push(
        this.responsive.observe(bp)
          .pipe(
            filter(state => state.matches)
          )
          .subscribe(() => {
            this.setSize(bp)
          })
      )
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }
}
