import { Injectable, inject } from '@angular/core';
import { TipoPagamento } from '../../../../../../../shared/interfaces/tipo-pagamento.interface';
import { HttpService } from '../../../../../../../shared/services/http.service';
import { Despesa } from '../../../../../../../shared/interfaces/despesa.interface';

@Injectable({
  providedIn: 'root'
})
export class DespesaFormService {
  httpService = inject(HttpService)

  getTipoPagamento() {
    return this.httpService.get<TipoPagamento[]>("tipos_pagamentos")
  }

  createDespesa(despesaFormValue: Despesa) {
    return this.httpService.post<Despesa[]>('despesas', despesaFormValue)
  }
}
