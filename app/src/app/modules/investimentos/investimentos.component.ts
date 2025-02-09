import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { ButtonDirective } from '../../shared/directives/button/button.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { CurrencyPipe } from '@angular/common';
import { HttpService } from '../../shared/services/http/http.service';

@Component({
  selector: 'app-investimentos',
  standalone: true,
  imports: [ModalComponent, TabsComponent, ButtonDirective, FormsModule, ReactiveFormsModule, SkeletonLoaderComponent, CurrencyPipe],
  templateUrl: './investimentos.component.html',
  styleUrl: './investimentos.component.scss'
})
export class InvestimentosComponent implements OnInit {
  httpService = inject(HttpService)
  modalUploadB3 = signal(false)

  tabsTipoAtivos = ["Ações"]
  tabSelecionada = signal(this.tabsTipoAtivos[0])

  ativos = signal<any[]>([])
  fetchingAtivos = signal(false)

  ngOnInit(): void {
    this.fetchAtivos()
  }

  fetchAtivos() {
    this.fetchingAtivos.set(true)

    this.httpService.get<any[]>('ativos').subscribe((response) => {
      this.ativos.set(response)
      this.fetchingAtivos.set(false)
    })
  }
}
