import { Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Despesa } from '../../../../../../shared/interfaces/despesa.interface';
import { InputDirective } from '../../../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../../../shared/directives/button/button.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent, ComboboxOption } from '../../../../../../shared/components/combobox/combobox.component';
import { DespesaService } from '../../services/despesa-service/despesa-form.service';
import { SkeletonLoaderComponent } from '../../../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AddCategoriaPagamentoComponent } from '../despesa-form/ui/add-categoria-pagamento/add-categoria-pagamento.component';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { DatePipe } from '@angular/common';
import { RemoveOptionComponent } from '../despesa-form/ui/remove-option/remove-option.component';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { tipoPagamento } from '../../shared/despesa-form.utils';
import { Subscription } from 'rxjs';
import { FrequenciaFormComponent } from '../forms/frequencia-form/frequencia-form.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { markAsDirtAndTouched } from '../../../../../../shared/utils/form.utils';
import { TODAY, WEEK_DAYS } from '../../../../../../shared/utils/date.utils';

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
    RemoveOptionComponent,
    DatePickerComponent,
    DatePipe,
    FrequenciaFormComponent,
    NgxCurrencyDirective
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
    this.despesa.set(despesa)

    this.tipoPagamento.set((despesa.tipoPagamento ? despesa.tipoPagamento : "") as tipoPagamento)

    this.categoriasPagamentos = this.despesaService.getCategoriasPagamentosByTipoPagamento(despesa.tipoPagamento as tipoPagamento)

    this.loading.set(true)

    let extraFields: any = {}

    if (despesa.tipoPagamento === 'Parcelado') {
      extraFields["quantidadeParcelas"] = [despesa.quantidadeParcelas, [Validators.required]]
      extraFields["parcelaAtual"] = [despesa.parcelaAtual, [Validators.required]]
    }

    this.despesaForm = this.formBuilder.group({
      "tipoPagamento": despesa.tipoPagamento,
      "descricao": [despesa.descricao, [Validators.required]],
      "valor": [despesa.valor, [Validators.required]],
      "categoriaPagamento": [despesa.categoriaPagamento, [Validators.required]],
      "dataProximoPagamento": despesa.dataProximoPagamento,
      ...extraFields
    })

    setTimeout(() => {
      this.loading.set(false)
    }, 300);
  }

  tipoPagamento = signal<tipoPagamento | "">("")

  weekDays = WEEK_DAYS

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

  minDate = TODAY.toLocaleDateString('en-ca')

  changeModalState(modal: string, state: boolean) {
    this.modalStates.update(modalStates => {
      modalStates[modal] = state
      return modalStates
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
    markAsDirtAndTouched(this.despesaForm)

    if (this.despesaForm.invalid) return

    this.despesaService.updateDespesa(this.despesaForm.value, this.despesa().despesaId!)
      .subscribe(res => this.despesaUpdated.emit(res))
  }
}
