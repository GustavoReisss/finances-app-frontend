import { Component, inject, OnInit, signal, } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { InputDirective } from '../../shared/directives/input/input.directive';
import { JsonPipe } from '@angular/common';
import { HttpService } from '../../shared/services/http.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';


type Path = {
  pathId: string
  comunidade: string
  releaseTrain: string
  squad: string
}

@Component({
  selector: 'app-cadastrar-steps',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    InputDirective,
    JsonPipe,
    ModalComponent
  ],
  templateUrl: './cadastrar-steps.component.html',
  styleUrl: './cadastrar-steps.component.scss'
})
export class CadastrarStepsComponent implements OnInit {
  formBuilder = inject(FormBuilder)
  httpService = inject(HttpService)

  filtersForm = this.formBuilder.group({
    comunidade: "",
    releaseTrain: "",
    squad: ""
  })

  modalCadastro = signal(false)

  cadastroRotaForm = this.formBuilder.group({
    pathId: "",
    comunidade: "",
    releaseTrain: "",
    squad: ""
  })

  paths = signal<Path[]>([{ pathId: "teste", comunidade: "teste", releaseTrain: "teste", squad: "teste" }])

  ngOnInit(): void {
    this.setPaths()
  }

  setPaths() {
    let filters = Object.fromEntries(
      Object.entries(this.filtersForm.value)
        .map(entry => [entry[0], entry[1]?.trim()])
        .filter(([k, v]) => v)
    )

    this.httpService.get<Path[]>("rotas", filters).subscribe(rotas => {
      this.paths.set(rotas)
    })
  }

  insertPath() {
    this.httpService.post<Path>("rotas", this.cadastroRotaForm.value).subscribe(novaRota => {
      this.paths.update(rotas => {
        rotas.push(novaRota)
        return rotas
      })
    })
  }


}
