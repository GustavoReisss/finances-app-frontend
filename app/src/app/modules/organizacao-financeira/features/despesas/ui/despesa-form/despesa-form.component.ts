import { Component, EventEmitter, OnInit, Output, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from '../../../../../../shared/components/checkbox/checkbox.component';
import { ComboboxComponent, ComboboxOption } from '../../../../../../shared/components/combobox/combobox.component';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { HttpService } from '../../../../../../shared/services/http.service';
import { TipoPagamento } from '../../../../../../shared/interfaces/tipo-pagamento.interface';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { DespesaFormService } from './data-service/despesa-form.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { RemoveOptionComponent } from './ui/remove-option/remove-option.component';
import { AddCategoriaPagamentoComponent } from './ui/add-categoria-pagamento/add-categoria-pagamento.component';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';

export type OptionsToDelete = "categoriaPagamento"
type tipoPagamento = "Recorrente" | "Parcelado" | "À Vista"
type Frequencia = "Mensal" | "Semanal" | "Outro"
type UnidadeFrequencia = "Dias" | "Semanas" | "Meses" | "Anos"

@Component({
  selector: 'app-despesa-form',
  standalone: true,
  imports: [
    CheckboxComponent,
    ComboboxComponent,
    InputDirective,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    ModalComponent,
    RemoveOptionComponent,
    AddCategoriaPagamentoComponent,
    DatePickerComponent,
    DatePipe
  ],
  templateUrl: './despesa-form.component.html',
  styleUrl: './despesa-form.component.scss'
})
export class DespesaFormComponent implements OnInit {
  @Output() despesaCreated = new EventEmitter<any>()

  httpService = inject(HttpService)
  despesaFormService = inject(DespesaFormService)
  fb = inject(FormBuilder)

  maxDate = ""
  minDate = ""

  despesaForm = this.fb.group({
    "despesaId": crypto.randomUUID(),
    "tipoPagamento": ["", [Validators.required]],
    "categoriaPagamento": [{ value: "", disabled: true }, [Validators.required]],
    "descricao": ["", [Validators.required]],
    "parcelado": [false, [Validators.required]],
    "valor": ["", [Validators.required]],
    "frequencia": ["", [Validators.required]],
    "ultimoPagamento": "",
    "detalhesFrequencia": this.fb.group({})
  })

  modalStates = signal<any>({
    "categoriaPagamento": false,
    "tipoPagamento": false,
    "deleteOption": false,
  })

  tipoPagamentoOptions: tipoPagamento[] = ["Recorrente", "Parcelado", "À Vista"]
  tipoPagamentoSelecionado = signal<tipoPagamento | "">("")

  frequenciasOptions: Frequencia[] = ["Mensal", "Semanal", "Outro"]
  frequenciaSelecionada = signal<Frequencia | "">("")

  daysOptions = [
    { "label": "Segunda-feira", "value": "0" },
    { "label": "Terça-feira", "value": "1" },
    { "label": "Quarta-feira", "value": "2" },
    { "label": "Quinta-feira", "value": "3" },
    { "label": "Sexta-feira", "value": "4" },
    { "label": "Sábado", "value": "5" },
    { "label": "Domingo", "value": "6" },
  ]


  typeOfOptionToDelete?: OptionsToDelete
  optionToDelete = signal<ComboboxOption>({ value: '', label: '' })

  tiposPagamentos = signal<TipoPagamento[]>([])

  categoriasPagamentosDisponiveis = computed(() => {
    return [...(
      (
        this.tiposPagamentos().find(el => el.descricao === this.tipoPagamentoSelecionado())
        || { categoriasPagamentos: [] }
      )
        .categoriasPagamentos
    )]
  })

  ngOnInit(): void {
    this.despesaFormService.getTipoPagamento().subscribe((response) => {
      this.tiposPagamentos.set(response)
    })

    this.observeDetalhesFrequenciaState()
  }

  changeModalState(modal: string, state: boolean) {
    this.modalStates.update(modalStates => {
      modalStates[modal] = state
      return modalStates
    })
  }

  clearForm() {
    this.despesaForm.patchValue({
      "descricao": "",
      "parcelado": false,
      "valor": "",
      "frequencia": "",
      "ultimoPagamento": "",
    })

    this.handleTipoPagamentoValueChange("")
    this.handleFrequenciaValueChange("")
    this.minDate = ""


    for (let control of Object.values(this.despesaForm.controls)) {
      control.markAsUntouched()
      control.markAsPristine()
    }
  }

  updateMinDate() {
    let currentDate = new Date()

    const dateHandlers: { [key in UnidadeFrequencia]: any } = {
      "Dias": (dias: number) => currentDate.setDate(currentDate.getDate() - dias),
      "Semanas": (semanas: number) => currentDate.setDate(currentDate.getDate() - (7 * semanas)),
      "Meses": (meses: number) => currentDate.setMonth(currentDate.getMonth() - meses),
      "Anos": (anos: number) => currentDate.setFullYear(currentDate.getFullYear() - anos),
    }

    let detalhesFrequencia = this.despesaForm.get("detalhesFrequencia")?.value as { quantidade: number, unidade: string }

    const quantidade = detalhesFrequencia?.quantidade
    const unidade = detalhesFrequencia?.unidade

    if (!quantidade || !unidade) {
      this.minDate = ""
      return
    }

    dateHandlers[unidade as UnidadeFrequencia](Number(quantidade))
    this.minDate = currentDate.toLocaleDateString('en-ca')
  }

  /* NEW OPTIONS EVENT HANDLERS */
  handleCategoriaPagamentoCreated(event: {
    tipoPagamentoUpdated: TipoPagamento,
    tipoPagamento: string,
    categoriaPagamento: string
  }) {
    const { tipoPagamentoUpdated, tipoPagamento, categoriaPagamento } = event

    this.tiposPagamentos.update(
      tiposPagamentos => {
        let tipoPagamentoUpdatedIndex = tiposPagamentos.findIndex(el => el.tipoPagamentoId === tipoPagamentoUpdated.tipoPagamentoId)

        tiposPagamentos[tipoPagamentoUpdatedIndex] = tipoPagamentoUpdated

        return [...tiposPagamentos]
      }
    )

    if (this.tipoPagamentoSelecionado() !== tipoPagamento) {
      this.handleTipoPagamentoValueChange(tipoPagamento as tipoPagamento)
    }

    setTimeout(() => {
      this.despesaForm.get("categoriaPagamento")?.setValue(categoriaPagamento)
    }, 200);

    this.changeModalState("categoriaPagamento", false)
  }

  /* DELETE HANDLERS */
  setOptionToDelete(option: ComboboxOption, field: OptionsToDelete) {
    this.typeOfOptionToDelete = field
    this.optionToDelete.set(option)
    console.log(this.optionToDelete())
    this.changeModalState("deleteOption", true)
  }

  optionDeletedHandler() {
    type DeleteHandlers = {
      [key in OptionsToDelete]: any
    }

    const deleteHandlers: DeleteHandlers = {
      "categoriaPagamento": () => this.deleteCategoriaPagamento()
    }

    if (this.typeOfOptionToDelete === undefined) {
      return
    }

    deleteHandlers[this.typeOfOptionToDelete]()

    this.changeModalState("deleteOption", false)
  }

  deleteCategoriaPagamento() {
    const OPTION_TO_DELETE = this.optionToDelete().value
    const userId = "1"

    const tipoPagamentoIndex = this.tiposPagamentos().findIndex(el => el.descricao === this.tipoPagamentoSelecionado())

    if (tipoPagamentoIndex === -1) {
      alert(`${this.tipoPagamentoSelecionado()} NOT FOUND ON this.tiposPagamentos()`)
      return
    }

    let newCategoriasPagamentosValue = [...this.tiposPagamentos()[tipoPagamentoIndex].categoriasPagamentos]
    newCategoriasPagamentosValue.splice(newCategoriasPagamentosValue.findIndex(el => el === OPTION_TO_DELETE), 1)

    this.httpService
      .put("tipos_pagamentos", `${userId}/${this.tiposPagamentos()[tipoPagamentoIndex].tipoPagamentoId}`, { categoriasPagamentos: newCategoriasPagamentosValue })
      .subscribe(() => {
        this.tiposPagamentos
          .update(tiposPagamentos => {
            if (this.despesaForm.getRawValue()["categoriaPagamento"] === OPTION_TO_DELETE) {
              this.despesaForm.patchValue({ "categoriaPagamento": "" })
            }

            tiposPagamentos[tipoPagamentoIndex]["categoriasPagamentos"] = newCategoriasPagamentosValue
            return [...tiposPagamentos]
          })
      })
  }


  /* CHECKBOX HANDLERS */
  handleTipoPagamentoValueChange(newValue: tipoPagamento | "") {
    let categoriaControl = this.despesaForm.get("categoriaPagamento")
    let categoriaControlState: "enable" | "disable" = "enable"

    if (newValue === this.tipoPagamentoSelecionado()) {
      newValue = ""
      categoriaControlState = "disable"
    }

    this.tipoPagamentoSelecionado.set(newValue)
    this.despesaForm.patchValue({
      "tipoPagamento": newValue,
      "categoriaPagamento": ""
    })

    categoriaControl![categoriaControlState]()
  }

  handleFrequenciaValueChange(newValue: Frequencia | "") {
    if (newValue === this.frequenciaSelecionada()) {
      newValue = ""
    }

    this.frequenciaSelecionada.set(newValue)

    this.despesaForm.patchValue({
      "frequencia": newValue,
      "ultimoPagamento": ""
    })
  }

  observeDetalhesFrequenciaState() {
    this.despesaForm.get("detalhesFrequencia")?.statusChanges.subscribe(state => {
      let ultimoPagamento = this.despesaForm.get("ultimoPagamento")
      if (!ultimoPagamento) return

      if (state === 'INVALID') {
        ultimoPagamento.disable()
        ultimoPagamento.setValue("")
        return
      }

      ultimoPagamento.enable()
    })
  }

  protected updateDetalhesFrequenciaForm = effect(() => {
    const removeControls = (fg: FormGroup) => {
      Object.keys(fg.controls).forEach(controlKey => fg.removeControl(controlKey))
    }

    const addControls = (fg: FormGroup, newControls: { [key: string]: any }) => {
      Object.entries(newControls).forEach(([controlName, initialValue]) => {
        fg.addControl(controlName, new FormControl(initialValue, [Validators.required]))
      })
    }

    let detalhesFrequenciaFormFields: {
      [key in Frequencia | ""]: any
    } = {
      'Mensal': {
        "diaPagamento": ""
      },
      'Semanal': {
        "diaSemana": ""
      },
      'Outro': {
        "unidade": "",
        "quantidade": ""
      },
      "": {}
    }

    let detalhesFrequenciasFG = (this.despesaForm.get("detalhesFrequencia") as FormGroup)

    removeControls(detalhesFrequenciasFG)
    addControls(
      detalhesFrequenciasFG,
      detalhesFrequenciaFormFields[this.frequenciaSelecionada()]
    )

    if (this.frequenciaSelecionada() === "Outro") {
      this.despesaForm.get("ultimoPagamento")?.setValidators(Validators.required)
      return
    }

    this.despesaForm.get("ultimoPagamento")?.clearValidators()

  }, { allowSignalWrites: true })

  /* FORM SUBMIT */
  save() {
    const markAsDirtAndTouched = (fg: FormGroup) => {
      for (let control of Object.values(fg.controls)) {
        control.markAsDirty()
        control.markAllAsTouched()
      }
    }

    markAsDirtAndTouched(this.despesaForm)

    if (this.despesaForm.invalid) {
      // alert("form invalid")
      return
    }

    this.despesaFormService.createDespesa(this.despesaForm.value as Despesa)
      .subscribe(res => {
        this.despesaForm.patchValue({ "despesaId": crypto.randomUUID() })

        this.despesaCreated.emit(res)
      })
  }
}
