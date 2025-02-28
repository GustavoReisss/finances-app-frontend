import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { RouterLink } from '@angular/router';
import { NgxCurrencyDirective } from 'ngx-currency';
import { HttpService } from '../../../../shared/services/http/http.service';
import { delay, finalize, forkJoin, map } from 'rxjs';
import { AddReceitaComponent } from './ui/add-receita/add-receita.component';
import { Receita, ReceitaComTags } from './types/receita.type';
import { Entrada, EntradaEditable } from './types/entrada.type';
import { DeleteReceitaAlertComponent } from './ui/delete-receita-alert/delete-receita-alert.component';
import { DeleteEntradaAlertComponent } from './ui/delete-entrada-alert/delete-entrada-alert.component';
import { AddEntradaComponent } from './ui/add-entrada/add-entrada.component';


@Component({
  selector: 'app-receitas',
  standalone: true,
  imports: [
    CurrencyPipe,
    SkeletonLoaderComponent,
    FormsModule,
    ModalComponent,
    ButtonDirective,
    RouterLink,
    DatePipe,
    NgxCurrencyDirective,
    AddReceitaComponent,
    DeleteReceitaAlertComponent,
    AddEntradaComponent,
    DeleteEntradaAlertComponent,
  ],
  templateUrl: './receitas.component.html',
  styleUrl: './receitas.component.scss'
})
export class ReceitasComponent {
  httpService = inject(HttpService)

  fetchingData = signal(false)


  modalCadastroReceita = signal(false)
  modalDeleteReceita = signal(false)
  modalEditReceita = signal(false)
  modalDeleteEntrada = signal(false)
  modalAddEntrada = signal(false)

  receitasRecorrentes = signal<ReceitaComTags[]>([])

  entradasByDate = signal<{
    [key: string]: EntradaEditable[]
  }>({})

  receitaToDelete = signal<Receita | null>(null)
  receitaToEdit = signal<Receita | null>(null)

  entradaToDelete = signal<Entrada | null>(null)

  availableDates = computed(
    () => Object.keys(this.entradasByDate()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  )

  ngOnInit() {
    this.fetchData()
  }

  parseReceitaToReceitaComTag(receita: Receita): ReceitaComTags {
    const dataProximoRecebimento = new Date(receita.dataProximoRecebimento!)
    dataProximoRecebimento.setHours(dataProximoRecebimento.getHours() + 3)

    return {
      ...receita,
      tags: ["Recorrente", dataProximoRecebimento.toLocaleDateString('pt-br')]
    }
  }

  fetchData() {
    this.fetchingData.set(true)

    forkJoin([
      this.httpService.get<Receita[]>("receitas_recorrentes"),
      this.httpService.get<Entrada[]>("entradas", { 'order': 'desc' })
    ])
      .pipe(
        // delay(1000),
        map(res => {
          res[0] = res[0].map(receita => this.parseReceitaToReceitaComTag(receita))
          return res as [ReceitaComTags[], Entrada[]]
        }),
        finalize(() => this.fetchingData.set(false))
      )
      .subscribe(res => {
        this.receitasRecorrentes.set(res[0])

        let entradasByDate: {
          [key: string]: EntradaEditable[]
        } = {}

        for (let entrada of res[1]) {
          if (!entradasByDate[entrada.data]) {
            entradasByDate[entrada.data] = []
          }

          entradasByDate[entrada.data].push({ ...entrada, editing: false, loading: false })
        }

        this.entradasByDate.set(entradasByDate)
      })
  }

  handleReceitaCreated(receita: Receita) {
    this.receitasRecorrentes.update(receitas => {
      receitas.push(this.parseReceitaToReceitaComTag(receita))
      return [...receitas]
    })

    this.modalCadastroReceita.set(false)
  }

  handleEntradaCreated(entrada: any) {
    this.entradasByDate.update(entradasByDate => {
      if (!entradasByDate[entrada.data]) {
        entradasByDate[entrada.data] = []
      }

      entradasByDate[entrada.data].push({ ...entrada, editing: false, loading: false })
      return { ...entradasByDate }
    })

    this.modalAddEntrada.set(false)
  }

  handleReceitaDeleted() {
    this.receitasRecorrentes.update(receitasRecorrentes => {
      const deletedReceitaIndex = receitasRecorrentes.findIndex(el => el.receitaId === this.receitaToDelete()!.receitaId)

      receitasRecorrentes.splice(deletedReceitaIndex, 1)
      return [...receitasRecorrentes]
    })

    this.modalDeleteReceita.set(false)
  }

  handleEntradaDeleted() {
    this.entradasByDate.update(entradasByDate => {
      const deletedReceitaIndex = entradasByDate[this.entradaToDelete()?.data!]
        .findIndex(el => el.entradaId === this.entradaToDelete()!.entradaId)

      entradasByDate[this.entradaToDelete()?.data!].splice(deletedReceitaIndex, 1)

      if (entradasByDate[this.entradaToDelete()?.data!].length === 0) {
        delete entradasByDate[this.entradaToDelete()?.data!]
      }

      return { ...entradasByDate }
    })

    this.modalDeleteEntrada.set(false)
  }

  saveEntrada(entrada: EntradaEditable) {
    if (entrada.loading) return

    entrada.loading = true

    this.httpService.put('entradas', entrada.entradaId, { valor: entrada.valor })
      .pipe(
        delay(100)
      )
      .subscribe({
        next: _response => {
          entrada.editing = false
        },
        complete: () => {
          entrada.loading = false
        }
      })
  }

  deleteReceita(receita: Receita) {
    this.receitaToDelete.set(receita)
    this.modalDeleteReceita.set(true)
  }

  deleteEntrada(entrada: Entrada) {
    this.entradaToDelete.set(entrada)
    this.modalDeleteEntrada.set(true)
  }

  editReceita(receita: any) {
    this.receitaToEdit.set(receita)
    this.modalEditReceita.set(true)
  }

  receitaUpdatedHandler(receita: Receita) {
    this.receitasRecorrentes.update(receitas => {
      receitas.splice(receitas.findIndex(el => el.receitaId === this.receitaToEdit()!.receitaId), 1)
      receitas.push(this.parseReceitaToReceitaComTag(receita))
      return [...receitas]
    })

    this.modalEditReceita.set(false)
  }
}
