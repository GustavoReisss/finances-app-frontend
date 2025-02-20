import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistoricoDespesa } from '../../utils';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { TODAY } from '../../shared/despesa-form.utils';
import { NgxCurrencyDirective } from 'ngx-currency';
import { markAsDirtAndTouched } from '../../../../../../shared/utils/form';



@Component({
  selector: 'app-add-despesa-passada',
  standalone: true,
  imports: [InputDirective, ButtonDirective, ReactiveFormsModule, FormsModule, DatePickerComponent, NgxCurrencyDirective],
  templateUrl: './add-despesa-passada.component.html',
  styleUrl: './add-despesa-passada.component.scss'
})
export class AddDespesaPassadaComponent {
  fb = inject(FormBuilder)
  httpService = inject(HttpService)

  @Output() despesaPassadaCreated = new EventEmitter<HistoricoDespesa>()

  maxDate = TODAY.toLocaleDateString('en-ca')

  despesaPassadaForm: FormGroup = this.fb.group({
    dataPagamento: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    categoriaPagamento: '',
    tipoPagamento: '',
    valor: ['', [Validators.required, Validators.min(0.01)]],
  })

  submitForm() {
    markAsDirtAndTouched(this.despesaPassadaForm)
    console.log(this.despesaPassadaForm)


    if (this.despesaPassadaForm.invalid) return

    this.httpService.post<HistoricoDespesa>("extrato_despesas", this.despesaPassadaForm.value).subscribe(
      (response) => {
        this.despesaPassadaCreated.emit(response)
      }
    )
  }

}
