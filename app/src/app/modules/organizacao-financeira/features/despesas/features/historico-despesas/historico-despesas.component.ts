import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { delay } from 'rxjs';
import { HistoricoDespesa, HistoricoDespesaEditable } from '../../utils';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { DeleteHistoricoDespesaAlertComponent } from '../../ui/delete-historico-despesa-alert/delete-historico-despesa-alert.component';
import { AddDespesaPassadaComponent } from '../../ui/add-despesa-passada/add-despesa-passada.component';

@Component({
  selector: 'app-historico-despesas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DatePickerComponent, FormsModule, AddDespesaPassadaComponent, RouterLink, ModalComponent, DeleteHistoricoDespesaAlertComponent, NgxCurrencyDirective],
  templateUrl: './historico-despesas.component.html',
  styleUrl: './historico-despesas.component.scss'
})
export class HistoricoDespesasComponent implements OnInit {
  today = new Date().toLocaleDateString('en-ca')
  initialDate = this.today

  httpService = inject(HttpService)
  extratoDespesas = signal<{ [key: string]: HistoricoDespesaEditable[] }>({})
  loading = signal(false)

  historicoToDelete = signal<HistoricoDespesa | null>(null)
  modalDeleteHistoricoDespesa = signal(false)
  modalAddHistoricoDespesa = signal(false)


  availableDates = computed(
    () => Object.keys(this.extratoDespesas()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  )


  ngOnInit(): void {
    this.fetchHistoricoDespesas()
  }

  fetchHistoricoDespesas() {
    this.loading.set(true)
    this.extratoDespesas.set({})

    this.httpService.get<HistoricoDespesa[]>('extrato_despesas', { 'order': 'desc', "beforeDate": this.initialDate })
      .subscribe((response) => {
        this.extratoDespesas.update((state) => {
          for (let extrato of response) {
            if (!state[extrato.dataPagamento]) {
              state[extrato.dataPagamento] = []
            }
            state[extrato.dataPagamento].push({ ...extrato, editing: false, loading: false })
          }
          return state
        })

        this.loading.set(false)

        // console.log(this.availableDates())
      })
  }

  deleteHistoricoDespesa(historicoDespesa: HistoricoDespesa) {
    this.historicoToDelete.set(historicoDespesa)
    this.modalDeleteHistoricoDespesa.set(true)
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

  handleDespesaPassadaCreated(despesaPassada: HistoricoDespesa) {
    this.extratoDespesas.update(historico => {
      if (!historico[despesaPassada.dataPagamento]) {
        historico[despesaPassada.dataPagamento] = []
      }

      historico[despesaPassada.dataPagamento].push({ ...despesaPassada, editing: false, loading: false })
      return { ...historico }
    })

    this.modalAddHistoricoDespesa.set(false)
  }

  handleHistoricoDespesaDeleted() {
    this.extratoDespesas.update(historico => {
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
}
