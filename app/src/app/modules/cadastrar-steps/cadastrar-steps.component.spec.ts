import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarStepsComponent } from './cadastrar-steps.component';

describe('CadastrarStepsComponent', () => {
  let component: CadastrarStepsComponent;
  let fixture: ComponentFixture<CadastrarStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
