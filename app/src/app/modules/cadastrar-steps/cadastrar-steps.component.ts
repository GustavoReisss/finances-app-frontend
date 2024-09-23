import { Component, inject, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { InputDirective } from '../../shared/directives/input/input.directive';
import { JsonPipe } from '@angular/common';

type Step = {
  action: string
  context: string
  input_template: string
}


@Component({
  selector: 'app-cadastrar-steps',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    InputDirective,
    JsonPipe
  ],
  templateUrl: './cadastrar-steps.component.html',
  styleUrl: './cadastrar-steps.component.scss'
})
export class CadastrarStepsComponent {
  formBuilder = inject(FormBuilder)
  execution = this.formBuilder.group({
    incident: "",
    input: "",
    steps: this.formBuilder.array([])
  })

  get steps(): FormArray<FormGroup<any>> {
    return this.execution.get('steps') as FormArray
  }

  addStep() {
    const stepForm = this.formBuilder.group({
      action: '',
      context: '',
      input_template: ''
    })

    this.steps.push(stepForm)
  }

  deleteStep(stepIndex: number) {
    this.steps.removeAt(stepIndex)
  }
}
