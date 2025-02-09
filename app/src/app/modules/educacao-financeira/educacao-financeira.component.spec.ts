import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducacaoFinanceiraComponent } from './educacao-financeira.component';

describe('EducacaoFinanceiraComponent', () => {
  let component: EducacaoFinanceiraComponent;
  let fixture: ComponentFixture<EducacaoFinanceiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducacaoFinanceiraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducacaoFinanceiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
