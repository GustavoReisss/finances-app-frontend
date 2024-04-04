import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoriaPagamentoComponent } from './add-categoria-pagamento.component';

describe('AddCategoriaPagamentoComponent', () => {
  let component: AddCategoriaPagamentoComponent;
  let fixture: ComponentFixture<AddCategoriaPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCategoriaPagamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCategoriaPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
