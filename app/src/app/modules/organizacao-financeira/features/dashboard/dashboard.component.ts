import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';

import { HttpService } from '../../../../shared/services/http.service';
import { DespesasChartComponent } from './ui/despesas-chart/despesas-chart.component';
import { finalize } from 'rxjs';

export interface DespesasFuturas {
  [key: string]: DespesaFutura
}

export interface DespesaFutura {
  date: string,
  despesas: {
    label: string,
    value: string
  }[],
  total: string
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ButtonDirective, DespesasChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  httpService = inject(HttpService)
  loading = signal(false)

  ngOnInit(): void {
    this.fetchDespesasFuturas()
  }

  despesas = signal<DespesaFutura[]>([])

  fetchDespesasFuturas() {
    this.loading.set(true)
    this.httpService.get<DespesasFuturas>("despesas_futuras", {})
      .pipe(
        // delay(3000),
        finalize(() => this.loading.set(false))
      )
      .subscribe(res => {
        this.despesas.set(Object.values(res))
      })
  }
}
