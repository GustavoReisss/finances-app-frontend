import { Injectable, computed, inject, signal } from '@angular/core';
import { TipoPagamento } from '../../../../../../shared/interfaces/tipo-pagamento.interface';
import { HttpService } from '../../../../../../shared/services/http.service';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  httpService = inject(HttpService)

  tipoPagamentos = signal<TipoPagamento[]>([])

  fetchedTipoPagamento = signal(false)
  private fetchingCategorias = false

  getTipoPagamento() {
    return this.httpService.get<TipoPagamento[]>("tipos_pagamentos")
  }

  getCategoriasPagamentosByTipoPagamento(tipoPagamento: string) {
    if (!this.fetchingCategorias) this.fetchTipoPagamento()

    return computed(() => [...(
      (
        this.tipoPagamentos().find(el => el.descricao === tipoPagamento)
        || { categoriasPagamentos: [] }
      )
        .categoriasPagamentos
    )]
    )
  }

  fetchTipoPagamento() {
    this.fetchingCategorias = true

    this.httpService.get<TipoPagamento[]>("tipos_pagamentos")

      .subscribe(response => { this.tipoPagamentos.set(response); this.fetchedTipoPagamento.set(true) })
  }

  createDespesa(despesaFormValue: Despesa) {
    return this.httpService.post<Despesa[]>('despesas', despesaFormValue)
  }

  updateDespesa(valueToUpdate: Partial<Despesa>, despesaId: string) {
    return this.httpService.put<Despesa[]>("despesas", despesaId, valueToUpdate)
  }

  deleteCategoriaPagamento(tipoPagamento: string, categoria: string) {

    const tipoPagamentoIndex = this.tipoPagamentos().findIndex(el => el.descricao === tipoPagamento)

    if (tipoPagamentoIndex === -1) {
      return throwError(() => `${tipoPagamento} NOT FOUND ON this.tipoPagamentos()`)
    }

    let newCategoriasPagamentosValue = [...this.tipoPagamentos()[tipoPagamentoIndex].categoriasPagamentos]
    newCategoriasPagamentosValue.splice(newCategoriasPagamentosValue.findIndex(el => el === categoria), 1)

    return this.httpService.put(
      "tipos_pagamentos",
      this.tipoPagamentos()[tipoPagamentoIndex].tipoPagamentoId,
      { categoriasPagamentos: newCategoriasPagamentosValue }
    )
      .pipe(
        tap(() => {
          this.tipoPagamentos.update(tiposPagamentos => {
            tiposPagamentos[tipoPagamentoIndex]["categoriasPagamentos"] = newCategoriasPagamentosValue
            return [...tiposPagamentos]
          })
        })
      )
  }

  createCategoria(tipoPagamento: string, categoria: string) {
    const tipoPagamentoIndex = this.tipoPagamentos().findIndex(el => el.descricao === tipoPagamento)

    if (tipoPagamentoIndex === -1) {
      return throwError(() => `${tipoPagamento} NOT FOUND ON this.tipoPagamentos()`)
    }

    let newCategorias = this.tipoPagamentos()[tipoPagamentoIndex].categoriasPagamentos
    newCategorias.push(categoria)

    const body = {
      "categoriasPagamentos": newCategorias
    }

    return this.httpService.put(
      'tipos_pagamentos',
      this.tipoPagamentos()[tipoPagamentoIndex].tipoPagamentoId,
      body
    ).pipe(
      tap(() => {
        this.tipoPagamentos.update(tiposPagamentos => {
          tiposPagamentos[tipoPagamentoIndex]["categoriasPagamentos"] = newCategorias
          return [...tiposPagamentos]
        })
      })
    )
  }
}
