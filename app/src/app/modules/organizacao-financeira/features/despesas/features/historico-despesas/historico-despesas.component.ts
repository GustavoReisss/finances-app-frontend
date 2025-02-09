import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historico-despesas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DatePickerComponent, FormsModule, RouterLink],
  templateUrl: './historico-despesas.component.html',
  styleUrl: './historico-despesas.component.scss'
})
export class HistoricoDespesasComponent implements OnInit {
  today = new Date().toLocaleDateString('en-ca')
  initialDate = this.today

  httpService = inject(HttpService)
  extratoDespesas = signal<{ [key: string]: any[] }>({})
  loading = signal(false)

  availableDates = computed(
    () => Object.keys(this.extratoDespesas()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )

    // () => Object.keys(this.extratoDespesas())
  )

  ngOnInit(): void {
    this.fetchHistoricoDespesas()
  }

  fetchHistoricoDespesas() {
    this.loading.set(true)
    this.extratoDespesas.set({})

    this.httpService.get<any[]>('extrato_despesas', { 'order': 'desc', "beforeDate": this.initialDate })
      .subscribe((response) => {
        this.extratoDespesas.update((state) => {
          for (let extrato of response) {
            if (!state[extrato.dataPagamento]) {
              state[extrato.dataPagamento] = []
            }
            state[extrato.dataPagamento].push(extrato)
          }
          return state
        })

        this.loading.set(false)

        // console.log(this.availableDates())
      })
  }
}
