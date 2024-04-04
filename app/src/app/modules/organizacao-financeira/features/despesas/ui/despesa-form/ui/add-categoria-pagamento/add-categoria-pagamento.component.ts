import { Component, EventEmitter, Output, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from '../../../../../../../../shared/directives/button/button.directive';
import { SelectComponent } from '../../../../../../../../shared/components/select/select.component';
import { InputDirective } from '../../../../../../../../shared/directives/input/input.directive';
import { HttpService } from '../../../../../../../../shared/services/http.service';
import { TipoPagamento } from '../../../../../../../../shared/interfaces/tipo-pagamento.interface';

@Component({
  selector: 'app-add-categoria-pagamento',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, SelectComponent, InputDirective],
  templateUrl: './add-categoria-pagamento.component.html',
  styleUrl: './add-categoria-pagamento.component.scss'
})
export class AddCategoriaPagamentoComponent {
  fb = inject(FormBuilder)
  httpService = inject(HttpService)

  @Output() categoriaPagamentoCreated = new EventEmitter<{ tipoPagamentoUpdated: TipoPagamento, tipoPagamento: string, categoriaPagamento: string }>()

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


    const tipoPagamentoSelecionado = this.tiposPagamentos().find(el => el.descricao === formValue["tipoPagamento"])

    if (!tipoPagamentoSelecionado) {
      alert(`tipoPagamento ${formValue["tipoPagamento"]} NOT FOUND IN this.tiposPagamentos()`)
      return
    }

    let categoriasPagamentos: string[] = tipoPagamentoSelecionado.categoriasPagamentos

    categoriasPagamentos.push(formValue["descricao"])

    const body = {
      "categoriasPagamentos": categoriasPagamentos
    }

    this.httpService.put<TipoPagamento[]>(
      'tipos_pagamentos',
      tipoPagamentoSelecionado.tipoPagamentoId,
      body
    )
      .subscribe(response => {
        let descricaoControl = this.categoriaPagamentoForm.get('descricao')

        descricaoControl?.setValue("")
        descricaoControl?.markAsPristine()

        this.categoriaPagamentoCreated.emit({
          tipoPagamentoUpdated: response[0],
          tipoPagamento: formValue["tipoPagamento"],
          categoriaPagamento: formValue["descricao"]
        })

      })
  }
}
