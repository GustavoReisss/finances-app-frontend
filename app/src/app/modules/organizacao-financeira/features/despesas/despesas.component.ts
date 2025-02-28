import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpService } from '../../../../shared/services/http/http.service';
import { Despesa } from '../../../../shared/interfaces/despesa.interface';
import { DespesaFormComponent } from './ui/despesa-form/despesa-form.component';
import { delay, finalize, forkJoin, map } from 'rxjs';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { DeleteDespesaAlertComponent } from './ui/delete-despesa-alert/delete-despesa-alert.component';
import { EditDespesaComponent } from './ui/edit-despesa/edit-despesa.component';
import { RouterLink } from '@angular/router';
import { createTags, HistoricoDespesa, HistoricoDespesaEditable, Tag } from './utils';
import { DeleteHistoricoDespesaAlertComponent } from './ui/delete-historico-despesa-alert/delete-historico-despesa-alert.component';
import { AddDespesaPassadaComponent } from './ui/add-despesa-passada/add-despesa-passada.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { NgxCurrencyDirective } from 'ngx-currency';

type DespesaComTag = Despesa & { tags: Tag[] }
type OrderBy = "descricao" | "valor"
type OrderDirection = -1 | 1 // asc || desc



@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [
    CurrencyPipe,
    DespesaFormComponent,
    SkeletonLoaderComponent,
    FormsModule,
    ModalComponent,
    ButtonDirective,
    DeleteDespesaAlertComponent,
    EditDespesaComponent,
    RouterLink,
    DatePipe,
    DeleteHistoricoDespesaAlertComponent,
    AddDespesaPassadaComponent,
    SelectComponent,
    NgxCurrencyDirective
  ],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.scss'
})
export class DespesasComponent implements OnInit {
  httpService = inject(HttpService)

  tabsTipoPagamentos = [
    "Todos",
    "Recorrente",
    "Parcelado",
    "À Vista"
  ]

  tabSelecionada = signal(this.tabsTipoPagamentos[0])

  fetchingData = signal(false)

  modalCadastroDespesa = signal(false)
  modalDeleteDespesa = signal(false)
  modalEditDespesa = signal(false)
  modalDeleteHistoricoDespesa = signal(false)
  modalAddHistoricoDespesa = signal(false)

  orderBy = signal<OrderBy>("descricao")
  orderDirection = signal<OrderDirection>(1)

  despesas = signal<DespesaComTag[]>([])
  historicoDespesas = signal<{
    [key: string]: HistoricoDespesaEditable[]
  }>({})
  quantidadeHistorico = signal(7)

  despesaToDelete = signal<Partial<Despesa>>({})
  despesaToEdit = signal<Partial<Despesa>>({})

  historicoToDelete = signal<HistoricoDespesa | null>(null)

  despesasFiltradas = computed<DespesaComTag[]>(() => {
    let orderedDespesas = [...this.despesas().sort((despesaA, despesaB) => {
      let valueA = despesaA[this.orderBy()]
      let valueB = despesaB[this.orderBy()]

      if (valueA > valueB) return this.orderDirection()
      if (valueA < valueB) return -this.orderDirection()

      return 0

    })]

    if (this.tabSelecionada() === this.tabsTipoPagamentos[0]) return orderedDespesas

    return orderedDespesas.filter(despesa => despesa.tipoPagamento === this.tabSelecionada())
  })

  despesasInfo = computed(() => {
    return {
      "quantidade": this.despesasFiltradas().length,
      "valorTotal": this.despesasFiltradas().map(despesa => Number(despesa["valor"])).reduce((a, b) => a + b, 0)
    }
  })

  availableDates = computed(
    () => Object.keys(this.historicoDespesas()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  )

  ngOnInit() {
    this.fetchData()
  }

  parseDespesaToDespesaComTag(despesa: Despesa) {
    return {
      ...despesa,
      valor: Number(despesa['valor']),
      tags: createTags(despesa)
    } as DespesaComTag
  }

  fetchData() {
    this.fetchingData.set(true)

    forkJoin([
      this.httpService.get<Despesa[]>("despesas"),
      this.httpService.get<HistoricoDespesa[]>("extrato_despesas", { 'order': 'desc' })
    ])
      .pipe(
        // delay(1000),
        map(res => {
          res[0] = res[0].map(el => this.parseDespesaToDespesaComTag(el))
          res[1] = res[1].slice(0, this.quantidadeHistorico())
          return res as [DespesaComTag[], HistoricoDespesa[]]
        }),
        finalize(() => this.fetchingData.set(false))
      )
      .subscribe(res => {
        this.despesas.set(res[0])

        let historico: {
          [key: string]: HistoricoDespesaEditable[]
        } = {}

        for (let extrato of res[1]) {
          if (!historico[extrato.dataPagamento]) {
            historico[extrato.dataPagamento] = []
          }

          historico[extrato.dataPagamento].push({ ...extrato, editing: false, loading: false })
        }

        this.historicoDespesas.set(historico)
      })
  }

  setOrder(order: OrderBy) {
    if (order == this.orderBy()) {
      this.orderDirection.set(-this.orderDirection() as OrderDirection)
      return
    }

    this.orderBy.set(order)
    this.orderDirection.set(1)
  }

  handleDespesaCreated(despesa: Despesa) {
    this.despesas.update(despesas => {
      despesas.push({ ...despesa, tags: createTags(despesa) })
      return [...despesas]
    })
    this.modalCadastroDespesa.set(false)
  }

  handleDespesaPassadaCreated(despesaPassada: HistoricoDespesa) {
    this.historicoDespesas.update(historico => {
      if (!historico[despesaPassada.dataPagamento]) {
        historico[despesaPassada.dataPagamento] = []
      }

      historico[despesaPassada.dataPagamento].push({ ...despesaPassada, editing: false, loading: false })
      return { ...historico }
    })

    this.modalAddHistoricoDespesa.set(false)
  }

  handleDespesaDeleted() {
    this.despesas.update(despesas => {
      const deletedDespesaIndex = despesas.findIndex(el => el.despesaId === this.despesaToDelete().despesaId)
      despesas.splice(deletedDespesaIndex, 1)
      return [...despesas]
    })

    this.modalDeleteDespesa.set(false)
  }

  handleHistoricoDespesaDeleted() {
    this.historicoDespesas.update(historico => {
      const deletedHistoricoDespesaIndex = historico[this.historicoToDelete()?.dataPagamento!]
        .findIndex(el => el.despesaId === this.historicoToDelete()!.despesaId)

      historico[this.historicoToDelete()?.dataPagamento!].splice(deletedHistoricoDespesaIndex, 1)

      if (historico[this.historicoToDelete()?.dataPagamento!].length === 0) {
        delete historico[this.historicoToDelete()?.dataPagamento!]
      }

      return { ...historico }
    })

    this.modalDeleteHistoricoDespesa.set(false)
  }

  saveHistoricoDespesa(historicoDespesa: HistoricoDespesaEditable) {
    if (historicoDespesa.loading) return

    historicoDespesa.loading = true

    this.httpService.put('extrato_despesas', historicoDespesa.despesaId, { valor: historicoDespesa.valor })
      .pipe(
        delay(100)
      )
      .subscribe({
        next: _response => {
          historicoDespesa.editing = false
        },
        complete: () => {
          historicoDespesa.loading = false
        }
      })
  }

  deleteDespesa(despesa: Despesa) {
    this.despesaToDelete.set(despesa)
    this.modalDeleteDespesa.set(true)
  }

  deleteHistoricoDespesa(historicoDespesa: HistoricoDespesa) {
    this.historicoToDelete.set(historicoDespesa)
    this.modalDeleteHistoricoDespesa.set(true)
  }

  editDespesa(despesa: Despesa) {
    this.despesaToEdit.set(despesa)
    this.modalEditDespesa.set(true)
  }

  despesaUpdatedHandler(despesaUpdated: Despesa) {
    this.despesas.update(despesas => {
      despesas.splice(despesas.findIndex(el => el.despesaId === this.despesaToEdit().despesaId), 1)
      let despesaEdita = this.parseDespesaToDespesaComTag(despesaUpdated)
      despesas.push(despesaEdita)
      console.log(despesaEdita)
      return [...despesas]
    })

    this.modalEditDespesa.set(false)
  }
}
