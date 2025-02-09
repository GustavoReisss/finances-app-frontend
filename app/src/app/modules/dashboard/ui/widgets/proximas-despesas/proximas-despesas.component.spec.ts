import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximasDespesasComponent } from './proximas-despesas.component';

describe('ProximasDespesasComponent', () => {
  let component: ProximasDespesasComponent;
  let fixture: ComponentFixture<ProximasDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProximasDespesasComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProximasDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
