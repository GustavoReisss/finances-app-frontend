import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequenciaFormComponent } from './frequencia-form.component';

describe('FrequenciaFormComponent', () => {
  let component: FrequenciaFormComponent;
  let fixture: ComponentFixture<FrequenciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrequenciaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrequenciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
