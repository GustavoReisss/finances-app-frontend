import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/services/http.service';
import { InputDirective } from '../../../../shared/directives/input/input.directive';
import { ButtonDirective } from '../../../../shared/directives/button/button.directive';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

const INTERNAL_SERVER_ERROR = "Um erro desconhecido aconteceu, tente novamente em breve!"

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputDirective, ButtonDirective, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  httpService = inject(HttpService)
  fb = inject(FormBuilder)
  router = inject(Router)

  errorMessage = signal("")

  loading = signal(false)

  loginForm = this.fb.group({
    userId: ['', [Validators.required]],
    password: ['', [Validators.required]]
  })

  login() {
    this.errorMessage.set("")

    if (this.loginForm.invalid) {
      this.errorMessage.set("Confira os campos e tente novamente")
      return
    }


    this.loading.set(true)
    this.httpService.post('login', this.loginForm.value)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (v) => this.router.navigate(["/"]),
        error: (e) =>
          this.errorMessage.set(e.error["error_message"] || INTERNAL_SERVER_ERROR)
      })
  }
}
