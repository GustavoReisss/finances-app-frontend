import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { NgxCurrencyDirective } from 'ngx-currency';
import { markAsDirtAndTouched } from '../../../../../../shared/utils/form.utils';
import { Receita } from '../../types/receita.type';
import { RecorrenciaFormComponent } from '../forms/recorrencia-form/recorrencia-form.component';

@Component({
  selector: 'app-add-receita',
  standalone: true,
  imports: [
    InputDirective,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyDirective,
    RecorrenciaFormComponent,
  ],
  templateUrl: './add-receita.component.html',
  styleUrl: './add-receita.component.scss'
})
export class AddReceitaComponent implements OnInit {
  @Output() receitaCreated = new EventEmitter<Receita>()
  @Output() receitaUpdated = new EventEmitter<Receita>()

  receita = input<Receita | null>(null)

  httpService = inject(HttpService)
  fb = inject(FormBuilder)

  receitaForm = this.fb.group({
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    dataProximoRecebimento: ''
  })

  ngOnInit(): void {
    let receita = this.receita()

    if (receita !== null) {
      this.receitaForm.patchValue({
        descricao: receita.descricao,
        valor: String(receita.valor),
        dataProximoRecebimento: receita.dataProximoRecebimento
      })
    }
  }

  submitForm() {
    markAsDirtAndTouched(this.receitaForm)

    if (this.receitaForm.invalid) return

    if (this.receita() === null) {
      this.httpService.post<Receita>("receitas_recorrentes", this.receitaForm.value).subscribe(
        (response) => {
          this.receitaCreated.emit(response)
        }
      )
    }
    else {
      this.httpService.put<Receita>("receitas_recorrentes", this.receita()!.receitaId, this.receitaForm.value).subscribe(
        (response) => {
          this.receitaUpdated.emit(response)
        }
      )
    }
  }
}
