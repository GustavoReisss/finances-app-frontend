import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { Receita } from '../../types/receita.type';

@Component({
  selector: 'app-delete-receita-alert',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './delete-receita-alert.component.html',
  styleUrl: './delete-receita-alert.component.scss'
})
export class DeleteReceitaAlertComponent {
  httpService = inject(HttpService)

  @Output() optionDeleted = new EventEmitter<void>()

  receita = input.required<Receita | null>()

  deleteOption() {
    this.httpService.delete("receitas_recorrentes", this.receita()!.receitaId)
      .subscribe(() => {
        this.optionDeleted.emit()
      })
  }
}
