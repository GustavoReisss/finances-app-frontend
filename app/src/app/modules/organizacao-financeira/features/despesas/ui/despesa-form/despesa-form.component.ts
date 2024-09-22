import { Component, EventEmitter, OnInit, Output, computed, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from '../../../../../../shared/components/checkbox/checkbox.component';
import { ComboboxComponent, ComboboxOption } from '../../../../../../shared/components/combobox/combobox.component';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { HttpService } from '../../../../../../shared/services/http.service';
import { TipoPagamento } from '../../../../../../shared/interfaces/tipo-pagamento.interface';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { DespesaService } from '../../services/despesa-service/despesa-form.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { RemoveOptionComponent } from './ui/remove-option/remove-option.component';
import { AddCategoriaPagamentoComponent } from './ui/add-categoria-pagamento/add-categoria-pagamento.component';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { daysOptions, Frequencia, frequenciasOptions, getMinDate, setDetalhesFrequenciaFields, tipoPagamento, UnidadeFrequencia } from '../../shared/despesa-form.utils';

export type OptionsToDelete = "categoriaPagamento"

const TODAY = new Date()
const FIRST_DAY_OF_THE_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)

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
  despesaFormService = inject(DespesaService)
  fb = inject(FormBuilder)

  maxDate = ""
  minDate = ""

  despesaForm = this.fb.group({
    "tipoPagamento": ["", [Validators.required]],
    "categoriaPagamento": [{ value: "", disabled: true }, [Validators.required]],
    "descricao": ["", [Validators.required]],
    "valor": ["", [Validators.required]],
    "ultimoPagamento": "",
    "detalhesFrequencia": this.fb.group({}),
    "dataProximoPagamento": ""
  })

  modalStates = signal<any>({
    "categoriaPagamento": false,
    "tipoPagamento": false,
    "deleteOption": false,
  })

  tipoPagamentoOptions: tipoPagamento[] = ["Recorrente", "Parcelado", "À Vista"]
  tipoPagamentoSelecionado = signal<tipoPagamento | "">("")

  frequenciasOptions = frequenciasOptions
  frequenciaSelecionada = signal<Frequencia | "">("")

  daysOptions = daysOptions


  typeOfOptionToDelete?: OptionsToDelete
  optionToDelete = signal<ComboboxOption>({ value: '', label: '' })

  tiposPagamentos = signal<TipoPagamento[]>([])

  categoriasPagamentosDisponiveis = computed(() =>
    this.despesaFormService.getCategoriasPagamentosByTipoPagamento(this.tipoPagamentoSelecionado())()
  )

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
      "valor": "",
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
    let detalhesFrequencia = this.despesaForm.get("detalhesFrequencia")!.value as { quantidade: number, unidade: string }

    const quantidade = detalhesFrequencia?.quantidade
    const unidade = detalhesFrequencia?.unidade as UnidadeFrequencia

    this.minDate = getMinDate(quantidade, unidade)
  }

  /* NEW OPTIONS EVENT HANDLERS */
  handleCategoriaPagamentoCreated(event: {
    tipoPagamento: string,
    categoriaPagamento: string
  }) {
    const { tipoPagamento, categoriaPagamento } = event

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
    this.despesaFormService.deleteCategoriaPagamento(this.tipoPagamentoSelecionado(), OPTION_TO_DELETE)
      .subscribe(
        () => {
          if (this.despesaForm.getRawValue()["categoriaPagamento"] === OPTION_TO_DELETE) {
            this.despesaForm.patchValue({ "categoriaPagamento": "" })
          }
        }
      )
  }


  /* CHECKBOX HANDLERS */
  handleTipoPagamentoValueChange(newValue: tipoPagamento | "") {
    let categoriaControl = this.despesaForm.get("categoriaPagamento")
    let categoriaControlState: "enable" | "disable" = "enable"

    if (newValue === this.tipoPagamentoSelecionado()) {
      newValue = ""
      categoriaControlState = "disable"
    }

    this.despesaForm.patchValue({
      "tipoPagamento": newValue,
      "categoriaPagamento": ""
    })

    categoriaControl![categoriaControlState]()

    const extraControls: { [key in tipoPagamento | ""]: any } = {
      "Parcelado": {
        "frequencia": "",
        "quantidadeParcelas": 1,
        "parcelaAtual": 1,
      },
      "Recorrente": {
        "frequencia": "",
      },
      "À Vista": {},
      "": {}
    }

    const addControls = (fg: FormGroup, newControls: { [key: string]: any }) => {
      Object.entries(newControls).forEach(([controlName, initialValue]) => {
        let control = (initialValue instanceof FormGroup) ? initialValue : new FormControl(initialValue, [Validators.required])
        fg.addControl(controlName, control)
      })
    }

    const removeControls = (fg: FormGroup, controls: string[]) => {
      controls.forEach(control => fg.removeControl(control))
    }

    removeControls(this.despesaForm, Object.keys(extraControls[this.tipoPagamentoSelecionado()]))
    addControls(this.despesaForm, extraControls[newValue])
    this.tipoPagamentoSelecionado.set(newValue)
    this.handleFrequenciaValueChange("")

    this.minDate = (newValue === 'À Vista') ? FIRST_DAY_OF_THE_MONTH.toLocaleDateString('en-ca') : ''
  }

  handleFrequenciaValueChange(newValue: Frequencia | "") {
    if (newValue === this.frequenciaSelecionada()) {
      newValue = ""
    }

    this.frequenciaSelecionada.set(newValue)

    let frequenciaControl = this.despesaForm.get("frequencia")
    if (frequenciaControl) (frequenciaControl as AbstractControl<string>).setValue(newValue)

    this.despesaForm.patchValue({
      "ultimoPagamento": "",
      "dataProximoPagamento": ""
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
    setDetalhesFrequenciaFields(this.despesaForm, this.frequenciaSelecionada())

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
        if (control instanceof FormGroup) {
          markAsDirtAndTouched(control)
          continue
        }

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
        this.despesaCreated.emit(res)
      })
  }
}
