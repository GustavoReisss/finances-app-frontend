import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { Despesa } from '../../../../shared/interfaces/despesa.interface';
import { DespesaFormComponent } from './ui/despesa-form/despesa-form.component';

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [
    CurrencyPipe,
    DespesaFormComponent
  ],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.scss'
})
export class DespesasComponent implements OnInit {
  httpService = inject(HttpService)

  despesas = signal<Despesa[]>([])

  ngOnInit() {
    this.httpService.get<Despesa[]>("despesas").subscribe(res => this.despesas.set(res))
  }

  handleDespesaCreated(despesa: Despesa[]) {
    this.despesas.update(despesas => {
      despesas.push(despesa[0])
      return despesas
    })
  }

  deleteDespesa(despesa: Despesa) {
    this.httpService.delete("despesas", `${despesa.userId}/${despesa.despesaId}`)
      .subscribe(() => {
        this.despesas.update(despesas => {
          const deletedDespesaIndex = despesas.findIndex(el => el.despesaId === despesa.despesaId)
          despesas.splice(deletedDespesaIndex, 1)
          return despesas
        })
      })
  }
}
