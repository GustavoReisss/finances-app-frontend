import { Component, inject, input, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Frequencia, frequenciasOptions, setDetalhesFrequenciaFields } from '../../../../despesas/shared/despesa-form.utils';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent } from '../../../../../../../shared/components/combobox/combobox.component';
import { InputDirective } from '../../../../../../../shared/directives/input/input.directive';
import { DatePickerComponent } from '../../../../../../../shared/components/date-picker/date-picker.component';
import { DatePipe } from '@angular/common';
import { CheckboxComponent } from '../../../../../../../shared/components/checkbox/checkbox.component';
import { TODAY, WEEK_DAYS } from '../../../../../../../shared/utils/date.utils';
import { Receita } from '../../../types/receita.type';

@Component({
  selector: 'app-recorrencia-form',
  standalone: true,
  imports: [
    ComboboxComponent,
    InputDirective,
    DatePickerComponent,
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    CheckboxComponent,
  ],
  templateUrl: './recorrencia-form.component.html',
  styleUrl: './recorrencia-form.component.scss'
})
export class RecorrenciaFormComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup
  receita = input<Receita | null>(null)

  formBuilder = inject(FormBuilder)

  weekDays = WEEK_DAYS
  frequenciasOptions = frequenciasOptions
  frequenciaSelecionada = signal<Frequencia | "">("")

  maxDate = ""
  minDate = TODAY.toLocaleDateString('en-ca')

  get detalhesFrequenciaForm() {
    return this.form.get("detalhesFrequencia") as FormGroup
  }

  ngOnInit(): void {
    if (this.form.get("detalhesFrequencia") === null) {
      this.form.addControl("detalhesFrequencia", this.formBuilder.group({}))
    }

    if (this.form.get("frequencia") === null) {
      this.form.addControl("frequencia", new FormControl("", [Validators.required]))
    }

    if (this.receita() === null) return

    this.handleFrequenciaValueChange(this.receita()!.frequencia as Frequencia)
  }

  handleFrequenciaValueChange(newValue: Frequencia | "") {
    if (newValue === this.frequenciaSelecionada()) {
      newValue = ""
    }

    this.frequenciaSelecionada.set(newValue)

    setDetalhesFrequenciaFields(this.form, this.frequenciaSelecionada(), "dataProximoRecebimento")

    let frequenciaControl = this.form.get("frequencia")
    if (frequenciaControl) frequenciaControl.setValue(newValue)

    let dataProximoRecebimento = ""

    if (this.receita() !== null && newValue === this.receita()?.frequencia) {
      dataProximoRecebimento = this.receita()!.dataProximoRecebimento as string
      this.detalhesFrequenciaForm.patchValue(this.receita()!.detalhesFrequencia || {})
    }

    this.form.patchValue({
      "dataProximoRecebimento": dataProximoRecebimento
    })
  }

  ngOnDestroy(): void {
    this.form.removeControl("detalhesFrequencia")
    this.form.removeControl("frequencia")
  }
}
