import { Component, EventEmitter, inject, Output } from '@angular/core';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { NgxCurrencyDirective } from 'ngx-currency';
import { markAsDirtAndTouched } from '../../../../../../shared/utils/form.utils';
import { Entrada } from '../../types/entrada.type';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';


@Component({
  selector: 'app-add-entrada',
  standalone: true,
  imports: [
    InputDirective,
    ButtonDirective,
    ReactiveFormsModule,
    FormsModule,
    NgxCurrencyDirective,
    DatePickerComponent
  ],
  templateUrl: './add-entrada.component.html',
  styleUrl: './add-entrada.component.scss'
})
export class AddEntradaComponent {
  @Output() entradaCreated = new EventEmitter<Entrada>()

  httpService = inject(HttpService)
  fb = inject(FormBuilder)

  entradaForm = this.fb.group({
    descricao: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    data: ['', [Validators.required]],
  })

  submitForm() {
    markAsDirtAndTouched(this.entradaForm)

    if (this.entradaForm.invalid) return

    this.httpService.post<Entrada>("entradas", this.entradaForm.value).subscribe(
      (response) => {
        this.entradaCreated.emit(response)
      }
    )
  }
}
