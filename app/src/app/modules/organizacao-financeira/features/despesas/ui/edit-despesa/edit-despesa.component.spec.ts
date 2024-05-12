import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDespesaComponent } from './edit-despesa.component';

describe('EditDespesaComponent', () => {
  let component: EditDespesaComponent;
  let fixture: ComponentFixture<EditDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDespesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
