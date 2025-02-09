import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimasDespesasComponent } from './ultimas-despesas.component';

describe('UltimasDespesasComponent', () => {
  let component: UltimasDespesasComponent;
  let fixture: ComponentFixture<UltimasDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimasDespesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UltimasDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
