import { Component, EventEmitter, Output, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from '../../../../../../../../shared/directives/button/button.directive';
import { SelectComponent } from '../../../../../../../../shared/components/select/select.component';
import { InputDirective } from '../../../../../../../../shared/directives/input/input.directive';
import { TipoPagamento } from '../../../../../../../../shared/interfaces/tipo-pagamento.interface';
import { DespesaService } from '../../../../services/despesa-service/despesa-form.service';

@Component({
  selector: 'app-add-categoria-pagamento',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, SelectComponent, InputDirective],
  templateUrl: './add-categoria-pagamento.component.html',
  styleUrl: './add-categoria-pagamento.component.scss'
})
export class AddCategoriaPagamentoComponent {
  fb = inject(FormBuilder)
  despesaService = inject(DespesaService)

  @Output() categoriaPagamentoCreated = new EventEmitter<{ tipoPagamento: string, categoriaPagamento: string }>()

  tiposPagamentos = input<TipoPagamento[]>([])
  tipoPagamentoSelecionado = input('')

  categoriaPagamentoForm = this.fb.group({
    tipoPagamento: ['', [Validators.required]],
    descricao: ['', [Validators.required]]
  })

  protected setTipoPagamentoFromInput = effect(() => {
    this.categoriaPagamentoForm.patchValue({
      tipoPagamento: this.tipoPagamentoSelecionado()
    })
  }, { allowSignalWrites: true })


  salvarNovaOpcao() {
    if (this.categoriaPagamentoForm.invalid) {
      alert("Preencha os campos e tente novamente")
      return
    }

    const formValue = this.categoriaPagamentoForm.value as { [key: string]: string }

    this.despesaService.createCategoria(
      formValue["tipoPagamento"],
      formValue["descricao"]
    ).subscribe(() => {
      let descricaoControl = this.categoriaPagamentoForm.get('descricao')

      descricaoControl?.setValue("")
      descricaoControl?.markAsPristine()

      this.categoriaPagamentoCreated.emit({
        tipoPagamento: formValue["tipoPagamento"],
        categoriaPagamento: formValue["descricao"]
      })

    })
  }
}
