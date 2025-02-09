import { Component, inject } from '@angular/core';
import { DashboardService } from '../../../service/dashboard.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonDirective } from '../../../../../shared/directives/button/button.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ultimas-despesas',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ButtonDirective, RouterLink],
  templateUrl: './ultimas-despesas.component.html',
  styleUrl: './ultimas-despesas.component.scss'
})
export class UltimasDespesasComponent {
  dashboardService = inject(DashboardService)
  ultimasDespeass = this.dashboardService.historicoDespesas
}
