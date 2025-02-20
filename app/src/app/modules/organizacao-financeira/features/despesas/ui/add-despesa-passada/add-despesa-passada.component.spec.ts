import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDespesaPassadaComponent } from './add-despesa-passada.component';

describe('AddDespesaPassadaComponent', () => {
  let component: AddDespesaPassadaComponent;
  let fixture: ComponentFixture<AddDespesaPassadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDespesaPassadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDespesaPassadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
