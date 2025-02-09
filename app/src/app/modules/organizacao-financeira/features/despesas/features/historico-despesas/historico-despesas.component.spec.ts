import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoDespesasComponent } from './historico-despesas.component';

describe('HistoricoDespesasComponent', () => {
  let component: HistoricoDespesasComponent;
  let fixture: ComponentFixture<HistoricoDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoDespesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricoDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
