import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { delay, finalize, forkJoin } from 'rxjs';

export interface proximaDespesa {
  data: string,
  descricao: string,
  valor: string,
  tipoPagamento: string,
  categoriaPagamento: string
}

interface ProximasDespesas {
  dataLimite: string,
  despesas: proximaDespesa[]
}

export interface DespesaMes {
  date: string,
  despesas: {
    label: string,
    value: string
  }[],
  total: string
}

export interface despesasDoMes {
  despesas_periodo: DespesaMes[],
  soma_periodo: string
}


export interface DespesasFuturas {
  despesas_do_mes: despesasDoMes,
  proximas_despesas: ProximasDespesas
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  loading = signal(false)

  constructor() {
    this.fetchData()
  }

  httpService = inject(HttpService)

  historicoDespesas = signal<any[]>([])
  despesasFuturas = signal<ProximasDespesas>({ "dataLimite": "", "despesas": [] })
  despesasDoMes = signal<DespesaMes[]>([])
  valorMensal = signal<string>('0')


  fetchData() {
    this.loading.set(true)

    forkJoin(
      [
        this.httpService.get<DespesasFuturas>("despesas_futuras", {}),
        this.httpService.get<any[]>("extrato_despesas", { order: 'desc' })
      ]
    ).pipe(
      delay(400),
      finalize(() => this.loading.set(false))
    )
      .subscribe(res => {
        let [extrato_despesas, historico_despesas] = res

        this.despesasFuturas.set(extrato_despesas.proximas_despesas)
        this.despesasDoMes.set(extrato_despesas.despesas_do_mes.despesas_periodo)
        this.valorMensal.set(extrato_despesas.despesas_do_mes.soma_periodo)

        this.historicoDespesas.set(historico_despesas)
      })
  }

}
