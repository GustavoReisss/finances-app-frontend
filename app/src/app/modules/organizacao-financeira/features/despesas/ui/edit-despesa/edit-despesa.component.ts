import { Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '../../../../../../shared/components/combobox/combobox.component';
import { DespesaService } from '../../services/despesa-service/despesa-form.service';
import { SkeletonLoaderComponent } from '../../../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AddCategoriaPagamentoComponent } from '../despesa-form/ui/add-categoria-pagamento/add-categoria-pagamento.component';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { RemoveOptionComponent } from '../despesa-form/ui/remove-option/remove-option.component';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { CheckboxComponent } from '../../../../../../shared/components/checkbox/checkbox.component';
import { daysOptions, Frequencia, frequenciasOptions, getMinDate, setDetalhesFrequenciaFields, tipoPagamento, UnidadeFrequencia } from '../../shared/despesa-form.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-despesa',
  standalone: true,
  imports: [
    InputDirective,
    ButtonDirective,
    ReactiveFormsModule,
    ComboboxComponent,
    SkeletonLoaderComponent,
    AddCategoriaPagamentoComponent,
    ModalComponent,
    JsonPipe,
    RemoveOptionComponent,
    DatePickerComponent,
    CheckboxComponent,
    DatePipe
  ],
  templateUrl: './edit-despesa.component.html',
  styleUrl: './edit-despesa.component.scss'
})
export class EditDespesaComponent {
  formBuilder = inject(FormBuilder)
  despesaService = inject(DespesaService)

  @Output() despesaUpdated = new EventEmitter<Despesa>()

  despesa = signal<Partial<Despesa>>({})

  @Input({ alias: 'despesa' })
  set _despesa(despesa: Partial<Despesa>) {
    despesa.detalhesFrequencia = despesa.detalhesFrequencia || {}

    this.despesa.set(despesa)

    this.tipoPagamento.set((despesa.tipoPagamento ? despesa.tipoPagamento : "") as tipoPagamento)
    this.frequenciaSelecionada.set((despesa.frequencia ? despesa.frequencia : "") as Frequencia)

    this.categoriasPagamentos = this.despesaService.getCategoriasPagamentosByTipoPagamento(despesa.tipoPagamento as tipoPagamento)

    this.loading.set(true)

    setTimeout(() => {
      this.setExtraFields(despesa)
      this.loading.set(false)
    }, 300);
  }

  setExtraFields(despesa: Partial<Despesa>) {
    const extraControls: { [key in tipoPagamento | ""]: any } = {
      "Parcelado": {
        "frequencia": despesa.frequencia,
        "detalhesFrequencia": this.formBuilder.group(despesa.detalhesFrequencia!),
        "quantidadeParcelas": despesa.quantidadeParcelas,
        "parcelaAtual": despesa.parcelaAtual,
      },
      "Recorrente": {
        "frequencia": despesa.frequencia,
        "detalhesFrequencia": this.formBuilder.group(despesa.detalhesFrequencia!),
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

    this.despesaForm = this.formBuilder.group({
      "descricao": [despesa.descricao, [Validators.required]],
      "valor": [despesa.valor, [Validators.required]],
      "categoriaPagamento": [despesa.categoriaPagamento, [Validators.required]],
      "ultimoPagamento": despesa.ultimoPagamento
    })

    addControls(this.despesaForm, extraControls[this.tipoPagamento()])
    this.updateMinDate()
  }

  protected updateDetalhesFrequenciaForm = effect(() => {
    setDetalhesFrequenciaFields(this.despesaForm, this.frequenciaSelecionada())
    this.observeDetalhesFrequenciaState()

    let ultimoPagamento = this.despesaForm.get("ultimoPagamento")
    if (!ultimoPagamento) return

    if (this.frequenciaSelecionada() === "Outro") {
      ultimoPagamento.setValidators(Validators.required)
      ultimoPagamento.disable()
      return
    }

    ultimoPagamento.clearValidators()

  }, { allowSignalWrites: true })

  tipoPagamento = signal<tipoPagamento | "">("")

  frequenciaSelecionada = signal<Frequencia | "">("")

  daysOptions = daysOptions
  frequenciasOptions = frequenciasOptions

  categoriasPagamentos = computed<string[]>(() => [])

  despesaForm: FormGroup = this.formBuilder.group({
    "descricao": ["", [Validators.required]],
    "valor": ["", [Validators.required]],
    "categoriaPagamento": ["", [Validators.required]],
  })

  loading = signal(false)

  setLoadingWhenFetchingData = effect(() => {
    this.loading.set(!this.despesaService.fetchedTipoPagamento())

    // Force form to load html fields
    setTimeout(() => {
      this.despesaForm.patchValue(this.despesaForm.value)
    }, 150);

  }, { allowSignalWrites: true })

  categoriaToDelete = signal<ComboboxOption>({ value: '', label: '' })

  obserseDetalhesFormSub?: Subscription

  modalStates = signal<any>({
    "categoriaPagamento": false,
    "deleteOption": false,
  })

  minDate = ""

  changeModalState(modal: string, state: boolean) {
    this.modalStates.update(modalStates => {
      modalStates[modal] = state
      return modalStates
    })
  }

  observeDetalhesFrequenciaState() {
    if (this.obserseDetalhesFormSub) this.obserseDetalhesFormSub.unsubscribe()

    this.obserseDetalhesFormSub = this.despesaForm.get("detalhesFrequencia")?.statusChanges.subscribe(state => {
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

  handleCategoriaPagamentoCreated(event: {
    tipoPagamento: string,
    categoriaPagamento: string
  }) {
    setTimeout(() => {
      this.despesaForm.get("categoriaPagamento")?.setValue(event.categoriaPagamento)
    }, 200);

    this.changeModalState("categoriaPagamento", false)
  }

  handleFrequenciaValueChange(newValue: Frequencia | "") {
    if (newValue === this.frequenciaSelecionada()) {
      newValue = ""
    }

    this.frequenciaSelecionada.set(newValue)

    let frequenciaControl = this.despesaForm.get("frequencia")
    if (frequenciaControl) (frequenciaControl as AbstractControl<string>).setValue(newValue)

    this.despesaForm.patchValue({
      "ultimoPagamento": ""
    })
  }

  updateMinDate() {
    let detalhesFrequencia = this.despesaForm.get("detalhesFrequencia")

    if (!detalhesFrequencia) {
      this.minDate = ""
      return
    }

    let detalhesFrequenciaValue = detalhesFrequencia.value as { quantidade: number, unidade: UnidadeFrequencia }

    const { quantidade, unidade } = detalhesFrequenciaValue

    this.minDate = getMinDate(quantidade, unidade)
  }

  removeCategoria(option: ComboboxOption) {
    this.categoriaToDelete.set(option)
    this.changeModalState("deleteOption", true)
  }

  categoriaDeletedHandler() {
    const OPTION_TO_DELETE = this.categoriaToDelete().value
    this.despesaService.deleteCategoriaPagamento(this.tipoPagamento(), OPTION_TO_DELETE)
      .subscribe(
        () => {
          if (this.despesaForm.getRawValue()["categoriaPagamento"] === OPTION_TO_DELETE) {
            this.despesaForm.patchValue({ "categoriaPagamento": "" })
          }
          this.changeModalState("deleteOption", false)
        }
      )
  }

  salvar() {
    if (this.despesaForm.invalid) return

    this.despesaService.updateDespesa(this.despesaForm.value, this.despesa().despesaId!)
      .subscribe(res => this.despesaUpdated.emit(res[0]))
  }
}
