import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { Entrada } from '../../types/entrada.type';

@Component({
  selector: 'app-delete-entrada-alert',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './delete-entrada-alert.component.html',
  styleUrl: './delete-entrada-alert.component.scss'
})
export class DeleteEntradaAlertComponent {
  httpService = inject(HttpService)

  @Output() optionDeleted = new EventEmitter<void>()

  entrada = input.required<Entrada | null>()

  deleteOption() {
    this.httpService.delete("entradas", this.entrada()!.entradaId)
      .subscribe(() => {
        this.optionDeleted.emit()
      })
  }
}
