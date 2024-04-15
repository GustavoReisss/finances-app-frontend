import { Component, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { HttpService } from '../../../../shared/services/http.service';
import { DespesasChartComponent } from './ui/despesas-chart/despesas-chart.component';
import { delay, finalize } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { gridLayout, GridModule } from '../../../../shared/components/grid/grid.module';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { OverlayModule } from '@angular/cdk/overlay';

export interface DespesasFuturas {
  "despesas_periodo": DespesaFutura[],
  "data_final": string,
  "soma_periodo": string
}

export interface DespesaFutura {
  date: string,
  despesas: {
    label: string,
    value: string
  }[],
  total: string
}

const DEFAULT_LAYOUT: gridLayout = [
  { id: '0', x: 0, y: 0, w: 4, h: 3, minH: 3, maxH: 3, minW: 2 },
  { id: '1', x: 0, y: 1, w: 2, h: 1, maxH: 1 },
];

type Widget = {
  id: number,
  name: string,
  active: boolean,
  config: {
    w: number,
    h: number,
    maxH?: number,
    minH?: number,
    maxW?: number,
    minW?: number,
  },
  onToggleOn?: any
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, OverlayModule, SkeletonLoaderComponent, ButtonDirective, DespesasChartComponent, CurrencyPipe, GridModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  httpService = inject(HttpService)

  loading = signal(false)

  updateChart = new EventEmitter<void>()
  updateLayout = new EventEmitter<void>()

  despesas = signal<DespesaFutura[]>([])
  custoMensal = signal("0")

  layout: gridLayout = []

  openSettings = signal(false)

  widgets = signal<Widget[]>([
    { "id": 0, "name": "Despesas do Mês", "active": true, config: { w: 4, h: 3, minH: 3, maxH: 3, minW: 2 }, onToggleOn: () => setTimeout(() => this.updateChart.emit(), 200) },
    { "id": 1, "name": "Custo Mensal", "active": true, config: { w: 2, h: 1, maxH: 1 } }
  ])

  activeWidgets = signal<string[]>([])

  ngOnInit(): void {
    this.setLayout()
    this.fetchDashboardData()
  }

  toggleWidget(widgetToToggle: Widget) {
    this.widgets.update(widgets => {
      let widgetToUpdate = widgets.find(widget => widget.id === widgetToToggle.id)

      if (widgetToUpdate) {
        widgetToUpdate.active = !widgetToUpdate.active
      }

      return widgets
    })

    if (!widgetToToggle.active) {
      let indexToRemove = this.layout.findIndex(el => Number(el.id) === widgetToToggle.id)
      this.layout.splice(indexToRemove, 1)
    }

    if (widgetToToggle.active) {
      let maxY = 0

      this.layout.forEach(item => {
        let locationAndHeight = item.y + item.h

        if (locationAndHeight > maxY) {
          maxY = locationAndHeight
        }
      })

      this.layout.push({
        id: String(widgetToToggle.id),
        "x": 0,
        "y": maxY,
        ...widgetToToggle.config
      })

      if (widgetToToggle.onToggleOn) {
        widgetToToggle.onToggleOn()
      }
    }

    this.layout = [...this.layout]
    console.log(this.layout)
    this.updateLayout.emit()
  }

  setLayout() {
    let layout = DEFAULT_LAYOUT
    let lastLayout = localStorage.getItem("layout")

    if (typeof (lastLayout) === "string") {
      try {
        layout = JSON.parse(lastLayout)
      } catch {
        console.warn("could not set previous layout")
      }
    }

    let widgetsID = this.widgets().map(widget => String(widget.id))
    this.layout = layout.filter(el => widgetsID.includes(el.id))



    let layoutItemsId = this.layout.map(el => el.id)
    this.widgets.update(currentWidgetValue => {
      for (let widget of currentWidgetValue) {
        widget['active'] = layoutItemsId.includes(String(widget.id))
      }

      return currentWidgetValue
    })
  }

  fetchDashboardData() {
    this.loading.set(true)
    this.httpService.get<DespesasFuturas>("despesas_futuras", {})
      .pipe(
        delay(1000),
        finalize(() => this.loading.set(false))
      )
      .subscribe(res => {
        this.despesas.set(res.despesas_periodo)
        this.custoMensal.set(res.soma_periodo)
      })
  }

  layoutUpdated(layout: gridLayout) {
    this.layout = layout
    if (this.loading()) return
    this.updateChart.emit()
  }
}
