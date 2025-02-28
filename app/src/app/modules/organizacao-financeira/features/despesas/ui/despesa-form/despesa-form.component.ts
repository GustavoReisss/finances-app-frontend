import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from '../../../../../../shared/components/checkbox/checkbox.component';
import { ComboboxComponent, ComboboxOption } from '../../../../../../shared/components/combobox/combobox.component';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { HttpService } from '../../../../../../shared/services/http/http.service';
import { TipoPagamento } from '../../../../../../shared/interfaces/tipo-pagamento.interface';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { DespesaService } from '../../services/despesa-service/despesa-form.service';
import { DatePipe } from '@angular/common';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { RemoveOptionComponent } from './ui/remove-option/remove-option.component';
import { AddCategoriaPagamentoComponent } from './ui/add-categoria-pagamento/add-categoria-pagamento.component';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { tipoPagamento } from '../../shared/despesa-form.utils';
import { FrequenciaFormComponent } from '../forms/frequencia-form/frequencia-form.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { addControls, markAsDirtAndTouched, removeControls } from '../../../../../../shared/utils/form.utils';
import { TODAY } from '../../../../../../shared/utils/date.utils';

export type OptionsToDelete = "categoriaPagamento"

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
    ModalComponent,
    RemoveOptionComponent,
    AddCategoriaPagamentoComponent,
    DatePickerComponent,
    DatePipe,
    FrequenciaFormComponent,
    NgxCurrencyDirective
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
  minDate = TODAY.toLocaleDateString('en-ca')

  despesaForm = this.fb.group({
    "tipoPagamento": ["", [Validators.required]],
    "categoriaPagamento": [{ value: "", disabled: true }, [Validators.required]],
    "descricao": ["", [Validators.required]],
    "valor": ["", [Validators.required]],
    "dataProximoPagamento": ""
  })

  modalStates = signal<any>({
    "categoriaPagamento": false,
    "tipoPagamento": false,
    "deleteOption": false,
  })

  tipoPagamentoOptions: tipoPagamento[] = ["Recorrente", "Parcelado", "À Vista"]
  tipoPagamentoSelecionado = signal<tipoPagamento | "">("")


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
    })

    this.handleTipoPagamentoValueChange("")

    for (let control of Object.values(this.despesaForm.controls)) {
      control.markAsUntouched()
      control.markAsPristine()
    }
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
        "quantidadeParcelas": 1,
        "parcelaAtual": 1,
      },
      "Recorrente": {},
      "À Vista": {},
      "": {}
    }

    removeControls(this.despesaForm, Object.keys(extraControls[this.tipoPagamentoSelecionado()]))
    addControls(this.despesaForm, extraControls[newValue])
    this.tipoPagamentoSelecionado.set(newValue)
  }

  /* FORM SUBMIT */
  save() {
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
