import { Component, computed, effect, inject } from '@angular/core';
import { DashboardService } from '../../../service/dashboard.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonDirective } from '../../../../../shared/directives/button/button.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-proximas-despesas',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ButtonDirective, RouterLink],
  templateUrl: './proximas-despesas.component.html',
  styleUrl: './proximas-despesas.component.scss'
})
export class ProximasDespesasComponent {
  dashboardService = inject(DashboardService)

  despesasPorData = computed(() => {
    const despesas = this.dashboardService.despesasFuturas().despesas

    let datas = [...new Set(despesas.map(despesa => despesa.data))]

    let despesasPorData: any = {}

    for (let despesa of despesas) {
      if (!despesasPorData[despesa.data]) {
        despesasPorData[despesa.data] = []
      }

      despesasPorData[despesa.data].push(despesa)
    }

    return {
      datas: datas,
      despesas: despesasPorData,
      dataLimite: this.dashboardService.despesasFuturas().dataLimite

    }
  })
}
