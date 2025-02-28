import { Component, inject, Input, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ComboboxComponent } from '../../../../../../../shared/components/combobox/combobox.component';
import { InputDirective } from '../../../../../../../shared/directives/input/input.directive';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Frequencia, frequenciasOptions, setDetalhesFrequenciaFields } from '../../../shared/despesa-form.utils';
import { DatePickerComponent } from '../../../../../../../shared/components/date-picker/date-picker.component';
import { DatePipe } from '@angular/common';
import { CheckboxComponent } from '../../../../../../../shared/components/checkbox/checkbox.component';
import { Despesa } from '../../../../../../../shared/interfaces/despesa.interface';
import { TODAY, WEEK_DAYS } from '../../../../../../../shared/utils/date.utils';


@Component({
  selector: 'app-frequencia-form',
  standalone: true,
  imports: [
    ComboboxComponent,
    InputDirective,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
    DatePipe,
    CheckboxComponent
  ],
  templateUrl: './frequencia-form.component.html',
  styleUrl: './frequencia-form.component.scss'
})
export class FrequenciaFormComponent implements OnInit, OnDestroy {
  @Input() despesaForm!: FormGroup
  despesa = input<Partial<Despesa> | null>(null)
  formBuilder = inject(FormBuilder)

  frequenciaSelecionada = signal<Frequencia | "">("")

  weekDays = WEEK_DAYS
  frequenciasOptions = frequenciasOptions

  maxDate = ""
  minDate = TODAY.toLocaleDateString('en-ca')


  get detalhesFrequenciaForm() {
    return this.despesaForm.get("detalhesFrequencia") as FormGroup
  }

  ngOnInit() {
    if (this.despesaForm.get("detalhesFrequencia") === null) {
      this.despesaForm.addControl("detalhesFrequencia", this.formBuilder.group({}))
    }

    if (this.despesaForm.get("frequencia") === null) {
      this.despesaForm.addControl("frequencia", new FormControl("", [Validators.required]))
    }

    if (this.despesa() === null) return

    this.handleFrequenciaValueChange(this.despesa()!.frequencia as Frequencia)
  }

  handleFrequenciaValueChange(newValue: Frequencia | "") {
    if (newValue === this.frequenciaSelecionada()) {
      newValue = ""
    }

    this.frequenciaSelecionada.set(newValue)

    setDetalhesFrequenciaFields(this.despesaForm, this.frequenciaSelecionada())

    let frequenciaControl = this.despesaForm.get("frequencia")
    if (frequenciaControl) frequenciaControl.setValue(newValue)

    let dataProximoPagamento = ""

    if (this.despesa() !== null && newValue === this.despesa()?.frequencia) {
      dataProximoPagamento = this.despesa()!.dataProximoPagamento as string
      this.detalhesFrequenciaForm.patchValue(this.despesa()!.detalhesFrequencia || {})
    }

    this.despesaForm.patchValue({
      "dataProximoPagamento": dataProximoPagamento
    })
  }

  ngOnDestroy(): void {
    this.despesaForm.removeControl("detalhesFrequencia")
    this.despesaForm.removeControl("frequencia")
  }
}
