import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { HistoricoDespesa } from '../../utils';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';

@Component({
  selector: 'app-delete-historico-despesa-alert',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './delete-historico-despesa-alert.component.html',
  styleUrl: './delete-historico-despesa-alert.component.scss'
})
export class DeleteHistoricoDespesaAlertComponent {
  httpService = inject(HttpService)

  @Output() optionDeleted = new EventEmitter<void>()

  historicoDespesa = input.required<Partial<HistoricoDespesa>>()

  deleteOption() {
    this.httpService.delete("extrato_despesas", this.historicoDespesa().despesaId!)
      .subscribe(() => {
        this.optionDeleted.emit()
      })
  }
}
