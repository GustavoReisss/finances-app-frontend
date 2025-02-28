import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorrenciaFormComponent } from './recorrencia-form.component';

describe('RecorrenciaFormComponent', () => {
  let component: RecorrenciaFormComponent;
  let fixture: ComponentFixture<RecorrenciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecorrenciaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecorrenciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
