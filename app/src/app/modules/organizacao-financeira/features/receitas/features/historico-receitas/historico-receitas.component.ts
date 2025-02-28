import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { delay } from 'rxjs';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { Entrada, EntradaEditable } from '../../types/entrada.type';
import { AddEntradaComponent } from '../../ui/add-entrada/add-entrada.component';
import { DeleteEntradaAlertComponent } from '../../ui/delete-entrada-alert/delete-entrada-alert.component';

@Component({
  selector: 'app-historico-receitas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DatePickerComponent, FormsModule, RouterLink, ModalComponent, NgxCurrencyDirective, AddEntradaComponent, DeleteEntradaAlertComponent],
  templateUrl: './historico-receitas.component.html',
  styleUrl: './historico-receitas.component.scss'
})
export class HistoricoDespesasComponent implements OnInit {
  today = new Date().toLocaleDateString('en-ca')
  initialDate = this.today

  httpService = inject(HttpService)
  entradasByDate = signal<{
    [key: string]: EntradaEditable[]
  }>({})

  loading = signal(false)

  entradaToDelete = signal<Entrada | null>(null)

  modalDeleteEntrada = signal(false)
  modalAddEntrada = signal(false)


  availableDates = computed(
    () => Object.keys(this.entradasByDate()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  )


  ngOnInit(): void {
    this.fetchHistoricoDespesas()
  }

  fetchHistoricoDespesas() {
    this.loading.set(true)
    this.entradasByDate.set({})

    this.httpService.get<Entrada[]>('entradas', { 'order': 'desc', "beforeDate": this.initialDate })
      .subscribe((response) => {
        this.entradasByDate.update((state) => {
          for (let extrato of response) {
            if (!state[extrato.data]) {
              state[extrato.data] = []
            }
            state[extrato.data].push({ ...extrato, editing: false, loading: false })
          }
          return state
        })

        this.loading.set(false)

        // console.log(this.availableDates())
      })
  }

  deleteEntrada(entrada: Entrada) {
    this.entradaToDelete.set(entrada)
    this.modalDeleteEntrada.set(true)
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


  handleEntradaCreated(entrada: Entrada) {
    this.entradasByDate.update(entradasByDate => {
      if (!entradasByDate[entrada.data]) {
        entradasByDate[entrada.data] = []
      }

      entradasByDate[entrada.data].push({ ...entrada, editing: false, loading: false })
      return { ...entradasByDate }
    })

    this.modalAddEntrada.set(false)
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
}
