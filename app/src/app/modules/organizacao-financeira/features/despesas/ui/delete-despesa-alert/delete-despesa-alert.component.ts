import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';

@Component({
  selector: 'app-delete-despesa-alert',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './delete-despesa-alert.component.html',
  styleUrl: './delete-despesa-alert.component.scss'
})
export class DeleteDespesaAlertComponent {
  httpService = inject(HttpService)

  @Output() optionDeleted = new EventEmitter<void>()

  despesa = input.required<Partial<Despesa>>()

  deleteOption() {
    this.httpService.delete("despesas", (this.despesa() as Despesa).despesaId)
      .subscribe(() => {
        this.optionDeleted.emit()
      })
  }
}
