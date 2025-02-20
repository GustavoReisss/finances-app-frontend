import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHistoricoDespesaAlertComponent } from './delete-historico-despesa-alert.component';

describe('DeleteHistoricoDespesaAlertComponent', () => {
  let component: DeleteHistoricoDespesaAlertComponent;
  let fixture: ComponentFixture<DeleteHistoricoDespesaAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHistoricoDespesaAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteHistoricoDespesaAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
