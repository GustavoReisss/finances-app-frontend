import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/services/http.service';
import { InputDirective } from '../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { Router, RouterLink } from '@angular/router';


const INTERNAL_SERVER_ERROR = "Um erro desconhecido aconteceu, tente novamente em breve!"


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputDirective, ButtonDirective, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  httpService = inject(HttpService)
  fb = inject(FormBuilder)
  router = inject(Router)

  errorMessage = signal("")

  userRegisterForm = this.fb.group({
    userId: ['', [Validators.required]],
    // name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  })


  registerUser() {
    this.errorMessage.set("")

    if (this.userRegisterForm.invalid) {
      console.log(this.userRegisterForm)
      this.errorMessage.set("Ajuste os campos e tente novamente!")
      return
    }

    let userFormValue = { ...this.userRegisterForm.value }

    if (userFormValue.password !== userFormValue.confirmPassword) {
      this.errorMessage.set("As senhas divergem, confira os valores e tente novamente!")
      return
    }

    delete userFormValue["confirmPassword"]

    this.httpService.post("register", userFormValue).subscribe({
      next: (v) => this.router.navigate(["/"]),
      error: (e) => this.errorMessage.set(e.error["error_message"] || INTERNAL_SERVER_ERROR)
    })
  }

}
