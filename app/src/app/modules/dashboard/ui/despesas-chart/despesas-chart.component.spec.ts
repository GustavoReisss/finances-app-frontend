import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasChartComponent } from './despesas-chart.component';

describe('DespesasChartComponent', () => {
  let component: DespesasChartComponent;
  let fixture: ComponentFixture<DespesasChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespesasChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DespesasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
