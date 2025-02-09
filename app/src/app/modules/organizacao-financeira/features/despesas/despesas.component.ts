import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpService } from '../../../../shared/services/http/http.service';
import { Despesa } from '../../../../shared/interfaces/despesa.interface';
import { DespesaFormComponent } from './ui/despesa-form/despesa-form.component';
import { delay, finalize, map } from 'rxjs';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { DeleteDespesaAlertComponent } from './ui/delete-despesa-alert/delete-despesa-alert.component';
import { EditDespesaComponent } from './ui/edit-despesa/edit-despesa.component';
import { daysOptions } from './shared/despesa-form.utils';
import { RouterLink } from '@angular/router';

type DespesaComTag = Despesa & { tags: Tag[] }
type OrderBy = "descricao" | "valor"
type OrderDirection = -1 | 1 // asc || desc

interface Tag {
  type: string
  value: string
}

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [
    CurrencyPipe,
    DespesaFormComponent,
    SkeletonLoaderComponent,
    TabsComponent,
    FormsModule,
    ModalComponent,
    ButtonDirective,
    DeleteDespesaAlertComponent,
    EditDespesaComponent,
    RouterLink
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

  fetchingDespesas = signal(false)

  modalCadastroDespesa = signal(false)
  modalDeleteDespesa = signal(false)
  modalEditDespesa = signal(false)

  orderBy = signal<OrderBy>("descricao")
  orderDirection = signal<OrderDirection>(1)

  despesas = signal<DespesaComTag[]>([])

  despesaToDelete = signal<Partial<Despesa>>({})
  despesaToEdit = signal<Partial<Despesa>>({})

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

  ngOnInit() {
    this.fetchDespesas()
  }

  parseDespesaToDespesaComTag(despesa: Despesa) {
    return {
      ...despesa,
      valor: Number(despesa['valor']),
      tags: this.createTags(despesa)
    } as DespesaComTag
  }

  fetchDespesas() {
    this.fetchingDespesas.set(true)
    this.httpService.get<Despesa[]>("despesas")
      .pipe(
        // delay(1000),
        map(res =>
          res.map(el => this.parseDespesaToDespesaComTag(el))
        ),
        finalize(() => this.fetchingDespesas.set(false))
      )
      .subscribe(res => { this.despesas.set(res); console.log(res) })
  }

  createTags(despesa: Despesa): Tag[] {
    let extraTags: Tag[] = []

    if (despesa.tipoPagamento == 'À Vista') {
      const dataPagamento = new Date(despesa.dataProximoPagamento!)
      dataPagamento.setHours(dataPagamento.getHours() + 3)

      extraTags.push({
        type: "Frequencia",
        value: `Pagamento dia ${dataPagamento.toLocaleDateString('pt-br')}`
      })
    }
    else {
      if (despesa.tipoPagamento == 'Parcelado') {
        extraTags.push({
          type: "Parcelas",
          value: `${despesa.parcelaAtual}/${despesa.quantidadeParcelas}`
        })
      }

      switch (despesa.frequencia) {
        case "Mensal":
          extraTags.push({
            type: "Frequencia",
            value: `Todo dia ${despesa.detalhesFrequencia?.diaPagamento}`
          })
          break
        case "Semanal":
          const diaSemana = daysOptions.find(el => el.value === despesa.detalhesFrequencia!.diaSemana)
          if (!diaSemana) break

          if (["5", "6"].includes(diaSemana.value)) { // Sábado e Domingo
            extraTags.push({
              type: "Frequencia",
              value: `Todo ${diaSemana.label.toLowerCase()}`
            })
            break
          }

          extraTags.push({
            type: "Frequencia",
            value: `Toda ${diaSemana.label.toLowerCase()}`
          })
          break
        case "Outro":
          let { quantidade, unidade } = despesa.detalhesFrequencia!

          if (!quantidade || !unidade) break

          if (quantidade === "1") {
            unidade = { "Semanas": "Semana", "Anos": "Ano", "Meses": "Mês" }[unidade]
          }

          extraTags.push({
            type: "Frequencia",
            value: `A cada ${quantidade} ${unidade?.toLocaleLowerCase()}`
          })
          break
      }
    }

    if (despesa.dataProximoPagamento && despesa.tipoPagamento !== 'À Vista') {
      const dataPagamento = new Date(despesa.dataProximoPagamento!)
      dataPagamento.setHours(dataPagamento.getHours() + 3)
      // extraTags.push(`Próximo pagamento em ${dataPagamento.toLocaleDateString('pt-br')}`)
      extraTags.push()
      extraTags.push({
        type: "proximoPagamento",
        value: dataPagamento.toLocaleDateString('pt-br')
      })
    }

    return [
      {
        type: "tipoPagamento",
        value: despesa.tipoPagamento
      },
      {
        type: "categoriaPagamento",
        value: despesa.categoriaPagamento
      },
      ...extraTags
    ]
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
      despesas.push({ ...despesa, tags: this.createTags(despesa) })
      return [...despesas]
    })
    this.modalCadastroDespesa.set(false)
  }

  handleDespesaDeleted() {
    this.despesas.update(despesas => {
      const deletedDespesaIndex = despesas.findIndex(el => el.despesaId === this.despesaToDelete().despesaId)
      despesas.splice(deletedDespesaIndex, 1)
      return [...despesas]
    })

    this.modalDeleteDespesa.set(false)
  }

  deleteDespesa(despesa: Despesa) {
    this.despesaToDelete.set(despesa)
    this.modalDeleteDespesa.set(true)
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
